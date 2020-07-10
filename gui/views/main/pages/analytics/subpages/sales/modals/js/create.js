// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// imports
const MODAL_NAME = 'create';

const MODAL_OPTIONS_TEMPLATE = {
  name: "",
  color: "",
  imageURL: "",
  size: "",
  notes: "",
  purchase: {
    price: null,
    estimatedResell: null,
    store: "",
    date: "2020-07-07",
    tracking: {
      number: "",
      carrier: "unselected",
      isTracking: false,
      details: {}
    }
  },
  sale: {
    price: null,
    fees: {
      amount: null,
      isPercent: true
    },
    platform: "",
    date: "2020-07-07",
    tracking: {
      number: "",
      carrier: "unselected",
      isTracking: false,
      details: {}
    }
  },
  quantity: 1
};

window.modalOptions = {};
window.resetModalOptions = () => {
  if (window.createApp) {
    if (window.createApp.activeSaleIndex != -1 && window.modalOptions.sale.tracking.isTracking) window.parent.refreshTracking(window.createApp.activeSaleIndex, true);
    window.createApp.activeSaleIndex = -1;
  }
  window.parent.parent.parent.memory.syncObject(window.modalOptions, window.parent.parent.parent.memory.copyObj(MODAL_OPTIONS_TEMPLATE));
}
window.resetModalOptions();

window.createApp = new Vue({
  el: "#Rewrite___Sold_Inventory_Item_Modal",
  data: {
    companionSettings: window.parent.parent.parent.companionSettings,
    modalOptions: modalOptions,
    activeSaleIndex: -1
  },
  methods: {
    confineTextWidth: window.parent.parent.parent.confineTextWidth,
    getTextWidth: window.parent.parent.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.parent.getThemeColor,
    getColor: window.parent.parent.parent.getColor,
    tryGenerateEllipses: window.parent.parent.parent.tryGenerateEllipses,
    tryConvertSize: function(size) {
      // let convertedSizeObj = {
      //   convertedSize: {
      //     size: "6.5",
      //     conversionType: "UK"
      //   },
      //   currentSize: {
      //     size: "7.5",
      //     conversionType: "US"
      //   }
      // };
      // return convertedSizeObj;
      return false;
    },
    hasOpenActivity: function(tracking) {
      if (!tracking.details || !tracking.details.activities) return false;
      for (var activity of tracking.details.activities) if (activity.isOpened) return true;
    },
    updateTracking: async function(tracking) {
      if (tracking.isTracking) return;
      tracking.isTracking = true;
      tracking.details = await window.parent.parent.parent.packagesAPI.getPackageDetails(tracking.number, tracking.carrier);
      tracking.isTracking = false;
      window.parent.tryTranslateTrackingActivities(tracking);
    },
    toggleActivityOpened: function(activity) {
       activity.isOpened = !activity.isOpened;
       this.$forceUpdate();
    },
    finalizeModal: function() {
      modalOptions.purchase.price = parseFloat(modalOptions.purchase.price);
      modalOptions.purchase.estimatedResell = parseFloat(modalOptions.purchase.estimatedResell);
      modalOptions.sale.price = parseFloat(modalOptions.sale.price);
      modalOptions.sale.fees.amount = parseFloat(modalOptions.sale.fees.amount);
      if (this.activeSaleIndex == -1) window.parent.addSale();
      else window.parent.updateSale(this.activeSaleIndex);
      this.closeModal();
    },
    isSizeActive: function(size) {
      return modalOptions.sizes.includes(size);
    },
    closeModal: function() {
      window.parent.modals[MODAL_NAME].visible = false;
      window.resetModalOptions();
    }
  }
});

function guessAndSetCarrier(trackingNumber) {
  let guessedCarriers = window.parent.parent.parent.packagesAPI.guessCarrier(trackingNumber);
  if (guessedCarriers.length > 0) modalOptions.sale.tracking.carrier = guessedCarriers[0];
}

$("#trackingNumber").on('change keydown paste input', function() {
  guessAndSetCarrier(modalOptions.sale.tracking.number);
});

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
