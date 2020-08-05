// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
window.currencies = {
  "USD": {
    name: "United States Dollar",
    symbol: "$"
  },
  "CAD": {
    name: "Canadian Dollar",
    symbol: "CA$"
  }
};

window.modals = {
  'billing-profiles': {
    visible: false
  },
  'google-accounts': {
    visible: false
  },
  'proxy-profiles': {
    visible: false
  },
  'connected-bots': {
    visible: false
  },
  'store-regions': {
    visible: false
  },
  'statistics': {
    visible: false
  }
};

window.openModal = (modalName) => {
  window.modals[modalName].visible = true;
};

window.modalLoadedCallback = async (modalName) => {
  if (modalName == 'billing-profiles') settingsApp.billingProfilesModal = window.frames['billing-profiles-modal'].modalOptions;
  else if (modalName == 'google-accounts') settingsApp.googleAccountsModal = window.frames['google-accounts-modal'].modalOptions;
  else if (modalName == 'statistics') {
    settingsApp.statisticsModal = window.frames['statistics-modal'].modalOptions;
    while(!window.parent.addStatistic) await window.parent.sleep(50);
    window.parent.addStatistic = async (category, statistic, value = 1) => settingsApp.statisticsModal.categories[category][statistic] += value;
    window.parent.addCheckoutStatistic = async (status, store, value = 1) => settingsApp.statisticsModal.checkouts[status][store] += value;
  }
};

window.settingsApp = new Vue({
  el: "#Rewrite___Settings",
  data: {
    companionSettings: window.parent.companionSettings,
    curLogin: window.parent.curLogin,
    appVersion: window.parent.appVersion,
    modals: window.modals,
    checkForUpdateButtonStatus: 'Check for Update',
    billingProfilesModal: {},
    googleAccountsModal: {},
    statisticsModal: {}
  },
  methods: {
    confineTextWidth: window.parent.confineTextWidth,
    getTextWidth: window.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.tryTranslate,
    formatTimestamp: window.parent.formatTimestamp,
    getThemeColor: window.parent.getThemeColor,
    setTheme: window.parent.setTheme,
    setLanguage: window.parent.setLanguage,
    openURL: window.parent.openURL,
    openModal: window.openModal,
    shouldDisplayModals: function() {
      for (var modal in modals) if (modals[modal].visible) return true;
      return false;
    },
    getTitleSwitchLeft: function(maxWidth, title) {
      let titleWidth = this.getTextWidth(title, 'bold 20px \'SF Pro Text\'');
      if (titleWidth >= maxWidth) return 0;
      else return (maxWidth/2) - ((titleWidth + 60)/2) + 20;
    },
    toggleNotificationBanners: function(enabled = !this.companionSettings.notifications.banners) {
      this.companionSettings.notifications.banners = enabled;
      if (!enabled) {
        while (window.parent.bannerQueue.length > 0) window.parent.bannerQueue.pop();
        window.parent.tryHideBanner(undefined, true); // force hide current banner
      }
    },
    testNotification: function() {
      // send notification
      window.parent.sendNotification({
        title: "Notification",
        description: "This is what a notification looks like",
        statusColor: "orange",
        clickFunc: "borderApp.switchToPage(-1, 'Settings');", // evaluated at main level
        imageLabel: "silhouette"
      });
    },
    getLanguageImage: function(language) {
      switch (language) {
        case 'en':
          return '../../../../images/regions/' + 'United-States-of-America' + '.png';
        case 'es':
          return '../../../../images/regions/' + 'Spain' + '.png';
        case 'fr':
          return '../../../../images/regions/' + 'France' + '.png';
        case 'it':
          return '../../../../images/regions/' + 'Italy' + '.png';
        case 'de':
          return '../../../../images/regions/' + 'Germany' + '.png';
      }
      return '../../../../images/regions/' + 'Global' + '.png';
    },
    updateCurrency: function(currency = this.companionSettings.currency) {
      let newCurrency = window.currencies[currency];
      console.log(newCurrency);
      if (!newCurrency) return false;
      this.companionSettings.currency = currency;
      this.companionSettings.currencyName = newCurrency.name;
      this.companionSettings.currencySymbol = newCurrency.symbol;
      window.parent.frames['analytics-frame'].frames['overview-subpage'].updatePortfolioGraphCurrency();
      // TODO: update all sales, inventoryItems, subscriptions, tickets, and cards SALE and PURCHASE prices
    }
  }
});

