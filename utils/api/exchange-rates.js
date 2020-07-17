const request = require('request-promise');
const fx = require('money');

async function convertCurrency(value, from, to, roundScale = 2, base = "USD") {
  if (!fx.rates[base]) await updateExchangeRates(base);
  let convertedValue = fx.convert(value, { from: from, to: to });
  return roundScale == -1 ? convertedValue : roundNumber(convertedValue, roundScale);
}

async function updateExchangeRates(base = "USD") {
  let rates = (await fetchExchangeRates(base)).rates;
  fx.base = base;
  fx.rates = rates;
}

async function fetchExchangeRates(base = "USD") {
  let uri = `https://api.exchangeratesapi.io/latest?base=${base}`;

  const requestOptions = {
    uri: uri,
    simple: false,
    resolveWithFullResponse: true,
    json: true
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') return {};
  else return body;
}

// call roundNumber after getting each conversion
function roundNumber(num, scale = 2) {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}

updateExchangeRates(); // initialize exchange rates

module.exports = {
  convertCurrency: convertCurrency,
  updateExchangeRates: updateExchangeRates
};
