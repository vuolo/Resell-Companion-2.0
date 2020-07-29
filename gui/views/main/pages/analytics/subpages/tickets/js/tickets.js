// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
window.tableSort = {
  key: "name",
  direction: "descending" // descending OR ascending
};

window.tickets = [
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
var displayedTickets = [];
var copiedTicketIDs = [];

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
      ticketsApp.createModal = window.frames['create-modal'].modalOptions;
      break;
    case 'delete':
      ticketsApp.deleteModal = window.frames['delete-modal'].modalOptions;
      break;
  }
}

window.addTicket = () => {
  for (var i = 0; i < ticketsApp.createModal.quantity; i++) {
    ticketsApp.createModal.id = window.parent.parent.makeid(10); // assign a new id to each ticket
    window.tickets.push(window.parent.parent.memory.copyObj(ticketsApp.createModal));
    window.tickets[window.tickets.length-1].quantity = 1;
    window.parent.parent.addStatistic('Tickets', 'Tickets Added');
  }
  ticketsApp.applyDateSearch();
};

window.editTicket = async (ticket) => {
  while (!window.frames['create-modal'] || !window.frames['create-modal'].createApp) await window.parent.parent.sleep(50); // check & sleep in case user clicks on item before the modal is initialized
  window.frames['create-modal'].createApp.activeTicketIndex = window.tickets.indexOf(ticket);
  ticketsApp.endHovering(ticket);
  if (!ticket.sale.price && ticket.sale.price != 0) ticket.sale.date = window.parent.parent.separateDate().date;
  window.parent.parent.memory.syncObject(window.frames['create-modal'].modalOptions, window.parent.parent.memory.copyObj(ticket));
  if (window.frames['create-modal'].modalOptions.sale.tracking.isTracking) setTimeout(window.refreshTracking(-2, true, window.frames['create-modal'].modalOptions.sale.tracking), 50);
  openModal('create');
};

window.updateTicket = (ticketIndex) => {
  window.parent.parent.memory.syncObject(window.tickets[ticketIndex], window.parent.parent.memory.copyObj(window.frames['create-modal'].modalOptions));
  ticketsApp.applyDateSearch();
};

function setMultipleSelectedTickets(ticketIndex) {
  let startTicketIndex = -1;
  for (var i = 0; i < displayedTickets.length; i++) {
    if (displayedTickets[i].selected) {
      startTicketIndex = i;
      break;
    }
  }
  if (startTicketIndex == -1) {
    switchSelectedTickets(ticketIndex);
  } else {
    // check if ticketIndex is > than startTicketIndex (go in order) else, ticketIndex is  < than startTicketIndex, loop reverse
    let allowSetSelected = false;
    if (ticketIndex > startTicketIndex) {
      for (var i = 0; i < displayedTickets.length; i++) {
        if (i == startTicketIndex) {
          allowSetSelected = true;
        } else if (i > ticketIndex) {
          break;
        } else if (allowSetSelected) {
          displayedTickets[i].selected = true;
        }
      }
    } else {
      for (var i = displayedTickets.length-1; i >= 0; i--) {
        if (i == startTicketIndex) {
          allowSetSelected = true;
        } else if (i < ticketIndex) {
          break;
        } else if (allowSetSelected) {
          displayedTickets[i].selected = true;
        }
      }
    }
  }
}

function switchSelectedTickets(ticketIndex) {
  displayedTickets[ticketIndex].selected = !displayedTickets[ticketIndex].selected;
}

window.setAllTicketsSelected = (selected = true, displayedOnly = true) => {
  for (var ticket of displayedOnly ? displayedTickets : window.tickets) ticket.selected = selected;
};

