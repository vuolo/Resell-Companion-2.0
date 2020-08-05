// MAIN SETTINGS
window.companionSettings = {
  language: "es",
  theme: "dark",
  currency: "CAD",
  currencyName: "Canadian Dollar",
  currencySymbol: "CA$",
  webhook: {
    enabled: true,
    URL: 'https://discordapp.com/api/webhooks/700913924912054313/6jAxEBPUK_NF8TFY_VsfTtZDuGUDt1mqn4aHj-ZO7LvqZaY086HIFbp6QpWGRjmQs04a'
  },
  notifications: {
    banners: true,
    sounds: true,
    desktop: true
  }
};

// arrays
window.billingProfiles = [];
window.googleAccounts = [];
window.proxyProfiles = [];
window.connectedBots = [];

// functions
window.parent.addStatistic = function() {};
window.parent.addCheckoutStatistic = function() {};
