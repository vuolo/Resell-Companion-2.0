// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
const MODAL_NAME = 'google-accounts';

window.modalOptions = {
  googleAccounts: window.parent.parent.googleAccounts
};

const googleAccountsApp = new Vue({
  el: "#Google_Accounts_Modal",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    modalOptions: modalOptions
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    calculateUnderlineWidth: window.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor,
    numberWithCommas: window.parent.parent.numberWithCommas,
    tryGenerateEllipses: window.parent.parent.tryGenerateEllipses,
    toggleGoogleAccountEnabled: function(googleAccountIndex, enabled) {
      window.modalOptions.googleAccounts[googleAccountIndex].settings.enabled = enabled == undefined ? !window.modalOptions.googleAccounts[googleAccountIndex].settings.enabled : enabled;
      this.$forceUpdate();
    },
    removeGoogleAccount: function(googleAccountIndex) {
      let incomingGoogleAccountID = window.modalOptions.googleAccounts[googleAccountIndex].settings.id;
      if (window.modalOptions.googleAccounts[googleAccountIndex].settings.favorited && window.modalOptions.googleAccounts[1]) window.modalOptions.googleAccounts[1].settings.favorited = true;
      window.modalOptions.googleAccounts.splice(googleAccountIndex, 1);
      organizeGoogleAccounts();
      this.$forceUpdate();
      // REMOVE BILLING PROFILE FROM ALL TASKS WITH SAME ID
      try {
        for (var task of window.parent.parent.frames['tasks-frame'].tasks) for (var node of task.nodes) if (node.configuration.checkoutMethod.googleAccount == incomingGoogleAccountID) {
          node.configuration.checkoutMethod.googleAccount = "unselected";
          window.parent.parent.frames['tasks-frame'].tasksApp.toggleNodeEnabled(node, false);
        }
      } catch(err) {}
    },
    editGoogleAccount: function(googleAccountIndex) {
      if (googleAccountIndex != -1) window.parent.parent.memory.syncObject(window.modalOptions_2, window.parent.parent.memory.copyObj(window.modalOptions.googleAccounts[googleAccountIndex]));
      this.googleAccountEditIndex = googleAccountIndex;
      this.isEditingGoogleAccounts = true;
      googleAccountCreationApp.googleAccountEditIndex = googleAccountIndex;
      googleAccountCreationApp.isEditingGoogleAccounts = true;
    },
    closeModal: function() {
      window.parent.modals[MODAL_NAME].visible = false;
    }
  }
});

function toggleSwitchTransitions(enabled) {
  const switchCircles = document.querySelectorAll('.Switch_Circle_1');
  for (var switchCircle of switchCircles) enabled == undefined ? (switchCircle.classList.contains('use_light_transitions') ? switchCircle.classList.remove('use_light_transitions') : switchCircle.classList.add('use_light_transitions')) : (enabled ? switchCircle.classList.add('use_light_transitions') : switchCircle.classList.remove('use_light_transitions'))
}

function organizeGoogleAccounts() {
  toggleSwitchTransitions(false);
  for (var googleAccount of window.modalOptions.googleAccounts) if (googleAccount.settings.favorited) {
    window.modalOptions.googleAccounts.unshift(googleAccount);
    window.modalOptions.googleAccounts.splice(window.modalOptions.googleAccounts.lastIndexOf(googleAccount), 1);
    break;
  }
  setTimeout(function() { toggleSwitchTransitions(true); }, 50);
}

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
