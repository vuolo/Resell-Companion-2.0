// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
window.tableSort = {
  key: "name",
  direction: "descending" // descending OR ascending
};

window.sales = [
  // {
  //   name: "Adidas Yeezy Boost 700 Wave Runner",
  //   color: "",
  //   styleCode: "",
  //   size: "XXXL",
  //   imageURL: "https://stockx-360.imgix.net/Adidas-Yeezy-Wave-Runner-700-Solid-Grey/Images/Adidas-Yeezy-Wave-Runner-700-Solid-Grey/Lv2/img02.jpg?auto=format,compress&w=559&q=90&dpr=2&updated_at=1538080256",
  //   notes: "",
  //   marketplaceData: {
  //     product: {},
  //     size: {},
  //     media360: []
  //   },
  //   suggestions: {
  //     items: [],
  //     itemsOpened: false,
  //     isSearchingForItems: false,
  //     sizes: [],
  //     sizesOpened: false,
  //     isSearchingForSizes: false
  //   },
  //   purchase: {
  //     price: 220,
  //     estimatedResell: 380,
  //     store: "Adidas",
  //     date: "1999-01-26",
  //     tracking: {
  //       number: "9274890198179002075020",
  //       carrier: "usps",
  //       isTracking: false,
  //       details: {}
  //     }
  //   },
  //   sale: {
  //     price: 420,
  //     fees: {
  //       amount: 4.75,
  //       isPercent: true
  //     },
  //     platform: "ebay",
  //     date: "1999-01-26",
  //     tracking: {
  //       number: "9274890198179002075020",
  //       carrier: "usps",
  //       isTracking: false,
  //       details: {}
  //     }
  //   },
  //   quantity: 1,
  //   selected: false,
  //   isHovering: false,
  //   id: "TEST-SALE"
  // }
];
var displayedSales = [];
var copiedSaleIDs = [];

window.modals = {
  'create': {
    visible: false
  },
  'delete': {
    visible: false
  }
}

window.openModal = (modalName) => {
  window.modals[modalName].visible = true;
}

window.modalLoadedCallback = (modalName) => {
  switch (modalName) {
    case 'create':
      salesApp.createModal = window.frames['create-modal'].modalOptions;
      break;
    case 'delete':
      salesApp.deleteModal = window.frames['delete-modal'].modalOptions;
      break;
  }
}

window.addSale = () => {
  for (var i = 0; i < salesApp.createModal.quantity; i++) {
    salesApp.createModal.id = window.parent.parent.makeid(10); // assign a new id to each sale
    window.sales.push(window.parent.parent.memory.copyObj(salesApp.createModal));
    window.sales[window.sales.length-1].quantity = 1;
  }
  salesApp.applyDateSearch();
};

window.editSale = async (sale) => {
  while (!window.frames['create-modal'] || !window.frames['create-modal'].createApp) await window.parent.parent.sleep(50); // check & sleep in case user clicks on item before the modal is initialized
  window.frames['create-modal'].createApp.activeSaleIndex = window.sales.indexOf(sale);
  salesApp.endHovering(sale);
  window.parent.parent.memory.syncObject(window.frames['create-modal'].modalOptions, window.parent.parent.memory.copyObj(sale));
  if (window.frames['create-modal'].modalOptions.sale.tracking.isTracking) setTimeout(window.refreshTracking(-2, true, window.frames['create-modal'].modalOptions.sale.tracking), 50);
  openModal('create');
};

window.updateSale = (saleIndex) => {
  window.parent.parent.memory.syncObject(window.sales[saleIndex], window.parent.parent.memory.copyObj(window.frames['create-modal'].modalOptions));
  salesApp.applyDateSearch();
};

function setMultipleSelectedSales(saleIndex) {
  let startSaleIndex = -1;
  for (var i = 0; i < displayedSales.length; i++) {
    if (displayedSales[i].selected) {
      startSaleIndex = i;
      break;
    }
  }
  if (startSaleIndex == -1) {
    switchSelectedSales(saleIndex);
  } else {
    // check if saleIndex is > than startSaleIndex (go in order) else, saleIndex is  < than startSaleIndex, loop reverse
    let allowSetSelected = false;
    if (saleIndex > startSaleIndex) {
      for (var i = 0; i < displayedSales.length; i++) {
        if (i == startSaleIndex) {
          allowSetSelected = true;
        } else if (i > saleIndex) {
          break;
        } else if (allowSetSelected) {
          displayedSales[i].selected = true;
        }
      }
    } else {
      for (var i = displayedSales.length-1; i >= 0; i--) {
        if (i == startSaleIndex) {
          allowSetSelected = true;
        } else if (i < saleIndex) {
          break;
        } else if (allowSetSelected) {
          displayedSales[i].selected = true;
        }
      }
    }
  }
}

