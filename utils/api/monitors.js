const request = require('request-promise');

async function fetchProducts(categories = null) {
  let uri;
  if (categories) uri = `https://resell.monster/api/resell-companion/all_products_extended`;
  else uri = `https://resell.monster/api/resell-companion/all_products`;

  const requestOptions = {
    method: categories ? 'POST' : undefined,
    uri: uri,
    body: categories ? { categories: categories } : undefined,
    simple: false,
    resolveWithFullResponse: true,
    json: true // Automatically parses the JSON string in the response
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') {
    return false;
  } else {
    return body;
  }

}

module.exports = {
  fetchProducts: fetchProducts
};
