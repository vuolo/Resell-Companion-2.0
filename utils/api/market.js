const request = require('request-promise');
const cheerio = require('cheerio');

// this function requires a StockX search result
async function updateMarket(result) {
  // result Obj looks like this: { product: product, variants: [] }
  // clear result variants
  while (result.variants.length > 0) result.variants.pop();

  // initialize displayed variants using StockX
  let stockXVariants = await fetchVariants("stockx", result.product);
  for (var stockXVariant of stockXVariants) {
    result.variants.push({
      name: stockXVariant.name,
      stores: {
        "stockx": {
          lowestAsk: stockXVariant.lowestAsk,
          highestBid: stockXVariant.highestBid,
          currency: stockXVariant.currency,
          url: stockXVariant.url
        },
        "goat": {
          lowestAsk: null,
          highestBid: null,
          currency: null
        },
        "stadiumgoods": {
          lowestAsk: null,
          highestBid: null,
          currency: null
        },
        "flightclub": {
          lowestAsk: null,
          highestBid: null,
          currency: null
        }
      }
    });
  }

  tryMatchAndApplyMarkets("goat", result);
  tryMatchAndApplyMarkets("stadiumgoods", result);
  tryMatchAndApplyMarkets("flightclub", result);
}

// requires an initialized StockX result (modifying)
async function tryMatchAndApplyMarkets(marketplace, stockXResult) {
  // find and match search result for the marketplace with the StockX result
  let searchResults = await searchMarketplace(marketplace, stockXResult.product.pid);
  let matchedResult;
  for (var searchResult of searchResults) {
    // validate sku to ensure the result is 100% correct.
    if (validateSKU(searchResult.sku || searchResult.manufacturer_sku || searchResult.style || "N/A", result.product.pid)) {
      matchedResult = searchResult;
      break;
    }
  }
  // apply matched variants (if found)
  if (matchedResult) applyMatchedVariants(marketplace, stockXResult, matchedResult);
}

// requires an initialized StockX result (modifying) and a matched marketplace result
async function applyMatchedVariants(marketplace, stockXResult, matchedResult) {
  let matchedVariants = await fetchVariants(marketplace, matchedResult);
  if (marketplace == "flightclub") {
    try {
      // guess assigning sizes for flightclub only because size names are unknown (this is because our method does not use their graphql api to get market data)
      stockXResult.variants.forEach((variant, i) => {
        variant.stores[marketplace].lowestAsk = matchedVariants[i].lowestAsk;
        variant.stores[marketplace].highestBid = matchedVariants[i].highestBid;
        variant.stores[marketplace].currency = matchedVariants[i].currency;
        variant.stores[marketplace].url = matchedVariants[i].url + "?size=" + variant.name;
      });
    } catch (err) { // variant lengths dont match up (more matched variants than result variants), so the above is probably wrong...
      // do nothing. fuck it. should be good enough.
    }
  } else {
    for (var variant of stockXResult.variants) {
      for (var matchedVariant of matchedVariants) {
        // validate the variant name with matched variant
        if (validateVariantName(matchedVariant.name, variant.name)) {
          variant.stores[marketplace].lowestAsk = matchedVariant.lowestAsk;
          variant.stores[marketplace].highestBid = matchedVariant.highestBid;
          variant.stores[marketplace].currency = matchedVariant.currency;
          variant.stores[marketplace].url = matchedVariant.url;
          break;
        }
      }
    }
  }
}

// general marketplace api search functions

async function searchMarketplace(marketplace, query, options = {}) {
  switch (marketplace) {
    case 'stockx':
      return await searchStockX(query, options);
    case 'goat':
      return await searchGoat(query, options);
    case 'stadiumgoods':
      return await searchStadiumGoods(query, options);
    case 'flightclub':
      return await searchFlightClub(query, options);
    default:
      return {};
  }
}

async function fetchVariants(marketplace, product, options = {}) {
  switch (marketplace) {
    case 'stockx':
      return await fetchStockXVariants(product, options);
    case 'goat':
      return await fetchGoatVariants(product, options);
    case 'stadiumgoods':
      return await fetchStadiumGoodsVariants(product, options);
    case 'flightclub':
      return await fetchFlightClubVariants(product, options);
    default:
      return {};
  }
}

