// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// imports
const MODAL_NAME = 'create';

window.modalOptions = {
  sizeView: 'Shoes',
  sizes: [],
  useRandomSize: true,
  checkoutMethod: {
    useCheckoutCompanion: true
  },
  quantity: 1,
  isEditingTask: false
};

const shoeSizes = [
  "4",
  "4.5",
  "5",
  "5.5",
  "6",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
  "12.5",
  "13",
  "13.5",
  "14",
  "14.5",
  "15",
  "15.5",
  "16",
  "16.5",
  "17",
  "17.5",
  "18",
  "18.5"
];

const clothingSizes = [
  "XXXS",
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "XXXXL"
];

const createApp = new Vue({
  el: "#Rewrite___Create_Task_Modal_",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    modalOptions: modalOptions,
    shoeSizes: shoeSizes,
    clothingSizes: clothingSizes
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    getTextWidth: window.parent.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor,
    getTitleSwitchLeft: function(maxWidth, title) {
      let titleWidth = this.getTextWidth(title, 'bold 20px \'SF Pro Text\'');
      if (titleWidth >= maxWidth) {
        return 0;
      } else {
        return (maxWidth/2) - ((titleWidth + 60)/2) + 20;
      }
      return 0;
    },
    isSizeActive: function(size) {
      return modalOptions.sizes.includes(size);
    },
    toggleSizeActive: function(size) {
      for (var i = 0; i < modalOptions.sizes.length; i++) {
        if (modalOptions.sizes[i] == size) {
          modalOptions.sizes.splice(i, 1);
          this.$forceUpdate();
          return;
        }
      }
      modalOptions.sizes.push(size);
      this.$forceUpdate();
    },
    closeModal: function() {
      window.parent.modals[MODAL_NAME].visible = false;
    }
  }
});

function resetOptions() {
  let templateOptions = {
    sizes: [],
    useRandomSize: true,
    checkoutMethod: {
      useCheckoutCompanion: true
    }
  };
  modalOptions = templateOptions;
}

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
