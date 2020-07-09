const shipit = require('shipit');
const request = require('request-promise');

const upsClient = new shipit.UpsClient({
  licenseNumber: 'CD79D563B624BCB5'
});

const uspsClient = new shipit.UspsClient({
  userId: '723RESEL2761'
});

const fedexClient = new shipit.FedexClient({
  key: 'Qs7ohRobarD6hwRa',
  password: 'fsxjWnnU4vN1NjSwXy6wOBQrp',
  account: '678054437',
  meter: '251258532',
});

const dhlClient = new shipit.DhlClient({
  userId: 'wOPHyQy1t4GjnvX4iojnaB3ULNUgknYv',
  password: 'I5ETYAuQ6MlHLHxS'
});

const canadaPostClient = new shipit.CanadaPostClient({
  username: 'd49a8cc5f7bdb1d6',
  password: '98c341d8bc2bb37e78b712'
});

const lsClient = new shipit.LasershipClient();

const onTracClient = new shipit.OnTracClient();

const dhlgmClient = new shipit.DhlGmClient();

const upsmiClient = new shipit.UpsMiClient();

const amazonClient = new shipit.AmazonClient();

const prestigeClient = new shipit.PrestigeClient();

// ##################### STATUS CODES #####################
// UNKNOWN: 0
// SHIPPING: 1
// EN_ROUTE: 2
// OUT_FOR_DELIVERY: 3
// DELIVERED: 4
// DELAYED: 5

const altCarriers = {
  "upsmi": false,
  "ups": true,
  "usps": false,
  "fedex": false,
  "lasership": false,
  // "amazon": false,
  "ontrac": false,
  "dhlgm": false,
  "dhl": true,
  "a1intl": false,
  "canadapost": false
}

async function getPackageDetails(trackingNumber, carrier) {
  return new Promise(async (resolve) => {
    if (altCarriers[carrier]) resolve(await getPackageDetails_ALT(trackingNumber, carrier));
    switch (carrier.toLowerCase()) {
      case "ups":
        await upsClient.requestData({trackingNumber: trackingNumber}, (err, result) => {
          if (err) resolve(false);
          resolve(result);
        });
        break;
      case "upsmi":
        await upsmiClient.requestData({trackingNumber: trackingNumber}, (err, result) => {
          if (err) resolve(false);
          resolve(result);
        });
        break;
      case "usps":
        await uspsClient.requestData({trackingNumber: trackingNumber}, (err, result) => {
          if (err) resolve(false);
          resolve(result);
        });
        break;
      case "fedex":
        await fedexClient.requestData({trackingNumber: trackingNumber}, (err, result) => {
          if (err) resolve(false);
          resolve(result);
        });
        break;
      case "lasership":
        await lsClient.requestData({trackingNumber: trackingNumber}, (err, result) => {
          if (err) resolve(false);
          resolve(result);
        });
        break;
      case "ontrac":
        await onTracClient.requestData({trackingNumber: trackingNumber}, (err, result) => {
          if (err) resolve(false);
          resolve(result);
        });
        break;
      case "dhl":
        await dhlClient.requestData({trackingNumber: trackingNumber}, (err, result) => {
          if (err) resolve(false);
          resolve(result);
        });
        break;
      case "dhlgm":
        await dhlgmClient.requestData({trackingNumber: trackingNumber}, (err, result) => {
          if (err) resolve(false);
          resolve(result);
        });
        break;
      case "a1intl":
        await prestigeClient.requestData({trackingNumber: trackingNumber}, (err, result) => {
          if (err) resolve(false);
          resolve(result);
        });
        break;
      case "canadapost":
        await canadaPostClient.requestData({trackingNumber: trackingNumber}, (err, result) => {
          if (err) resolve(false);
          resolve(result);
        });
        break;
      default:
        return false;
    }
  });
}

async function getPackageDetails_ALT(trackingNumber, carrier) {
  let uri = `http://shipit-api.herokuapp.com/api/carriers/${carrier.toLowerCase()}/${trackingNumber}`;

  const requestOptions = {
    uri: uri,
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
  getPackageDetails: getPackageDetails
};
