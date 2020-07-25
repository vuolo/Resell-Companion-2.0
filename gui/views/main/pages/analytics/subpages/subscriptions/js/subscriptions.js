// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
window.tableSort = {
  key: "name",
  direction: "descending" // descending OR ascending
};

window.subscriptions = [
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
  //   id: "TEST-TICKET"
  // }
];
var displayedSubscriptions = [];
var copiedSubscriptionIDs = [];

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
      subscriptionsApp.createModal = window.frames['create-modal'].modalOptions;
      break;
    case 'delete':
      subscriptionsApp.deleteModal = window.frames['delete-modal'].modalOptions;
      break;
  }
}

window.addSubscription = () => {
  for (var i = 0; i < subscriptionsApp.createModal.quantity; i++) {
    subscriptionsApp.createModal.id = window.parent.parent.makeid(10); // assign a new id to each subscription
    window.subscriptions.push(window.parent.parent.memory.copyObj(subscriptionsApp.createModal));
    window.subscriptions[window.subscriptions.length-1].quantity = 1;
  }
  subscriptionsApp.applyDateSearch();
};

window.editSubscription = async (subscription) => {
  while (!window.frames['create-modal'] || !window.frames['create-modal'].createApp) await window.parent.parent.sleep(50); // check & sleep in case user clicks on item before the modal is initialized
  window.frames['create-modal'].createApp.activeSubscriptionIndex = window.subscriptions.indexOf(subscription);
  subscriptionsApp.endHovering(subscription);
  if (!subscription.sale.price && subscription.sale.price != 0) subscription.sale.date = window.parent.parent.separateDate().date;
  window.parent.parent.memory.syncObject(window.frames['create-modal'].modalOptions, window.parent.parent.memory.copyObj(subscription));
  if (window.frames['create-modal'].modalOptions.sale.tracking.isTracking) setTimeout(window.refreshTracking(-2, true, window.frames['create-modal'].modalOptions.sale.tracking), 50);
  openModal('create');
};

window.updateSubscription = (subscriptionIndex) => {
  window.parent.parent.memory.syncObject(window.subscriptions[subscriptionIndex], window.parent.parent.memory.copyObj(window.frames['create-modal'].modalOptions));
  subscriptionsApp.applyDateSearch();
};

function setMultipleSelectedSubscriptions(subscriptionIndex) {
  let startSubscriptionIndex = -1;
  for (var i = 0; i < displayedSubscriptions.length; i++) {
    if (displayedSubscriptions[i].selected) {
      startSubscriptionIndex = i;
      break;
    }
  }
  if (startSubscriptionIndex == -1) {
    switchSelectedSubscriptions(subscriptionIndex);
  } else {
    // check if subscriptionIndex is > than startSubscriptionIndex (go in order) else, subscriptionIndex is  < than startSubscriptionIndex, loop reverse
    let allowSetSelected = false;
    if (subscriptionIndex > startSubscriptionIndex) {
      for (var i = 0; i < displayedSubscriptions.length; i++) {
        if (i == startSubscriptionIndex) {
          allowSetSelected = true;
        } else if (i > subscriptionIndex) {
          break;
        } else if (allowSetSelected) {
          displayedSubscriptions[i].selected = true;
        }
      }
    } else {
      for (var i = displayedSubscriptions.length-1; i >= 0; i--) {
        if (i == startSubscriptionIndex) {
          allowSetSelected = true;
        } else if (i < subscriptionIndex) {
          break;
        } else if (allowSetSelected) {
          displayedSubscriptions[i].selected = true;
        }
      }
    }
  }
}

function switchSelectedSubscriptions(subscriptionIndex) {
  displayedSubscriptions[subscriptionIndex].selected = !displayedSubscriptions[subscriptionIndex].selected;
}

window.setAllSubscriptionsSelected = (selected = true, displayedOnly = true) => {
  for (var subscription of displayedOnly ? displayedSubscriptions : window.subscriptions) subscription.selected = selected;
};

function weeksBetween(d1, d2) {
  return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
}

