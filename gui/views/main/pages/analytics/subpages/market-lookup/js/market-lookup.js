// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
const marketLookupApp = new Vue({
  el: "#Rewrite___Market_Lookup",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    curLogin: window.parent.parent.curLogin,
    results: [],
    activeResultIndex: -1
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    calculateUnderlineWidth: window.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor,
    getDisplayedMarketplaceResult: function(marketplace, variant, type = this.currentMarketplaceView) {
      let outResult = this.companionSettings.currencySymbol + this.numberWithCommas((type == "lowestAsk" ? window.parent.parent.parent.exchangeRatesAPI.convertCurrencySync(variant.stores[marketplace].lowestAsk || 0, variant.stores[marketplace].currency || "USD", window.parent.parent.parent.companionSettings.currency) : window.parent.parent.parent.exchangeRatesAPI.convertCurrencySync(variant.stores[marketplace].highestBid || 0, variant.stores[marketplace].currency || "USD", window.parent.parent.parent.companionSettings.currency)) || 0);
      return this.companionSettings.currencySymbol + 0 == outResult ? { value: this.tryTranslate('N/A'), link: "#" } : { value: outResult, link: variant.stores[marketplace].url };
    }
  }
});
