// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
const overviewApp = new Vue({
  el: "#Rewrite___Overview",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    curLogin: window.parent.parent.curLogin,
    subpageView: "everything",
    dateSearch: {
      category: "all-time",
      start: "2020-06-23",
      end: "2020-06-27",
      display: "Jun 23 – Jun 27",
      visible: false
    }
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    calculateUnderlineWidth: window.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor,
    getColor: window.parent.parent.getColor,
    numberWithCommas: window.parent.parent.numberWithCommas,
    roundNumber: window.parent.parent.roundNumber,
    getTotalSpent: function(subpageView = this.subpageView) {
      if (!areAnalyticsSubpagesInitialized()) return this.tryTranslate('N/A');
      switch (subpageView) {
        case 'everything':
          let outSpent = 0;
          outSpent += window.parent.frames['sales-subpage'].salesApp.getTotalSpent(this.dateSearch);
          outSpent += window.parent.frames['inventory-subpage'].inventoryApp.getTotalSpent(this.dateSearch);
          outSpent += window.parent.frames['subscriptions-subpage'].subscriptionsApp.getTotalSpent(this.dateSearch);
          outSpent += window.parent.frames['tickets-subpage'].ticketsApp.getTotalSpent(this.dateSearch);
          outSpent += window.parent.frames['cards-subpage'].cardsApp.getTotalSpent(this.dateSearch);
          return this.roundNumber(outSpent);
        case 'sales':
          return this.roundNumber(window.parent.frames['sales-subpage'].salesApp.getTotalSpent(this.dateSearch));
        case 'inventory':
          return this.roundNumber(window.parent.frames['inventory-subpage'].inventoryApp.getTotalSpent(this.dateSearch));
        case 'subscriptions':
          return this.roundNumber(window.parent.frames['subscriptions-subpage'].subscriptionsApp.getTotalSpent(this.dateSearch));
        case 'tickets':
          return this.roundNumber(window.parent.frames['tickets-subpage'].ticketsApp.getTotalSpent(this.dateSearch));
        case 'cards':
          return this.roundNumber(window.parent.frames['cards-subpage'].cardsApp.getTotalSpent(this.dateSearch));
      }
      return this.tryTranslate('N/A');
    },
    getTotalRevenue: function(subpageView = this.subpageView) {
      if (!areAnalyticsSubpagesInitialized()) return this.tryTranslate('N/A');
      switch (subpageView) {
        case 'everything':
          let outSpent = 0;
          outSpent += window.parent.frames['sales-subpage'].salesApp.getTotalRevenue(this.dateSearch);
          // outSpent += window.parent.frames['inventory-subpage'].inventoryApp.getTotalEstimatedResell(this.dateSearch);
          outSpent += window.parent.frames['subscriptions-subpage'].subscriptionsApp.getTotalRevenue(this.dateSearch);
          outSpent += window.parent.frames['tickets-subpage'].ticketsApp.getTotalRevenue(this.dateSearch);
          outSpent += window.parent.frames['cards-subpage'].cardsApp.getTotalRevenue(this.dateSearch);
          return this.roundNumber(outSpent);
        case 'sales':
          return this.roundNumber(window.parent.frames['sales-subpage'].salesApp.getTotalRevenue(this.dateSearch));
        case 'inventory':
          return this.roundNumber(window.parent.frames['inventory-subpage'].inventoryApp.getTotalEstimatedResell(this.dateSearch));
        case 'subscriptions':
          return this.roundNumber(window.parent.frames['subscriptions-subpage'].subscriptionsApp.getTotalRevenue(this.dateSearch));
        case 'tickets':
          return this.roundNumber(window.parent.frames['tickets-subpage'].ticketsApp.getTotalRevenue(this.dateSearch));
        case 'cards':
          return this.roundNumber(window.parent.frames['cards-subpage'].cardsApp.getTotalRevenue(this.dateSearch));
      }
      return this.tryTranslate('N/A');
    },
    getTotalProfit: function(subpageView = this.subpageView) {
      if (!areAnalyticsSubpagesInitialized()) return this.tryTranslate('N/A');
      switch (subpageView) {
        case 'everything':
          let outSpent = 0;
          outSpent += window.parent.frames['sales-subpage'].salesApp.getTotalProfit(this.dateSearch);
          // outSpent += window.parent.frames['inventory-subpage'].inventoryApp.getTotalEstimatedProfit(this.dateSearch);
          outSpent += window.parent.frames['subscriptions-subpage'].subscriptionsApp.getTotalProfit(this.dateSearch);
          outSpent += window.parent.frames['tickets-subpage'].ticketsApp.getTotalProfit(this.dateSearch);
          outSpent += window.parent.frames['cards-subpage'].cardsApp.getTotalProfit(this.dateSearch);
          return this.roundNumber(outSpent);
        case 'sales':
          return this.roundNumber(window.parent.frames['sales-subpage'].salesApp.getTotalProfit(this.dateSearch));
        case 'inventory':
          return this.roundNumber(window.parent.frames['inventory-subpage'].inventoryApp.getTotalEstimatedProfit(this.dateSearch));
        case 'subscriptions':
          return this.roundNumber(window.parent.frames['subscriptions-subpage'].subscriptionsApp.getTotalProfit(this.dateSearch));
        case 'tickets':
          return this.roundNumber(window.parent.frames['tickets-subpage'].ticketsApp.getTotalProfit(this.dateSearch));
        case 'cards':
          return this.roundNumber(window.parent.frames['cards-subpage'].cardsApp.getTotalProfit(this.dateSearch));
      }
      return this.tryTranslate('N/A');
    },
    getProfitColor: function(profit) {
      if (profit > 0) return 'green'
      else if (profit < 0) return 'red';
      return 'yellow';
    },
    applyDateSearch: function(category = this.dateSearch.category) {
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
          let allTimeDates = getAllTimeDates(this.subpageView);
          this.dateSearch.start = allTimeDates.start;
          this.dateSearch.end = allTimeDates.end;
          break;
        case 'custom':
          // do nothing
          break;
      }
      this.updateDateSearch();
    },
    updateDateSearch: function() {
      this.dateSearch.display = `${window.parent.parent.frames['home-frame'].homeApp.formatScheduleDate(new Date(new Date(this.dateSearch.start).getTime() + (24 * 60 * 60 * 1000)).toString())} – ${window.parent.parent.frames['home-frame'].homeApp.formatScheduleDate(new Date(new Date(this.dateSearch.end).getTime() + (24 * 60 * 60 * 1000)).toString())}`;
      this.$forceUpdate();
    }
  }
});
window.overviewApp = overviewApp;

