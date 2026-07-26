// The two Substack "sections" that function as separate podcast shows
// under the main Verdandi Weaver publication. Each has its own RSS
// feed (found via the section page's <link rel="alternate"
// type="application/rss+xml"> autodiscovery tag, not guessed).
// Add a new show here and its "new episode" strip appears on the
// homepage automatically — no template changes needed.
module.exports = [
  {
    key: "vagaTanka",
    name: "Våga Tänka Om",
    feedUrl: "https://novaharmonia.substack.com/feed?sectionId=431727",
    sectionUrl: "https://novaharmonia.substack.com/s/vaga-tanka-om-en-podcast-av-verdandi",
  },
  {
    key: "rethinkingEverything",
    name: "Rethinking Everything",
    feedUrl: "https://novaharmonia.substack.com/feed?sectionId=431735",
    sectionUrl: "https://novaharmonia.substack.com/s/rethinking-everything-with-verdandi",
  },
];