const ticketsApp = new Vue({
  el: "#Rewrite___Sales",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    tickets: displayedTickets,
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
    editTicket: window.editTicket,
    beginExport: async function(displayedOnly = true) {
      if (this.isExporting) return; // prevent overlapping exports
      this.isExporting = true;
      try { await window.parent.parent.csvAPI.exportItems('tickets', displayedOnly ? this.tickets : window.tickets); } catch(err) { console.error(err); }
      this.isExporting = false;
    },
    beginImport: async function() {
      if (this.isImporting) return; // prevent overlapping imports
      this.isImporting = true;
      try { await window.parent.parent.csvAPI.importItems('tickets', window.tickets); } catch(err) { console.error(err); }
      this.isImporting = false;
    },
    beginHovering: async function(ticket) {
      if (!ticket.isHovering && ticket.marketplaceData.media360.length > 0) {
        window.preloadTickets360Media(ticket);
        ticket.isHovering = true;
        let curMedia360Index = 0;
        let hoverIntv = setInterval(function() {
          ticket.imageURL = ticket.marketplaceData.media360[curMedia360Index];
          curMedia360Index++;
          if (curMedia360Index >= ticket.marketplaceData.media360.length-1) curMedia360Index = 0;
          if (!ticket.isHovering) clearInterval(hoverIntv);
        }, 50);
      }
    },
    endHovering: function(ticket) {
      ticket.isHovering = false;
      if (ticket.marketplaceData.media360.length > 0) ticket.imageURL = ticket.marketplaceData.media360[0];
    },
    handleSelectClick: function(e, ticketIndex) {
      if (e.ctrlKey) switchSelectedTickets(ticketIndex);
      else if (e.shiftKey) setMultipleSelectedTickets(ticketIndex);
      else editTicket(displayedTickets[ticketIndex]);
    },
    applyDateSearch: function(category = this.dateSearch.category, changeSorting = false, refreshOverview = true) {
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
      this.updateDateSearch(changeSorting, refreshOverview);
    },
    updateDateSearch: function(changeSorting = false, refreshOverview = true) {
      this.dateSearch.display = `${window.parent.parent.frames['home-frame'].homeApp.formatScheduleDate(new Date(new Date(this.dateSearch.start).getTime() + (24 * 60 * 60 * 1000)).toString())} – ${window.parent.parent.frames['home-frame'].homeApp.formatScheduleDate(new Date(new Date(this.dateSearch.end).getTime() + (24 * 60 * 60 * 1000)).toString())}`;
      if (changeSorting) toggleSortTicketsByColumn('purchase.date', true);
      else refreshTicketsSearch(refreshOverview);
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
    getTotalSpent: function(altDateSearch) {
      if (altDateSearch) {
        let tempDateSearch = window.parent.parent.memory.copyObj(this.dateSearch)
        window.parent.parent.memory.syncObject(this.dateSearch, window.parent.parent.memory.copyObj(altDateSearch));
        this.applyDateSearch(this.dateSearch.category, false, false);

        let outSpent = 0;
        for (var ticket of this.tickets) outSpent += (ticket.purchase.price || 0);

        window.parent.parent.memory.syncObject(this.dateSearch, tempDateSearch);
        this.applyDateSearch(this.dateSearch.category, false, false);
        return window.parent.parent.roundNumber(outSpent);
      } else {
        let outSpent = 0;
        for (var ticket of this.tickets) outSpent += (ticket.purchase.price || 0);
        return window.parent.parent.roundNumber(outSpent);
      }
    },
    getTotalRevenue: function(altDateSearch) {
      if (altDateSearch) {
        let tempDateSearch = window.parent.parent.memory.copyObj(this.dateSearch)
        window.parent.parent.memory.syncObject(this.dateSearch, window.parent.parent.memory.copyObj(altDateSearch));
        this.applyDateSearch(this.dateSearch.category, false, false);

        let outRevenue = 0;
        for (var ticket of this.tickets) outRevenue += this.calculateProfit(ticket) + (ticket.purchase.price || 0);

        window.parent.parent.memory.syncObject(this.dateSearch, tempDateSearch);
        this.applyDateSearch(this.dateSearch.category, false, false);
        return window.parent.parent.roundNumber(outRevenue);
      } else {
        let outRevenue = 0;
        for (var ticket of this.tickets) outRevenue += this.calculateProfit(ticket) + (ticket.purchase.price || 0);
        return window.parent.parent.roundNumber(outRevenue);
      }
    },
    getTotalProfit: function(altDateSearch) {
      if (altDateSearch) {
        let tempDateSearch = window.parent.parent.memory.copyObj(this.dateSearch)
        window.parent.parent.memory.syncObject(this.dateSearch, window.parent.parent.memory.copyObj(altDateSearch));
        this.applyDateSearch(this.dateSearch.category, false, false);

        let outProfit = 0;
        for (var ticket of this.tickets) outProfit += this.calculateProfit(ticket);

        window.parent.parent.memory.syncObject(this.dateSearch, tempDateSearch);
        this.applyDateSearch(this.dateSearch.category, false, false);
        return window.parent.parent.roundNumber(outProfit);
      } else {
        let outProfit = 0;
        for (var ticket of this.tickets) outProfit += this.calculateProfit(ticket);
        return window.parent.parent.roundNumber(outProfit);
      }
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
    calculateProfit: function(ticket) {
      if (ticket.sale.fees.isPercent) return window.parent.parent.roundNumber((ticket.sale.price || 0) * (1 - (ticket.sale.fees.amount || 0) * (1/100)) - (ticket.purchase.price || 0));
      return window.parent.parent.roundNumber((ticket.sale.price || 0) - (ticket.sale.fees.amount || 0) - (ticket.purchase.price || 0));
    },
    getDisplayedFees: function(ticket) {
      if (ticket.sale.fees.amount == null || ticket.sale.fees.amount == 0) return this.tryTranslate("N/A");
      return ticket.sale.fees.isPercent ? (ticket.sale.fees.amount || 0) + "%" : this.companionSettings.currencySymbol + this.numberWithCommas(window.parent.parent.roundNumber((ticket.sale.fees.amount || 0)));
    }
  }
});
window.ticketsApp = ticketsApp;

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
  ticketsApp.$forceUpdate();
  window.tryTranslateTrackingActivities(tracking);
  window.parent.parent.addStatistic('Tickets', 'Packages Tracked');
}

