// "Help this work continue" support options, in display order.
// Pulls URLs from links.js rather than repeating them.
const links = require("./links.js");

module.exports = [
  {
    key: "buyMeACoffee",
    name: "Buy Me a Coffee",
    url: links.buyMeACoffee,
    description: "Offer a small one-time contribution or explore downloadable resources.",
    buttonText: "Support through Buy Me a Coffee",
    icon: "coffee",
  },
  {
    key: "goFundMe",
    name: "GoFundMe",
    url: links.goFundMe,
    description: "Help fund the wider growth of Verdandi Weaver and Rethinking Society.",
    buttonText: "Visit the GoFundMe",
    icon: "heart",
  },
  {
    key: "patreon",
    name: "Patreon",
    url: links.patreon,
    description: "Join, follow updates, or explore memberships and the resource shop.",
    buttonText: "Explore Patreon",
    icon: "patreon",
  },
];
