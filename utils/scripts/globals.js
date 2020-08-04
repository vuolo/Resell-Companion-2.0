// MAIN SETTINGS
window.companionSettings = {
  language: "es",
  theme: "dark",
  currency: "CAD",
  currencyName: "Canadian Dollar",
  currencySymbol: "CA$",
  webhook: {
    enabled: true,
    URL: ''
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
