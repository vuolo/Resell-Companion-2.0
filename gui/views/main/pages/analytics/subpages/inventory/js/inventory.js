// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
window.tableSort = {
  key: "name",
  direction: "descending" // descending OR ascending
};

window.inventoryItems = [
  // {
  //   name: "Adidas Yeezy Boost 700 Wave Runner",
  //   color: "",
  //   styleCode: "",
  //   size: "9.5",
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
  //     price: null,
  //     fees: {
  //       amount: null,
  //       isPercent: true
  //     },
  //     platform: "",
  //     date: "1999-01-26",
  //     tracking: {
  //       number: "",
  //       carrier: "unselected",
  //       isTracking: false,
  //       details: {}
  //     }
  //   },
  //   quantity: 1,
  //   selected: false,
  //   isHovering: false,
  //   id: "TEST-INVENTORY-ITEM"
  // }
];
var displayedInventoryItems = [];
var copiedInventoryItemIDs = [];

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
      inventoryApp.createModal = window.frames['create-modal'].modalOptions;
      break;
    case 'delete':
      inventoryApp.deleteModal = window.frames['delete-modal'].modalOptions;
      break;
  }
}

window.addInventoryItem = () => {
  for (var i = 0; i < inventoryApp.createModal.quantity; i++) {
    inventoryApp.createModal.id = window.parent.parent.makeid(10); // assign a new id to each inventory item
    window.inventoryItems.push(window.parent.parent.memory.copyObj(inventoryApp.createModal));
    window.inventoryItems[window.inventoryItems.length-1].quantity = 1;
  }
  inventoryApp.applyDateSearch();
};

window.editInventoryItem = async (inventoryItem) => {
  while (!window.frames['create-modal'] || !window.frames['create-modal'].createApp) await window.parent.parent.sleep(50); // check & sleep in case user clicks on item before the modal is initialized
  window.frames['create-modal'].createApp.activeInventoryItemIndex = window.inventoryItems.indexOf(inventoryItem);
  inventoryApp.endHovering(inventoryItem);
  if (!inventoryItem.sale.price && inventoryItem.sale.price != 0) inventoryItem.sale.date = window.parent.parent.separateDate().date;
  window.parent.parent.memory.syncObject(window.frames['create-modal'].modalOptions, window.parent.parent.memory.copyObj(inventoryItem));
  window.frames['create-modal'].resetMarketplaceResult();
  window.frames['create-modal'].marketplaceResult.product = window.frames['create-modal'].modalOptions.marketplaceData.product;
  window.frames['create-modal'].setupMarketplaceResult();
  window.frames['create-modal'].setupMarketplaceResult();
  if (window.frames['create-modal'].modalOptions.purchase.tracking.isTracking) setTimeout(window.refreshTracking(-2, true, window.frames['create-modal'].modalOptions.purchase.tracking), 50);
  openModal('create');
};

window.updateInventoryItem = (inventoryItemIndex) => {
  window.parent.parent.memory.syncObject(window.inventoryItems[inventoryItemIndex], window.parent.parent.memory.copyObj(window.frames['create-modal'].modalOptions));
  inventoryApp.applyDateSearch();
};

function setMultipleSelectedInventoryItems(inventoryItemIndex) {
  let startInventoryItemIndex = -1;
  for (var i = 0; i < displayedInventoryItems.length; i++) {
    if (displayedInventoryItems[i].selected) {
      startInventoryItemIndex = i;
      break;
    }
  }
  if (startInventoryItemIndex == -1) {
    switchSelectedInventoryItems(inventoryItemIndex);
  } else {
    // check if inventoryItemIndex is > than startInventoryItemIndex (go in order) else, inventoryItemIndex is  < than startInventoryItemIndex, loop reverse
    let allowSetSelected = false;
    if (inventoryItemIndex > startInventoryItemIndex) {
      for (var i = 0; i < displayedInventoryItems.length; i++) {
        if (i == startInventoryItemIndex) {
          allowSetSelected = true;
        } else if (i > inventoryItemIndex) {
          break;
        } else if (allowSetSelected) {
          displayedInventoryItems[i].selected = true;
        }
      }
    } else {
      for (var i = displayedInventoryItems.length-1; i >= 0; i--) {
        if (i == startInventoryItemIndex) {
          allowSetSelected = true;
        } else if (i < inventoryItemIndex) {
          break;
        } else if (allowSetSelected) {
          displayedInventoryItems[i].selected = true;
        }
      }
    }
  }
}

