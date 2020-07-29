// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
window.results = []; // result Obj looks like this: { product: product, variants: [], storesCrawled: [], id: '' }

const marketLookupApp = new Vue({
  el: "#Rewrite___Market_Lookup",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    curLogin: window.parent.parent.curLogin,
    window: window,
    results: window.results,
    activeResultIndex: -1,
    searchTerm: "",
    isSearching: false,
    isUpdatingMarket: false
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    getTextWidth: window.parent.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor,
    getColor: window.parent.parent.getColor,
    numberWithCommas: window.parent.parent.numberWithCommas,
    tryGenerateEllipses: window.parent.parent.tryGenerateEllipses,
    convertCurrencySync: window.parent.parent.parent.exchangeRatesAPI.convertCurrencySync,
    handleSelectClick: function(e, resultIndex) {
      if (e.ctrlKey) setResultActive(resultIndex);
      else if (e.shiftKey) setResultActive(resultIndex);
      else setResultActive(resultIndex);
    },
    getMarketStatus: function(product) {
      let outMarketStatus = { direction: null, value: null, percent: null };
      outMarketStatus.value = window.parent.parent.parent.exchangeRatesAPI.convertCurrencySync(product.market.changeValue || 0, 'USD', window.parent.parent.companionSettings.currency);
      outMarketStatus.percent = window.parent.parent.roundNumber(product.market.changePercentage || 0);
      outMarketStatus.direction = outMarketStatus.value > 0 ? '↑' : (outMarketStatus.value < 0 ? '↓' : '');
      return outMarketStatus;
    },
    getMarketStatusColor: function(product) {
      if (!product.market) return "N/A";
      let marketStatus = this.getMarketStatus(product);
      if (marketStatus.value < 0) return "red";
      else if (marketStatus.value > 0) return "green";
      return "yellow";
    },
    calculateGridPosition: function(index) {
      return { left: (index * (227+9)) + (12) + 'px' }
    },
    getDisplayedMarketplaceResult: function(marketplace, variant, type = this.currentMarketplaceView) {
      let outResult = this.companionSettings.currencySymbol + this.numberWithCommas((type == "lowestAsk" ? window.parent.parent.parent.exchangeRatesAPI.convertCurrencySync(variant.stores[marketplace].lowestAsk || 0, variant.stores[marketplace].currency || "USD", window.parent.parent.parent.companionSettings.currency) : window.parent.parent.parent.exchangeRatesAPI.convertCurrencySync(variant.stores[marketplace].highestBid || 0, variant.stores[marketplace].currency || "USD", window.parent.parent.parent.companionSettings.currency)) || 0);
      return this.companionSettings.currencySymbol + 0 == outResult ? { value: this.tryTranslate('N/A'), link: "#" } : { value: outResult, link: variant.stores[marketplace].url };
    }
  }
});
window.marketLookupApp = marketLookupApp;

window.getResultByID = (id) => {
  for (var result of window.results) if (result.id == id) return result;
};

async function refreshMarketResults(searchTerm = marketLookupApp.searchTerm, addStatistic = true) {
  marketLookupApp.isSearching = true;
  let searchResults = await window.parent.parent.parent.marketAPI.searchMarketplace('stockx', searchTerm);
  if (searchTerm != marketLookupApp.searchTerm) return;
  resetMarketResults();
  for (var searchResult of searchResults) {
    window.results.push({
      product: searchResult,
      variants: [],
      storesCrawled: [],
      id: window.parent.parent.makeid(10) // assign a new id to each result
    });
  }
  if (addStatistic) window.parent.parent.addStatistic('Market Lookup', 'Searches');
}

async function setResultActive(result) {
  if (typeof result == "number") result = window.results[result]; // result was an index, convert to result
  marketLookupApp.activeResultIndex = window.results.indexOf(result);
  marketLookupApp.isUpdatingMarket = true;
  if (result.variants.length == 0) {
    await window.parent.parent.parent.marketAPI.updateMarket(result);
    window.parent.parent.addStatistic('Market Lookup', 'Items Compared');
  }
  marketLookupApp.isUpdatingMarket = false;
}
window.refreshMarketResults = refreshMarketResults;

function resetMarketResults() {
  marketLookupApp.activeResultIndex = -1;
  while (window.results.length > 0) window.results.pop();
  marketLookupApp.isSearching = false;
  try { clearInterval(searchIntv); } catch(err) { console.log(err); }
  searchIntv = null;
}

let searchIntv;
let previousSearchTerm;
let allowRefresh = true;
$('#marketLookupSearch').on('change keydown paste input', function() {
  if (previousSearchTerm && previousSearchTerm.length > 0 && marketLookupApp.searchTerm.length == 0) {
    previousSearchTerm = marketLookupApp.searchTerm;
    if (allowRefresh) refreshMarketResults(previousSearchTerm);
  }
  if (!searchIntv) {
    searchIntv = setInterval(function() {
      if (marketLookupApp.searchTerm != previousSearchTerm) {
        previousSearchTerm = marketLookupApp.searchTerm;
      } else {
        previousSearchTerm = marketLookupApp.searchTerm;
        if (allowRefresh) refreshMarketResults(previousSearchTerm);
      }
    }, 333);
  }
});

refreshMarketResults(marketLookupApp.searchTerm, false);