// ############### CHECK FOR UPDATES ###############
const checkForUpdateButton = document.querySelector(".Check_for_Update_Button_Class");
const updateAPI = window.parent.require('../../../utils/api/update.js');
window.updateAPI = updateAPI;

var ableToCheckForUpdate = true;
checkForUpdateButton.addEventListener("click", function (e) {
	if (ableToCheckForUpdate) {
		settingsApp.checkForUpdateButtonStatus = window.parent.tryTranslate('Checking for Update') + "...";
		checkForUpdate();
		ableToCheckForUpdate = false;
	}
});

async function checkForUpdate(promptUser = true) {
  var updateResponse = await updateAPI.checkForUpdate(window.parent.appVersion, window.parent.process.platform);
  if (!updateResponse) {
    console.log("error fetching recent version (from: " + url + ")");
    settingsApp.checkForUpdateButtonStatus = window.parent.tryTranslate('Error Checking');
    checkForUpdateButton.querySelector('span').style.color = "rgb(255, 255, 255)";
    checkForUpdateButton.querySelector('.clipGroup').style.display = "none";
    checkForUpdateButton.querySelector('.Rectangle_Class').style.fill = "rgba(253,53,53,1)";
    checkForUpdateButton.querySelector('.Rectangle_Class').style.stroke = "rgba(253,53,53,1)";
    applyButtonTransitions();
    setTimeout(function() { resetCheckForUpdateButton() }, 3600);
  } else {
    if (updateResponse.status == 'outdated') {
      console.log("current version (" + window.parent.appVersion + ") is outdated. Most recent version is " + updateResponse.current_version + ".");
      settingsApp.checkForUpdateButtonStatus = window.parent.tryTranslate('Outdated Version') + " (" + updateResponse.current_version + " " + window.parent.tryTranslate('Available') + ")";
      checkForUpdateButton.querySelector('span').style.color = "rgb(255, 255, 255)";
      checkForUpdateButton.querySelector('.clipGroup').style.display = "none";
      checkForUpdateButton.querySelector('.Rectangle_Class').style.fill = "rgba(253,53,53,1)";
      checkForUpdateButton.querySelector('.Rectangle_Class').style.stroke = "rgba(253,53,53,1)";
      applyButtonTransitions();
      if (promptUser) {
        const options = {
          type: 'none',
          buttons: [window.parent.tryTranslate('Yes'), window.parent.tryTranslate('No')],
          defaultId: 0,
          title: `Resell Companion - ${window.parent.tryTranslate('Outdated Version')}`,
          message: `${window.parent.tryTranslate("There is a new Resell Companion update available")} (${updateResponse.current_version})`,
          detail: window.parent.tryTranslate("Would you like to like to install this update now?"),
          icon: './build-assets/icons/icon.png'
        };
        if ((await window.parent.electron.remote.dialog.showMessageBox(null, options)).response == 0) updateAPI.launchUpdateWindow();
      }
      setTimeout(function() { resetCheckForUpdateButton() }, 3600);
    } else {
      console.log("current version (" + window.parent.appVersion + ") up to date!");
      settingsApp.checkForUpdateButtonStatus = window.parent.tryTranslate('Latest Version') + " (" + window.parent.appVersion + ")";
      checkForUpdateButton.querySelector('span').style.color = "rgb(255, 255, 255)";
      checkForUpdateButton.querySelector('.clipGroup').style.display = "none";
      checkForUpdateButton.querySelector('.Rectangle_Class').style.fill = "rgba(53,178,57,1)";
      checkForUpdateButton.querySelector('.Rectangle_Class').style.stroke = "rgba(53,178,57,1)";
      applyButtonTransitions();
      setTimeout(function() { resetCheckForUpdateButton() }, 3600);
    }
  }
}

function resetCheckForUpdateButton() {
	ableToCheckForUpdate = true;
	settingsApp.checkForUpdateButtonStatus = window.parent.tryTranslate('Check for Update');
	checkForUpdateButton.querySelector('span').style.color = "rgb(91, 182, 187)";
	checkForUpdateButton.querySelector('.clipGroup').style.display = "block";
	checkForUpdateButton.querySelector('.Rectangle_Class').style.fill = "transparent";
	checkForUpdateButton.querySelector('.Rectangle_Class').style.stroke = "rgba(91,182,187,1)";
	applyButtonTransitions();
}

window.onload = checkForUpdate;