function switchSelectedSales(saleIndex) {
  displayedSales[saleIndex].selected = !displayedSales[saleIndex].selected;
}

window.setAllSalesSelected = (selected = true, displayedOnly = true) => {
  for (var sale of displayedOnly ? displayedSales : window.sales) sale.selected = selected;
};

const salesApp = new Vue({
  el: "#Rewrite___Sales",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    sales: displayedSales,
    searchTerm: "",
    dateSearch: {
      category: "all-time",
      start: "2020-06-23",
      end: "2020-06-27",
      display: "Jun 23 – Jun 27",
      visible: false
    },
    displayMode: 'table', // 'grid'
    modals: window.modals,
    isExporting: false,
    isImporting: false,
    createModal: {},
    deleteModal: {}
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
    beginExport: async function(displayedOnly = true) {
      if (this.isExporting) return; // prevent overlapping exports
      this.isExporting = true;
      try { await window.parent.parent.csvAPI.exportItems('sales', displayedOnly ? this.sales : window.sales); } catch(err) { console.error(err); }
      this.isExporting = false;
    },
    beginImport: async function() {
      if (this.isImporting) return; // prevent overlapping imports
      this.isImporting = true;
      try { await window.parent.parent.csvAPI.importItems('sales', window.sales); } catch(err) { console.error(err); }
      this.isImporting = false;
    },
    beginHovering: async function(sale) {
      if (!sale.isHovering && sale.marketplaceData.media360.length > 0) {
        window.preloadSales360Media(sale);
        sale.isHovering = true;
        let curMedia360Index = 0;
        let hoverIntv = setInterval(function() {
          sale.imageURL = sale.marketplaceData.media360[curMedia360Index];
          curMedia360Index++;
          if (curMedia360Index >= sale.marketplaceData.media360.length-1) curMedia360Index = 0;
          if (!sale.isHovering) clearInterval(hoverIntv);
        }, 50);
      }
    },
    endHovering: function(sale) {
      sale.isHovering = false;
      setTimeout(function() { if (sale.marketplaceData.media360.length > 0) sale.imageURL = sale.marketplaceData.media360[0]; }, 50);
    },
    handleSelectClick: function(e, saleIndex) {
      if (e.ctrlKey) switchSelectedSales(saleIndex);
      else if (e.shiftKey) setMultipleSelectedSales(saleIndex);
      else editSale(displayedSales[saleIndex]);
    },
    applyDateSearch: function(category = this.dateSearch.category, changeSorting = false) {
      this.dateSearch.category = category;
      switch (category) {
        case 'today':
          let separatedDate = window.parent.parent.separateDate();
          this.dateSearch.start = separatedDate.date;
          this.dateSearch.end = separatedDate.date;
          break;
        case 'last7d':
          this.dateSearch.start = window.parent.parent.separateDate(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)).date;
          this.dateSearch.end = window.parent.parent.separateDate().date;
          break;
        case 'last4w':
          this.dateSearch.start = window.parent.parent.separateDate(new Date().getTime() - (4 * 7 * 24 * 60 * 60 * 1000)).date;
          this.dateSearch.end = window.parent.parent.separateDate().date;
          break;
        case 'last3m':
          this.dateSearch.start = window.parent.parent.separateDate(new Date().setMonth(new Date().getMonth() - 3)).date;
          this.dateSearch.end = window.parent.parent.separateDate().date;
          break;
        case 'last1y':
          this.dateSearch.start = window.parent.parent.separateDate(new Date().setMonth(new Date().getMonth() - 12)).date;
          this.dateSearch.end = window.parent.parent.separateDate().date;
          break;
        case 'all-time':
          let allTimeDates = getAllTimeDates();
          this.dateSearch.start = allTimeDates.start;
          this.dateSearch.end = allTimeDates.end;
          break;
        case 'custom':
          // do nothing
          break;
      }
      this.updateDateSearch(changeSorting);
    },
    updateDateSearch: function(changeSorting = false) {
      this.dateSearch.display = `${window.parent.parent.frames['home-frame'].homeApp.formatScheduleDate(new Date(new Date(this.dateSearch.start).getTime() + (24 * 60 * 60 * 1000)).toString())} – ${window.parent.parent.frames['home-frame'].homeApp.formatScheduleDate(new Date(new Date(this.dateSearch.end).getTime() + (24 * 60 * 60 * 1000)).toString())}`;
      if (changeSorting) toggleSortSalesByColumn('sale.date', true);
      else refreshSalesSearch();
    },
    getDisplayedSortDirection: function(key) {
      return window.tableSort.key == key ? (window.tableSort.direction == "ascending" ? "↑" : (window.tableSort.direction == "descending" ? "↓" : "") ) : "";
    },
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
      if (!tracking.details || tracking.details.status == null) return "N/A";
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
      if (!tracking.details || tracking.details.status == null) return "N/A";
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
window.salesApp = salesApp;

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
  let trackingDetails = await window.parent.parent.trackingAPI.getPackageDetails(tracking.number, tracking.carrier);
  tracking.isTracking = false;
  // set after gathering to ensure old packages are not reset
  if (trackingDetails && trackingDetails.status != null) tracking.details = trackingDetails;
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
  // reorganize sales based on table filter
  sortDisplayedSales();
}
window.refreshSalesSearch = refreshSalesSearch;

