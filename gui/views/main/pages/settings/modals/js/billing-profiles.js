// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
const MODAL_NAME = 'billing-profiles';

const MODAL_OPTIONS_TEMPLATE = {
  billingProfiles: [
    // {
    //   settings: {
    //     nickname: "test!",
    //     autoCheckout: true,
    //     autoCheckoutDelay: 0,
    //     simulateTyping: true,
    //     favorited: true,
    //     enabled: true,
    //     id: "TEST-BILLING-PROFILE"
    //   },
    //   autofillInformation: {
    //     firstName: "Charles",
    //     lastName: "Emanuel",
    //     email: "ce@gmail.com",
    //     phoneNumber: "4079028902",
    //     address: "385 Caddie Drive",
    //     unit: "",
    //     zipCode: "32713",
    //     city: "DeBary",
    //     state: "Florida",
    //     country: "United States",
    //     billing: {
    //       cardNumber: "4242424242424242",
    //       cardType: "Visa",
    //       expirationDateFull: "06/27",
    //       expirationDate: {
    //         month: "06",
    //         year: "27"
    //       },
    //       cvc: "285"
    //     }
    //   }
    // }
  ]
};

window.modalOptions = {};
window.resetModalOptions = () => {
  window.parent.parent.memory.syncObject(window.modalOptions, window.parent.parent.memory.copyObj(MODAL_OPTIONS_TEMPLATE));
  // LINK BILLING PROFILES ARRAY GLOBALLY
  (async () => {
    window.parent.parent.billingProfiles = window.modalOptions.billingProfiles;
    while (!window.parent.parent.frames['tasks-frame'] || !window.parent.parent.frames['tasks-frame'].frames['create-modal'] || !window.parent.parent.frames['tasks-frame'].frames['create-modal'].createApp) await window.parent.parent.sleep(50);
    window.parent.parent.frames['tasks-frame'].frames['create-modal'].createApp.billingProfiles = window.parent.parent.billingProfiles;
    window.parent.parent.frames['tasks-frame'].frames['create-modal'].createApp.$forceUpdate();
  })();
}
window.resetModalOptions();

const billingProfilesApp = new Vue({
  el: "#Billing_Profiles_Modal",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    modalOptions: modalOptions,
    billingProfileEditIndex: -1,
    isEditingBillingProfiles: false
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    calculateUnderlineWidth: window.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor,
    numberWithCommas: window.parent.parent.numberWithCommas,
    tryGenerateEllipses: window.parent.parent.tryGenerateEllipses,
    toggleBillingProfileFavorited: function(billingProfileIndex, favorited) {
      if (billingProfileIndex == 0) return;
      for (var billingProfile of window.modalOptions.billingProfiles) billingProfile.settings.favorited = false;
      window.modalOptions.billingProfiles[billingProfileIndex].settings.favorited = favorited == undefined ? !window.modalOptions.billingProfiles[billingProfileIndex].settings.favorited : favorited;
      organizeBillingProfiles();
      this.$forceUpdate();
    },
    toggleBillingProfileEnabled: function(billingProfileIndex, enabled) {
      window.modalOptions.billingProfiles[billingProfileIndex].settings.enabled = enabled == undefined ? !window.modalOptions.billingProfiles[billingProfileIndex].settings.enabled : enabled;
      this.$forceUpdate();
    },
    removeBillingProfile: function(billingProfileIndex) {
      let incomingBillingProfileID = window.modalOptions.billingProfiles[billingProfileIndex].settings.id;
      if (window.modalOptions.billingProfiles[billingProfileIndex].settings.favorited && window.modalOptions.billingProfiles[1]) window.modalOptions.billingProfiles[1].settings.favorited = true;
      window.modalOptions.billingProfiles.splice(billingProfileIndex, 1);
      organizeBillingProfiles();
      this.$forceUpdate();
      // REMOVE BILLING PROFILE FROM ALL TASKS WITH SAME ID
      try {
        for (var task of window.parent.parent.frames['tasks-frame'].tasks) for (var node of task.nodes) if (node.configuration.checkoutMethod.billingProfile == incomingBillingProfileID) {
          node.configuration.checkoutMethod.billingProfile = "unselected";
          window.parent.parent.frames['tasks-frame'].tasksApp.setNodeStatus(node, false);
        }
      } catch(err) {}
    },
    editBillingProfile: function(billingProfileIndex) {
      if (billingProfileIndex != -1) window.parent.parent.memory.syncObject(window.modalOptions_2, window.parent.parent.memory.copyObj(window.modalOptions.billingProfiles[billingProfileIndex]));
      this.billingProfileEditIndex = billingProfileIndex;
      this.isEditingBillingProfiles = true;
      billingProfileCreationApp.billingProfileEditIndex = billingProfileIndex;
      billingProfileCreationApp.isEditingBillingProfiles = true;
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

function organizeBillingProfiles() {
  toggleSwitchTransitions(false);
  for (var billingProfile of window.modalOptions.billingProfiles) if (billingProfile.settings.favorited) {
    window.modalOptions.billingProfiles.unshift(billingProfile);
    window.modalOptions.billingProfiles.splice(window.modalOptions.billingProfiles.lastIndexOf(billingProfile), 1);
    break;
  }
  setTimeout(function() { toggleSwitchTransitions(true); }, 50);
}

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
