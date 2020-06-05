// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

window.products = [];
window.categories = window.parent.require("../../../utils/json/categories.json").categories;

const categoryImages = {
  "Shopify": "./images/Shopify_Icon@2x.png",
  "SNKRS": "./images/SNKRS_Icon@2x.png",
  "adidas": "./images/Adidas_Icon@2x.png",
}

const monitorsApp = new Vue({
  el: "#Rewrite___Monitors",
  data: {
    shouldOpenExternal: false,
    products: window.products,
    categories: window.categories,
    companionSettings: window.parent.companionSettings
  },
  methods: {
    tryTranslate: window.parent.tryTranslate,
    formatTimestamp: window.parent.formatTimestamp,
    tryApplyDarkMode: window.parent.tryApplyDarkMode,
    openInternal: window.parent.openInternal,
    openExternal: window.parent.openExternal,
    getCategoryTop: function(categoryIndex) {
      let storeOffset = 0;
      for (var i = 0; i < categories.length; i++) {
        if (categoryIndex == i) {
          break;
        }
        if (!categories[i].opened) {
          continue;
        }
        for (var store of categories[i].stores) {
          if (store.favorited) {
            storeOffset += 20 + 3;
          }
        }
      }
      return (categoryIndex * (47 + 5)) + (storeOffset + 6) + 66 - 6
    },
    getCategoryImage: function(category) {
      return categoryImages[category];
    },
    getStockColor: function(product) {
      let stockPercentage = this.getStockPercentage(product);
      return stockPercentage >= 50 ? 'rgba(53,178,57,1)' /*greem*/ : (stockPercentage > 0 ? 'rgba(253,213,53,1)' /*yellow*/ : 'rgba(253,53,53,1)' /*red*/) ;
    },
    getStockPercentage: function(product) {
      let inStockCount = 0;;
      for (var variant of product.Variants) {
        if (variant.Available) {
          inStockCount++;
        }
      }
      let stockPercentage = Math.floor((inStockCount/product.Variants.length) * 100);
      return stockPercentage;
    },
    getProductCardWidth: function(product) {
      let aggregateGridWidth = this.isProductCardLong(product);
      if (!aggregateGridWidth) {
        return 473;
      } else {
        return 473 + aggregateGridWidth - 284 + 15;
      }
    },
    isProductCardLong: function(product) {
      let aggregateGridWidth = this.getVariantGridWidth(product.Variants) * this.getVariantColumnNumber(product.Variants, product.Variants.length - 1)
      if (aggregateGridWidth > 284) {
        return aggregateGridWidth;
      }
      return false;
    },
    getProductColumnNumber: function(productIndex) {
      let outColumn = 1;
      if (productIndex == 0) {
        outColumn = 1;
      } else if (this.isProductCardLong(this.products[productIndex-1])) {
        outColumn = 1;
      } else if (this.getProductRowNumber(productIndex-1) == this.getProductRowNumber(productIndex)) {
        outColumn = 2;
      }
      return outColumn;
    },
    getProductRowNumber: function(productIndex) {
      let outRow = 1;
      for (var i = 0; i < this.products.length; i++) {
        if (productIndex == i) {
          break;
        }
        if (this.isProductCardLong(this.products[i])) {
          outRow++;
        } else {
          if (i % 2 == 1) {
            outRow++;
          }
        }
      }
      return outRow;
    },
    getVariantGridWidth: function(variants) {
      var longestVariantNameWidth = this.getLongestVariantNameWidth(variants);
      return (longestVariantNameWidth > 50 - 15) ? (longestVariantNameWidth + 15) : 50;
    },
    getLongestVariantNameWidth: function(variants) {
      let longestVariantNameWidth = 0;
      for (var variant of variants) {
        let variantNameWidth = window.parent.getTextWidth(variant.Name, 'bold 13px \'SF Pro Text\'');
        if (variantNameWidth > longestVariantNameWidth) {
          longestVariantNameWidth = variantNameWidth;
        }
      }
      return longestVariantNameWidth;
    },
    getVariantColumnNumber: function(variants, variantIndex) {
      let outColumn = 1;
      outColumn *= Math.floor(variantIndex/9) + 1;
      return outColumn;
    },
    getVariantRowNumber: function(variants, variantIndex) {
      let outRow = 1;
      for (var i = 0; i < variants.length; i++) {
        if (variantIndex == i) {
          break;
        }
        outRow++;
      }
      outRow -= Math.floor(variantIndex/9) * 9;
      return outRow;
    },
    launchVariantCheckout: function(product, variant) {
      let checkoutURL = "https://" + product.Store + "/cart/" + variant.ID + ":1";
      this.shouldOpenExternal ? this.openExternal(checkoutURL) : this.openInternal(checkoutURL, { title: 'Resell Companion — ' + product.Name + " Checkout" })
    }
  }
});

