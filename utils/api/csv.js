const ObjectsToCsv = require('objects-to-csv');
const electron = require('electron');
const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');

// master export function
async function exportItems(itemType, items) {
  switch (itemType) {
    case 'sales':
      await exportSales(items);
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

// master import function
async function importItems(itemType, items) {
  switch (itemType) {
    case 'sales':
      await importSales(items);
      break;
    case 'inventory':
      await importInventory(items);
      break;
    case 'subscriptions':
      await importSubscriptions(items);
      break;
    case 'tickets':
      await importTickets(items);
      break;
    case 'cards':
      await importCards(items);
      break;
  }
}

// export sales
async function exportSales(sales) {
  // open to documents path by default
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

  // get file path
  const result = await electron.remote.dialog.showSaveDialog({
    defaultPath: documentsPath,
    filters: [{ name: window.tryTranslate('Excel Spreadsheet'), extensions:["csv"] }]
  });
  if (result.canceled) return;

  // save to csv
  await exportObjects(formattedSales, result.filePath);

  // show success message box
  const options = {
    type: 'none',
    buttons: [window.tryTranslate('Okay')],
    defaultId: 0,
    title: `Resell Companion - ${window.tryTranslate('Hooray!')}`,
    message: window.tryTranslate("Your sales have been exported!"),
    detail: `${window.tryTranslate("Exported to")}: ${result.filePath}`,
    icon: './build-assets/icons/icon.png'
  };
  electron.remote.dialog.showMessageBox(null, options);
}

// import sales
async function importSales(sale) {
  // open to documents path by default
  var documentsPath = path.resolve(electron.remote.app.getPath("documents"), path.basename(`${window.tryTranslate('Sales')}.csv`));

  // get file path
  const result = await electron.remote.dialog.showOpenDialog({
    defaultPath: documentsPath,
    filters: [{ name: window.tryTranslate('Excel Spreadsheet'), extensions:["csv"] }],
    properties: ['openFile']
  });
  if (result.canceled || result.filePaths.length == 0) return;

  // format objects to csv
  let errored = await formatObjectsFromCSV('sales', result.filePaths[0]);

  if (errored === true) {
    // show errored message box
    const options = {
      type: 'none',
      buttons: [window.tryTranslate('Okay')],
      defaultId: 0,
      title: `Resell Companion - ${window.tryTranslate('Oops...')}`,
      message: window.tryTranslate("There was an issue importing... Ensure that the spreadsheet is in the correct language and format (try exporting to get an example first)."),
      detail: `${window.tryTranslate("Attempted to import from")}: ${result.filePaths[0]}`,
      icon: './build-assets/icons/icon.png'
    };
    return electron.remote.dialog.showMessageBox(null, options);
  }

  // show success message box
  const options = {
    type: 'none',
    buttons: [window.tryTranslate('Okay')],
    defaultId: 0,
    title: `Resell Companion - ${window.tryTranslate('Hooray!')}`,
    message: window.tryTranslate("Your sales have been imported!"),
    detail: `${window.tryTranslate("Imported from")}: ${result.filePath}`,
    icon: './build-assets/icons/icon.png'
  };
  electron.remote.dialog.showMessageBox(null, options);
}

// generic export objects func to save to file
async function exportObjects(objArr, filePath) {
  // initialize csv saver
  const csv = new ObjectsToCsv(objArr);
  // save to file path
  await csv.toDisk(filePath, { bom: true });
}

// format objects from csv file
async function formatObjectsFromCSV(type, filePath) {
  return await new Promise(async (resolve) => {
    let outObjArry = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', function(data) {
        try {
          switch (type) {
            case 'sales':
              // validate import data columns is correct
              if (!(
                // generic product information
                data[window.tryTranslate("Product Name")] &&
                data[window.tryTranslate("Color")] &&
                data[window.tryTranslate("Style Code")] &&
                data[window.tryTranslate("Size")] &&
                data[window.tryTranslate("Image URL")] &&
                data[window.tryTranslate("Notes")] &&
                // sale information
                data[window.tryTranslate("Sale Price")] &&
                data[window.tryTranslate("Fees")] &&
                data[window.tryTranslate("Platform")] &&
                data[window.tryTranslate("Sold Date")] &&
                data[window.tryTranslate("Sale Tracking Number")] &&
                data[window.tryTranslate("Sale Tracking Carrier")] &&
                // purchase information
                data[window.tryTranslate("Purchase Price")] &&
                data[window.tryTranslate("Estimated Resell")] &&
                data[window.tryTranslate("Store")] &&
                data[window.tryTranslate("Purchase Date")] &&
                data[window.tryTranslate("Purchase Tracking Number")] &&
                data[window.tryTranslate("Purchase Tracking Carrier")] &&
                // extra
                data[window.tryTranslate("Currency")]
              ) resolve(true);

              // format sale
              let formattedSale = {
                // TODO: add implementation
                name: "",
                color: "",
                styleCode: "",
                size: "",
                imageURL: "",
                notes: "",
                marketplaceData: {
                  product: {},
                  size: {},
                  media360: []
                },
                suggestions: {
                  items: [],
                  itemsOpened: false,
                  isSearchingForItems: false,
                  sizes: [],
                  sizesOpened: false,
                  isSearchingForSizes: false
                },
                purchase: {
                  price: null,
                  estimatedResell: null,
                  store: "",
                  date: "2020-07-07",
                  tracking: {
                    number: "",
                    carrier: "unselected",
                    isTracking: false,
                    details: {}
                  }
                },
                sale: {
                  price: null,
                  fees: {
                    amount: null,
                    isPercent: true
                  },
                  platform: "",
                  date: "2020-07-07",
                  tracking: {
                    number: "",
                    carrier: "unselected",
                    isTracking: false,
                    details: {}
                  }
                },
                quantity: 1,
                selected: false,
                isHovering: false,
                id: window.makeid(10); // assign a new id to each sale
              };
              // push to array
              outObjArry.push(formattedSale);
              break;
            case 'inventory':
              // TODO: add import functionality
              break;
            case 'subscriptions':
              // TODO: add import functionality
              break;
            case 'tickets':
              // TODO: add import functionality
              break;
            case 'cards':
              // TODO: add import functionality
              break;
          }
        } catch(err) {
          console.error(err);
          resolve(true);
          return;
        }
      })
      .on('end', function() {
        resolve(outObjArry);
      });
  });
}

module.exports = {
  exportItems: exportItems,
  importItems: importItems
};
