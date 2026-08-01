// The two podcast shows under the main Verdandi Weaver publication.
// This is each show's constant identity (name, byline, show-level
// platform presence) — distinct from individual episodes, which are
// fetched client-side at runtime (src/assets/podcast-feed.js, via
// src/feed-proxy.php) rather than stored here. `sectionUrl` is the
// show's own Substack page (a "listen to the whole show" destination),
// not a feed — the actual feed URLs live in feed-proxy.php's allow-list.
module.exports = [
  {
    key: "vagaTanka",
    lang: "sv",
    name: "Våga Tänka Om",
    fullName: "Våga Tänka Om med Verdandi Weaver",
    byline: "En podcast om livet, människan och världen vi skapar tillsammans.",
    invitation: "Välkommen till Våga Tänka Om – en podcast om livet, människan och världen vi skapar tillsammans.",
    closingQuestion: "Vad skulle kunna bli möjligt om vi vågade tänka om?",
    sectionUrl: "https://verdandiweaver.substack.com/s/vaga-tanka-om-en-podcast-av-verdandi",
    spotify: "https://open.spotify.com/show/033VwsZNfkvAjIW2K5LoXk",
    apple: "https://podcasts.apple.com/us/podcast/v%C3%A5ga-t%C3%A4nka-om-med-verdandi-weaver/id6795157110",
    youtubeMusic: "https://music.youtube.com/@VagaTankaOm",
    facebook: "https://www.facebook.com/vagatankaom/",
  },
  {
    key: "rethinkingEverything",
    lang: "en",
    name: "Rethinking Everything",
    fullName: "Rethinking Everything with Verdandi Weaver",
    byline: "A podcast about life, humanity, and the world we are creating together.",
    invitation: "Welcome to Rethinking Everything—a podcast about life, humanity, and the world we are creating together.",
    closingQuestion: "What might become possible if we dared to rethink?",
    sectionUrl: "https://verdandiweaver.substack.com/s/rethinking-everything-with-verdandi",
    spotify: "https://open.spotify.com/show/033VzGVmCd5cdPom5fehLL",
    apple: "https://podcasts.apple.com/us/podcast/rethinking-everything-with-verdandi-weaver/id6795177198",
    youtubeMusic: "https://music.youtube.com/@RethinkingEverythingVerdandi",
    facebook: "https://www.facebook.com/rethinkingeverything",
  },
];