function switchSelectedInventoryItems(inventoryItemIndex) {
  displayedInventoryItems[inventoryItemIndex].selected = !displayedInventoryItems[inventoryItemIndex].selected;
}

window.setAllInventoryItemsSelected = (selected = true, displayedOnly = true) => {
  for (var inventoryItem of displayedOnly ? displayedInventoryItems : window.inventoryItems) inventoryItem.selected = selected;
};

const inventoryApp = new Vue({
  el: "#Rewrite___Sales",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    inventoryItems: displayedInventoryItems,
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
    editInventoryItem: window.editInventoryItem,
    beginExport: async function(displayedOnly = true) {
      if (this.isExporting) return; // prevent overlapping exports
      this.isExporting = true;
      try { await window.parent.parent.csvAPI.exportItems('inventory', displayedOnly ? this.inventoryItems : window.inventoryItems); } catch(err) { console.error(err); }
      this.isExporting = false;
    },
    beginImport: async function() {
      if (this.isImporting) return; // prevent overlapping imports
      this.isImporting = true;
      try { await window.parent.parent.csvAPI.importItems('inventory', window.inventoryItems); } catch(err) { console.error(err); }
      this.isImporting = false;
    },
    beginHovering: async function(inventoryItem) {
      if (!inventoryItem.isHovering && inventoryItem.marketplaceData.media360.length > 0) {
        window.preloadInventoryItems360Media(inventoryItem);
        inventoryItem.isHovering = true;
        let curMedia360Index = 0;
        let hoverIntv = setInterval(function() {
          inventoryItem.imageURL = inventoryItem.marketplaceData.media360[curMedia360Index];
          curMedia360Index++;
          if (curMedia360Index >= inventoryItem.marketplaceData.media360.length-1) curMedia360Index = 0;
          if (!inventoryItem.isHovering) clearInterval(hoverIntv);
        }, 50);
      }
    },
    endHovering: function(inventoryItem) {
      inventoryItem.isHovering = false;
      setTimeout(function() { if (inventoryItem.marketplaceData.media360.length > 0) inventoryItem.imageURL = inventoryItem.marketplaceData.media360[0]; }, 50);
    },
    handleSelectClick: function(e, inventoryItemIndex) {
      if (e.ctrlKey) switchSelectedInventoryItems(inventoryItemIndex);
      else if (e.shiftKey) setMultipleSelectedInventoryItems(inventoryItemIndex);
      else editInventoryItem(displayedInventoryItems[inventoryItemIndex]);
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
      if (changeSorting) toggleSortInventoryItemsByColumn('purchase.date', true);
      else refreshInventoryItemsSearch();
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
      for (var inventoryItem of this.inventoryItems) outSpent += (inventoryItem.purchase.price || 0);
      return window.parent.parent.roundNumber(outSpent);
    },
    getTotalRevenue: function() {
      let outRevenue = 0;
      for (var inventoryItem of this.inventoryItems) outRevenue += this.calculateEstimatedProfit(inventoryItem) + (inventoryItem.purchase.price || 0);
      return window.parent.parent.roundNumber(outRevenue);
    },
    getTotalEstimatedResell: function () {
      let outEstimatedResell = 0;
      for (var inventoryItem of this.inventoryItems) outEstimatedResell += (inventoryItem.purchase.estimatedResell || 0);
      return window.parent.parent.roundNumber(outEstimatedResell);
    },
    getTotalEstimatedProfit: function() {
      let outProfit = 0;
      for (var inventoryItem of this.inventoryItems) outProfit += this.calculateEstimatedProfit(inventoryItem);
      return window.parent.parent.roundNumber(outProfit);
    },
    getStoreImage: function(store) {
      let formattedStore = store.replace(new RegExp(" ", 'g'), "").toLowerCase().trim();
      switch (formattedStore) {
        case 'adidas':
          return 'adidas-full';
        case 'nike':
          return 'Nike';
        case 'offwhite':
          return 'Off White';
        case 'shopify':
          return 'Shopify-full';
        case 'snkrs':
          return 'SNKRS';
        case 'supreme':
          return 'Supreme';
        case 'yeezy':
          return 'Yeezy';
        case 'yeezysupply':
          return 'Yeezy';
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
    calculateEstimatedProfit: function(inventoryItem) {
      return window.parent.parent.roundNumber((inventoryItem.purchase.estimatedResell || 0) - (inventoryItem.purchase.price || 0));
    },
    getDisplayedFees: function(inventoryItem) {
      if (inventoryItem.sale.fees.amount == null || inventoryItem.sale.fees.amount == 0) return this.tryTranslate("N/A");
      return inventoryItem.sale.fees.isPercent ? (inventoryItem.sale.fees.amount || 0) + "%" : this.companionSettings.currencySymbol + this.numberWithCommas(window.parent.parent.roundNumber((inventoryItem.sale.fees.amount || 0)));
    }
  }
});
window.inventoryApp = inventoryApp;

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
  inventoryApp.$forceUpdate();
  window.tryTranslateTrackingActivities(tracking);
}

