const NUMS_ALLOWED = '0123456789';

// https://laced.com.au/cart/31560672411705:1,8513047822393:1
var shoppingBags = [];

function getTotalBagQuantity(shoppingBagIndex) {
  let totalQuantity = 0;
  for (var variant of shoppingBags[shoppingBagIndex].variants) {
    totalQuantity += variant.quantity;
  }
  return totalQuantity;
}

// loop through all chars in price (string) and stop when you get to a number
function getCurrencyFromPrice(price) {
  let outCurrency = "";
  for (var char of price.toString()) {
    let foundNumber = false;
    for (var NUM_ALLOWED of NUMS_ALLOWED) {
      if (char == NUM_ALLOWED) {
        foundNumber = true;
        break;
      }
    }
    if (foundNumber) {
      break;
    }
    outCurrency += char;
  }
  return outCurrency;
}

function getTotalBagValue(shoppingBagIndex, includeCurrency = false, useCommas = false) {
  let totalValue = 0;
  for (var variant of shoppingBags[shoppingBagIndex].variants) {
    totalValue += Number(variant.parent.Price.replace(/[^0-9\.]+/g,"")) * variant.quantity;
  }
  if (includeCurrency) {
    if (shoppingBags[shoppingBagIndex].variants.length > 0) {
      const currency = getCurrencyFromPrice(shoppingBags[shoppingBagIndex].variants[0].parent.Price);
      let condensedTotalValue = parseFloat(totalValue).toFixed(2);
      if (useCommas) return currency + window.parent.numberWithCommas(condensedTotalValue);
      return currency + condensedTotalValue;
    }
  }
  let condensedTotalValue = parseFloat(totalValue).toFixed(2);
  if (useCommas) return outCurrency + window.parent.numberWithCommas(condensedTotalValue);
  return outCurrency + condensedTotalValue;
}

function getBagVariantValue(variant, includeCurrency = false, useCommas = false) {
  let totalValue = Number(variant.parent.Price.replace(/[^0-9\.]+/g,"")) * variant.quantity;
  if (includeCurrency) {
    const currency = getCurrencyFromPrice(variant.parent.Price);
    let condensedTotalValue = parseFloat(totalValue).toFixed(2);
    if (useCommas) return currency + window.parent.numberWithCommas(condensedTotalValue);
    return currency + condensedTotalValue;
  }
  let condensedTotalValue = parseFloat(totalValue).toFixed(2);
  if (useCommas) return outCurrency + window.parent.numberWithCommas(condensedTotalValue);
  return outCurrency + condensedTotalValue;
}

async function tryGenerateShoppingBag(store_url, generateFullURL = false, clearCart = false) {
  var foundStoreIndex = -1;
  for (var i = 0; i < shoppingBags.length; i++) {
    if (store_url == shoppingBags[i].store_url) {
      foundStoreIndex = i;
      break;
    }
  }
  if (foundStoreIndex == -1 || (foundStoreIndex != -1 && shoppingBags[foundStoreIndex].variants.length == 0)) {
    return generateFullURL ? "https://" + store_url : undefined;
  }
  var outQueryString = "";
  for (var i = 0; i < shoppingBags[foundStoreIndex].variants.length; i++) {
    outQueryString += shoppingBags[foundStoreIndex].variants[i].variant.ID + ":" + String(shoppingBags[foundStoreIndex].variants[i].quantity);
    if (i != shoppingBags[foundStoreIndex].variants.length-1) {
      outQueryString += ",";
    }
  }
  if (generateFullURL) {
    if (store_url == "cactusplantfleamarket.com") {
      let outVariants = [];
      let outQuantities = [];
      for (var i = 0; i < shoppingBags[foundStoreIndex].variants.length; i++) {
        outVariants.push(shoppingBags[foundStoreIndex].variants[i].variant);
        outQuantities.push(shoppingBags[foundStoreIndex].variants[i].quantity);
      }
      if (clearCart) clearShoppingBag(foundStoreIndex);
      return await window.parent.frames['tasks-frame'].generateCPFMCartURL(outVariants, outQuantities);
    }
    else {
      if (clearCart) clearShoppingBag(foundStoreIndex);
      return "https://" + store_url + "/cart/" + outQueryString;
    }
  }
  if (clearCart) clearShoppingBag(foundStoreIndex);
  return outQueryString;
}

function clearShoppingBag(bagIndex) {
  while (shoppingBags[bagIndex].variants.length > 0) shoppingBags[bagIndex].variants.pop();
}

function tryAddEmptyShoppingBag(store_url, store_name) {
  if (!store_url) {
    return -1;
  }
  for (var i = 0; i < shoppingBags.length; i++) {
    if (shoppingBags[i].store_url == store_url) {
      return i;
    }
  }
  shoppingBags.push(
    {
      store_url: store_url,
      store_name: store_name,
      variants: []
    }
  );
  return shoppingBags.length - 1;
}

function addVariantToShoppingBags(product, variant, quantity = 1) {
  if (!variant.Available) {
    return false;
  }
  var foundStoreIndex = -1;
  for (var i = 0; i < shoppingBags.length; i++) {
    if (product.Store == shoppingBags[i].store_url) {
      foundStoreIndex = i;
      break;
    }
  }
  if (foundStoreIndex == -1) { // not found, add variant to shoppingBags
    if (quantity <= 0) {
      return true;
    }
    shoppingBags.push(
      {
        store_url: product.Store,
        store_name: product.StoreName,
        variants: [
          {
            variant: variant,
            quantity: quantity,
            parent: product
          }
        ]
      }
    );
    return true;
  } else { // bag found, add variant to shopping bag
    for (var i = 0; i < shoppingBags[foundStoreIndex].variants.length; i++ ) {
      if (shoppingBags[foundStoreIndex].variants[i].variant.ID == variant.ID) {
        shoppingBags[foundStoreIndex].variants[i].quantity += quantity;
        if (shoppingBags[foundStoreIndex].variants[i].quantity <= 0) {
          shoppingBags[foundStoreIndex].variants.splice(i, 1);
        }
        return true;
      }
    }
    if (quantity <= 0) {
      return true;
    }
    shoppingBags[foundStoreIndex].variants.push(
      {
        variant: variant,
        quantity: quantity,
        parent: product
      }
    );
    return true;
  }
  return false;
}
