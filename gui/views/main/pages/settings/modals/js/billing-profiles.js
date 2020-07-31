// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
const MODAL_NAME = 'billing-profiles';

const MODAL_OPTIONS_TEMPLATE = {
  billingProfiles: [
    {
      settings: {
        nickname: "",
        autoCheckout: true,
        autoCheckoutDelay: 450,
        simulateTyping: true,
        favorited: true,
        enabled: true
      },
      autofillInformation: {
        firstName: "Charles",
        lastName: "Emanuel",
        email: "ce@gmail.com",
        phoneNumber: "4079028902",
        address: "385 Caddie Drive",
        unit: "",
        zipCode: "32713",
        city: "DeBary",
        state: "Florida",
        country: "United States",
        billing: {
          cardNumber: "4242424242424242",
          cardType: "Visa",
          expirationDateFull: "06/27",
          expirationDate: {
            month: "06",
            year: "27"
          },
          cvc: "285"
        }
      }
    }
  ]
};

window.modalOptions = {};
window.resetModalOptions = () => {
  window.parent.parent.memory.syncObject(window.modalOptions, window.parent.parent.memory.copyObj(MODAL_OPTIONS_TEMPLATE));
}
window.resetModalOptions();

const billingProfilesApp = new Vue({
  el: "#Billing_Profiles_Modal",
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
    closeModal: function() {
      window.parent.modals[MODAL_NAME].visible = false;
    }
  }
});

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
