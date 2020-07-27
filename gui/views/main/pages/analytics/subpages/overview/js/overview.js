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
      window.updatePortfolioGraphValues();
    }
  }
});
window.overviewApp = overviewApp;

Chart.defaults.global.defaultFontFamily = 'SF Pro Text';

var config = {
	type: 'line',
	data: {
		labels: [
      window.parent.parent.tryTranslate('January'),
      window.parent.parent.tryTranslate('Februrary'),
      window.parent.parent.tryTranslate('March'),
      window.parent.parent.tryTranslate('April'),
      window.parent.parent.tryTranslate('May'),
      window.parent.parent.tryTranslate('June'),
      window.parent.parent.tryTranslate('July'),
      window.parent.parent.tryTranslate('August'),
      window.parent.parent.tryTranslate('September'),
      window.parent.parent.tryTranslate('October'),
      window.parent.parent.tryTranslate('November'),
      window.parent.parent.tryTranslate('December')
    ],
		datasets: [
      {
  			label: 'Spent',
  			backgroundColor: 'rgba(253,53,53,1)',
  			borderColor: 'rgba(253,53,53,1)',
  			data: getTotalFilteredSpentsByMonth(),
  			fill: false,
  		},
      {
  			label: 'Revenue',
  			fill: false,
  			backgroundColor: 'rgba(255,167,78,1)',
  			borderColor: 'rgba(255,167,78,1)',
  			data: getTotalFilteredRevenuesByMonth(),
  		},
      {
  			label: 'Profit',
  			fill: false,
  			backgroundColor: 'rgba(53,178,57,1)',
  			borderColor: 'rgba(53,178,57,1)',
  			data: getTotalFilteredProfitsByMonth(),
  		}
    ]
	},
	options: {
		responsive: true,
		title: {
			display: true,
			text: 'Reselling Portfolio'
		},
		scales: {
      yAxes: [
        {
          scaleLabel: {
    				display: true,
            labelString: `${window.parent.parent.tryTranslate(window.parent.parent.companionSettings.currencyName)} (${window.parent.parent.companionSettings.currency})`
    			},
          gridLines: {
            display: true,
            color: window.parent.parent.getThemeColor('rgba(190,190,190,1)');
          },
    			ticks: {
    				// the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
    				suggestedMin: 0,
    				// the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
    				suggestedMax: 25
    			}
    		}
      ],
      xAxes: [
        {
          gridLines: {
            display: true,
            color: window.parent.parent.getThemeColor('rgba(190,190,190,1)');
          }
        }
      ]
		}
	}
};

window.onload = function() {
	var ctx = document.getElementById('canvas').getContext('2d');
	window.portfolioGraph = new Chart(ctx, config);
};

window.updatePortfolioGraphCurrency = () => {
  window.portfolioGraph.options.scales.yAxes[0].scaleLabel.labelString = `${window.parent.parent.tryTranslate(window.parent.parent.companionSettings.currencyName)} (${window.parent.parent.companionSettings.currency})`;
  window.portfolioGraph.update();
};

window.updatePortfolioGraphValues = () => {
  if (!window.portfolioGraph) return;
  window.portfolioGraph.data.datasets[0].data = getTotalFilteredSpentsByMonth();
  window.portfolioGraph.data.datasets[1].data = getTotalFilteredRevenuesByMonth();
  window.portfolioGraph.data.datasets[2].data = getTotalFilteredProfitsByMonth();
  window.portfolioGraph.update();
};

function dateWithinDateSearch(incomingDate) {
  let incomingTimestamp = new Date(incomingDate).getTime();
  return incomingTimestamp >= new Date(overviewApp.dateSearch.start).getTime() && incomingTimestamp <= new Date(overviewApp.dateSearch.end).getTime()
}

function calculateProfit(item) {
  if (item.sale.fees.isPercent) return window.parent.parent.roundNumber((item.sale.price || 0) * (1 - (item.sale.fees.amount || 0) * (1/100)) - (item.purchase.price || 0));
  return window.parent.parent.roundNumber((item.sale.price || 0) - (item.sale.fees.amount || 0) - (item.purchase.price || 0));
}

function getMonthIndexByDate(date) {
  return parseInt(date.split('-')[1]) - 1;
}