// specific marketplace APIs

// ==== STOCKX API ==== \\

async function searchStockX(query, options = {}) {
  const { limit, dataType, proxy } = options;
  let uri = dataType == undefined ? `https://stockx.com/api/browse?&_search=${query}` : `https://stockx.com/api/browse?&_search=${query}&dataType=${dataType}`;

  const requestOptions = {
    uri: uri,
    headers: {
      'authority': 'stockx.com',
      'dnt': '1',
      'appos': 'web',
      'authorization': '',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      'sec-fetch-dest': 'empty',
      'x-requested-with': 'XMLHttpRequest',
      'x-anonymous-id': 'undefined',
      'appversion': '0.1',
      'accept': '*/*',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'referer': 'https://stockx.com/search',
      'accept-language': 'es-US,es;q=0.9,en;q=0.8,en-US;q=0.7',
      'if-none-match': 'W/^\^30453-2Zu2uOFrvCFoydwXHV8/7VKCWcU^\^',
      'Cookie': `_pxvid=f082e570-2b5b-11ea-986f-99d0d99eb90${Math.floor(Math.random() * 9)};`
    },
    simple: false,
    resolveWithFullResponse: true,
    proxy: proxy
  };

  const res = await request(requestOptions);
  if (res.body.includes("Please verify you are a human")) return [];//throw new Error("Human Authentication Requested.");
  const body = JSON.parse(res.body);

  if (body.status && body.status == 'failed') return false;
  else {
    const { Products } = body;
    const target = limit !== undefined ? Products.slice(0, limit) : Products;
    if (!target) return [];
    const productArray = target.map(product => {
      const image = new URL(product.media.imageUrl, 'https://stockx.com').href;
      return {
        name: product.title,
        retail: product.retailPrice,
        releaseDate: product.releaseDate,
        pid: product.styleId,
        uuid: product.market.productUuid,
        image,
        color: product.colorway,
        urlKey: product.urlKey,
        market: product.market
      };
    });

    if (productArray == "") return [];//throw new Error("No products found!");
    else return removeDuplicateProducts(productArray);
  }

}