var config = {
	type: 'line',
	data: {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [{
			label: 'Spent',
			backgroundColor: 'rgba(253,53,53,1)',
			borderColor: 'rgba(253,53,53,1)',
			data: [10, 30, 50, 20, 25, 44, -10],
			fill: false,
		}, {
			label: 'Revenue',
			fill: false,
			backgroundColor: 'rgba(255,167,78,1)',
			borderColor: 'rgba(255,167,78,1)',
			data: [100, 33, 22, 19, 11, 49, 30],
		}, {
			label: 'Profits',
			fill: false,
			backgroundColor: 'rgba(53,178,57,1)',
			borderColor: 'rgba(53,178,57,1)',
			data: [30, 13, 72, 79, 51, 99, 10],
		}]
	},
	options: {
		responsive: true,
		title: {
			display: true,
  			text: '2020 Reselling Portfolio'
		},
		scales: {
      yAxes: [{
  			ticks: {
  				// the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
  				suggestedMin: 10,

  				// the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
  				suggestedMax: 50
  			}
  		}]
		}
	}
};

window.onload = function() {
	var ctx = document.getElementById('canvas').getContext('2d');
	window.myLine = new Chart(ctx, config);
};

function areAnalyticsSubpagesInitialized() {
  return (window.parent.analyticsApp.sales && window.parent.analyticsApp.inventoryItems && window.parent.analyticsApp.subscriptions && window.parent.analyticsApp.tickets && window.parent.analyticsApp.cards) ? true : false;
}

