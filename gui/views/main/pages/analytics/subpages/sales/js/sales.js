// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
window.sales = [
  {
    name: "Adidas Yeezy Boost 700 Wave Runner",
    color: "",
    styleCode: "",
    imageURL: "https://stockx-360.imgix.net/Adidas-Yeezy-Wave-Runner-700-Solid-Grey/Images/Adidas-Yeezy-Wave-Runner-700-Solid-Grey/Lv2/img02.jpg?auto=format,compress&w=559&q=90&dpr=2&updated_at=1538080256",
    size: "XXXL",
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
      price: 220,
      estimatedResell: 380,
      store: "Adidas",
      date: "2020-07-07",
      tracking: {
        number: "9274890198179002075020",
        carrier: "usps",
        isTracking: false,
        details: {}
      }
    },
    sale: {
      price: 420,
      fees: {
        amount: 4.75,
        isPercent: true
      },
      platform: "ebay",
      date: "2020-07-07",
      tracking: {
        number: "9274890198179002075020",
        carrier: "usps",
        isTracking: false,
        details: {}
      }
    },
    quantity: 1,
    id: "TEST-SALE"
  }
];

let displayedSales = [];

window.modals = {
  'create': {
    visible: false
  }
}

window.openModal = (modalName) => {
  window.modals[modalName].visible = true;
}

window.modalLoadedCallback = (modalName) => {
  if (modalName == 'create') {
    salesApp.createModal = window.frames['create-modal'].modalOptions;
  }
}

window.addSale = () => {
  for (var i = 0; i < salesApp.createModal.quantity; i++) {
    salesApp.createModal.id = window.parent.parent.makeid(10); // assign a new id to each node
    window.sales.push(window.parent.parent.memory.copyObj(salesApp.createModal));
    window.sales[window.sales.length-1].quantity = 1;
  }
  refreshSalesSearch();
  // TODO: reorganize sales based on table filter (OR DO THIS IN THE FUNCTION ABOVE)
};

window.editSale = async (sale) => {
  while (!window.frames['create-modal'] || !window.frames['create-modal'].createApp) await window.parent.parent.sleep(50); // check & sleep in case user clicks on item before the modal is initialized
  window.frames['create-modal'].createApp.activeSaleIndex = window.sales.indexOf(sale);
  window.parent.parent.memory.syncObject(window.frames['create-modal'].modalOptions, window.parent.parent.memory.copyObj(sale));
  if (window.frames['create-modal'].modalOptions.sale.tracking.isTracking) setTimeout(window.refreshTracking(-2, true, window.frames['create-modal'].modalOptions.sale.tracking), 50);
  openModal('create');
};

window.updateSale = (saleIndex) => {
  window.parent.parent.memory.syncObject(window.sales[saleIndex], window.parent.parent.memory.copyObj(window.frames['create-modal'].modalOptions));
  refreshSalesSearch();
};

