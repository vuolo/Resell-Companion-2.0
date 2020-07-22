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
    searchTerm: "",
    isSearching: false,
    isUpdatingMarket: false,
    results: [], // result Obj looks like this: { product: product, variants: [], storesCrawled: [], id: '' }
    activeResultIndex: -1
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
    handleSelectClick: function(e, resultIndex) {
      if (e.ctrlKey) setResultActive(resultIndex);
      else if (e.shiftKey) setResultActive(resultIndex);
      else setResultActive(resultIndex);
    },
    getMarketStatus: function(product) {
      return "N/A";
    },
    getMarketStatusColor: function(product) {
      if (!product.market) return "N/A";
      // switch (getStatusDescription(tracking.details.status)) {
      //   case 'UNKNOWN':
      //     return 'N/A';
      //   case 'SHIPPING':
      //     return 'yellow';
      //   case 'EN_ROUTE':
      //     return 'orange';
      //   case 'OUT_FOR_DELIVERY':
      //     return 'orange';
      //   case 'DELIVERED':
      //     return 'green';
      //   case 'DELAYED':
      //     return 'N/A';
      // }
      return "N/A";
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

async function refreshMarketResults(searchTerm = marketLookupApp.searchTerm) {
  marketLookupApp.isSearching = true;
  let searchResults = await window.parent.parent.parent.marketAPI.searchMarketplace('stockx', searchTerm);
  if (searchTerm != marketLookupApp.searchTerm) return;
  resetMarketResults();
  for (var searchResult of searchResults) {
    marketLookupApp.results.push({
      product: searchResult,
      variants: [],
      storesCrawled: [],
      id: window.parent.parent.makeid(10) // assign a new id to each result
    });
  }
}

async function setResultActive(result) {
  if (typeof result == "number") result = marketLookupApp.results[result]; // result was an index, convert to result
  marketLookupApp.activeResultIndex = marketLookupApp.results.indexOf(result);
  marketLookupApp.isUpdatingMarket = true;
  if (result.variants.length == 0) await window.parent.parent.parent.marketAPI.updateMarket(result);
  marketLookupApp.isUpdatingMarket = false;
}

function resetMarketResults() {
  marketLookupApp.activeResultIndex = -1;
  while (marketLookupApp.results.length > 0) marketLookupApp.results.pop();
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

refreshMarketResults();
