const ObjectsToCsv = require('objects-to-csv');
const electron = require('electron');
const path = require('path');

function exportItems(itemType, items) {
  switch (itemType) {
    case 'sales':
      exportSales(items);
      break;
    case 'inventory':
      exportInventory(items);
      break;
    case 'subscriptions':
      exportSubscriptions(items);
      break;
    case 'tickets':
      exportTickets(items);
      break;
    case 'cards':
      exportCards(items);
      break;
  }
}

function importItems(itemType, items) {
  switch (itemType) {
    case 'sales':
      importSales(items);
      break;
    case 'inventory':
      importInventory(items);
      break;
    case 'subscriptions':
      importSubscriptions(items);
      break;
    case 'tickets':
      importTickets(items);
      break;
    case 'cards':
      importCards(items);
      break;
  }
}

function exportSales(sales) {
  var documentsPath = path.resolve(electron.remote.app.getPath("documents"), path.basename(`${window.tryTranslate('Sales')}.csv`));

  var formattedSales = [];
  for (var sale of sales) {
    let formattedSale = {};
    // generic product information
    formattedSale[window.tryTranslate("Product Name")] = sale.name || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Color")] = sale.color || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Style Code")] = sale.styleCode || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Size")] = sale.size || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Image URL")] = sale.imageURL || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Notes")] = sale.notes || window.tryTranslate("N/A");
    // sale information
    formattedSale[window.tryTranslate("Sale Price")] = sale.sale.price || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Fees")] = (sale.sale.fees.amount + (sale.sale.fees.isPercent ? "%" : 0)) || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Platform")] = sale.sale.platform || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Sold Date")] = sale.sale.date || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Sale Tracking Number")] = sale.sale.tracking.number || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Sale Tracking Carrier")] = sale.sale.tracking.carrier == "unselected" ? window.tryTranslate("N/A") : window.trackingAPI.getCarrierDisplayName(sale.purchase.tracking.carrier);
    // purchase information
    formattedSale[window.tryTranslate("Purchase Price")] = sale.purchase.price || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Estimated Resell")] = sale.purchase.estimatedResell || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Store")] = sale.purchase.store || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Purchase Date")] = sale.purchase.date || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Purchase Tracking Number")] = sale.purchase.tracking.number || window.tryTranslate("N/A");
    formattedSale[window.tryTranslate("Purchase Tracking Carrier")] = sale.purchase.tracking.carrier == "unselected" ? window.tryTranslate("N/A") : window.trackingAPI.getCarrierDisplayName(sale.purchase.tracking.carrier);
    // extra
    formattedSale[window.tryTranslate("Currency")] = window.companionSettings.currency || "USD";
    formattedSales.push(formattedSale);
  }

  electron.remote.dialog.showSaveDialog(
    { defaultPath: documentsPath, filters: [ { name: window.tryTranslate('Excel Spreadsheet'), extensions:["csv"] } ] }
  ).then(result => {
    if (!result.canceled) {
      exportObjects(formattedSales, result.filePath, function() {

        const options = {
          type: 'none', // info ????
          buttons: [window.tryTranslate('Okay')],
          defaultId: 0,
          title: window.tryTranslate('Hooray!'), // window.tryTranslate('Success!')
          message: window.tryTranslate("Your sales have been exported!"),
          detail: `${window.tryTranslate("Directory")}: ${result.filePath}`,
          icon: './build-assets/icons/icon.png' // icon: './gui/images/green-checkmark.png'
        };

        electron.remote.dialog.showMessageBox(null, options);
      });
    }
  }).catch(err => {
    console.log(err);
  });
}

function exportObjects(objArr, filePath, callback) {
  (async () => {
    const csv = new ObjectsToCsv(objArr);
    // Save to file:
    await csv.toDisk(filePath, { bom: true });
    // await csv.toDisk(filePath);

    // DONE
    callback();
  })();
}

module.exports = {
  exportItems: exportItems,
  importItems: importItems
};