window.addTestProduct = () => {
  const testProduct = {
    "Store": "feature.com",
    "StoreName": "Feature",
    "Name": "Common Projects Soft Leather Toiletry Bag - Warm Grey",
    "URL": "https://feature.com/products/common-projects-soft-leather-toiletry-bag-soft-leather-warm-grey",
    "Price": "$395.00",
    "ImageURL": "https://cdn.shopify.com/s/files/1/0408/9909/products/Common_Projects_Soft_Leather_Zip_Coin_Case_-_Warm_Grey_9121-Warm_Grey_-_March_28_2019-4_5cd6bfc7-6f43-4c77-901a-fb2002fdd51f.jpg?v=1588037268",
    "Description": "<meta charset=\"utf-8\">\n<p><span>Founded by Prathan Poopat and Flavio Girolami in 2004, Common Projects are best known for their signature gold stamp at the heel highlighting style and size. Assembled in Italy using the highest-quality materials, Common Projects pushes the standard in luxury. Pictured is the </span>Common Projects Soft Leather Toiletry Bag in Warm Grey.</p>\n<meta charset=\"utf-8\">\n<ul>\n<li>Leather construction</li>\n<li>Interior zipper pocket</li>\n<li>Carry handle</li>\n<li>Gold Foil branding</li>\n<li>Made in Italy</li>\n<li><span>Style no: 9126</span></li>\n</ul>\n<ul></ul>",
    "Available": true,
    "Variants": [
      {
        "Name": "One Size",
        "ID": "12738237366343",
        "Available": true,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "4.5",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "5",
        "ID": "12738237366343",
        "Available": true,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "5.5",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "6",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "6.5",
        "ID": "12738237366343",
        "Available": true,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "7",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "7.5",
        "ID": "12738237366343",
        "Available": true,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "8",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "8.5",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "9",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "14",
        "ID": "12738237366343",
        "Available": true,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "14.5",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "15",
        "ID": "12738237366343",
        "Available": true,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "15.5",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "16",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "16.5",
        "ID": "12738237366343",
        "Available": true,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "17",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "17.5",
        "ID": "12738237366343",
        "Available": true,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "18",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "18.5",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      },
      {
        "Name": "19",
        "ID": "12738237366343",
        "Available": false,
        "Price": "395.00",
        "Quantity": -420
      }
    ],
    "Identifier": "shopify",
    "LaunchDate": "2020-06-03T12:46:47-07:00",
    "Color": "",
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
    "MD5": "389430269c82918eced7a4fb04c01046",
    "Timestamp": new Date().getTime(),
    "isDisplayingMoreInfo": false
  };
  window.products.push(testProduct);
};

window.sortStores = (categoryIndex = -1) => {
  if (categoryIndex == -1) {
    for (var category of window.categories) {
      let favoritedStores = [];
      let unfavoritedStores = [];
      for (var i = 0; i < category.stores.length; i++) {
        if (category.stores[i].favorited) {
          favoritedStores.push(category.stores[i]);
        } else {
          unfavoritedStores.push(category.stores[i]);
        }
      }
      window.parent.memory.syncObjects(category.stores, favoritedStores.concat(unfavoritedStores));
    }
  } else {
    let favoritedStores = [];
    let unfavoritedStores = [];
    for (var i = 0; i < window.categories[categoryIndex].stores.length; i++) {
      if (window.categories[categoryIndex].stores[i].favorited) {
        favoritedStores.push(window.categories[categoryIndex].stores[i]);
      } else {
        unfavoritedStores.push(window.categories[categoryIndex].stores[i]);
      }
    }
    window.parent.memory.syncObjects(window.categories[categoryIndex].stores, favoritedStores.concat(unfavoritedStores));
  }
};

window.addTestProduct();
window.addTestProduct();
window.addTestProduct();
window.addTestProduct();
window.addTestProduct();
window.addTestProduct();
window.addTestProduct();
window.addTestProduct();