function isSaleDisplayable(sale) {
  let searchName = sale.name;
  if (searchName.length == 0) searchName = window.parent.parent.tryTranslate('N/A');
  let searchSize = sale.size;
  if (searchSize.length == 0) searchSize = window.parent.parent.tryTranslate('N/A');
  let searchPlatform = sale.sale.platform;
  if (searchPlatform.length == 0) searchPlatform = window.parent.parent.tryTranslate('N/A');
  // validate sale is within date range
  let saleTimestamp = new Date(sale.sale.date).getTime();
  if (!(saleTimestamp >= new Date(salesApp.dateSearch.start).getTime() && saleTimestamp <= new Date(salesApp.dateSearch.end).getTime())) return false;
  return salesApp.searchTerm.length == 0 || searchName.toLowerCase().includes(salesApp.searchTerm.toLowerCase()) || searchSize.toLowerCase().includes(salesApp.searchTerm.toLowerCase()) || searchPlatform.toLowerCase().includes(salesApp.searchTerm.toLowerCase());
};

function toggleSortSalesByColumn(key, forceSameColumn = false) {
  var isSameColumn = window.tableSort.key == key;
  window.tableSort.key = key;
  window.tableSort.direction = !forceSameColumn && isSameColumn ? (window.tableSort.direction == 'ascending' ? 'descending' : 'ascending') : 'descending';
  refreshSalesSearch();
  salesApp.$forceUpdate();
}

function sortDisplayedSales() {
  let key = window.tableSort.key;
  let tempShortenedDisplayedSales = [];
  for (var displayedSale of displayedSales) {
    tempShortenedDisplayedSales.push({
      'name': displayedSale.name.toLowerCase() || window.parent.parent.tryTranslate('N/A'),
      'size': displayedSale.size.toLowerCase() || window.parent.parent.tryTranslate('N/A'),
      'sale.platform': displayedSale.sale.platform.toLowerCase()  || window.parent.parent.tryTranslate('N/A'),
      'purchase.price': displayedSale.purchase.price || 0,
      'sale.price': displayedSale.sale.price || 0,
      'sale.fees.amount': displayedSale.sale.fees.amount || 0,
      'sale.profit': salesApp.calculateProfit(displayedSale) || 0,
      'sale.tracking.details.status': displayedSale.sale.tracking.details.status || 0,
      'sale.date': displayedSale.sale.date,
      id: displayedSale.id
    });
  }
  tempShortenedDisplayedSales.quick_sort(function(a,b) { return window.tableSort.direction == "descending" ? a[key] < b[key] : a[key] > b[key] });
  // rearrange displayedSales based on tempDisplayedSales' id order
  let tempDisplayedSales = [];
  for (var tempShortenedDisplayedSale of tempShortenedDisplayedSales) {
    for (var displayedSale of displayedSales) {
      if (tempShortenedDisplayedSale.id == displayedSale.id) {
        tempDisplayedSales.push(displayedSale);
        break;
      }
    }
  }
  while (displayedSales.length > 0) displayedSales.pop();
  for (var tempDisplayedSale of tempDisplayedSales) displayedSales.push(tempDisplayedSale);
}

function getAllTimeDates() {
  if (window.sales.length == 0) {
    let separatedDate = window.parent.parent.separateDate();
    return { start: separatedDate.date, end: separatedDate.date }
  }
  let dates = [];
  for (var sale of window.sales) dates.push(sale.sale.date);
  dates.quick_sort(function(a,b) { return a < b });
  return { start: dates[0], end: dates[dates.length-1] };
}

