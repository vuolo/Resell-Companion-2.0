// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// imports
const MODAL_NAME = 'create';

const MODAL_OPTIONS_TEMPLATE = {
  name: "",
  color: "",
  styleCode: "",
  imageURL: "",
  size: "",
  notes: "",
  marketplaceData: {
    product: {},
    size: ""
  },
  suggestions: {
    items: [],
    itemsOpened: false,
    isSearchingForItems: false,
    sizes: [],
    sizesOpened: false,
    isSearchingForSizes: false
  },
  purchase: {
    price: null,
    estimatedResell: null,
    store: "",
    date: "2020-07-07",
    tracking: {
      number: "",
      carrier: "unselected",
      isTracking: false,
      details: {}
    }
  },
  sale: {
    price: null,
    fees: {
      amount: null,
      isPercent: true
    },
    platform: "",
    date: "2020-07-07",
    tracking: {
      number: "",
      carrier: "unselected",
      isTracking: false,
      details: {}
    }
  },
  quantity: 1,
  selected: false,
  id: ""
};

window.modalOptions = {};
window.resetModalOptions = () => {
  if (window.createApp) {
    if (window.createApp.activeSaleIndex != -1 && window.modalOptions.sale.tracking.isTracking) window.parent.refreshTracking(window.createApp.activeSaleIndex, true);
    window.createApp.activeSaleIndex = -1;
    resetSuggestedItems();
    window.createApp.itemsOpened = false;
    window.createApp.isSearchingForItems = false;
    window.createApp.sizesOpened = false;
    window.createApp.isSearchingForSizes = false;
  }
  window.parent.parent.parent.memory.syncObject(window.modalOptions, window.parent.parent.parent.memory.copyObj(MODAL_OPTIONS_TEMPLATE));
  let separatedDate = window.parent.parent.parent.separateDate();
  window.modalOptions.purchase.date = separatedDate.date;
  window.modalOptions.sale.date = separatedDate.date;
}
window.resetModalOptions();

window.createApp = new Vue({
  el: "#Rewrite___Sold_Inventory_Item_Modal",
  data: {
    companionSettings: window.parent.parent.parent.companionSettings,
    modalOptions: modalOptions,
    activeSaleIndex: -1
  },
  methods: {
    confineTextWidth: window.parent.parent.parent.confineTextWidth,
    getTextWidth: window.parent.parent.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.parent.getThemeColor,
    getColor: window.parent.parent.parent.getColor,
    tryGenerateEllipses: window.parent.parent.parent.tryGenerateEllipses,
    formatScheduleDate: window.parent.parent.parent.frames['home-frame'].homeApp.formatScheduleDate,
    calculateSizeGridPosition: function(index) {
      return { top: (Math.floor(index/3) * (15 + 20)) + (11 + 20) + 'px', left: ((index%3) * (50)) + (18) + 'px' }
    },
    hideSuggestedItems: function() {
      let isHovering = false;
      for (var elem of $('.Suggested_Item_hy_Class')) if ($(elem).is(":hover")) { isHovering = true; break; }
      if (isHovering) setTimeout(function() { modalOptions.suggestions.itemsOpened = false; }, 150);
      else modalOptions.suggestions.itemsOpened = false;
    },
    hideSuggestedSizes: function() {
      let isHovering = false;
      for (var elem of $('.Keyword_Input_Area_ip_Class')) if ($(elem).is(":hover")) { isHovering = true; break; }
      if (isHovering) setTimeout(function() { modalOptions.suggestions.sizesOpened = false; }, 150);
      else {
        modalOptions.suggestions.sizesOpened = false;
        // loop through all sizes and check if typed size = any sizes, then apply if so
        for (var size of modalOptions.suggestions.sizes) {
          if (size.name == modalOptions.size) {
            this.applySuggestedSize(size);
            break;
          }
        }
      }
    },
    applySuggestedItem: async function(item) {
      // update previous search term to prevent a refresh
      allowRefresh = false;
      previousSearchTerm = modalOptions.name;
      try { clearInterval(searchIntv); } catch(err) { console.log(err); }
      searchIntv = null;
      setTimeout(function() { allowRefresh = true; }, 150);

      modalOptions.name = item.name || "";
      modalOptions.color = item.color || "";
      modalOptions.styleCode = item.pid || "";
      modalOptions.imageURL = item.image || "";
      modalOptions.purchase.price = item.retail || null;
      modalOptions.purchase.estimatedResell = item.market.lowestAsk || null;
      modalOptions.marketplaceData.product = item || {};
      modalOptions.suggestions.itemsOpened = false;
      modalOptions.suggestions.isSearchingForSizes = true;
      document.querySelector(".Size_Area_Class > input").focus();
      modalOptions.suggestions.sizes = await window.parent.parent.parent.marketAPI.fetchVariants('stockx', item.urlKey);
      modalOptions.suggestions.isSearchingForSizes = false;
    },
    applySuggestedSize: function(size) {
      modalOptions.size = size.name || "";
      modalOptions.purchase.estimatedResell = size.lowestAsk || modalOptions.purchase.estimatedResell || null;
      modalOptions.marketplaceData.size = size || "";
      modalOptions.suggestions.sizesOpened = false;
    },
    tryConvertSize: function(size) {
      // let convertedSizeObj = {
      //   convertedSize: {
      //     size: "6.5",
      //     conversionType: "UK"
      //   },
      //   currentSize: {
      //     size: "7.5",
      //     conversionType: "US"
      //   }
      // };
      // return convertedSizeObj;
      return false;
    },
    hasOpenActivity: function(tracking) {
      if (!tracking.details || !tracking.details.activities) return false;
      for (var activity of tracking.details.activities) if (activity.isOpened) return true;
    },
    updateTracking: async function(tracking) {
      if (tracking.isTracking) return;
      tracking.isTracking = true;
      tracking.details = await window.parent.parent.parent.packagesAPI.getPackageDetails(tracking.number, tracking.carrier);
      tracking.isTracking = false;
      window.parent.tryTranslateTrackingActivities(tracking);
    },
    toggleActivityOpened: function(activity) {
       activity.isOpened = !activity.isOpened;
       this.$forceUpdate();
    },
    finalizeModal: function() {
      modalOptions.purchase.price = parseFloat(modalOptions.purchase.price);
      modalOptions.purchase.estimatedResell = parseFloat(modalOptions.purchase.estimatedResell);
      modalOptions.sale.price = parseFloat(modalOptions.sale.price);
      modalOptions.sale.fees.amount = parseFloat(modalOptions.sale.fees.amount);
      if (this.activeSaleIndex == -1) window.parent.addSale();
      else window.parent.updateSale(this.activeSaleIndex);
      this.closeModal();
    },
    isSizeActive: function(size) {
      return modalOptions.sizes.includes(size);
    },
    closeModal: function() {
      window.parent.modals[MODAL_NAME].visible = false;
      window.resetModalOptions();
    }
  }
});