function getAllTimeDates(subpageView = overviewApp.subpageView, getRawList = false) {
  if (!areAnalyticsSubpagesInitialized()) {
    if (getRawList) return [];
    let separatedDate = window.parent.parent.separateDate();
    return { start: separatedDate.date, end: separatedDate.date }
  }
  // get first and last date of current category selected. IF all, loop through all.
  switch (subpageView) {
    case 'everything':
      if (
        window.parent.frames['sales-subpage'].sales.length == 0 &&
        window.parent.frames['inventory-subpage'].inventoryItems.length == 0 &&
        window.parent.frames['subscriptions-subpage'].subscriptions.length == 0 &&
        window.parent.frames['tickets-subpage'].tickets.length == 0 &&
        window.parent.frames['cards-subpage'].cards.length == 0
      ) {
        let separatedDate = window.parent.parent.separateDate();
        return { start: separatedDate.date, end: separatedDate.date }
      }
      let allDates = [
        ...getAllTimeDates('sales', true),
        ...getAllTimeDates('inventory', true),
        ...getAllTimeDates('subscriptions', true),
        ...getAllTimeDates('tickets', true),
        ...getAllTimeDates('cards', true)
      ];
      allDates.quick_sort(function(a,b) { return a < b });
      return { start: allDates[0], end: allDates[allDates.length-1] };
    case 'sales':
      if (window.parent.frames['sales-subpage'].sales.length == 0 && !getRawList) {
        let separatedDate = window.parent.parent.separateDate();
        return { start: separatedDate.date, end: separatedDate.date }
      }
      let salesDates = [];
      for (var sale of window.parent.frames['sales-subpage'].sales) salesDates.push(sale.sale.date);
      salesDates.quick_sort(function(a,b) { return a < b });
      if (getRawList) return salesDates;
      return { start: salesDates[0], end: salesDates[salesDates.length-1] };
    case 'inventory':
      if (window.parent.frames['inventory-subpage'].inventoryItems.length == 0 && !getRawList) {
        let separatedDate = window.parent.parent.separateDate();
        return { start: separatedDate.date, end: separatedDate.date }
      }
      let inventoryDates = [];
      for (var inventoryItem of window.parent.frames['inventory-subpage'].inventoryItems) inventoryDates.push(inventoryItem.purchase.date);
      inventoryDates.quick_sort(function(a,b) { return a < b });
      if (getRawList) return inventoryDates;
      return { start: inventoryDates[0], end: inventoryDates[inventoryDates.length-1] };
    case 'subscriptions':
      if (window.parent.frames['subscriptions-subpage'].subscriptions.length == 0 && !getRawList) {
        let separatedDate = window.parent.parent.separateDate();
        return { start: separatedDate.date, end: separatedDate.date }
      }
      let subscriptionsDates = [];
      for (var subscription of window.parent.frames['subscriptions-subpage'].subscriptions) subscriptionsDates.push(subscription.purchase.date);
      subscriptionsDates.quick_sort(function(a,b) { return a < b });
      if (getRawList) return subscriptionsDates;
      return { start: subscriptionsDates[0], end: subscriptionsDates[subscriptionsDates.length-1] };
    case 'tickets':
      if (window.parent.frames['tickets-subpage'].tickets.length == 0 && !getRawList) {
        let separatedDate = window.parent.parent.separateDate();
        return { start: separatedDate.date, end: separatedDate.date }
      }
      let ticketsDates = [];
      for (var ticket of window.parent.frames['tickets-subpage'].tickets) ticketsDates.push(ticket.purchase.date);
      ticketsDates.quick_sort(function(a,b) { return a < b });
      if (getRawList) return ticketsDates;
      return { start: ticketsDates[0], end: ticketsDates[ticketsDates.length-1] };
    case 'cards':
      if (window.parent.frames['cards-subpage'].cards.length == 0 && !getRawList) {
        let separatedDate = window.parent.parent.separateDate();
        return { start: separatedDate.date, end: separatedDate.date }
      }
      let cardsDates = [];
      for (var card of window.parent.frames['cards-subpage'].cards) cardsDates.push(card.purchase.date);
      cardsDates.quick_sort(function(a,b) { return a < b });
      if (getRawList) return cardsDates;
      return { start: cardsDates[0], end: cardsDates[cardsDates.length-1] };
  }
}

document.addEventListener("click", function() {
  if (!$('.Date_Selection_Area_Class').is(":hover") && !$('#dateRangeFilter').is(":hover")) overviewApp.dateSearch.visible = false;
});

// DISABLE SELECT ALL TEXT FROM Ctrl + A
$(function(){
  $(document).keydown(function(objEvent) {
    if (objEvent.ctrlKey && objEvent.keyCode == 65 && objEvent.target.tagName != "INPUT" && objEvent.target.tagName != "TEXTAREA") objEvent.preventDefault();
  });
});

overviewApp.applyDateSearch();
