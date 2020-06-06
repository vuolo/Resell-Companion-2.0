// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

window.products = [];
window.categories = window.parent.require("../../../utils/json/categories.json").categories;
let displayedProducts = [];

const categoryImages = {
  "Shopify": "../../../../images/stores/Shopify.png",
  "SNKRS": "../../../../images/stores/Nike.png",
  "SNKRS-white": "../../../../images/stores/Nike-white.png",
  "adidas": "../../../../images/stores/adidas.png",
  "adidas-white": "../../../../images/stores/adidas-white.png"
};

const monitorsApp = new Vue({
  el: "#Rewrite___Monitors",
  data: {
    companionSettings: window.parent.companionSettings,
    shouldOpenExternal: false,
    products: displayedProducts,
    categories: window.categories,
    searchTerm: "",
    shoppingBags: shoppingBags,
    shoppingBagIndex: -1,
    isShoppingBagOpened: false
  },
  methods: {
    confineTextWidth: window.parent.confineTextWidth,
    calculateUnderlineWidth: window.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.tryTranslate,
    formatTimestamp: window.parent.formatTimestamp,
    getThemeColor: window.parent.getThemeColor,
    openInternal: window.parent.openInternal,
    openExternal: window.parent.openExternal,
    getKeyOnCurPlatform: window.parent.getKeyOnCurPlatform,
    getTotalBagQuantity: getTotalBagQuantity,
    getTotalBagValue: getTotalBagValue,
    getBagVariantValue: getBagVariantValue,
    tryGenerateShoppingBag: tryGenerateShoppingBag,
    addVariantToShoppingBags: addVariantToShoppingBags,
    handleVariantClick: function(e, product, variant) {
      if (e.ctrlKey || e.metaKey) addVariantToShoppingBags(product, variant, 1)
      else if (e.altKey) addVariantToShoppingBags(product, variant, -1)
      else if (e.shiftKey) this.launchVariantCheckout(product, variant, true)
      else this.launchVariantCheckout(product, variant)
    },
    setStoreActive: function(category, storeIndex) {
      if (category.activeIndex == storeIndex) {
        return;
      }
      for (var curCategory of this.categories) {
        curCategory.activeIndex = -1;
      }
      category.activeIndex = storeIndex;
      this.shoppingBagIndex = category.stores[storeIndex].urls.length == 1 ? tryAddEmptyShoppingBag(category.stores[storeIndex].urls[0], category.stores[storeIndex].name) : -1;
      refreshDisplayedProducts();
    },
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
      return categoryImages[category + (window.parent.companionSettings.theme == "dark" ? "-white" : "")];
    },
    getStockColor: function(product) {
      let stockPercentage = this.getStockPercentage(product);
      return stockPercentage > 50 ? 'rgba(53,178,57,1)' /*greem*/ : (stockPercentage > 0 ? 'rgba(253,213,53,1)' /*yellow*/ : 'rgba(253,53,53,1)' /*red*/) ;
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
        let variantNameWidth = window.parent.getTextWidth(this.tryTranslate(variant.Name), 'bold 13px \'SF Pro Text\'');
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
    launchVariantCheckout: function(product, variant, useConnectedBots = false) {
      if (!useConnectedBots) {
        let checkoutURL = "https://" + product.Store + "/cart/" + variant.ID + ":1";
        this.shouldOpenExternal ? this.openExternal(checkoutURL) : this.openInternal(checkoutURL, { title: 'Resell Companion — ' + product.Name + " Checkout" });
        return;
      }
      // TODO: launch with connected bots
    }
  }
});

window.updateProduct = (product) => {
  let foundProduct = false;
  for (var i = 0; i < window.products.length; i++) {
    if (window.products[i].URL == product.URL) {
      window.parent.memory.syncObject(window.products[i], product);
      if (product.Available) { // only move available products to the top
        tryDisplayProduct(window.products[i], false, i);
      }
      foundProduct = true;
      break;
    }
  }
  if (!foundProduct) {
    addNewProduct(product);
  }
};

function refreshDisplayedProducts() {
  while (displayedProducts.length > 0) {
    displayedProducts.pop();
  }
  let displayedCount = 0;
  for (var product of window.products) {
    if (tryDisplayProduct(product, true)) {
      displayedCount++;
      if (displayedCount >= 75) {
        break;
      }
    }
  }
}

function updateDisplayedProduct(product, displayedProductIndex = -1, productIndex = -1) {
  if (displayedProductIndex == -1) {
    for (var i = 0; i < displayedProducts.length; i++) {
      if (displayedProducts[i].URL == product.URL) {
        displayedProductIndex = i;
        break;
      }
    }
  }
  displayedProducts.splice(displayedProductIndex, 1);
  displayedProducts.unshift(product);
  if (productIndex == -1) {
    for (var i = 0; i < window.products.length; i++) {
      if (window.products[i].URL == product.URL) {
        productIndex = i;
        break;
      }
    }
  }
  window.products.splice(productIndex, 1);
  window.products.unshift(product);
  return true;
}

function addDisplayProduct(product, addToEnd = false, productIndex = -1) {
  if (productIndex != -1) {
    for (var i = 0; i < displayedProducts.length; i++) {
      if (displayedProducts[i].URL == product.URL) {
        displayedProductIndex = i;
        break;
      }
    }
    if (displayedProductIndex != -1) {
      updateDisplayedProduct(product, displayedProductIndex, productIndex);
      return true;
    }
  }
  if (!addToEnd) {
    displayedProducts.unshift(product);
  } else {
    displayedProducts.push(product);
  }
  if (displayedProducts.length > 75) {
    if (!addToEnd) {
      displayedProducts.pop(product);
    } else {
      displayedProducts.shift(product);
    }
  }
  return true;
}