function guessAndSetCarrier(trackingNumber) {
  let guessedCarriers = window.parent.parent.parent.packagesAPI.guessCarrier(trackingNumber);
  if (guessedCarriers.length > 0) modalOptions.sale.tracking.carrier = guessedCarriers[0];
}

$("#trackingNumber").on('change keydown paste input', function() {
  guessAndSetCarrier(modalOptions.sale.tracking.number);
});

async function refreshSuggestedItems(inputtedName = modalOptions.name) {
  resetSuggestedItems();
  modalOptions.suggestions.isSearchingForItems = true;
  let searchResults = await window.parent.parent.parent.marketAPI.searchMarketplace('stockx', inputtedName);
  // validate this is still the correct last typed phrase
  if (inputtedName == modalOptions.name) {
    modalOptions.suggestions.items = searchResults;
    modalOptions.suggestions.isSearchingForItems = false;
  }
}

function resetSuggestedItems() {
  while (modalOptions.suggestions.items.length > 0) modalOptions.suggestions.items.pop();
  while (modalOptions.suggestions.sizes.length > 0) modalOptions.suggestions.sizes.pop();
  try { clearInterval(searchIntv); } catch(err) { console.log(err); }
  searchIntv = null;
}

let searchIntv;
let previousSearchTerm;
let allowRefresh = true;
$('.Product_Name_Area_Class .Search_Bar_Class').on('change keydown paste input', function() {
  if (previousSearchTerm && previousSearchTerm.length > 0 && modalOptions.name.length == 0) {
    previousSearchTerm = modalOptions.name;
    if (previousSearchTerm.length > 0 ) { if (allowRefresh) refreshSuggestedItems(previousSearchTerm); }
    else resetSuggestedItems();
  }
  if (!searchIntv) {
    searchIntv = setInterval(function() {
      if (modalOptions.name != previousSearchTerm) {
        previousSearchTerm = modalOptions.name;
      } else {
        previousSearchTerm = modalOptions.name;
        if (previousSearchTerm.length > 0 ) { if (allowRefresh) refreshSuggestedItems(previousSearchTerm); }
        else resetSuggestedItems();
      }
    }, 333);
  }
});

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