const salesApp = new Vue({
  el: "#Rewrite___Sales",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    sales: displayedSales,
    searchTerm: "",
    displayMode: 'table', // 'grid'
    modals: window.modals,
    createModal: {},
    displayedDateSearch: 'Jun 23 – Jun 27'
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
    openModal: window.openModal,
    editSale: window.editSale,
    calculateGridPosition: function(index) {
      return { top: (Math.floor(index/5) * (218+9)) + 10 + 'px', left: ((index%5) * (227+9)) + (10 + 25) + 'px' }
    },
    shouldDisplayModals: function() {
      for (var modal in modals) if (modals[modal].visible) return true;
      return false;
    },
    getTotalSpent: function() {
      let outSpent = 0;
      for (var sale of this.sales) outSpent += (sale.purchase.price || 0);
      return window.parent.parent.roundNumber(outSpent);
    },
    getTotalRevenue: function() {
      let outRevenue = 0;
      for (var sale of this.sales) outRevenue += this.calculateProfit(sale) + (sale.purchase.price || 0);
      return window.parent.parent.roundNumber(outRevenue);
    },
    getTotalProfit: function() {
      let outProfit = 0;
      for (var sale of this.sales) outProfit += this.calculateProfit(sale);
      return window.parent.parent.roundNumber(outProfit);
    },
    getPlatformImage: function(platform) {
      let formattedPlatform = platform.replace(new RegExp(" ", 'g'), "").toLowerCase().trim();
      switch (formattedPlatform) {
        case 'stockx':
          return 'StockX';
        case 'ebay':
          return 'eBay';
        case 'flightclub':
          return 'Flight Club';
        case 'goat':
          return 'Goat';
        case 'stadiumgoods':
          return 'Stadium Goods';
      }
      return "";
    },
    getTrackingColor: function(tracking) {
      if (!tracking.details || !tracking.details.status) return "N/A";
      switch (getStatusDescription(tracking.details.status)) {
        case 'UNKNOWN':
          return 'N/A';
        case 'SHIPPING':
          return 'yellow';
        case 'EN_ROUTE':
          return 'orange';
        case 'OUT_FOR_DELIVERY':
          return 'orange';
        case 'DELIVERED':
          return 'green';
        case 'DELAYED':
          return 'N/A';
      }
      return "N/A";
    },
    getDisplayedTrackingStatus: function(tracking) {
      if (!tracking.details || !tracking.details.status) return "N/A";
      switch (getStatusDescription(tracking.details.status)) {
        case 'UNKNOWN':
          return 'Unknown';
        case 'SHIPPING':
          return 'Shipping...';
        case 'EN_ROUTE':
          return 'En Route...';
        case 'OUT_FOR_DELIVERY':
          return 'Out for Delivery';
        case 'DELIVERED':
          return 'Delivered';
        case 'DELAYED':
          return 'Delayed';
      }
      return "N/A";
    },
    getProfitColor: function(profit) {
      if (profit > 0) return 'green'
      else if (profit < 0) return 'red';
      return 'yellow';
    },
    calculateProfit: function(sale) {
      if (sale.sale.fees.isPercent) return window.parent.parent.roundNumber((sale.sale.price || 0) * (1 - (sale.sale.fees.amount || 0) * (1/100)) - (sale.purchase.price || 0));
      return window.parent.parent.roundNumber((sale.sale.price || 0) - (sale.sale.fees.amount || 0) - (sale.purchase.price || 0));
    },
    getDisplayedFees: function(sale) {
      if (sale.sale.fees.amount == null || sale.sale.fees.amount == 0) return this.tryTranslate("N/A");
      return sale.sale.fees.isPercent ? (sale.sale.fees.amount || 0) + "%" : this.companionSettings.currencySymbol + this.numberWithCommas(window.parent.parent.roundNumber((sale.sale.fees.amount || 0)));
    }
  }
});

window.tryTranslateTrackingActivities = (tracking, language = window.parent.parent.companionSettings.language || "en") => {
  if (language == "en" || !tracking.details.activities) return;
  for (var i = 0; i < tracking.details.activities.length; i++) {
    let activity = tracking.details.activities[i];
    window.parent.parent.translate(activity.details, { from: "en", to: language, engine: 'google', key: 'AIzaSyAjeg3W1rEmviok1H2UmlPvrjOZybUb9wU'  })
    .then(translation => activity.details = translation);
  }
};

async function tryUpdateTracking(tracking, force = false) {
  if (!force && !tracking.isTracking && tracking.number.length == 0 || tracking.carrier == 'unselected') return;
  tracking.isTracking = true;
  let trackingDetails = await window.parent.parent.packagesAPI.getPackageDetails(tracking.number, tracking.carrier);
  tracking.isTracking = false;
  // set after gathering to ensure old packages are not reset
  if (trackingDetails && trackingDetails.status) tracking.details = trackingDetails;
  salesApp.$forceUpdate();
  window.tryTranslateTrackingActivities(tracking);
}

window.refreshTracking = (saleIndex = -1, force = false, tracking = null) => {
  if (saleIndex != -1) tryUpdateTracking(tracking || window.sales[saleIndex].sale.tracking, force);
  else for (var i = 0; i < window.sales.length; i++) tryUpdateTracking(tracking || window.sales[i].sale.tracking, force);
};

function getStatusDescription(statusNumber) {
  switch (statusNumber) {
    case 0:
      return "UNKNOWN";
    case 1:
      return "SHIPPING";
    case 2:
      return "EN_ROUTE";
    case 3:
      return "OUT_FOR_DELIVERY";
    case 4:
      return "DELIVERED";
    case 5:
      return "DELAYED";
  }
  return "UNKNOWN";
}

$("#salesSearch").on('change keydown paste input', refreshSalesSearch);

function refreshSalesSearch() {
  while (displayedSales.length > 0) displayedSales.pop();
  for (var sale of window.sales) if (isSaleDisplayable(sale)) displayedSales.push(sale);
  // TODO: sort at end?
}

function isSaleDisplayable(sale) {
  return salesApp.searchTerm.length == 0 || sale.name.toLowerCase().includes(salesApp.searchTerm.toLowerCase());
};

refreshSalesSearch();
window.refreshTracking(-1, true); // force refresh tracking on load
window.onload = window.parent.subpageLoadedCallback('sales');