document.addEventListener("click", function() {
  if (!$('.Date_Selection_Area_Class').is(":hover") && !$('#dateRangeFilter').is(":hover")) salesApp.dateSearch.visible = false;
  let isHoveringOverItem = false;
  if (!isHoveringOverItem) for (var elem of $('.Row_1_Class')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var elem of $('.Product_Card_1_dy_Class')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var elem of $('body > ul.context-menu-root')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) window.setAllSalesSelected(false, false);
});

window.getSaleByID = (id) => {
  for (var sale of window.sales) if (sale.id == id) return sale;
};

window.removeSale = (sale, refreshSales = true) => {
  window.sales.splice(window.sales.indexOf(sale), 1)
  if (refreshSales) salesApp.applyDateSearch();
};

window.getSelectedSales = () => {
  let outSales = [];
  for (var sale of window.sales) if (sale.selected) outSales.push(sale);
  return outSales;
};

window.preloadSales360Media = (incomingSale = null) => {
  if (incomingSale) window.parent.parent.preloadImages(incomingSale.marketplaceData.media360 || []);
  else for (var sale of window.sales) window.parent.parent.preloadImages(sale.marketplaceData.media360 || []);
}

function duplicateSales(incomingSales = null) {
  if (incomingSales) {
    for (var incomingSale of incomingSales) {
      let duplicateSale = {};
      window.parent.parent.memory.syncObject(duplicateSale, window.parent.parent.memory.copyObj(incomingSale));
      duplicateSale.id = window.parent.parent.makeid(10); // assign a new id to each duplicated sale
      duplicateSale.selected = true; // force select on new sales ONLY
      window.sales.push(duplicateSale);
    }
  } else {
    for (var sale of window.sales) {
      if (sale.selected) {
        sale.selected = false; // force deselect on BOTH new AND duplciated sales
        let duplicateSale = {};
        window.parent.parent.memory.syncObject(duplicateSale, window.parent.parent.memory.copyObj(sale));
        duplicateSale.id = window.parent.parent.makeid(10); // assign a new id to each duplicated sale
        window.sales.push(duplicateSale);
      }
    }
  }
  refreshSalesSearch();
}

async function displayRemovePrompt() {
  while (!window.frames['delete-modal'] || !window.frames['delete-modal'].deleteApp) await window.parent.parent.sleep(50); // check & sleep in case user clicks on item before the modal is initialized
  let selectedSales = window.getSelectedSales();
  window.parent.parent.memory.syncObject(window.frames['delete-modal'].modalOptions.sales, window.parent.parent.memory.copyObj(selectedSales));
  window.frames['delete-modal'].deleteApp.$forceUpdate();
  openModal('delete');
}

function copySales() {
  while (copiedSaleIDs.length > 0) copiedSaleIDs.pop();
  for (var sale of window.sales) if (sale.selected) copiedSaleIDs.push(sale.id);
}

function pasteSales() {
  let outSales = [];
  for (var copiedSaleID of copiedSaleIDs) {
    let sale = window.getSaleByID(copiedSaleID);
    if (sale) outSales.push(sale);
  }
  window.setAllSalesSelected(false, false);
  duplicateSales(outSales);
}

// DISABLE SELECT ALL TEXT FROM Ctrl + A
$(function(){
  $(document).keydown(function(objEvent) {
    if (objEvent.ctrlKey && objEvent.keyCode == 65 && objEvent.target.tagName != "INPUT" && objEvent.target.tagName != "TEXTAREA") objEvent.preventDefault();
  });
});

// KEYBINDS
document.onkeyup = function(e) {
  if (e.which == 46) { // Delete: display delete prompt
    let atLeastOneSelected = false;
    for (var sale of window.sales) if (sale.selected) { atLeastOneSelected = true; break; }
    if (atLeastOneSelected) displayRemovePrompt();
  } else if (e.ctrlKey && e.which == 65) { // Ctrl + A: select all displayed sales
    window.setAllSalesSelected(true);
  } else if (e.ctrlKey && e.which == 68) { // Ctrl + D: deselect all displayed sales
    window.setAllSalesSelected(false);
  } else if (e.ctrlKey && e.which == 67) { // Ctrl + C: copy sales
    copySales();
  } else if (e.ctrlKey && e.which == 86) { // Ctrl + V: paste sales
    pasteSales();
  } else if (e.which == 13) { // Enter: submit delete modal (if user has not yet clicked on the delete modal)
    window.frames['delete-modal'].deleteApp.finalizeModal();
  }
};

salesApp.applyDateSearch();
window.preloadSales360Media();
window.refreshTracking(-1, true); // force refresh tracking on load
window.onload = window.parent.subpageLoadedCallback('sales');
