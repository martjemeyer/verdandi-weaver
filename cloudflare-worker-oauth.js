// Substack's edge WAF blocks GitHub Actions' runner IPs with a hard 403
// on every one of its feed hosts (confirmed 31 July 2026, via temporary
// build-time diagnostic logging) — verdandiweaver.substack.com AND
// api.substack.com alike. Cloudflare's own edge is not blocked, so this
// Worker fetches the feed server-side and hands the XML back untouched.
// A closed allow-list, not an open proxy — this must never forward an
// arbitrary caller-supplied URL, only one of the publication's own known
// feeds, so the endpoint can't be abused as a general relay.
const ALLOWED_FEEDS = {
  main: "https://verdandiweaver.substack.com/feed",
  vagaTanka: "https://api.substack.com/feed/podcast/5888631/s/431727.rss",
  rethinkingEverything: "https://api.substack.com/feed/podcast/5888631.rss",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/substack-feed") {
      const target = ALLOWED_FEEDS[url.searchParams.get("feed")];
      if (!target) return new Response("Not found", { status: 404 });

      const upstream = await fetch(target, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; VerdandiWeaverFeedProxy/1.0)" },
      });
      const body = await upstream.text();
      return new Response(body, {
        status: upstream.status,
        headers: {
          "Content-Type": upstream.headers.get("Content-Type") || "application/xml",
          "Cache-Control": "public, max-age=1800",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Step 1 — redirect to GitHub login
    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: url.origin + '/callback',
        scope: 'repo,user'
      });
      return Response.redirect(
        'https://github.com/login/oauth/authorize?' + params, 302
      );
    }

    // Step 2 — GitHub sends code here, exchange for token
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code
        })
      });

      const { access_token } = await tokenRes.json();
      const payload = JSON.stringify({ token: access_token, provider: 'github' });

      // Send token back to the CMS popup
      const html = `<!DOCTYPE html><html><body><script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage('authorization:github:success:${payload}', e.origin);
  }
  window.addEventListener('message', receiveMessage);
  window.opener.postMessage('authorizing:github', '*');
}());
</script></body></html>`;

      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('Not found', { status: 404 });
  }
};