// force return market prices in USD to convert to local currency after gathering
async function fetchStockXVariants(product, options = {}) {
  const { currency = "USD", proxy, includeMedia360 = false } = options;
  let slug;
  if (typeof product == 'string') {
      if (product.includes('stockx.com/')) slug = product.split('stockx.com/')[1].split('/')[0];
      else slug = product;
  }
  else slug = product.urlKey;
  let uri = `https://stockx.com/api/products/${slug}?includes=market&currency=${currency}`;

  const requestOptions = {
    uri: uri,
    headers: {
      'authority': 'stockx.com',
      'dnt': '1',
      'appos': 'web',
      'authorization': '',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      'sec-fetch-dest': 'empty',
      'x-requested-with': 'XMLHttpRequest',
      'x-anonymous-id': 'undefined',
      'appversion': '0.1',
      'accept': '*/*',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'referer': 'https://stockx.com/search',
      'accept-language': 'es-US,es;q=0.9,en;q=0.8,en-US;q=0.7',
      'if-none-match': 'W/^\^30453-2Zu2uOFrvCFoydwXHV8/7VKCWcU^\^',
      'Cookie': `_pxvid=f082e570-2b5b-11ea-986f-99d0d99eb90${Math.floor(Math.random() * 9)};`
    },
    simple: false,
    resolveWithFullResponse: true,
    proxy: proxy,
    json: true
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') return false;
  else {
    let variants = [];

    const sizes = body.Product.children;
    for (let key in sizes) {
      variants.push({
        name: sizes[key].shoeSize,
        lowestAsk: sizes[key].market.lowestAsk,
        highestBid: sizes[key].market.highestBid,
        currency: "USD",
        groupTitle: sizes[key].skuVariantGroup ? sizes[key].skuVariantGroup.shortCode || "U.S. Men's Size" : "U.S. Men's Size",
        url: `https://stockx.com/${slug}?size=${sizes[key].shoeSize}`
      });
    };

    const media360 = body.Product.media['360'] || [body.Product.media.imageUrl];
    return includeMedia360 ? { variants: variants, media360: media360 } : variants;
  }

}

// ==== GOAT API ==== \\

async function searchGoat(query, options = {}) {
  const { limit = 10, proxy } = options;
  let uri = 'https://2fwotdvm2o-dsn.algolia.net/1/indexes/product_variants_v2_trending_purchase/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.25.1&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a';

  const requestOptions = {
    method: 'POST',
    uri: uri,
    headers: {
      'authority': 'goat.com',
      'origin': 'https://goat.com',
      'dnt': '1',
      'appos': 'web',
      'authorization': '',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      'sec-fetch-dest': 'empty',
      'x-requested-with': 'XMLHttpRequest',
      'x-anonymous-id': 'undefined',
      'appversion': '0.1',
      'accept': 'application/json',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'referer': 'https://goat.com',
      'accept-language': 'es-US,es;q=0.9,en;q=0.8,en-US;q=0.7',
      'if-none-match': 'W/^\^30453-2Zu2uOFrvCFoydwXHV8/7VKCWcU^\^'
    },
    simple: false,
    resolveWithFullResponse: true,
    proxy: proxy,
    body: {
      params: `query=&query=${query}&distinct=true&facetFilters=(product_category%3Ashoes)&page=0&hitsPerPage=${limit}`
    },
    json: true
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') return false;
  else return body.hits;
}

// goat always returns USD no matter what
async function fetchGoatVariants(product, options = {}) {
  const { proxy } = options;
  let uri = `https://www.goat.com/web-api/v1/product_variants?productTemplateId=${product.slug}`;

  const requestOptions = {
    uri: uri,
    headers: {
      'authority': 'goat.com',
      'origin': 'https://goat.com',
      'dnt': '1',
      'appos': 'web',
      'authorization': '',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      'sec-fetch-dest': 'empty',
      'x-requested-with': 'XMLHttpRequest',
      'x-anonymous-id': 'undefined',
      'appversion': '0.1',
      'accept': 'application/json',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'referer': 'https://goat.com',
      'accept-language': 'es-US,es;q=0.9,en;q=0.8,en-US;q=0.7',
      'if-none-match': 'W/^\^30453-2Zu2uOFrvCFoydwXHV8/7VKCWcU^\^'
    },
    simple: false,
    resolveWithFullResponse: true,
    proxy: proxy,
    json: true
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') return false;
  else {
    let variants = [];

    const sizes = body;
    for (var size of sizes) {
      if (size.shoeCondition != "new_no_defects") continue; // make sure to only get NEW sizes...
      variants.push({
        name: String(size.size),
        lowestAsk: size.lowestPriceCents.amountUsdCents / 100,
        highestBid: null,
        currency: "USD",
        url: `https://www.goat.com/sneakers/${product.slug}?size=${size.size}`
      });
    }

    return removeDuplicateVariants(variants);
  };
}

// ==== STADIUM GOODS API ==== \\

async function searchStadiumGoods(query, options = {}) {
  const { limit = 10, proxy } = options;
  let uri = 'https://avuthfhit4-dsn.algolia.net/1/indexes/mag_prod_default_products/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.32.1%3BMagento%20integration%20(1.16.0)&x-algolia-application-id=AVUTHFHIT4&x-algolia-api-key=YjE1NmQ4ZmJjM2YxODRkZmIwMzcxNjFlOGE5YTg1OGM2NWFlMTY5ZjE3MWMzZDRiYjI3MzllZDczYTEzOGQzNWZpbHRlcnM9';

  const requestOptions = {
    method: 'POST',
    uri: uri,
    headers: {
      'authority': 'stadiumgoods.com',
      'origin': 'https://stadiumgoods.com',
      'dnt': '1',
      'appos': 'web',
      'authorization': '',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      'sec-fetch-dest': 'empty',
      'x-requested-with': 'XMLHttpRequest',
      'x-anonymous-id': 'undefined',
      'appversion': '0.1',
      'accept': 'application/json',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'referer': 'https://stadiumgoods.com',
      'accept-language': 'es-US,es;q=0.9,en;q=0.8,en-US;q=0.7',
      'if-none-match': 'W/^\^30453-2Zu2uOFrvCFoydwXHV8/7VKCWcU^\^'
    },
    simple: false,
    resolveWithFullResponse: true,
    proxy: proxy,
    body: {
      params: `query=&query=${query}&distinct=true&page=0&hitsPerPage=${limit}`
    },
    json: true
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') return false;
  else return body.hits;
}

// stadium goods always returns local currency (BASED ON IP LOCATION) no matter what
async function fetchStadiumGoodsVariants(product, options = {}) {
  const { proxy } = options;
  let uri = product.url;

  const requestOptions = {
    uri: uri,
    headers: {
      'authority': 'stadiumgoods.com',
      'origin': 'https://stadiumgoods.com',
      'dnt': '1',
      'appos': 'web',
      'authorization': '',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      'sec-fetch-dest': 'empty',
      'x-requested-with': 'XMLHttpRequest',
      'x-anonymous-id': 'undefined',
      'appversion': '0.1',
      'accept': 'application/json',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'referer': 'https://stadiumgoods.com',
      'accept-language': 'es-US,es;q=0.9,en;q=0.8,en-US;q=0.7',
      'if-none-match': 'W/^\^30453-2Zu2uOFrvCFoydwXHV8/7VKCWcU^\^'
    },
    simple: false,
    resolveWithFullResponse: true,
    proxy: proxy
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') return false;
  else {
    let variants = [];

    const $cheerio = cheerio.load(body);
    const currency = $cheerio('meta[property="product:price:currency"]')[0].attribs['content'];
    $cheerio('.product-sizes__input').each(function(i, elem) {
      if ($cheerio(this).attr('data-amount') == "0") return; // OOS
      variants.push({
        name: $cheerio(this).attr('data-size'),
        lowestAsk: parseFloat($cheerio(this).attr('data-amount')) / 100,
        highestBid: null,
        currency: currency,
        url: `${product.url}?size=${$cheerio(this).attr('data-size')}`
      });
    });

    return variants;
  }
}

// ==== FLIGHT CLUB API ==== \\

async function searchFlightClub(query, options = {}) {
  const { limit = 10, proxy } = options;
  let uri = 'https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.32.0%3Breact-instantsearch%205.4.0%3BJS%20Helper%202.26.1&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a';

  const requestOptions = {
    method: 'POST',
    uri: uri,
    headers: {
      'authority': 'flightclub.com',
      'origin': 'https://flightclub.com',
      'dnt': '1',
      'appos': 'web',
      'authorization': '',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      'sec-fetch-dest': 'empty',
      'x-requested-with': 'XMLHttpRequest',
      'x-anonymous-id': 'undefined',
      'appversion': '0.1',
      'accept': 'application/json',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'referer': 'https://flightclub.com',
      'accept-language': 'es-US,es;q=0.9,en;q=0.8,en-US;q=0.7',
      'if-none-match': 'W/^\^30453-2Zu2uOFrvCFoydwXHV8/7VKCWcU^\^'
    },
    simple: false,
    resolveWithFullResponse: true,
    proxy: proxy,
    body: {
      "requests": [
        {
          "indexName": "product_variants_v2_flight_club",
          "params": `query=${query}&hitsPerPage=${limit}&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&distinct=true&facets=%5B%5D&tagFilters=`
        }
      ]
    },
    json: true
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') return false;
  else return body.results[0].hits;
}

// flight club always returns local currency (BASED ON IP LOCATION) no matter what
async function fetchFlightClubVariants(product, options = {}) {
  const { proxy } = options;
  let uri = `https://www.flightclub.com/${product.slug}`;

  const requestOptions = {
    uri: uri,
    headers: {
      'authority': 'flightclub.com',
      'origin': 'https://flightclub.com',
      'dnt': '1',
      'appos': 'web',
      'authorization': '',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      'sec-fetch-dest': 'empty',
      'x-requested-with': 'XMLHttpRequest',
      'x-anonymous-id': 'undefined',
      'appversion': '0.1',
      'accept': 'application/json',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'referer': 'https://flightclub.com',
      'accept-language': 'es-US,es;q=0.9,en;q=0.8,en-US;q=0.7',
      'if-none-match': 'W/^\^30453-2Zu2uOFrvCFoydwXHV8/7VKCWcU^\^'
    },
    simple: false,
    resolveWithFullResponse: true,
    proxy: proxy
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') return false;
  else {
    let variants = [];

    const $cheerio = cheerio.load(body);
    let productData;
    try {
      productData = JSON.parse($cheerio('script[type="application/ld+json"]')[1].children[0].data);
      for (var offer of productData.offers.offers) {
        variants.push({
          name: null,
          lowestAsk: parseFloat(offer.price),
          highestBid: null,
          currency: offer.priceCurrency,
          url: `https://www.flightclub.com/${product.slug}`
        });
      }
    } catch(err) {
      return variants;
    }

    return variants;
  }
}

// validate sku function
function validateSKU(incomingSKU, expectedSKU) {
  let formattedIncomingSKU = incomingSKU.toUpperCase().replace(new RegExp(" ", "g"), "-").trim();
  let formattedExpectedSKU = expectedSKU.toUpperCase().replace(new RegExp(" ", "g"), "-").trim();
  return formattedIncomingSKU == formattedExpectedSKU;
}

// validate variant name function
function validateVariantName(incomingVariant, expectedVariant) {
  let incomingVariantNum = getNumberFromString(incomingVariant);
  let expectedVariantNum = getNumberFromString(expectedVariant);
  if (incomingVariantNum == 0 && expectedVariantNum) return incomingVariant == expectedVariant; // variant names do NOT include numbers at all. (or both variant names are "0"). either way. return this.
  return incomingVariantNum == expectedVariantNum;
}

// clear duplicate variants and keep the one with the lowestAsk
function removeDuplicateVariants(variants) {
  let foundDuplicateIndex = getDuplicateVariantIndex(variants);
  while (foundDuplicateIndex != -1) {
    // start loop at second duplicate
    for (var i = foundDuplicateIndex + 1; i < variants.length; i++) {
      if (variants[i].lowestAsk <= variants[foundDuplicateIndex].lowestAsk) variants.splice(foundDuplicateIndex, 1);
      else variants.splice(i, 1);
      break;
    }
    foundDuplicateIndex = getDuplicateVariantIndex(variants);
  }
  return variants;
}

// clear duplicate products
function removeDuplicateProducts(products) {
  let outProducts = [];
  let foundProductNames = [];
  let foundProductStyleCodes = [];
  let foundProductColors = [];
  for (var product of products) {
    if (!foundProductNames.includes(product.name || "unknown name")) {
      outProducts.push(product);
      foundProductNames.push(product.name || "unknown name");
      foundProductStyleCodes.push(product.pid || "unknown style code");
      foundProductColors.push(product.color || "unknown color");
    } else if (!foundProductStyleCodes.includes(product.pid || "unknown style code")) {
      outProducts.push(product);
      foundProductNames.push(product.name || "unknown name");
      foundProductStyleCodes.push(product.pid || "unknown style code");
      foundProductColors.push(product.color || "unknown color");
    } else if (!foundProductColors.includes(product.color || "unknown color")) {
      outProducts.push(product);
      foundProductNames.push(product.name || "unknown name");
      foundProductStyleCodes.push(product.pid || "unknown style code");
      foundProductColors.push(product.color || "unknown color");
    }
  }
  return outProducts;
}

// returns the first index of the duplicated variant
function getDuplicateVariantIndex(variants) {
  for (var i = 0; i < variants.length; i++) {
    if (i != 0 && variants[i].name == variants[i-1].name) {
      return i-1;
    }
  }
  return -1;
}

function getNumberFromString(string) {
  return Number(string.replace(/[^0-9\.]+/g,""));
}

module.exports = {
  updateMarket: updateMarket,
  searchMarketplace: searchMarketplace,
  fetchVariants: fetchVariants,
  validateSKU: validateSKU
};
