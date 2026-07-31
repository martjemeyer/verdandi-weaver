// The two Substack podcast shows under the main Verdandi Weaver
// publication. `feedUrl` is Substack's dedicated podcast-audio RSS
// endpoint (api.substack.com/feed/podcast/...) — confirmed 31 July 2026
// to carry real itunes:duration, itunes:image, and an audio enclosure,
// none of which the publication's old post/section feeds ever had.
//
// The publication itself moved from novaharmonia.substack.com to
// verdandiweaver.substack.com at some point after 26 July 2026 — the
// old feedUrls below started returning a flat 404 (not the earlier
// 403 CI-block), which is why episodes stopped appearing anywhere.
// All URLs here are the user's own verified links, not guessed.
//
// Add a new show here and its "new episode" strip + hub page picks it
// up automatically — no template changes needed for the strip; a new
// hub page still needs its own route.
module.exports = [
  {
    key: "vagaTanka",
    lang: "sv",
    name: "Våga Tänka Om",
    fullName: "Våga Tänka Om med Verdandi Weaver",
    byline: "En podcast om livet, människan och världen vi skapar tillsammans.",
    invitation: "Välkommen till Våga Tänka Om – en podcast om livet, människan och världen vi skapar tillsammans.",
    closingQuestion: "Vad skulle kunna bli möjligt om vi vågade tänka om?",
    feedUrl: "https://api.substack.com/feed/podcast/5888631/s/431727.rss",
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
    feedUrl: "https://api.substack.com/feed/podcast/5888631.rss",
    sectionUrl: "https://verdandiweaver.substack.com/s/rethinking-everything-with-verdandi",
    spotify: "https://open.spotify.com/show/033VzGVmCd5cdPom5fehLL",
    apple: "https://podcasts.apple.com/us/podcast/rethinking-everything-with-verdandi-weaver/id6795177198",
    youtubeMusic: "https://music.youtube.com/@RethinkingEverythingVerdandi",
    facebook: "https://www.facebook.com/rethinkingeverything",
  },
];
