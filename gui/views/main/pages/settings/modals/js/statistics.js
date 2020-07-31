// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
const MODAL_NAME = 'statistics';

const MODAL_OPTIONS_TEMPLATE = {
  checkouts: {
    successful: {
      shopify: 0,
      supreme: 0
    },
    failed: {
      shopify: 0,
      supreme: 0
    }
  },
  categories: {
    "Monitors": {
      "Products Added to Shopping Bag": 0,
      "Products Opened": 0,
      "Shopping Bag Checkouts": 0,
      "Tasks Launched": 0
    },
    "Tasks": {
      "Failed Tasks": 0,
      "Products Created": 0,
      "Successful Tasks": 0,
      "Tasks Created": 0,
      "Tasks Launched": 0
    },
    "Spoof": {
      "Device Locations Spoofed": 0
    },
    "Browsers": {
      "Browsers Created": 0,
      "Browsers Refreshed": 0
    },
    "Sales": {
      "Packages Tracked": 0,
      "Sales Marked Unsold": 0,
      "Sold Items": 0
    },
    "Inventory": {
      "Items Added": 0,
      "Items Marked Sold": 0,
      "Packages Tracked": 0
    },
    "Subscriptions": {
      "Subscriptions Added": 0
    },
    "Tickets": {
      "Packages Tracked": 0,
      "Tickets Added": 0
    },
    "Cards": {
      "Packages Tracked": 0,
      "Cards Added": 0
    },
    "Market Lookup": {
      "Items Compared": 0,
      "Searches": 0
    },
    "Social+": {
      "Discord Servers Joined": 0,
      "Giveaways Detected": 0,
      "Instagram Handles Watched": 0,
      "Instagram Posts Received": 0,
      "Keywords Found": 0,
      "Links Opened": 0,
      "Restocks Detected": 0,
      "Twitter Handles Watched": 0,
      "Twitter Posts Received": 0
    }
  }
};

window.modalOptions = {};
window.resetModalOptions = () => {
  window.parent.parent.memory.syncObject(window.modalOptions, window.parent.parent.memory.copyObj(MODAL_OPTIONS_TEMPLATE));
}
window.resetModalOptions();

const MAX_STATISTIC_WIDTH = 541; // px

const statisticsApp = new Vue({
  el: "#Rewrite___Statistics_Modal",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    modalOptions: modalOptions
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    getTextWidth: window.parent.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor,
    numberWithCommas: window.parent.parent.numberWithCommas,
    getObjectKeyIndex: window.parent.parent.getObjectKeyIndex,
    getStatisticTop: function(categories, key) {
      let categoryIndex = this.getObjectKeyIndex(categories, key); // obj, key
      let categoriesArr = Object.keys(categories);
      let outTop = 0;

      for (var i = 0; i < categoriesArr.length; i++) {
        if (i == categoryIndex) break;
        outTop += ((Object.keys(categories[categoriesArr[i]]).length) * 27) + 30 + 5;
      }

      return outTop;
    },
    generatePeriods: function(title, value) {
      const titleWidth = this.getTextWidth(this.tryTranslate(title), `${'normal'} ${16 + 'px'} ${'SF Pro Text'}`);
      const valueWidth = this.getTextWidth(' ' + this.numberWithCommas(value), `${'bold'} ${16 + 'px'} ${'SF Pro Text'}`);
      let outPeriods = '';

      while (this.getTextWidth(outPeriods, `${'normal'} ${16 + 'px'} ${'SF Pro Text'}`) <= MAX_STATISTIC_WIDTH - titleWidth - valueWidth) outPeriods += '.';

      return outPeriods.length > 0 ? outPeriods.substring(1, outPeriods.length) : outPeriods;
    },
    closeModal: function() {
      window.parent.modals[MODAL_NAME].visible = false;
    }
  }
});

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