function getTotalFilteredSpentsByMonth() {
  let outSpentDates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (!areAnalyticsSubpagesInitialized()) return outSpentDates;

  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "sales") updateSpentDates('sales', window.parent.analyticsApp.sales, outSpentDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "inventory") updateSpentDates('inventory', window.parent.analyticsApp.inventoryItems, outSpentDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "subscriptions") updateSpentDates('subscriptions', window.parent.analyticsApp.subscriptions, outSpentDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "tickets") updateSpentDates('tickets', window.parent.analyticsApp.tickets, outSpentDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "cards") updateSpentDates('cards', window.parent.analyticsApp.cards, outSpentDates);

  return outSpentDates;
}

function updateSpentDates(type, itemsArr, dates) {
  if (type == "sales") for (var item of itemsArr) { if (dateWithinDateSearch(item.sale.date)) dates[getMonthIndexByDate(item.sale.date)] += window.parent.parent.roundNumber(item.purchase.price || 0); }
  else for (var item of itemsArr) if (dateWithinDateSearch(item.purchase.date)) dates[getMonthIndexByDate(item.purchase.date)] += window.parent.parent.roundNumber(item.purchase.price || 0);
}

function getTotalFilteredRevenuesByMonth() {
  let outRevenueDates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (!areAnalyticsSubpagesInitialized()) return outRevenueDates;

  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "sales") updateRevenueDates('sales', window.parent.analyticsApp.sales, outRevenueDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "inventory") updateRevenueDates('inventory', window.parent.analyticsApp.inventoryItems, outRevenueDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "subscriptions") updateRevenueDates('subscriptions', window.parent.analyticsApp.subscriptions, outRevenueDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "tickets") updateRevenueDates('tickets', window.parent.analyticsApp.tickets, outRevenueDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "cards") updateRevenueDates('cards', window.parent.analyticsApp.cards, outRevenueDates);

  return outRevenueDates;
}

function updateRevenueDates(type, itemsArr, dates) {
  if (type == "inventory") return;
  else if (type == "sales") for (var item of itemsArr) { if (dateWithinDateSearch(item.sale.date)) dates[getMonthIndexByDate(item.sale.date)] += window.parent.parent.roundNumber(calculateProfit(item) + (item.purchase.price || 0)); }
  else for (var item of itemsArr) if (dateWithinDateSearch(item.purchase.date)) dates[getMonthIndexByDate(item.purchase.date)] += window.parent.parent.roundNumber(calculateProfit(item) + (item.purchase.price || 0));
}

function getTotalFilteredProfitsByMonth() {
  let outProfitDates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (!areAnalyticsSubpagesInitialized()) return outProfitDates;

  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "sales") updateProfitDates('sales', window.parent.analyticsApp.sales, outProfitDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "inventory") updateProfitDates('inventory', window.parent.analyticsApp.inventoryItems, outProfitDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "subscriptions") updateProfitDates('subscriptions', window.parent.analyticsApp.subscriptions, outProfitDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "tickets") updateProfitDates('tickets', window.parent.analyticsApp.tickets, outProfitDates);
  if (overviewApp.subpageView == "everything" || overviewApp.subpageView == "cards") updateProfitDates('cards', window.parent.analyticsApp.cards, outProfitDates);

  return outProfitDates;
}

function updateProfitDates(type, itemsArr, dates) {
  if (type == "inventory") return;
  else if (type == "sales") for (var item of itemsArr) { if (dateWithinDateSearch(item.sale.date)) dates[getMonthIndexByDate(item.sale.date)] += window.parent.parent.roundNumber(calculateProfit(item)); }
  else for (var item of itemsArr) if (dateWithinDateSearch(item.purchase.date)) dates[getMonthIndexByDate(item.purchase.date)] += window.parent.parent.roundNumber(calculateProfit(item));
}

function areAnalyticsSubpagesInitialized() {
  return (
    window.parent.analyticsApp.sales &&
    window.parent.analyticsApp.inventoryItems &&
    window.parent.analyticsApp.subscriptions &&
    window.parent.analyticsApp.tickets &&
    window.parent.analyticsApp.cards
  ) ? true : false;
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
