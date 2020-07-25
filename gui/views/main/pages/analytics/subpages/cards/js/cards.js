// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
window.tableSort = {
  key: "name",
  direction: "descending" // descending OR ascending
};

window.cards = [
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
  //   id: "TEST-CARD"
  // }
];
var displayedCards = [];
var copiedCardIDs = [];

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
      cardsApp.createModal = window.frames['create-modal'].modalOptions;
      break;
    case 'delete':
      cardsApp.deleteModal = window.frames['delete-modal'].modalOptions;
      break;
  }
}

window.addCard = () => {
  for (var i = 0; i < cardsApp.createModal.quantity; i++) {
    cardsApp.createModal.id = window.parent.parent.makeid(10); // assign a new id to each card
    window.cards.push(window.parent.parent.memory.copyObj(cardsApp.createModal));
    window.cards[window.cards.length-1].quantity = 1;
  }
  cardsApp.applyDateSearch();
};

window.editCard = async (card) => {
  while (!window.frames['create-modal'] || !window.frames['create-modal'].createApp) await window.parent.parent.sleep(50); // check & sleep in case user clicks on item before the modal is initialized
  window.frames['create-modal'].createApp.activeCardIndex = window.cards.indexOf(card);
  cardsApp.endHovering(card);
  if (!card.sale.price && card.sale.price != 0) card.sale.date = window.parent.parent.separateDate().date;
  window.parent.parent.memory.syncObject(window.frames['create-modal'].modalOptions, window.parent.parent.memory.copyObj(card));
  if (window.frames['create-modal'].modalOptions.sale.tracking.isTracking) setTimeout(window.refreshTracking(-2, true, window.frames['create-modal'].modalOptions.sale.tracking), 50);
  openModal('create');
};

window.updateCard = (cardIndex) => {
  window.parent.parent.memory.syncObject(window.cards[cardIndex], window.parent.parent.memory.copyObj(window.frames['create-modal'].modalOptions));
  cardsApp.applyDateSearch();
};

function setMultipleSelectedCards(cardIndex) {
  let startCardIndex = -1;
  for (var i = 0; i < displayedCards.length; i++) {
    if (displayedCards[i].selected) {
      startCardIndex = i;
      break;
    }
  }
  if (startCardIndex == -1) {
    switchSelectedCards(cardIndex);
  } else {
    // check if cardIndex is > than startCardIndex (go in order) else, cardIndex is  < than startCardIndex, loop reverse
    let allowSetSelected = false;
    if (cardIndex > startCardIndex) {
      for (var i = 0; i < displayedCards.length; i++) {
        if (i == startCardIndex) {
          allowSetSelected = true;
        } else if (i > cardIndex) {
          break;
        } else if (allowSetSelected) {
          displayedCards[i].selected = true;
        }
      }
    } else {
      for (var i = displayedCards.length-1; i >= 0; i--) {
        if (i == startCardIndex) {
          allowSetSelected = true;
        } else if (i < cardIndex) {
          break;
        } else if (allowSetSelected) {
          displayedCards[i].selected = true;
        }
      }
    }
  }
}

function switchSelectedCards(cardIndex) {
  displayedCards[cardIndex].selected = !displayedCards[cardIndex].selected;
}

window.setAllCardsSelected = (selected = true, displayedOnly = true) => {
  for (var card of displayedOnly ? displayedCards : window.cards) card.selected = selected;
};

const cardsApp = new Vue({
  el: "#Rewrite___Sales",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    cards: displayedCards,
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
    editCard: window.editCard,
    beginExport: async function(displayedOnly = true) {
      if (this.isExporting) return; // prevent overlapping exports
      this.isExporting = true;
      try { await window.parent.parent.csvAPI.exportItems('cards', displayedOnly ? this.cards : window.cards); } catch(err) { console.error(err); }
      this.isExporting = false;
    },
    beginImport: async function() {
      if (this.isImporting) return; // prevent overlapping imports
      this.isImporting = true;
      try { await window.parent.parent.csvAPI.importItems('cards', window.cards); } catch(err) { console.error(err); }
      this.isImporting = false;
    },
    beginHovering: async function(card) {
      if (!card.isHovering && card.marketplaceData.media360.length > 0) {
        window.preloadCards360Media(card);
        card.isHovering = true;
        let curMedia360Index = 0;
        let hoverIntv = setInterval(function() {
          card.imageURL = card.marketplaceData.media360[curMedia360Index];
          curMedia360Index++;
          if (curMedia360Index >= card.marketplaceData.media360.length-1) curMedia360Index = 0;
          if (!card.isHovering) clearInterval(hoverIntv);
        }, 50);
      }
    },
    endHovering: function(card) {
      card.isHovering = false;
      setTimeout(function() { if (card.marketplaceData.media360.length > 0) card.imageURL = card.marketplaceData.media360[0]; }, 50);
    },
    handleSelectClick: function(e, cardIndex) {
      if (e.ctrlKey) switchSelectedCards(cardIndex);
      else if (e.shiftKey) setMultipleSelectedCards(cardIndex);
      else editCard(displayedCards[cardIndex]);
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
      if (changeSorting) toggleSortCardsByColumn('sale.date', true);
      else refreshCardsSearch();
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
      for (var card of this.cards) outSpent += (card.purchase.price || 0);
      return window.parent.parent.roundNumber(outSpent);
    },
    getTotalRevenue: function() {
      let outRevenue = 0;
      for (var card of this.cards) outRevenue += this.calculateProfit(card) + (card.purchase.price || 0);
      return window.parent.parent.roundNumber(outRevenue);
    },
    getTotalProfit: function() {
      let outProfit = 0;
      for (var card of this.cards) outProfit += this.calculateProfit(card);
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
    calculateProfit: function(card) {
      if (card.sale.fees.isPercent) return window.parent.parent.roundNumber((card.sale.price || 0) * (1 - (card.sale.fees.amount || 0) * (1/100)) - (card.purchase.price || 0));
      return window.parent.parent.roundNumber((card.sale.price || 0) - (card.sale.fees.amount || 0) - (card.purchase.price || 0));
    },
    getDisplayedFees: function(card) {
      if (card.sale.fees.amount == null || card.sale.fees.amount == 0) return card.tryTranslate("N/A");
      return card.sale.fees.isPercent ? (card.sale.fees.amount || 0) + "%" : card.companionSettings.currencySymbol + this.numberWithCommas(window.parent.parent.roundNumber((card.sale.fees.amount || 0)));
    }
  }
});
window.cardsApp = cardsApp;

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
  cardsApp.$forceUpdate();
  window.tryTranslateTrackingActivities(tracking);
}

