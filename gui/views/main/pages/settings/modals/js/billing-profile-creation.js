// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
const MODAL_OPTIONS_TEMPLATE_2 = {
  settings: {
    nickname: "",
    autoCheckout: true,
    autoCheckoutDelay: 0,
    simulateTyping: true,
    favorited: false,
    enabled: true,
    id: ""
  },
  autofillInformation: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    unit: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    billing: {
      cardNumber: "",
      cardType: "",
      expirationDateFull: "",
      expirationDate: {
        month: "",
        year: ""
      },
      cvc: ""
    }
  }
};

window.modalOptions_2 = {};
window.resetModalOptions_2 = () => {
  window.parent.parent.memory.syncObject(window.modalOptions_2, window.parent.parent.memory.copyObj(MODAL_OPTIONS_TEMPLATE_2));
}
window.resetModalOptions_2();

const billingProfileCreationApp = new Vue({
  el: "#Rewrite___Billing_Profile_Creation_Modal",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    modalOptions: modalOptions_2,
    billingProfileEditIndex: billingProfilesApp.billingProfileEditIndex,
    isEditingBillingProfiles: billingProfilesApp.isEditingBillingProfiles
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    calculateUnderlineWidth: window.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor,
    getCardTypeLocation: function(cardNumber) {
      this.modalOptions.autofillInformation.billing.cardType = getCardType(cardNumber);
      switch (this.modalOptions.autofillInformation.billing.cardType) {
        case 'Visa':
          return "../../../../../images/card-providers/Visa.png";
        case 'AMEX':
          return "../../../../../images/card-providers/AmericanExpress.png";
        case 'Diners':
          return "../../../../../images/card-providers/Diners.png";
        case 'JCB':
          return "../../../../../images/card-providers/JCB.png";
        case 'Mastercard':
          return "../../../../../images/card-providers/Mastercard.png";
        case 'Discover':
          return "../../../../../images/card-providers/Discover.png";
      }
      return "../../../../../images/emoticons/faces/Happy.png";
    },
    finalizeModal: function() {
      if (billingProfilesApp.billingProfileEditIndex == -1) addBillingProfile();
      else updateBillingProfile(billingProfilesApp.billingProfileEditIndex);
      this.closeModal();
    },
    closeModal: function() {
      billingProfilesApp.billingProfileEditIndex = -1;
      billingProfilesApp.isEditingBillingProfiles = false;
      this.billingProfileEditIndex = -1;
      this.isEditingBillingProfiles = false;
      setTimeout(window.resetModalOptions_2, 333);
    }
  }
});

window.updateBillingProfile = (billingProfileEditIndex = billingProfilesApp.billingProfileEditIndex) => {
  window.parent.parent.memory.syncObject(billingProfilesApp.modalOptions.billingProfiles[billingProfileEditIndex], window.parent.parent.memory.copyObj(window.modalOptions_2));
  // REFRESH BILLING PROFILE NAMES ON TASKS PAGE
  try { window.parent.parent.frames['tasks-frame'].tasksApp.$forceUpdate(); } catch(err) {}
};

window.addBillingProfile = () => {
  window.modalOptions_2.settings.id = window.parent.parent.makeid(10); // assign a new id to the billing profile
  window.modalOptions_2.settings.favorited = billingProfilesApp.modalOptions.billingProfiles.length == 0;
  window.modalOptions_2.settings.nickname = window.modalOptions_2.settings.nickname.length > 0 ? window.modalOptions_2.settings.nickname : `${window.parent.parent.tryTranslate('Billing Profile')} #${billingProfilesApp.modalOptions.billingProfiles.length + 1}`;
  if (!window.modalOptions_2.settings.favorited) {
    let foundFavorited = false;
    for (var billingProfile of billingProfilesApp.modalOptions.billingProfiles) if (billingProfile.settings.favorited) { foundFavorited = true; break; }
    if (!foundFavorited) window.modalOptions_2.settings.favorited = true;
  }
  billingProfilesApp.modalOptions.billingProfiles.push(window.parent.parent.memory.copyObj(window.modalOptions_2));
  organizeBillingProfiles();
};

// begin card number format
function numberWithSpaces(x) {
  var incomingValue = x.toString();
  let formattedValue = "";
  for (var i = 0; i < incomingValue.length; i++) {
    if (i % 4 == 0 && i != 0) {
      formattedValue += " ";
    }
    formattedValue += incomingValue.charAt(i);
  }
  return formattedValue;
}

const NUMBERS_ALLOWED = '0123456789';
function getOnlyNumbers(value) {
  let newValue = "";
  for (var char of value) for (var numberAllowed of NUMBERS_ALLOWED) if (char == numberAllowed) { newValue += char; break; }
  return newValue;
}

function setCardNumberFormat() {
  let outCardNumber = numberWithSpaces(getOnlyNumbers(billingProfileCreationApp.modalOptions.autofillInformation.billing.cardNumber));
  billingProfileCreationApp.modalOptions.autofillInformation.billing.cardNumber = outCardNumber;
}

$("#cardNumber").on('change keydown paste input', function() {
  setCardNumberFormat();
});
// end card number format

// begin expiration date format
function numberWithSlash(x) {
  var incomingValue = x.toString();
  let formattedValue = "";
  for (var i = 0; i < incomingValue.length; i++) {
    if (i == 2) formattedValue += "/";
    formattedValue += incomingValue.charAt(i);
  }
  return formattedValue;
}

function setExpirationDateFormat() {
  let outExpirationDateFull = numberWithSlash(getOnlyNumbers(billingProfileCreationApp.modalOptions.autofillInformation.billing.expirationDateFull));
  billingProfileCreationApp.modalOptions.autofillInformation.billing.expirationDateFull = outExpirationDateFull;
  try { billingProfileCreationApp.modalOptions.autofillInformation.billing.expirationDate.month = outExpirationDateFull.split("/")[0]; } catch(err) {}
  try { billingProfileCreationApp.modalOptions.autofillInformation.billing.expirationDate.year = outExpirationDateFull.split("/")[1]; } catch(err) {}
}

$("#expirationDateFull").on('change keydown paste input', function() {
  setExpirationDateFormat();
});
// end expiration date format

// card type guesser
function getCardType(number) {
  // visa
  var re = new RegExp("^4");
  if (number.match(re) != null)
    return "Visa";

  // Mastercard
  // Updated for Mastercard 2017 BINs expansion
   if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number))
    return "Mastercard";

  // AMEX
  re = new RegExp("^3[47]");
  if (number.match(re) != null)
    return "AMEX";

  // Discover
  re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
  if (number.match(re) != null)
    return "Discover";

  // Diners
  re = new RegExp("^36");
  if (number.match(re) != null)
    return "Diners";

  // Diners - Carte Blanche
  re = new RegExp("^30[0-5]");
  if (number.match(re) != null)
    // return "Diners - Carte Blanche";
    return "Diners";

  // JCB
  re = new RegExp("^35(2[89]|[3-8][0-9])");
  if (number.match(re) != null)
    return "JCB";

  // Visa Electron
  re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
  if (number.match(re) != null)
    // return "Visa Electron";
    return "Visa";

  return "";
}