window.refreshTracking = (ticketIndex = -1, force = false, tracking = null) => {
  if (ticketIndex != -1) tryUpdateTracking(tracking || window.tickets[ticketIndex].sale.tracking, force);
  else for (var i = 0; i < window.tickets.length; i++) tryUpdateTracking(tracking || window.tickets[i].sale.tracking, force);
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

$("#ticketsSearch").on('change keydown paste input', refreshTicketsSearch);

function refreshTicketsSearch(refreshOverview = true) {
  while (displayedTickets.length > 0) displayedTickets.pop();
  for (var ticket of window.tickets) if (isTicketDisplayable(ticket)) displayedTickets.push(ticket);
  // reorganize tickets based on table filter
  sortDisplayedTickets();
  if (refreshOverview) if (window.parent.frames['overview-subpage'].overviewApp) window.parent.frames['overview-subpage'].overviewApp.applyDateSearch(); // refresh totals on overview page
}
window.refreshTicketsSearch = refreshTicketsSearch;

function isTicketDisplayable(ticket) {
  let searchName = ticket.name;
  if (searchName.length == 0) searchName = window.parent.parent.tryTranslate('N/A');
  let searchSize = ticket.size;
  if (searchSize.length == 0) searchSize = window.parent.parent.tryTranslate('N/A');
  let searchPlatform = ticket.sale.platform;
  if (searchPlatform.length == 0) searchPlatform = window.parent.parent.tryTranslate('N/A');
  // validate ticket is within date range
  let ticketTimestamp = new Date(ticket.purchase.date).getTime();
  if (!(ticketTimestamp >= new Date(ticketsApp.dateSearch.start).getTime() && ticketTimestamp <= new Date(ticketsApp.dateSearch.end).getTime())) return false;
  return ticketsApp.searchTerm.length == 0 || searchName.toLowerCase().includes(ticketsApp.searchTerm.toLowerCase()) || searchSize.toLowerCase().includes(ticketsApp.searchTerm.toLowerCase()) || searchPlatform.toLowerCase().includes(ticketsApp.searchTerm.toLowerCase());
};

function toggleSortTicketsByColumn(key, forceSameColumn = false) {
  var isSameColumn = window.tableSort.key == key;
  window.tableSort.key = key;
  window.tableSort.direction = !forceSameColumn && isSameColumn ? (window.tableSort.direction == 'ascending' ? 'descending' : 'ascending') : 'descending';
  refreshTicketsSearch();
  ticketsApp.$forceUpdate();
}

function sortDisplayedTickets() {
  let key = window.tableSort.key;
  let tempShortenedDisplayedTickets = [];
  for (var displayedTicket of displayedTickets) {
    tempShortenedDisplayedTickets.push({
      'name': displayedTicket.name.toLowerCase() || window.parent.parent.tryTranslate('N/A'),
      'size': displayedTicket.size.toLowerCase() || window.parent.parent.tryTranslate('N/A'),
      'sale.platform': displayedTicket.sale.platform.toLowerCase()  || window.parent.parent.tryTranslate('N/A'),
      'purchase.price': displayedTicket.purchase.price || 0,
      'sale.price': displayedTicket.sale.price || 0,
      'sale.fees.amount': displayedTicket.sale.fees.amount || 0,
      'sale.profit': ticketsApp.calculateProfit(displayedTicket) || 0,
      'sale.tracking.details.status': displayedTicket.sale.tracking.details.status || 0,
      'sale.date': displayedTicket.sale.date,
      'purchase.date': displayedTicket.purchase.date,
      id: displayedTicket.id
    });
  }
  tempShortenedDisplayedTickets.quick_sort(function(a,b) { return window.tableSort.direction == "descending" ? a[key] < b[key] : a[key] > b[key] });
  // rearrange displayedTickets based on tempDisplayedTickets' id order
  let tempDisplayedTickets = [];
  for (var tempShortenedDisplayedTicket of tempShortenedDisplayedTickets) {
    for (var displayedTicket of displayedTickets) {
      if (tempShortenedDisplayedTicket.id == displayedTicket.id) {
        tempDisplayedTickets.push(displayedTicket);
        break;
      }
    }
  }
  while (displayedTickets.length > 0) displayedTickets.pop();
  for (var tempDisplayedTicket of tempDisplayedTickets) displayedTickets.push(tempDisplayedTicket);
}

function getAllTimeDates() {
  if (window.tickets.length == 0) {
    let separatedDate = window.parent.parent.separateDate();
    return { start: separatedDate.date, end: separatedDate.date }
  }
  let dates = [];
  for (var ticket of window.tickets) dates.push(ticket.purchase.date);
  dates.quick_sort(function(a,b) { return a < b });
  return { start: dates[0], end: dates[dates.length-1] };
}

document.addEventListener("click", function() {
  if (!$('.Date_Selection_Area_Class').is(":hover") && !$('#dateRangeFilter').is(":hover")) ticketsApp.dateSearch.visible = false;
  let isHoveringOverItem = false;
  if (!isHoveringOverItem) for (var elem of $('.Row_1_Class')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var elem of $('.Product_Card_1_dy_Class')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var elem of $('body > ul.context-menu-root')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) window.setAllTicketsSelected(false, false);
});

window.getTicketByID = (id) => {
  for (var ticket of window.tickets) if (ticket.id == id) return ticket;
};

window.removeTicket = (ticket, refreshTickets = true) => {
  window.tickets.splice(window.tickets.indexOf(ticket), 1)
  if (refreshTickets) ticketsApp.applyDateSearch();
};

window.getSelectedTickets = () => {
  let outTickets = [];
  for (var ticket of window.tickets) if (ticket.selected) outTickets.push(ticket);
  return outTickets;
};

window.preloadTickets360Media = (incomingTicket = null) => {
  if (incomingTicket) window.parent.parent.preloadImages(incomingTicket.marketplaceData.media360);
  else for (var ticket of window.tickets) window.parent.parent.preloadImages(ticket.marketplaceData.media360);
}

function duplicateTickets(incomingTickets = null) {
  if (incomingTickets) {
    for (var incomingTicket of incomingTickets) {
      let duplicateTicket = {};
      window.parent.parent.memory.syncObject(duplicateTicket, window.parent.parent.memory.copyObj(incomingTicket));
      duplicateTicket.id = window.parent.parent.makeid(10); // assign a new id to each duplicated ticket
      duplicateTicket.selected = true; // force select on new tickets ONLY
      window.tickets.push(duplicateTicket);
      window.parent.parent.addStatistic('Tickets', 'Tickets Added');
    }
  } else {
    for (var ticket of window.tickets) {
      if (ticket.selected) {
        ticket.selected = false; // force deselect on BOTH new AND duplciated tickets
        let duplicateTicket = {};
        window.parent.parent.memory.syncObject(duplicateTicket, window.parent.parent.memory.copyObj(ticket));
        duplicateTicket.id = window.parent.parent.makeid(10); // assign a new id to each duplicated ticket
        window.tickets.push(duplicateTicket);
        window.parent.parent.addStatistic('Tickets', 'Tickets Added');
      }
    }
  }
  refreshTicketsSearch();
}

async function displayRemovePrompt() {
  while (!window.frames['delete-modal'] || !window.frames['delete-modal'].deleteApp) await window.parent.parent.sleep(50); // check & sleep in case user clicks on item before the modal is initialized
  let selectedTickets = window.getSelectedTickets();
  window.parent.parent.memory.syncObject(window.frames['delete-modal'].modalOptions.tickets, window.parent.parent.memory.copyObj(selectedTickets));
  window.frames['delete-modal'].deleteApp.$forceUpdate();
  openModal('delete');
}

function copyTickets() {
  while (copiedTicketIDs.length > 0) copiedTicketIDs.pop();
  for (var ticket of window.tickets) if (ticket.selected) copiedTicketIDs.push(ticket.id);
}

function pasteTickets() {
  let outTickets = [];
  for (var copiedTicketID of copiedTicketIDs) {
    let ticket = window.getTicketByID(copiedTicketID);
    if (ticket) outTickets.push(ticket);
  }
  window.setAllTicketsSelected(false, false);
  duplicateTickets(outTickets);
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
    for (var ticket of window.tickets) if (ticket.selected) { atLeastOneSelected = true; break; }
    if (atLeastOneSelected) displayRemovePrompt();
  } else if (e.ctrlKey && e.which == 65) { // Ctrl + A: select all displayed tickets
    window.setAllTicketsSelected(true);
  } else if (e.ctrlKey && e.which == 68) { // Ctrl + D: deselect all displayed tickets
    window.setAllTicketsSelected(false);
  } else if (e.ctrlKey && e.which == 67) { // Ctrl + C: copy tickets
    copyTickets();
  } else if (e.ctrlKey && e.which == 86) { // Ctrl + V: paste tickets
    pasteTickets();
  } else if (e.which == 13) { // Enter: submit delete modal (if user has not yet clicked on the delete modal)
    window.frames['delete-modal'].deleteApp.finalizeModal();
  }
};

ticketsApp.applyDateSearch();
window.preloadTickets360Media();
window.refreshTracking(-1, true); // force refresh tracking on load
window.onload = window.parent.subpageLoadedCallback('tickets');
