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
window.billingProfiles = [
  {
    settings: {
      nickname: "test!",
      autoCheckout: true,
      autoCheckoutDelay: 0,
      simulateTyping: true,
      favorited: true,
      enabled: true,
      id: "TEST-BILLING-PROFILE"
    },
    autofillInformation: {
      firstName: "Charles",
      lastName: "Emanuel",
      email: "ce@gmail.com",
      phoneNumber: "4079028902",
      address: "385 Caddie Drive",
      unit: "",
      zipCode: "32713",
      city: "DeBary",
      state: "Florida",
      country: "United States",
      billing: {
        cardNumber: "4242424242424242",
        cardType: "Visa",
        expirationDateFull: "06/27",
        expirationDate: {
          month: "06",
          year: "27"
        },
        cvc: "285"
      }
    }
  }
];
window.googleAccounts = [
  {
    settings: {
      nickname: "test!",
      autoCheckout: true,
      autoCheckoutDelay: 0,
      simulateTyping: true,
      favorited: true,
      enabled: true,
      id: "TEST-GOOGLE-ACCOUNT"
    }
  }
];
window.proxyProfiles = [];
window.connectedBots = [];

window.tasks = [];
// TODO: add browsers, sales, products, etc. here

// functions
window.parent.addStatistic = function() {};
window.parent.addCheckoutStatistic = function() {};
