const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://www.zillow.com",
    blockHosts: [
      "*.googlesyndication.com",
      "*.google-analytics.com",
      "*.collector-pxhyx10rg3.px-cloud.net",
      "*.doubleclick.net",
      "*.clicktale.net",
    ]
  },
});