window.refreshTracking = (cardIndex = -1, force = false, tracking = null) => {
  if (cardIndex != -1) tryUpdateTracking(tracking || window.cards[cardIndex].sale.tracking, force);
  else for (var i = 0; i < window.cards.length; i++) tryUpdateTracking(tracking || window.cards[i].sale.tracking, force);
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

$("#cardsSearch").on('change keydown paste input', refreshCardsSearch);

function refreshCardsSearch() {
  while (displayedCards.length > 0) displayedCards.pop();
  for (var card of window.cards) if (isCardDisplayable(card)) displayedCards.push(card);
  // reorganize cards based on table filter
  sortDisplayedCards();
  if (window.parent.frames['overview-subpage'].overviewApp) window.parent.frames['overview-subpage'].overviewApp.applyDateSearch(); // refresh totals on overview page
}
window.refreshCardsSearch = refreshCardsSearch;

function isCardDisplayable(card) {
  let searchName = card.name;
  if (searchName.length == 0) searchName = window.parent.parent.tryTranslate('N/A');
  let searchSize = card.size;
  if (searchSize.length == 0) searchSize = window.parent.parent.tryTranslate('N/A');
  let searchPlatform = card.sale.platform;
  if (searchPlatform.length == 0) searchPlatform = window.parent.parent.tryTranslate('N/A');
  // validate card is within date range
  let cardTimestamp = new Date(card.sale.date).getTime();
  if (!(cardTimestamp >= new Date(cardsApp.dateSearch.start).getTime() && cardTimestamp <= new Date(cardsApp.dateSearch.end).getTime())) return false;
  return cardsApp.searchTerm.length == 0 || searchName.toLowerCase().includes(cardsApp.searchTerm.toLowerCase()) || searchSize.toLowerCase().includes(cardsApp.searchTerm.toLowerCase()) || searchPlatform.toLowerCase().includes(cardsApp.searchTerm.toLowerCase());
};

function toggleSortCardsByColumn(key, forceSameColumn = false) {
  var isSameColumn = window.tableSort.key == key;
  window.tableSort.key = key;
  window.tableSort.direction = !forceSameColumn && isSameColumn ? (window.tableSort.direction == 'ascending' ? 'descending' : 'ascending') : 'descending';
  refreshCardsSearch();
  cardsApp.$forceUpdate();
}

function sortDisplayedCards() {
  let key = window.tableSort.key;
  let tempShortenedDisplayedCards = [];
  for (var displayedCard of displayedCards) {
    tempShortenedDisplayedCards.push({
      'name': displayedCard.name.toLowerCase() || window.parent.parent.tryTranslate('N/A'),
      'size': displayedCard.size.toLowerCase() || window.parent.parent.tryTranslate('N/A'),
      'sale.platform': displayedCard.sale.platform.toLowerCase()  || window.parent.parent.tryTranslate('N/A'),
      'purchase.price': displayedCard.purchase.price || 0,
      'sale.price': displayedCard.sale.price || 0,
      'sale.fees.amount': displayedCard.sale.fees.amount || 0,
      'sale.profit': cardsApp.calculateProfit(displayedCard) || 0,
      'sale.tracking.details.status': displayedCard.sale.tracking.details.status || 0,
      'sale.date': displayedCard.sale.date,
      id: displayedCard.id
    });
  }
  tempShortenedDisplayedCards.quick_sort(function(a,b) { return window.tableSort.direction == "descending" ? a[key] < b[key] : a[key] > b[key] });
  // rearrange displayedCards based on tempDisplayedCards' id order
  let tempDisplayedCards = [];
  for (var tempShortenedDisplayedCard of tempShortenedDisplayedCards) {
    for (var displayedCard of displayedCards) {
      if (tempShortenedDisplayedCard.id == displayedCard.id) {
        tempDisplayedCards.push(displayedCard);
        break;
      }
    }
  }
  while (displayedCards.length > 0) displayedCards.pop();
  for (var tempDisplayedCard of tempDisplayedCards) displayedCards.push(tempDisplayedCard);
}

function getAllTimeDates() {
  if (window.cards.length == 0) {
    let separatedDate = window.parent.parent.separateDate();
    return { start: separatedDate.date, end: separatedDate.date }
  }
  let dates = [];
  for (var card of window.cards) dates.push(card.purchase.date);
  dates.quick_sort(function(a,b) { return a < b });
  return { start: dates[0], end: dates[dates.length-1] };
}

document.addEventListener("click", function() {
  if (!$('.Date_Selection_Area_Class').is(":hover") && !$('#dateRangeFilter').is(":hover")) cardsApp.dateSearch.visible = false;
  let isHoveringOverItem = false;
  if (!isHoveringOverItem) for (var elem of $('.Row_1_Class')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var elem of $('.Product_Card_1_dy_Class')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var elem of $('body > ul.context-menu-root')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) window.setAllCardsSelected(false, false);
});

window.getCardByID = (id) => {
  for (var card of window.cards) if (card.id == id) return card;
};

window.removeCard = (card, refreshCards = true) => {
  window.cards.splice(window.cards.indexOf(card), 1)
  if (refreshCards) cardsApp.applyDateSearch();
};

window.getSelectedCards = () => {
  let outCards = [];
  for (var card of window.cards) if (card.selected) outCards.push(card);
  return outCards;
};

window.preloadCards360Media = (incomingCard = null) => {
  if (incomingCard) window.parent.parent.preloadImages(incomingCard.marketplaceData.media360 || []);
  else for (var card of window.cards) window.parent.parent.preloadImages(card.marketplaceData.media360 || []);
}

function duplicateCards(incomingCards = null) {
  if (incomingCards) {
    for (var incomingCard of incomingCards) {
      let duplicateCard = {};
      window.parent.parent.memory.syncObject(duplicateCard, window.parent.parent.memory.copyObj(incomingCard));
      duplicateCard.id = window.parent.parent.makeid(10); // assign a new id to each duplicated card
      duplicateCard.selected = true; // force select on new cards ONLY
      window.cards.push(duplicateCard);
    }
  } else {
    for (var card of window.cards) {
      if (card.selected) {
        card.selected = false; // force deselect on BOTH new AND duplciated cards
        let duplicateCard = {};
        window.parent.parent.memory.syncObject(duplicateCard, window.parent.parent.memory.copyObj(card));
        duplicateCard.id = window.parent.parent.makeid(10); // assign a new id to each duplicated card
        window.cards.push(duplicateCard);
      }
    }
  }
  refreshCardsSearch();
}

async function displayRemovePrompt() {
  while (!window.frames['delete-modal'] || !window.frames['delete-modal'].deleteApp) await window.parent.parent.sleep(50); // check & sleep in case user clicks on item before the modal is initialized
  let selectedCards = window.getSelectedCards();
  window.parent.parent.memory.syncObject(window.frames['delete-modal'].modalOptions.cards, window.parent.parent.memory.copyObj(selectedCards));
  window.frames['delete-modal'].deleteApp.$forceUpdate();
  openModal('delete');
}

function copyCards() {
  while (copiedCardIDs.length > 0) copiedCardIDs.pop();
  for (var card of window.cards) if (card.selected) copiedCardIDs.push(card.id);
}

function pasteCards() {
  let outCards = [];
  for (var copiedCardID of copiedCardIDs) {
    let card = window.getCardByID(copiedCardID);
    if (card) outCards.push(card);
  }
  window.setAllCardsSelected(false, false);
  duplicateCards(outCards);
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
    for (var card of window.cards) if (card.selected) { atLeastOneSelected = true; break; }
    if (atLeastOneSelected) displayRemovePrompt();
  } else if (e.ctrlKey && e.which == 65) { // Ctrl + A: select all displayed cards
    window.setAllCardsSelected(true);
  } else if (e.ctrlKey && e.which == 68) { // Ctrl + D: deselect all displayed cards
    window.setAllCardsSelected(false);
  } else if (e.ctrlKey && e.which == 67) { // Ctrl + C: copy cards
    copyCards();
  } else if (e.ctrlKey && e.which == 86) { // Ctrl + V: paste cards
    pasteCards();
  } else if (e.which == 13) { // Enter: submit delete modal (if user has not yet clicked on the delete modal)
    window.frames['delete-modal'].deleteApp.finalizeModal();
  }
};

cardsApp.applyDateSearch();
window.preloadCards360Media();
window.refreshTracking(-1, true); // force refresh tracking on load
window.onload = window.parent.subpageLoadedCallback('cards');
