// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// imports
const MODAL_NAME = 'checkout';

const MODAL_OPTIONS_TEMPLATE = {
  node: null,
  shoppingBag: {
    store_name: "",
    store_url: "",
    variants: []
  },
  isSuccessful: false,
  isFailed: false
};

window.modalOptions = {};
window.resetModalOptions = () => {
  window.parent.parent.memory.syncObject(window.modalOptions, window.parent.parent.memory.copyObj(MODAL_OPTIONS_TEMPLATE));
  if (window.checkoutApp) window.checkoutApp.shoppingBagProductIndex = 0;
}
window.resetModalOptions();

window.checkoutApp = new Vue({
  el: "#Rewrite___Sold_Inventory_Item_Modal",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    window: window,
    modalOptions: modalOptions,
    shoppingBagProductIndex: 0
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    getTextWidth: window.parent.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor,
    getColor: window.parent.parent.getColor,
    tryGenerateEllipses: window.parent.parent.tryGenerateEllipses,
    addStatistic: window.parent.parent.addStatistic,
    openURL: window.parent.parent.openURL,
    getTitleSwitchLeft: function(maxWidth, title) {
      let titleWidth = this.getTextWidth(title, 'bold 20px \'SF Pro Text\'');
      if (titleWidth >= maxWidth) {
        return 0;
      } else {
        return (maxWidth/2) - ((titleWidth + 60)/2) + 20;
      }
      return 0;
    },
    rotateShoppingBagProduct: function(direction) {
      switch (direction) {
        case 'left':
          this.shoppingBagProductIndex = this.shoppingBagProductIndex - 1 < 0 ? window.modalOptions.shoppingBag.variants.length - 1 : this.shoppingBagProductIndex - 1;
          break;
        case 'right':
          this.shoppingBagProductIndex = this.shoppingBagProductIndex + 1 >= window.modalOptions.shoppingBag.variants.length ? 0 : this.shoppingBagProductIndex + 1;
          break;
      }
    },
    closeModal: function() {
      if (window.modalOptions.node) window.parent.parent.frames['tasks-frame'].tasksApp.toggleNodeEnabled(window.modalOptions.node, false, true);
      window.parent.modals[MODAL_NAME].visible = false;
      window.resetModalOptions();
    }
  }
});

window.triggerSuccessful = () => {
  window.modalOptions.isSuccessful = true;

  // add items to inventory
  let separatedDate = window.parent.parent.separateDate();
  for (var variant of window.modalOptions.shoppingBag.variants) {
    let newInventoryItem = {
      name: variant.parent.Name || "",
      color: variant.parent.Color || "",
      styleCode: "",
      size: variant.variant.Name || "",
      imageURL: variant.parent.ImageURL || "",
      notes: "",
      marketplaceData: {
        product: {},
        size: {},
        media360: []
      },
      suggestions: {
        items: [],
        itemsOpened: false,
        isSearchingForItems: false,
        sizes: [],
        sizesOpened: false,
        isSearchingForSizes: false
      },
      purchase: {
        price: window.parent.parent.getNumberFromString(variant.parent.Price),
        estimatedResell: null,
        store: variant.parent.StoreName || "",
        date: separatedDate.date,
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
        date: separatedDate.date,
        tracking: {
          number: "",
          carrier: "unselected",
          isTracking: false,
          details: {}
        }
      },
      quantity: 1,
      selected: true,
      isHovering: false,
      id: window.parent.parent.makeid(10) // assign a new id to each inventory item
    };
    // add inventory item
    window.parent.parent.frames['analytics-frame'].analyticsApp.inventoryItems.push(newInventoryItem);
  }
  window.parent.parent.frames['analytics-frame'].openSubpage('inventory'); // switch subpage
  window.parent.parent.borderApp.switchToPage(-1, 'analytics'); // switch page
  window.parent.parent.frames['analytics-frame'].frames['inventory-subpage'].inventoryApp.applyDateSearch(); // refresh
};

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
