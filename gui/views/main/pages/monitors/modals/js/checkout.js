// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// imports
const MODAL_NAME = 'checkout';

const MODAL_OPTIONS_TEMPLATE = {
  node: null,
  // {
  //   statuses: [
  //     {
  //       description: 'first',
  //       color: 'yellow',
  //     },
  //     {
  //       description: 'second',
  //       color: 'orange',
  //     },
  //     {
  //       description: 'third',
  //       color: 'green',
  //     }
  //   ]
  // },
  shoppingBag: {
    store_name: "",
    store_url: "",
    variants: []
  }
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
      window.applyButtonTransitions(true);
    }
  }
});

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
