// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// imports
const MODAL_NAME = 'checkout';

const MODAL_OPTIONS_TEMPLATE = {
  node: {
    statuses: [
      {
        description: 'first',
        color: 'yellow',
      },
      {
        description: 'second',
        color: 'orange',
      },
      {
        description: 'third',
        color: 'green',
      }
    ]
  },
  shoppingBag: {
    store_name: "",
    store_url: "",
    variants: [
      {
        parent: {
          "Store": "it-is-all-about-the-sauce.myshopify.com",
          "StoreName": "It is All About the Sauce",
          "Name": "Test 1 [TEST - 1]",
          "URL": "https://it-is-all-about-the-sauce.myshopify.com/products/test-1#1",
          "Price": "$0.00",
          "ImageURL": "",
          "Description": "<meta charset=\"utf-8\">\n<p><span>Founded by Prathan Poopat and Flavio Girolami in 2004, Common Projects are best known for their signature gold stamp at the heel highlighting style and size. Assembled in Italy using the highest-quality materials, Common Projects pushes the standard in luxury. Pictured is the </span>Common Projects Soft Leather Toiletry Bag in Warm Grey.</p>\n<meta charset=\"utf-8\">\n<ul>\n<li>Leather construction</li>\n<li>Interior zipper pocket</li>\n<li>Carry handle</li>\n<li>Gold Foil branding</li>\n<li>Made in Italy</li>\n<li><span>Style no: 9126</span></li>\n</ul>\n<ul></ul>",
          "Available": true,
          "Variants": [
            {
              "Name": "One Size",
              "ID": "34901400846504",
              "Available": true,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "4.5",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "5",
              "ID": "34901400846504",
              "Available": true,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "5.5",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "6",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "6.5",
              "ID": "34901400846504",
              "Available": true,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "7",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "7.5",
              "ID": "34901400846504",
              "Available": true,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "8",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "8.5",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "9",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "14",
              "ID": "34901400846504",
              "Available": true,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "14.5",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "15",
              "ID": "34901400846504",
              "Available": true,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "15.5",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "16",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "16.5",
              "ID": "34901400846504",
              "Available": true,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "17",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "17.5",
              "ID": "34901400846504",
              "Available": true,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "18",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "18.5",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            },
            {
              "Name": "19",
              "ID": "34901400846504",
              "Available": false,
              "Price": "395.00",
              "Quantity": -420
            }
          ],
          "Identifier": "shopify",
          "LaunchDate": "2020-06-03T12:46:47-07:00",
          "Color": "Banana Gray",
          "Collection": "Common Projects",
          "Keywords": "",
          "Tags": [
            "05/01/20delete",
            "color-grey",
            "Common Projects",
            "hide",
            "main-collection_accessories",
            "main-collection_new",
            "Men Sizes",
            "Mens",
            "mn092",
            "over-200",
            "RO#500",
            "size-o-s",
            "UNISEX",
            "vendor_common projects",
            "Wallets"
          ],
          "OverrideURL": "",
          "MD5": "389430269c82918eced7a4fb04c01046_1"
        },
        quantity: 1,
        variant: {
          "Name": "One Size",
          "ID": "34901400846504",
          "Available": true,
          "Price": "395.00",
          "Quantity": -420
        }
      }
    ]
  }
};

window.modalOptions = {};
window.resetModalOptions = () => {
  window.parent.parent.memory.syncObject(window.modalOptions, window.parent.parent.memory.copyObj(MODAL_OPTIONS_TEMPLATE));
}
window.resetModalOptions();

window.checkoutApp = new Vue({
  el: "#Rewrite___Sold_Inventory_Item_Modal",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    window: window,
    modalOptions: modalOptions
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
    closeModal: function() {
      window.parent.modals[MODAL_NAME].visible = false;
      window.resetModalOptions();
    }
  }
});

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