function monthsBetween(date1, date2, roundUpFractionalMonths) {
  // Months will be calculated between start and end dates.
  // Make sure start date is less than end date.
  // But remember if the difference should be negative.
  var startDate = date1;
  var endDate = date2;
  var inverse = false;
  if (date1 > date2) {
    startDate = date2;
    endDate = date1;
    inverse = true;
  }

  // Calculate the differences between the start and end dates
  var yearsDifference = endDate.getFullYear() - startDate.getFullYear();
  var monthsDifference = endDate.getMonth() - startDate.getMonth();
  var daysDifference = endDate.getDate() - startDate.getDate();

  var monthCorrection = 0;
  // If roundUpFractionalMonths is true, check if an extra month needs to be added from rounding up.
  // The difference is done by ceiling (round up), e.g. 3 months and 1 day will be 4 months.
  if (roundUpFractionalMonths === true && daysDifference > 0) monthCorrection = 1;
  // If the day difference between the 2 months is negative, the last month is not a whole month.
  else if (roundUpFractionalMonths !== true && daysDifference < 0) monthCorrection = -1;

  return (inverse ? -1 : 1) * (yearsDifference * 12 + monthsDifference + monthCorrection);
};

const subscriptionsApp = new Vue({
  el: "#Rewrite___Sales",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    subscriptions: displayedSubscriptions,
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
    editSubscription: window.editSubscription,
    getTotalMembershipSpentColor: function(subscription) {
      let totalSpent = this.getTotalMembershipSpent(subscription);
      if (totalSpent == 'N/A') return 'N/A';
      else if (totalSpent > 0) return 'red';
      else if (totalSpent < 0) return 'green';
      else return 'yellow';
    },
    getTotalMembershipSpent: function(subscription) {
      let membership = subscription.size;
      let secondDate = !subscription.sale.price ? new Date() : new Date(subscription.sale.date);
      switch (membership) {
        case 'unselected':
          return subscription.purchase.price || 'N/A';
        case 'lifetime':
          return subscription.purchase.price || 'N/A';
        case '1week':
          return !subscription.purchase.price ? 'N/A' : subscription.purchase.price * (weeksBetween(new Date(subscription.purchase.date), secondDate) + 1);
        case '1month':
          return !subscription.purchase.price ? 'N/A' : subscription.purchase.price * (monthsBetween(new Date(subscription.purchase.date), secondDate) + 1);
        case '2month':
          return !subscription.purchase.price ? 'N/A' : subscription.purchase.price * (Math.floor(monthsBetween(new Date(subscription.purchase.date), secondDate)/2) + 1);
        case '3month':
          return !subscription.purchase.price ? 'N/A' : subscription.purchase.price * (Math.floor(monthsBetween(new Date(subscription.purchase.date), secondDate)/3) + 1);
        case '5month':
          return !subscription.purchase.price ? 'N/A' : subscription.purchase.price * (Math.floor(monthsBetween(new Date(subscription.purchase.date), secondDate)/5) + 1);
        case '6month':
          return !subscription.purchase.price ? 'N/A' : subscription.purchase.price * (Math.floor(monthsBetween(new Date(subscription.purchase.date), secondDate)/(12 / 2)) + 1);
        case '1year':
          return !subscription.purchase.price ? 'N/A' : subscription.purchase.price * (Math.floor(monthsBetween(new Date(subscription.purchase.date), secondDate)/(12 * 1)) + 1);
        case '2year':
          return !subscription.purchase.price ? 'N/A' : subscription.purchase.price * (Math.floor(monthsBetween(new Date(subscription.purchase.date), secondDate)/(12 * 2)) + 1);
        case '3year':
          return !subscription.purchase.price ? 'N/A' : subscription.purchase.price * (Math.floor(monthsBetween(new Date(subscription.purchase.date), secondDate)/(12 * 3)) + 1);
      }
      return 'N/A';
    },
    getDisplayedMembership: function(membership) {
      switch (membership) {
        case 'unselected':
          return 'N/A';
        case 'lifetime':
          return 'Lifetime';
        case '1week':
          return 'Weekly';
        case '1month':
          return 'Monthly';
        case '2month':
          return 'Every 2 Months';
        case '3month':
          return 'Every 3 Months';
        case '5month':
          return 'Every 5 Months';
        case '6month':
          return 'Biyearly';
        case '1year':
          return 'Yearly';
        case '2year':
          return 'Every 2 Years';
        case '3year':
          return 'Every 3 Years';
      }
      return 'N/A';
    },
    beginExport: async function(displayedOnly = true) {
      if (this.isExporting) return; // prevent overlapping exports
      this.isExporting = true;
      try { await window.parent.parent.csvAPI.exportItems('subscriptions', displayedOnly ? this.subscriptions : window.subscriptions); } catch(err) { console.error(err); }
      this.isExporting = false;
    },
    beginImport: async function() {
      if (this.isImporting) return; // prevent overlapping imports
      this.isImporting = true;
      try { await window.parent.parent.csvAPI.importItems('subscriptions', window.subscriptions); } catch(err) { console.error(err); }
      this.isImporting = false;
    },
    beginHovering: async function(subscription) {
      if (!subscription.isHovering && subscription.marketplaceData.media360.length > 0) {
        window.preloadSubscriptions360Media(subscription);
        subscription.isHovering = true;
        let curMedia360Index = 0;
        let hoverIntv = setInterval(function() {
          subscription.imageURL = subscription.marketplaceData.media360[curMedia360Index];
          curMedia360Index++;
          if (curMedia360Index >= subscription.marketplaceData.media360.length-1) curMedia360Index = 0;
          if (!subscription.isHovering) clearInterval(hoverIntv);
        }, 50);
      }
    },
    endHovering: function(subscription) {
      subscription.isHovering = false;
      if (subscription.marketplaceData.media360.length > 0) subscription.imageURL = subscription.marketplaceData.media360[0];
    },
    handleSelectClick: function(e, subscriptionIndex) {
      if (e.ctrlKey) switchSelectedSubscriptions(subscriptionIndex);
      else if (e.shiftKey) setMultipleSelectedSubscriptions(subscriptionIndex);
      else editSubscription(displayedSubscriptions[subscriptionIndex]);
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
      if (changeSorting) toggleSortSubscriptionsByColumn('sale.date', true);
      else refreshSubscriptionsSearch();
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
      for (var subscription of this.subscriptions) outSpent += (subscription.purchase.price || 0);
      return window.parent.parent.roundNumber(outSpent);
    },
    getTotalRevenue: function() {
      let outRevenue = 0;
      for (var subscription of this.subscriptions) outRevenue += this.calculateProfit(subscription) + (subscription.purchase.price || 0);
      return window.parent.parent.roundNumber(outRevenue);
    },
    getTotalProfit: function() {
      let outProfit = 0;
      for (var subscription of this.subscriptions) outProfit += this.calculateProfit(subscription);
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
    calculateProfit: function(subscription) {
      if (subscription.sale.fees.isPercent) return window.parent.parent.roundNumber((subscription.sale.price || 0) * (1 - (subscription.sale.fees.amount || 0) * (1/100)) - (subscription.purchase.price || 0));
      return window.parent.parent.roundNumber((subscription.sale.price || 0) - (subscription.sale.fees.amount || 0) - (subscription.purchase.price || 0));
    },
    getDisplayedFees: function(subscription) {
      if (subscription.sale.fees.amount == null || subscription.sale.fees.amount == 0) return this.tryTranslate("N/A");
      return subscription.sale.fees.isPercent ? (subscription.sale.fees.amount || 0) + "%" : this.companionSettings.currencySymbol + this.numberWithCommas(window.parent.parent.roundNumber((subscription.sale.fees.amount || 0)));
    }
  }
});
window.subscriptionsApp = subscriptionsApp;

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
  subscriptionsApp.$forceUpdate();
  window.tryTranslateTrackingActivities(tracking);
}

