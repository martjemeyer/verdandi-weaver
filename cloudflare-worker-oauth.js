export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