function tryDisplayProduct(product, addToEnd = false, productIndex = -1) {
  if (monitorsApp.searchTerm.length > 0 && !product.Name.toLowerCase().includes(monitorsApp.searchTerm.toLowerCase())) {
    return false;
  }
  for (var category of window.categories) {
    if (category.activeIndex != -1) {
      let store = category.stores[category.activeIndex];
      if (store.urls.length > 0) {
        if (store.urls.includes(product.Store) && store.identifier == product.Identifier) {
          return addDisplayProduct(product, addToEnd, productIndex);
        }
      } else {
        if (store.identifier == product.Identifier) {
          return addDisplayProduct(product, addToEnd, productIndex);
        }
      }
    }
  }
  return false;
};

window.addNewProduct = (product) => {
  product.isDisplayingMoreInfo = false;
  product.Timestamp = new Date().getTime();
  window.products.unshift(product);
  tryDisplayProduct(product);
  if (window.products.length > 2500) { // random number that is large that becomes the largest # of products loaded in memory
    window.products.pop(product);
  }
};

window.addTestProduct = () => {
  const testProduct = {
    "Store": "feature.com",
    "StoreName": "Feature",
    "Name": "Common Projects Soft Leather Toiletry Bag - Warm Grey [TEST - " + window.products.length + "]",
    "URL": "https://feature.com/products/common-projects-soft-leather-toiletry-bag-soft-leather-warm-grey#" + window.products.length,
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
    "MD5": "389430269c82918eced7a4fb04c01046"
  };
  addNewProduct(testProduct);
};

window.sortStores = (categoryIndex = -1) => {
  if (categoryIndex == -1) {
    for (var category of window.categories) {
      let previousActiveStoreName = category.activeIndex != -1 ? category.stores[category.activeIndex].name : undefined; // remember previous active store name to update activeIndex after sort
      // quick sort alphabetically first
      category.stores.quick_sort(function(a,b) { return a.name < b.name }); // descending
      // then put favorites on top
      let favoritedStores = [];
      let unfavoritedStores = [];
      let unfilteredStore;
      for (var i = 0; i < category.stores.length; i++) {
        if (category.stores[i].name == "Unfiltered") {
          unfilteredStore = category.stores[i];
          continue;
        }
        if (category.stores[i].favorited) {
          favoritedStores.push(category.stores[i]);
        } else {
          unfavoritedStores.push(category.stores[i]);
        }
      }
      if (unfilteredStore) favoritedStores.push(unfilteredStore);
      if (previousActiveStoreName) {
        let foundActiveStoreInFavorites = false;
        for (var i = 0; i < favoritedStores.length; i++) {
          if (previousActiveStoreName == favoritedStores[i].name) {
            category.activeIndex = i;
            foundActiveStoreInFavorites = true;
            break;
          }
        }
        if (!foundActiveStoreInFavorites) {
          category.activeIndex = favoritedStores.length == 0 ? -1 : 0;
          refreshDisplayedProducts();
        }
      }
      window.parent.memory.syncObjects(category.stores, favoritedStores.concat(unfavoritedStores));
    }
  } else {
    let previousActiveStoreName = window.categories[categoryIndex].activeIndex != -1 ? window.categories[categoryIndex].stores[window.categories[categoryIndex].activeIndex].name : undefined; // remember previous active store name to update activeIndex after sort
    // quick sort alphabetically first
    window.categories[categoryIndex].stores.quick_sort(function(a,b) { return a.name < b.name }); // descending
    // then put favorites on top
    let favoritedStores = [];
    let unfavoritedStores = [];
    for (var i = 0; i < window.categories[categoryIndex].stores.length; i++) {
      if (category.stores[i].name == "Unfiltered") {
        unfilteredStore = window.categories[categoryIndex].stores[i];
        continue;
      }
      if (window.categories[categoryIndex].stores[i].favorited) {
        favoritedStores.push(window.categories[categoryIndex].stores[i]);
      } else {
        unfavoritedStores.push(window.categories[categoryIndex].stores[i]);
      }
    }
    if (unfilteredStore) favoritedStores.push(unfilteredStore);
    if (previousActiveStoreName) {
      let foundActiveStoreInFavorites = false;
      for (var i = 0; i < favoritedStores.length; i++) {
        if (previousActiveStoreName == favoritedStores[i].name) {
          window.categories[categoryIndex].activeIndex = i;
          foundActiveStoreInFavorites = true;
          break;
        }
      }
      if (!foundActiveStoreInFavorites) {
        window.categories[categoryIndex].activeIndex = favoritedStores.length == 0 ? -1 : 0;
        refreshDisplayedProducts();
      }
    }
    window.parent.memory.syncObjects(window.categories[categoryIndex].stores, favoritedStores.concat(unfavoritedStores));
  }
};

$(".Search_Bar_Class").on('change keydown paste input', function() {
  refreshDisplayedProducts();
});

const shoppingBagArea = document.querySelector('.Shopping_Bag_Area_Class');
const shoppingBagIcon = document.querySelector('.Shopping_Bag_g_Class');

// Listen for click events on body
document.body.addEventListener('click', function (event) {
  if (!shoppingBagArea.contains(event.target) && !shoppingBagIcon.contains(event.target)) {
    monitorsApp.isShoppingBagOpened = false;
  }
});

window.sortStores();