window.refreshTracking = (subscriptionIndex = -1, force = false, tracking = null) => {
  if (subscriptionIndex != -1) tryUpdateTracking(tracking || window.subscriptions[subscriptionIndex].sale.tracking, force);
  else for (var i = 0; i < window.subscriptions.length; i++) tryUpdateTracking(tracking || window.subscriptions[i].sale.tracking, force);
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

$("#subscriptionsSearch").on('change keydown paste input', refreshSubscriptionsSearch);

function refreshSubscriptionsSearch() {
  while (displayedSubscriptions.length > 0) displayedSubscriptions.pop();
  for (var subscription of window.subscriptions) if (isSubscriptionDisplayable(subscription)) displayedSubscriptions.push(subscription);
  // reorganize subscriptions based on table filter
  sortDisplayedSubscriptions();
  if (window.parent.frames['overview-subpage'].overviewApp) window.parent.frames['overview-subpage'].overviewApp.applyDateSearch(); // refresh totals on overview page
}
window.refreshSubscriptionsSearch = refreshSubscriptionsSearch;

function isSubscriptionDisplayable(subscription) {
  let searchName = subscription.name;
  if (searchName.length == 0) searchName = window.parent.parent.tryTranslate('N/A');
  let searchSize = subscription.size;
  if (searchSize.length == 0) searchSize = window.parent.parent.tryTranslate('N/A');
  let searchPlatform = subscription.sale.platform;
  if (searchPlatform.length == 0) searchPlatform = window.parent.parent.tryTranslate('N/A');
  // validate subscription is within date range
  let subscriptionTimestamp = new Date(subscription.sale.date).getTime();
  if (!(subscriptionTimestamp >= new Date(subscriptionsApp.dateSearch.start).getTime() && subscriptionTimestamp <= new Date(subscriptionsApp.dateSearch.end).getTime())) return false;
  return subscriptionsApp.searchTerm.length == 0 || searchName.toLowerCase().includes(subscriptionsApp.searchTerm.toLowerCase()) || searchSize.toLowerCase().includes(subscriptionsApp.searchTerm.toLowerCase()) || searchPlatform.toLowerCase().includes(subscriptionsApp.searchTerm.toLowerCase());
};

function toggleSortSubscriptionsByColumn(key, forceSameColumn = false) {
  var isSameColumn = window.tableSort.key == key;
  window.tableSort.key = key;
  window.tableSort.direction = !forceSameColumn && isSameColumn ? (window.tableSort.direction == 'ascending' ? 'descending' : 'ascending') : 'descending';
  refreshSubscriptionsSearch();
  subscriptionsApp.$forceUpdate();
}

function sortDisplayedSubscriptions() {
  let key = window.tableSort.key;
  let tempShortenedDisplayedSubscriptions = [];
  for (var displayedSubscription of displayedSubscriptions) {
    tempShortenedDisplayedSubscriptions.push({
      'name': displayedSubscription.name.toLowerCase() || window.parent.parent.tryTranslate('N/A'),
      'size': window.parent.parent.tryTranslate(subscriptionsApp.getDisplayedMembership(displayedSubscription.size)).toLowerCase() || window.parent.parent.tryTranslate('N/A'),
      'sale.platform': displayedSubscription.sale.platform.toLowerCase()  || window.parent.parent.tryTranslate('N/A'),
      'purchase.price': displayedSubscription.purchase.price || 0,
      'sale.price': displayedSubscription.sale.price || 0,
      'sale.fees.amount': displayedSubscription.sale.fees.amount || 0,
      'sale.profit': subscriptionsApp.calculateProfit(displayedSubscription) || 0,
      'sale.totalSpent': window.parent.parent.tryTranslate(subscriptionsApp.getTotalMembershipSpent(displayedSubscription)),
      'sale.date': displayedSubscription.sale.date,
      id: displayedSubscription.id
    });
  }
  tempShortenedDisplayedSubscriptions.quick_sort(function(a,b) { return window.tableSort.direction == "descending" ? a[key] < b[key] : a[key] > b[key] });
  // rearrange displayedSubscriptions based on tempDisplayedSubscriptions' id order
  let tempDisplayedSubscriptions = [];
  for (var tempShortenedDisplayedSubscription of tempShortenedDisplayedSubscriptions) {
    for (var displayedSubscription of displayedSubscriptions) {
      if (tempShortenedDisplayedSubscription.id == displayedSubscription.id) {
        tempDisplayedSubscriptions.push(displayedSubscription);
        break;
      }
    }
  }
  while (displayedSubscriptions.length > 0) displayedSubscriptions.pop();
  for (var tempDisplayedSubscription of tempDisplayedSubscriptions) displayedSubscriptions.push(tempDisplayedSubscription);
}

function getAllTimeDates() {
  if (window.subscriptions.length == 0) {
    let separatedDate = window.parent.parent.separateDate();
    return { start: separatedDate.date, end: separatedDate.date }
  }
  let dates = [];
  for (var subscription of window.subscriptions) dates.push(subscription.purchase.date);
  dates.quick_sort(function(a,b) { return a < b });
  return { start: dates[0], end: dates[dates.length-1] };
}

document.addEventListener("click", function() {
  if (!$('.Date_Selection_Area_Class').is(":hover") && !$('#dateRangeFilter').is(":hover")) subscriptionsApp.dateSearch.visible = false;
  let isHoveringOverItem = false;
  if (!isHoveringOverItem) for (var elem of $('.Row_1_Class')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var elem of $('.Product_Card_1_dy_Class')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var elem of $('body > ul.context-menu-root')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) window.setAllSubscriptionsSelected(false, false);
});

window.getSubscriptionByID = (id) => {
  for (var subscription of window.subscriptions) if (subscription.id == id) return subscription;
};

window.removeSubscription = (subscription, refreshSubscriptions = true) => {
  window.subscriptions.splice(window.subscriptions.indexOf(subscription), 1)
  if (refreshSubscriptions) subscriptionsApp.applyDateSearch();
};

window.getSelectedSubscriptions = () => {
  let outSubscriptions = [];
  for (var subscription of window.subscriptions) if (subscription.selected) outSubscriptions.push(subscription);
  return outSubscriptions;
};

window.preloadSubscriptions360Media = (incomingSubscription = null) => {
  if (incomingSubscription) window.parent.parent.preloadImages(incomingSubscription.marketplaceData.media360);
  else for (var subscription of window.subscriptions) window.parent.parent.preloadImages(subscription.marketplaceData.media360);
}

function duplicateSubscriptions(incomingSubscriptions = null) {
  if (incomingSubscriptions) {
    for (var incomingSubscription of incomingSubscriptions) {
      let duplicateSubscription = {};
      window.parent.parent.memory.syncObject(duplicateSubscription, window.parent.parent.memory.copyObj(incomingSubscription));
      duplicateSubscription.id = window.parent.parent.makeid(10); // assign a new id to each duplicated subscription
      duplicateSubscription.selected = true; // force select on new subscriptions ONLY
      window.subscriptions.push(duplicateSubscription);
    }
  } else {
    for (var subscription of window.subscriptions) {
      if (subscription.selected) {
        subscription.selected = false; // force deselect on BOTH new AND duplciated subscriptions
        let duplicateSubscription = {};
        window.parent.parent.memory.syncObject(duplicateSubscription, window.parent.parent.memory.copyObj(subscription));
        duplicateSubscription.id = window.parent.parent.makeid(10); // assign a new id to each duplicated subscription
        window.subscriptions.push(duplicateSubscription);
      }
    }
  }
  refreshSubscriptionsSearch();
}

async function displayRemovePrompt() {
  while (!window.frames['delete-modal'] || !window.frames['delete-modal'].deleteApp) await window.parent.parent.sleep(50); // check & sleep in case user clicks on item before the modal is initialized
  let selectedSubscriptions = window.getSelectedSubscriptions();
  window.parent.parent.memory.syncObject(window.frames['delete-modal'].modalOptions.subscriptions, window.parent.parent.memory.copyObj(selectedSubscriptions));
  window.frames['delete-modal'].deleteApp.$forceUpdate();
  openModal('delete');
}

function copySubscriptions() {
  while (copiedSubscriptionIDs.length > 0) copiedSubscriptionIDs.pop();
  for (var subscription of window.subscriptions) if (subscription.selected) copiedSubscriptionIDs.push(subscription.id);
}

function pasteSubscriptions() {
  let outSubscriptions = [];
  for (var copiedSubscriptionID of copiedSubscriptionIDs) {
    let subscription = window.getSubscriptionByID(copiedSubscriptionID);
    if (subscription) outSubscriptions.push(subscription);
  }
  window.setAllSubscriptionsSelected(false, false);
  duplicateSubscriptions(outSubscriptions);
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
    for (var subscription of window.subscriptions) if (subscription.selected) { atLeastOneSelected = true; break; }
    if (atLeastOneSelected) displayRemovePrompt();
  } else if (e.ctrlKey && e.which == 65) { // Ctrl + A: select all displayed subscriptions
    window.setAllSubscriptionsSelected(true);
  } else if (e.ctrlKey && e.which == 68) { // Ctrl + D: deselect all displayed subscriptions
    window.setAllSubscriptionsSelected(false);
  } else if (e.ctrlKey && e.which == 67) { // Ctrl + C: copy subscriptions
    copySubscriptions();
  } else if (e.ctrlKey && e.which == 86) { // Ctrl + V: paste subscriptions
    pasteSubscriptions();
  } else if (e.which == 13) { // Enter: submit delete modal (if user has not yet clicked on the delete modal)
    window.frames['delete-modal'].deleteApp.finalizeModal();
  }
};

subscriptionsApp.applyDateSearch();
window.preloadSubscriptions360Media();
window.refreshTracking(-1, true); // force refresh tracking on load
window.onload = window.parent.subpageLoadedCallback('subscriptions');
