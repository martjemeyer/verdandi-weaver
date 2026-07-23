// "Follow along" platform list, in display order. Pulls URLs from
// links.js rather than repeating them. To add/remove a platform from
// the homepage row, edit this array — no template changes needed.
const links = require("./links.js");

module.exports = [
  { key: "substack", name: "Substack", url: links.substack, descriptor: "Podcast and reflections", icon: "substack" },
  { key: "youtube", name: "YouTube", url: links.youtube, descriptor: "Films and conversations", icon: "youtube" },
  { key: "instagram", name: "Instagram", url: links.instagram, descriptor: "Images and shorter reflections", icon: "instagram" },
  { key: "facebookPage", name: "Facebook", url: links.facebookPage, descriptor: "Updates and community", icon: "facebook" },
  { key: "facebookPersonal", name: "Facebook (personal)", url: links.facebookPersonal, descriptor: "Where most updates are shared first", icon: "facebook" },
  { key: "tiktok", name: "TikTok", url: links.tiktok, descriptor: "Short videos", icon: "tiktok" },
  { key: "pinterest", name: "Pinterest", url: links.pinterest, descriptor: "Visual reflections", icon: "pinterest" },
  { key: "patreon", name: "Patreon", url: links.patreon, descriptor: "Membership and shop", icon: "patreon" },
];