window.refreshTracking = (inventoryItemIndex = -1, force = false, tracking = null) => {
  if (inventoryItemIndex != -1) tryUpdateTracking(tracking || window.inventoryItems[inventoryItemIndex].purchase.tracking, force);
  else for (var i = 0; i < window.inventoryItems.length; i++) tryUpdateTracking(tracking || window.inventoryItems[i].purchase.tracking, force);
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

$("#inventoryItemsSearch").on('change keydown paste input', refreshInventoryItemsSearch);

function refreshInventoryItemsSearch() {
  while (displayedInventoryItems.length > 0) displayedInventoryItems.pop();
  for (var inventoryItem of window.inventoryItems) if (isInventoryItemDisplayable(inventoryItem)) displayedInventoryItems.push(inventoryItem);
  // reorganize inventory items based on table filter
  sortDisplayedInventoryItems();
  if (window.parent.frames['overview-subpage'].overviewApp) window.parent.frames['overview-subpage'].overviewApp.applyDateSearch(); // refresh totals on overview page
}
window.refreshInventoryItemsSearch = refreshInventoryItemsSearch;

function isInventoryItemDisplayable(inventoryItem) {
  let searchName = inventoryItem.name;
  if (searchName.length == 0) searchName = window.parent.parent.tryTranslate('N/A');
  let searchSize = inventoryItem.size;
  if (searchSize.length == 0) searchSize = window.parent.parent.tryTranslate('N/A');
  let searchStore = inventoryItem.purchase.store;
  if (searchStore.length == 0) searchStore = window.parent.parent.tryTranslate('N/A');
  // validate inventory item is within date range
  let purchaseTimestamp = new Date(inventoryItem.purchase.date).getTime();
  if (!(purchaseTimestamp >= new Date(inventoryApp.dateSearch.start).getTime() && purchaseTimestamp <= new Date(inventoryApp.dateSearch.end).getTime())) return false;
  return inventoryApp.searchTerm.length == 0 || searchName.toLowerCase().includes(inventoryApp.searchTerm.toLowerCase()) || searchSize.toLowerCase().includes(inventoryApp.searchTerm.toLowerCase()) || searchStore.toLowerCase().includes(inventoryApp.searchTerm.toLowerCase());
};

function toggleSortInventoryItemsByColumn(key, forceSameColumn = false) {
  var isSameColumn = window.tableSort.key == key;
  window.tableSort.key = key;
  window.tableSort.direction = !forceSameColumn && isSameColumn ? (window.tableSort.direction == 'ascending' ? 'descending' : 'ascending') : 'descending';
  refreshInventoryItemsSearch();
  inventoryApp.$forceUpdate();
}

function sortDisplayedInventoryItems() {
  let key = window.tableSort.key;
  let tempShortenedDisplayedInventoryItems = [];
  for (var displayedInventoryItem of displayedInventoryItems) {
    tempShortenedDisplayedInventoryItems.push({
      'name': displayedInventoryItem.name.toLowerCase() || window.parent.parent.tryTranslate('N/A'),
      'size': displayedInventoryItem.size.toLowerCase() || window.parent.parent.tryTranslate('N/A'),
      'purchase.store': displayedInventoryItem.purchase.store.toLowerCase()  || window.parent.parent.tryTranslate('N/A'),
      'purchase.price': displayedInventoryItem.purchase.price || 0,
      'purchase.estimatedResell': displayedInventoryItem.purchase.estimatedResell || 0,
      'purchase.tracking.details.status': displayedInventoryItem.purchase.tracking.details.status || 0,
      'purchase.date': displayedInventoryItem.purchase.date,
      id: displayedInventoryItem.id
    });
  }
  tempShortenedDisplayedInventoryItems.quick_sort(function(a,b) { return window.tableSort.direction == "descending" ? a[key] < b[key] : a[key] > b[key] });
  // rearrange displayedInventoryItems based on tempDisplayedInventoryItems' id order
  let tempDisplayedInventoryItems = [];
  for (var tempShortenedDisplayedInventoryItem of tempShortenedDisplayedInventoryItems) {
    for (var displayedInventoryItem of displayedInventoryItems) {
      if (tempShortenedDisplayedInventoryItem.id == displayedInventoryItem.id) {
        tempDisplayedInventoryItems.push(displayedInventoryItem);
        break;
      }
    }
  }
  while (displayedInventoryItems.length > 0) displayedInventoryItems.pop();
  for (var tempDisplayedInventoryItem of tempDisplayedInventoryItems) displayedInventoryItems.push(tempDisplayedInventoryItem);
}

function getAllTimeDates() {
  if (window.inventoryItems.length == 0) {
    let separatedDate = window.parent.parent.separateDate();
    return { start: separatedDate.date, end: separatedDate.date }
  }
  let dates = [];
  for (var inventoryItem of window.inventoryItems) dates.push(inventoryItem.purchase.date);
  dates.quick_sort(function(a,b) { return a < b });
  return { start: dates[0], end: dates[dates.length-1] };
}

document.addEventListener("click", function() {
  if (!$('.Date_Selection_Area_Class').is(":hover") && !$('#dateRangeFilter').is(":hover")) inventoryApp.dateSearch.visible = false;
  let isHoveringOverItem = false;
  if (!isHoveringOverItem) for (var elem of $('.Row_1_Class')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var elem of $('.Product_Card_1_dy_Class')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var elem of $('body > ul.context-menu-root')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) window.setAllInventoryItemsSelected(false, false);
});

window.getInventoryItemByID = (id) => {
  for (var inventoryItem of window.inventoryItems) if (inventoryItem.id == id) return inventoryItem;
};

window.removeInventoryItem = (inventoryItem, refreshInventoryItems = true) => {
  window.inventoryItems.splice(window.inventoryItems.indexOf(inventoryItem), 1)
  if (refreshInventoryItems) inventoryApp.applyDateSearch();
};

window.getSelectedInventoryItems = () => {
  let outInventoryItems = [];
  for (var inventoryItem of window.inventoryItems) if (inventoryItem.selected) outInventoryItems.push(inventoryItem);
  return outInventoryItems;
};

window.preloadInventoryItems360Media = (incomingInventoryItem = null) => {
  if (incomingInventoryItem) window.parent.parent.preloadImages(incomingInventoryItem.marketplaceData.media360 || []);
  else for (var inventoryItem of window.inventoryItems) window.parent.parent.preloadImages(inventoryItem.marketplaceData.media360 || []);
}

function duplicateInventoryItems(incomingInventoryItems = null) {
  if (incomingInventoryItems) {
    for (var incomingInventoryItem of incomingInventoryItems) {
      let duplicateInventoryItem = {};
      window.parent.parent.memory.syncObject(duplicateInventoryItem, window.parent.parent.memory.copyObj(incomingInventoryItem));
      duplicateInventoryItem.id = window.parent.parent.makeid(10); // assign a new id to each duplicated inventory item
      duplicateInventoryItem.selected = true; // force select on new inventory items ONLY
      window.inventoryItems.push(duplicateInventoryItem);
    }
  } else {
    for (var inventoryItem of window.inventoryItems) {
      if (inventoryItem.selected) {
        inventoryItem.selected = false; // force deselect on BOTH new AND duplciated inventory items
        let duplicateInventoryItem = {};
        window.parent.parent.memory.syncObject(duplicateInventoryItem, window.parent.parent.memory.copyObj(inventoryItem));
        duplicateInventoryItem.id = window.parent.parent.makeid(10); // assign a new id to each duplicated inventory item
        window.inventoryItems.push(duplicateInventoryItem);
      }
    }
  }
  refreshInventoryItemsSearch();
}

async function displayRemovePrompt() {
  while (!window.frames['delete-modal'] || !window.frames['delete-modal'].deleteApp) await window.parent.parent.sleep(50); // check & sleep in case user clicks on item before the modal is initialized
  let selectedInventoryItems = window.getSelectedInventoryItems();
  window.parent.parent.memory.syncObject(window.frames['delete-modal'].modalOptions.inventoryItems, window.parent.parent.memory.copyObj(selectedInventoryItems));
  window.frames['delete-modal'].deleteApp.$forceUpdate();
  openModal('delete');
}

function copyInventoryItems() {
  while (copiedInventoryItemIDs.length > 0) copiedInventoryItemIDs.pop();
  for (var inventoryItem of window.inventoryItems) if (inventoryItem.selected) copiedInventoryItemIDs.push(inventoryItem.id);
}

function pasteInventoryItems() {
  let outInventoryItems = [];
  for (var copiedInventoryItemID of copiedInventoryItemIDs) {
    let inventoryItem = window.getInventoryItemByID(copiedInventoryItemID);
    if (inventoryItem) outInventoryItems.push(inventoryItem);
  }
  window.setAllInventoryItemsSelected(false, false);
  duplicateInventoryItems(outInventoryItems);
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
    for (var inventoryItem of window.inventoryItems) if (inventoryItem.selected) { atLeastOneSelected = true; break; }
    if (atLeastOneSelected) displayRemovePrompt();
  } else if (e.ctrlKey && e.which == 65) { // Ctrl + A: select all displayed inventory items
    window.setAllInventoryItemsSelected(true);
  } else if (e.ctrlKey && e.which == 68) { // Ctrl + D: deselect all displayed inventory items
    window.setAllInventoryItemsSelected(false);
  } else if (e.ctrlKey && e.which == 67) { // Ctrl + C: copy inventory items
    copyInventoryItems();
  } else if (e.ctrlKey && e.which == 86) { // Ctrl + V: paste inventory items
    pasteInventoryItems();
  } else if (e.which == 13) { // Enter: submit delete modal (if user has not yet clicked on the delete modal)
    window.frames['delete-modal'].deleteApp.finalizeModal();
  }
};

inventoryApp.applyDateSearch();
window.preloadInventoryItems360Media();
window.refreshTracking(-1, true); // force refresh tracking on load
window.onload = window.parent.subpageLoadedCallback('inventory');
