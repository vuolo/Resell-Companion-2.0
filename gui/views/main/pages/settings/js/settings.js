// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
window.settings = {
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

window.currencies = {
  "USD": {
    name: "United States Dollar",
    symbol: "$"
  },
  "CAD": {
    name: "Canadian Dollar",
    symbol: "CA$"
  }
};

window.modals = {
  'billing-profiles': {
    visible: false
  },
  'google-accounts': {
    visible: false
  },
  'proxy-profiles': {
    visible: false
  },
  'connected-bots': {
    visible: false
  },
  'store-regions': {
    visible: false
  },
  'statistics': {
    visible: false
  }
};

window.openModal = (modalName) => {
  window.modals[modalName].visible = true;
};

window.modalLoadedCallback = (modalName) => {
  if (modalName == 'billing-profiles') settingsApp.billingProfilesModal = window.frames['billing-profiles-modal'].modalOptions;
  else if (modalName == 'statistics') {
    settingsApp.statisticsModal = window.frames['statistics-modal'].modalOptions;
    window.parent.addStatistic = async (category, statistic, value = 1) => settingsApp.statisticsModal.categories[category][statistic] += value;
    window.parent.addCheckoutStatistic = async (status, store, value = 1) => settingsApp.statisticsModal.checkouts[status][storeType] += value;
  }
};

window.settingsApp = new Vue({
  el: "#Rewrite___Settings",
  data: {
    companionSettings: window.parent.companionSettings,
    curLogin: window.parent.curLogin,
    appVersion: window.parent.appVersion,
    settings: window.settings,
    modals: window.modals,
    billingProfilesModal: {},
    statisticsModal: {}
  },
  methods: {
    confineTextWidth: window.parent.confineTextWidth,
    getTextWidth: window.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.tryTranslate,
    formatTimestamp: window.parent.formatTimestamp,
    getThemeColor: window.parent.getThemeColor,
    setTheme: window.parent.setTheme,
    setLanguage: window.parent.setLanguage,
    openURL: window.parent.openURL,
    openModal: window.openModal,
    shouldDisplayModals: function() {
      for (var modal in modals) if (modals[modal].visible) return true;
      return false;
    },
    getTitleSwitchLeft: function(maxWidth, title) {
      let titleWidth = this.getTextWidth(title, 'bold 20px \'SF Pro Text\'');
      if (titleWidth >= maxWidth) return 0;
      else return (maxWidth/2) - ((titleWidth + 60)/2) + 20;
    },
    getLanguageImage: function(language) {
      switch (language) {
        case 'en':
          return '../../../../images/regions/' + 'United-States-of-America' + '.png';
        case 'es':
          return '../../../../images/regions/' + 'Spain' + '.png';
        case 'fr':
          return '../../../../images/regions/' + 'France' + '.png';
        case 'it':
          return '../../../../images/regions/' + 'Italy' + '.png';
        case 'de':
          return '../../../../images/regions/' + 'Germany' + '.png';
      }
      return '../../../../images/regions/' + 'Global' + '.png';
    },
    updateCurrency: function(currency = this.companionSettings.currency) {
      let newCurrency = window.currencies[currency];
      console.log(newCurrency);
      if (!newCurrency) return false;
      this.companionSettings.currency = currency;
      this.companionSettings.currencyName = newCurrency.name;
      this.companionSettings.currencySymbol = newCurrency.symbol;
      window.parent.frames['analytics-frame'].frames['overview-subpage'].updatePortfolioGraphCurrency();
      // TODO: update all sales, inventoryItems, subscriptions, tickets, and cards SALE and PURCHASE prices
    }
  }
});
