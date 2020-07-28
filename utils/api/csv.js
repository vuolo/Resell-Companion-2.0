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
      await exportInventory(items);
      break;
    case 'subscriptions':
      await exportSubscriptions(items);
      break;
    case 'tickets':
      await exportTickets(items);
      break;
    case 'cards':
      await exportCards(items);
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
    formattedSale[window.tryTranslate("Fees")] = sale.sale.fees.amount ? ((sale.sale.fees.amount + (sale.sale.fees.isPercent ? "%" : 0)) || window.tryTranslate("N/A")) : window.tryTranslate("N/A");
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
async function importSales(sales) {
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
  let formattedObjects = await formatObjectsFromCSV('sales', result.filePaths[0]);

  if (formattedObjects === false) {
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

  // import sales
  for (var formattedObject of formattedObjects) {
    sales.push(formattedObject);
    window.frames['analytics-frame'].frames['sales-subpage'].refreshTracking(sales.length-1, true);
  }
  window.frames['analytics-frame'].frames['sales-subpage'].refreshSalesSearch();

  // show success message box
  const options = {
    type: 'none',
    buttons: [window.tryTranslate('Okay')],
    defaultId: 0,
    title: `Resell Companion - ${window.tryTranslate('Hooray!')}`,
    message: window.tryTranslate("Your sales have been imported!"),
    detail: `${window.tryTranslate("Imported from")}: ${result.filePaths[0]}`,
    icon: './build-assets/icons/icon.png'
  };
  electron.remote.dialog.showMessageBox(null, options);
}

// export inventory
async function exportInventory(inventoryItems) {
  // open to documents path by default
  var documentsPath = path.resolve(electron.remote.app.getPath("documents"), path.basename(`${window.tryTranslate('Inventory')}.csv`));

  var formattedInventoryItems = [];
  for (var inventoryItem of inventoryItems) {
    let formattedInventoryItem = {};
    // generic product information
    formattedInventoryItem[window.tryTranslate("Product Name")] = inventoryItem.name || window.tryTranslate("N/A");
    formattedInventoryItem[window.tryTranslate("Color")] = inventoryItem.color || window.tryTranslate("N/A");
    formattedInventoryItem[window.tryTranslate("Style Code")] = inventoryItem.styleCode || window.tryTranslate("N/A");
    formattedInventoryItem[window.tryTranslate("Size")] = inventoryItem.size || window.tryTranslate("N/A");
    formattedInventoryItem[window.tryTranslate("Image URL")] = inventoryItem.imageURL || window.tryTranslate("N/A");
    formattedInventoryItem[window.tryTranslate("Notes")] = inventoryItem.notes || window.tryTranslate("N/A");
    // purchase information
    formattedInventoryItem[window.tryTranslate("Purchase Price")] = inventoryItem.purchase.price || window.tryTranslate("N/A");
    formattedInventoryItem[window.tryTranslate("Estimated Resell")] = inventoryItem.purchase.estimatedResell || window.tryTranslate("N/A");
    formattedInventoryItem[window.tryTranslate("Store")] = inventoryItem.purchase.store || window.tryTranslate("N/A");
    formattedInventoryItem[window.tryTranslate("Purchase Date")] = inventoryItem.purchase.date || window.tryTranslate("N/A");
    formattedInventoryItem[window.tryTranslate("Purchase Tracking Number")] = inventoryItem.purchase.tracking.number || window.tryTranslate("N/A");
    formattedInventoryItem[window.tryTranslate("Purchase Tracking Carrier")] = inventoryItem.purchase.tracking.carrier == "unselected" ? window.tryTranslate("N/A") : window.trackingAPI.getCarrierDisplayName(inventoryItem.purchase.tracking.carrier);
    // extra
    formattedInventoryItem[window.tryTranslate("Currency")] = window.companionSettings.currency || "USD";
    formattedInventoryItems.push(formattedInventoryItem);
  }

  // get file path
  const result = await electron.remote.dialog.showSaveDialog({
    defaultPath: documentsPath,
    filters: [{ name: window.tryTranslate('Excel Spreadsheet'), extensions:["csv"] }]
  });
  if (result.canceled) return;

  // save to csv
  await exportObjects(formattedInventoryItems, result.filePath);

  // show success message box
  const options = {
    type: 'none',
    buttons: [window.tryTranslate('Okay')],
    defaultId: 0,
    title: `Resell Companion - ${window.tryTranslate('Hooray!')}`,
    message: window.tryTranslate("Your inventory has been exported!"),
    detail: `${window.tryTranslate("Exported to")}: ${result.filePath}`,
    icon: './build-assets/icons/icon.png'
  };
  electron.remote.dialog.showMessageBox(null, options);
}
// import inventory
async function importInventory(inventoryItems) {
  // open to documents path by default
  var documentsPath = path.resolve(electron.remote.app.getPath("documents"), path.basename(`${window.tryTranslate('Inventory')}.csv`));

  // get file path
  const result = await electron.remote.dialog.showOpenDialog({
    defaultPath: documentsPath,
    filters: [{ name: window.tryTranslate('Excel Spreadsheet'), extensions:["csv"] }],
    properties: ['openFile']
  });
  if (result.canceled || result.filePaths.length == 0) return;

  // format objects to csv
  let formattedObjects = await formatObjectsFromCSV('inventory', result.filePaths[0]);

  if (formattedObjects === false) {
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

  // import inventory items
  for (var formattedObject of formattedObjects) {
    inventoryItems.push(formattedObject);
    window.frames['analytics-frame'].frames['inventory-subpage'].refreshTracking(inventoryItems.length-1, true);
  }
  window.frames['analytics-frame'].frames['inventory-subpage'].refreshInventoryItemsSearch();

  // show success message box
  const options = {
    type: 'none',
    buttons: [window.tryTranslate('Okay')],
    defaultId: 0,
    title: `Resell Companion - ${window.tryTranslate('Hooray!')}`,
    message: window.tryTranslate("Your inventory has been imported!"),
    detail: `${window.tryTranslate("Imported from")}: ${result.filePaths[0]}`,
    icon: './build-assets/icons/icon.png'
  };
  electron.remote.dialog.showMessageBox(null, options);
}

// export subscriptions
async function exportSubscriptions(subscriptions) {
  // open to documents path by default
  var documentsPath = path.resolve(electron.remote.app.getPath("documents"), path.basename(`${window.tryTranslate('Subscriptions')}.csv`));

  var formattedSubscriptions = [];
  for (var subscription of subscriptions) {
    let formattedSubscription = {};
    // generic product information
    formattedSubscription[window.tryTranslate("Product Name")] = subscription.name || window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Membership")] = window.tryTranslate(getDisplayedMembership(subscription.size));
    formattedSubscription[window.tryTranslate("Image URL")] = subscription.imageURL || window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Notes")] = subscription.notes || window.tryTranslate("N/A");
    // sale information
    formattedSubscription[window.tryTranslate("Sale Price")] = subscription.sale.price || window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Fees")] = subscription.sale.fees.amount ? ((subscription.sale.fees.amount + (subscription.sale.fees.isPercent ? "%" : 0)) || window.tryTranslate("N/A")) : window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Platform")] = subscription.sale.platform || window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Sold Date")] = subscription.sale.date || window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Sale Tracking Number")] = subscription.sale.tracking.number || window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Sale Tracking Carrier")] = subscription.sale.tracking.carrier == "unselected" ? window.tryTranslate("N/A") : window.trackingAPI.getCarrierDisplayName(subscription.purchase.tracking.carrier);
    // purchase information
    formattedSubscription[window.tryTranslate("Purchase Price")] = subscription.purchase.price || window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Estimated Resell")] = subscription.purchase.estimatedResell || window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Store")] = subscription.purchase.store || window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Purchase Date")] = subscription.purchase.date || window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Purchase Tracking Number")] = subscription.purchase.tracking.number || window.tryTranslate("N/A");
    formattedSubscription[window.tryTranslate("Purchase Tracking Carrier")] = subscription.purchase.tracking.carrier == "unselected" ? window.tryTranslate("N/A") : window.trackingAPI.getCarrierDisplayName(subscription.purchase.tracking.carrier);
    // extra
    formattedSubscription[window.tryTranslate("Currency")] = window.companionSettings.currency || "USD";
    formattedSubscriptions.push(formattedSubscription);
  }

  // get file path
  const result = await electron.remote.dialog.showSaveDialog({
    defaultPath: documentsPath,
    filters: [{ name: window.tryTranslate('Excel Spreadsheet'), extensions:["csv"] }]
  });
  if (result.canceled) return;

  // save to csv
  await exportObjects(formattedSubscriptions, result.filePath);

  // show success message box
  const options = {
    type: 'none',
    buttons: [window.tryTranslate('Okay')],
    defaultId: 0,
    title: `Resell Companion - ${window.tryTranslate('Hooray!')}`,
    message: window.tryTranslate("Your subscriptions have been exported!"),
    detail: `${window.tryTranslate("Exported to")}: ${result.filePath}`,
    icon: './build-assets/icons/icon.png'
  };
  electron.remote.dialog.showMessageBox(null, options);
}
// import subscriptions
async function importSubscriptions(subscriptions) {
  // open to documents path by default
  var documentsPath = path.resolve(electron.remote.app.getPath("documents"), path.basename(`${window.tryTranslate('Subscriptions')}.csv`));

  // get file path
  const result = await electron.remote.dialog.showOpenDialog({
    defaultPath: documentsPath,
    filters: [{ name: window.tryTranslate('Excel Spreadsheet'), extensions:["csv"] }],
    properties: ['openFile']
  });
  if (result.canceled || result.filePaths.length == 0) return;

  // format objects to csv
  let formattedObjects = await formatObjectsFromCSV('subscriptions', result.filePaths[0]);

  if (formattedObjects === false) {
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

  // import subscriptions
  for (var formattedObject of formattedObjects) {
    subscriptions.push(formattedObject);
    window.frames['analytics-frame'].frames['subscriptions-subpage'].refreshTracking(subscriptions.length-1, true);
  }
  window.frames['analytics-frame'].frames['subscriptions-subpage'].refreshSubscriptionsSearch();

  // show success message box
  const options = {
    type: 'none',
    buttons: [window.tryTranslate('Okay')],
    defaultId: 0,
    title: `Resell Companion - ${window.tryTranslate('Hooray!')}`,
    message: window.tryTranslate("Your subscriptions have been imported!"),
    detail: `${window.tryTranslate("Imported from")}: ${result.filePaths[0]}`,
    icon: './build-assets/icons/icon.png'
  };
  electron.remote.dialog.showMessageBox(null, options);
}

// export tickets
async function exportTickets(tickets) {
  // open to documents path by default
  var documentsPath = path.resolve(electron.remote.app.getPath("documents"), path.basename(`${window.tryTranslate('Tickets')}.csv`));

  var formattedTickets = [];
  for (var ticket of tickets) {
    let formattedTicket = {};
    // generic product information
    formattedTicket[window.tryTranslate("Product Name")] = ticket.name || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Seat")] = ticket.size || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Image URL")] = ticket.imageURL || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Notes")] = ticket.notes || window.tryTranslate("N/A");
    // sale information
    formattedTicket[window.tryTranslate("Sale Price")] = ticket.sale.price || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Fees")] = ticket.sale.fees.amount ? ((ticket.sale.fees.amount + (ticket.sale.fees.isPercent ? "%" : 0)) || window.tryTranslate("N/A")) : window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Platform")] = ticket.sale.platform || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Sold Date")] = ticket.sale.date || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Sale Tracking Number")] = ticket.sale.tracking.number || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Sale Tracking Carrier")] = ticket.sale.tracking.carrier == "unselected" ? window.tryTranslate("N/A") : window.trackingAPI.getCarrierDisplayName(ticket.purchase.tracking.carrier);
    // purchase information
    formattedTicket[window.tryTranslate("Purchase Price")] = ticket.purchase.price || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Estimated Resell")] = ticket.purchase.estimatedResell || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Store")] = ticket.purchase.store || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Purchase Date")] = ticket.purchase.date || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Purchase Tracking Number")] = ticket.purchase.tracking.number || window.tryTranslate("N/A");
    formattedTicket[window.tryTranslate("Purchase Tracking Carrier")] = ticket.purchase.tracking.carrier == "unselected" ? window.tryTranslate("N/A") : window.trackingAPI.getCarrierDisplayName(ticket.purchase.tracking.carrier);
    // extra
    formattedTicket[window.tryTranslate("Currency")] = window.companionSettings.currency || "USD";
    formattedTickets.push(formattedTicket);
  }

  // get file path
  const result = await electron.remote.dialog.showSaveDialog({
    defaultPath: documentsPath,
    filters: [{ name: window.tryTranslate('Excel Spreadsheet'), extensions:["csv"] }]
  });
  if (result.canceled) return;

  // save to csv
  await exportObjects(formattedTickets, result.filePath);

  // show success message box
  const options = {
    type: 'none',
    buttons: [window.tryTranslate('Okay')],
    defaultId: 0,
    title: `Resell Companion - ${window.tryTranslate('Hooray!')}`,
    message: window.tryTranslate("Your tickets have been exported!"),
    detail: `${window.tryTranslate("Exported to")}: ${result.filePath}`,
    icon: './build-assets/icons/icon.png'
  };
  electron.remote.dialog.showMessageBox(null, options);
}
// import tickets
async function importTickets(tickets) {
  // open to documents path by default
  var documentsPath = path.resolve(electron.remote.app.getPath("documents"), path.basename(`${window.tryTranslate('Tickets')}.csv`));

  // get file path
  const result = await electron.remote.dialog.showOpenDialog({
    defaultPath: documentsPath,
    filters: [{ name: window.tryTranslate('Excel Spreadsheet'), extensions:["csv"] }],
    properties: ['openFile']
  });
  if (result.canceled || result.filePaths.length == 0) return;

  // format objects to csv
  let formattedObjects = await formatObjectsFromCSV('tickets', result.filePaths[0]);

  if (formattedObjects === false) {
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

  // import tickets
  for (var formattedObject of formattedObjects) {
    tickets.push(formattedObject);
    window.frames['analytics-frame'].frames['tickets-subpage'].refreshTracking(tickets.length-1, true);
  }
  window.frames['analytics-frame'].frames['tickets-subpage'].refreshTicketsSearch();

  // show success message box
  const options = {
    type: 'none',
    buttons: [window.tryTranslate('Okay')],
    defaultId: 0,
    title: `Resell Companion - ${window.tryTranslate('Hooray!')}`,
    message: window.tryTranslate("Your tickets have been imported!"),
    detail: `${window.tryTranslate("Imported from")}: ${result.filePaths[0]}`,
    icon: './build-assets/icons/icon.png'
  };
  electron.remote.dialog.showMessageBox(null, options);
}

// export cards
async function exportCards(cards) {
  // open to documents path by default
  var documentsPath = path.resolve(electron.remote.app.getPath("documents"), path.basename(`${window.tryTranslate('Cards')}.csv`));

  var formattedCards = [];
  for (var card of cards) {
    let formattedCard = {};
    // generic product information
    formattedCard[window.tryTranslate("Product Name")] = card.name || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Grade")] = card.size || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Image URL")] = card.imageURL || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Notes")] = card.notes || window.tryTranslate("N/A");
    // sale information
    formattedCard[window.tryTranslate("Sale Price")] = card.sale.price || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Fees")] = card.sale.fees.amount ? ((card.sale.fees.amount + (card.sale.fees.isPercent ? "%" : 0)) || window.tryTranslate("N/A")) : window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Platform")] = card.sale.platform || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Sold Date")] = card.sale.date || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Sale Tracking Number")] = card.sale.tracking.number || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Sale Tracking Carrier")] = card.sale.tracking.carrier == "unselected" ? window.tryTranslate("N/A") : window.trackingAPI.getCarrierDisplayName(card.purchase.tracking.carrier);
    // purchase information
    formattedCard[window.tryTranslate("Purchase Price")] = card.purchase.price || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Estimated Resell")] = card.purchase.estimatedResell || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Store")] = card.purchase.store || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Purchase Date")] = card.purchase.date || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Purchase Tracking Number")] = card.purchase.tracking.number || window.tryTranslate("N/A");
    formattedCard[window.tryTranslate("Purchase Tracking Carrier")] = card.purchase.tracking.carrier == "unselected" ? window.tryTranslate("N/A") : window.trackingAPI.getCarrierDisplayName(card.purchase.tracking.carrier);
    // extra
    formattedCard[window.tryTranslate("Currency")] = window.companionSettings.currency || "USD";
    formattedCards.push(formattedCard);
  }

  // get file path
  const result = await electron.remote.dialog.showSaveDialog({
    defaultPath: documentsPath,
    filters: [{ name: window.tryTranslate('Excel Spreadsheet'), extensions:["csv"] }]
  });
  if (result.canceled) return;

  // save to csv
  await exportObjects(formattedCards, result.filePath);

  // show success message box
  const options = {
    type: 'none',
    buttons: [window.tryTranslate('Okay')],
    defaultId: 0,
    title: `Resell Companion - ${window.tryTranslate('Hooray!')}`,
    message: window.tryTranslate("Your cards have been exported!"),
    detail: `${window.tryTranslate("Exported to")}: ${result.filePath}`,
    icon: './build-assets/icons/icon.png'
  };
  electron.remote.dialog.showMessageBox(null, options);
}
// import cards
async function importCards(cards) {
  // open to documents path by default
  var documentsPath = path.resolve(electron.remote.app.getPath("documents"), path.basename(`${window.tryTranslate('Cards')}.csv`));

  // get file path
  const result = await electron.remote.dialog.showOpenDialog({
    defaultPath: documentsPath,
    filters: [{ name: window.tryTranslate('Excel Spreadsheet'), extensions:["csv"] }],
    properties: ['openFile']
  });
  if (result.canceled || result.filePaths.length == 0) return;

  // format objects to csv
  let formattedObjects = await formatObjectsFromCSV('cards', result.filePaths[0]);

  if (formattedObjects === false) {
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

  // import cards
  for (var formattedObject of formattedObjects) {
    cards.push(formattedObject);
    window.frames['analytics-frame'].frames['cards-subpage'].refreshTracking(cards.length-1, true);
  }
  window.frames['analytics-frame'].frames['cards-subpage'].refreshCardsSearch();

  // show success message box
  const options = {
    type: 'none',
    buttons: [window.tryTranslate('Okay')],
    defaultId: 0,
    title: `Resell Companion - ${window.tryTranslate('Hooray!')}`,
    message: window.tryTranslate("Your cards have been imported!"),
    detail: `${window.tryTranslate("Imported from")}: ${result.filePaths[0]}`,
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
        trimObjKeys(data);
        try {
          switch (type) {
            case 'sales':
              // validate import data columns is correct
              if (
                // generic product information
                data[window.tryTranslate("Product Name")] == null ||
                data[window.tryTranslate("Color")] == null ||
                data[window.tryTranslate("Style Code")] == null ||
                data[window.tryTranslate("Size")] == null ||
                data[window.tryTranslate("Image URL")] == null ||
                data[window.tryTranslate("Notes")] == null ||
                // sale information
                data[window.tryTranslate("Sale Price")] == null ||
                data[window.tryTranslate("Fees")] == null ||
                data[window.tryTranslate("Platform")] == null ||
                data[window.tryTranslate("Sold Date")] == null ||
                data[window.tryTranslate("Sale Tracking Number")] == null ||
                data[window.tryTranslate("Sale Tracking Carrier")] == null ||
                // purchase information
                data[window.tryTranslate("Purchase Price")] == null ||
                data[window.tryTranslate("Estimated Resell")] == null ||
                data[window.tryTranslate("Store")] == null ||
                data[window.tryTranslate("Purchase Date")] == null ||
                data[window.tryTranslate("Purchase Tracking Number")] == null ||
                data[window.tryTranslate("Purchase Tracking Carrier")] == null ||
                // extra
                data[window.tryTranslate("Currency")] == null
              ) resolve(false);

              // format sale
              let formattedSale = {
                // TODO: add implementation
                name: data[window.tryTranslate("Product Name")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Product Name")],
                color: data[window.tryTranslate("Color")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Color")],
                styleCode: data[window.tryTranslate("Style Code")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Style Code")],
                size: data[window.tryTranslate("Size")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Size")],
                imageURL: data[window.tryTranslate("Image URL")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Image URL")],
                notes: data[window.tryTranslate("Notes")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Notes")],
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
                  price: data[window.tryTranslate("Purchase Price")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Purchase Price")]),
                  estimatedResell: data[window.tryTranslate("Estimated Resell")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Estimated Resell")]),
                  store: data[window.tryTranslate("Store")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Store")],
                  date: data[window.tryTranslate("Purchase Date")] == window.tryTranslate("N/A") ? "1999-01-26" : data[window.tryTranslate("Purchase Date")],
                  tracking: {
                    number: data[window.tryTranslate("Purchase Tracking Number")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Purchase Tracking Number")],
                    carrier: data[window.tryTranslate("Purchase Tracking Carrier")] == window.tryTranslate("N/A") ? "unselected" : window.trackingAPI.getCarrierID(data[window.tryTranslate("Purchase Tracking Carrier")]),
                    isTracking: false,
                    details: {}
                  }
                },
                sale: {
                  price: data[window.tryTranslate("Sale Price")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Sale Price")]),
                  fees: {
                    amount: data[window.tryTranslate("Fees")] == window.tryTranslate("N/A") ? null : window.getNumberFromString(data[window.tryTranslate("Fees")]),
                    isPercent: data[window.tryTranslate("Fees")].includes("%")
                  },
                  platform: data[window.tryTranslate("Platform")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Platform")],
                  date: data[window.tryTranslate("Sold Date")] == window.tryTranslate("N/A") ? "1999-01-26" : data[window.tryTranslate("Sold Date")],
                  tracking: {
                    number: data[window.tryTranslate("Sale Tracking Number")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Sale Tracking Number")],
                    carrier: data[window.tryTranslate("Sale Tracking Carrier")] == window.tryTranslate("N/A") ? "unselected" : window.trackingAPI.getCarrierID(data[window.tryTranslate("Sale Tracking Carrier")]),
                    isTracking: false,
                    details: {}
                  }
                },
                quantity: 1,
                selected: true,
                isHovering: false,
                id: window.makeid(10) // assign a new id to each sale
              };
              // push to array
              outObjArry.push(formattedSale);
              break;
            case 'inventory':
              // validate import data columns is correct
              if (
                // generic product information
                data[window.tryTranslate("Product Name")] == null ||
                data[window.tryTranslate("Color")] == null ||
                data[window.tryTranslate("Style Code")] == null ||
                data[window.tryTranslate("Size")] == null ||
                data[window.tryTranslate("Image URL")] == null ||
                data[window.tryTranslate("Notes")] == null ||
                // purchase information
                data[window.tryTranslate("Purchase Price")] == null ||
                data[window.tryTranslate("Estimated Resell")] == null ||
                data[window.tryTranslate("Store")] == null ||
                data[window.tryTranslate("Purchase Date")] == null ||
                data[window.tryTranslate("Purchase Tracking Number")] == null ||
                data[window.tryTranslate("Purchase Tracking Carrier")] == null ||
                // extra
                data[window.tryTranslate("Currency")] == null
              ) resolve(false);

              // format inventory item
              let formattedInventoryItem = {
                // TODO: add implementation
                name: data[window.tryTranslate("Product Name")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Product Name")],
                color: data[window.tryTranslate("Color")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Color")],
                styleCode: data[window.tryTranslate("Style Code")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Style Code")],
                size: data[window.tryTranslate("Size")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Size")],
                imageURL: data[window.tryTranslate("Image URL")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Image URL")],
                notes: data[window.tryTranslate("Notes")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Notes")],
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
                  price: data[window.tryTranslate("Purchase Price")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Purchase Price")]),
                  estimatedResell: data[window.tryTranslate("Estimated Resell")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Estimated Resell")]),
                  store: data[window.tryTranslate("Store")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Store")],
                  date: data[window.tryTranslate("Purchase Date")] == window.tryTranslate("N/A") ? "1999-01-26" : data[window.tryTranslate("Purchase Date")],
                  tracking: {
                    number: data[window.tryTranslate("Purchase Tracking Number")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Purchase Tracking Number")],
                    carrier: data[window.tryTranslate("Purchase Tracking Carrier")] == window.tryTranslate("N/A") ? "unselected" : window.trackingAPI.getCarrierID(data[window.tryTranslate("Purchase Tracking Carrier")]),
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
                  date: "1999-01-26",
                  tracking: {
                    number: "",
                    carrier: "unselected",
                    isTracking: false,
                    details: {}
                  }
                },
                quantity: 1,
                selected: true,
                isHovering: false,
                id: window.makeid(10) // assign a new id to each inventory item
              };
              // push to array
              outObjArry.push(formattedInventoryItem);
              break;
            case 'subscriptions':
              // validate import data columns is correct
              if (
                // generic product information
                data[window.tryTranslate("Product Name")] == null ||
                data[window.tryTranslate("Membership")] == null ||
                data[window.tryTranslate("Image URL")] == null ||
                data[window.tryTranslate("Notes")] == null ||
                // sale information
                data[window.tryTranslate("Sale Price")] == null ||
                data[window.tryTranslate("Fees")] == null ||
                data[window.tryTranslate("Platform")] == null ||
                data[window.tryTranslate("Sold Date")] == null ||
                data[window.tryTranslate("Sale Tracking Number")] == null ||
                data[window.tryTranslate("Sale Tracking Carrier")] == null ||
                // purchase information
                data[window.tryTranslate("Purchase Price")] == null ||
                data[window.tryTranslate("Estimated Resell")] == null ||
                data[window.tryTranslate("Store")] == null ||
                data[window.tryTranslate("Purchase Date")] == null ||
                data[window.tryTranslate("Purchase Tracking Number")] == null ||
                data[window.tryTranslate("Purchase Tracking Carrier")] == null ||
                // extra
                data[window.tryTranslate("Currency")] == null
              ) resolve(false);

              // format subscription
              let formattedSubscription = {
                // TODO: add implementation
                name: data[window.tryTranslate("Product Name")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Product Name")],
                color: "",
                styleCode: "",
                size: data[window.tryTranslate("Membership")] == window.tryTranslate("N/A") ? "unselected" : getMembershipID(data[window.tryTranslate("Membership")]),
                imageURL: data[window.tryTranslate("Image URL")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Image URL")],
                notes: data[window.tryTranslate("Notes")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Notes")],
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
                  price: data[window.tryTranslate("Purchase Price")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Purchase Price")]),
                  estimatedResell: data[window.tryTranslate("Estimated Resell")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Estimated Resell")]),
                  store: data[window.tryTranslate("Store")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Store")],
                  date: data[window.tryTranslate("Purchase Date")] == window.tryTranslate("N/A") ? "1999-01-26" : data[window.tryTranslate("Purchase Date")],
                  tracking: {
                    number: data[window.tryTranslate("Purchase Tracking Number")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Purchase Tracking Number")],
                    carrier: data[window.tryTranslate("Purchase Tracking Carrier")] == window.tryTranslate("N/A") ? "unselected" : window.trackingAPI.getCarrierID(data[window.tryTranslate("Purchase Tracking Carrier")]),
                    isTracking: false,
                    details: {}
                  }
                },
                sale: {
                  price: data[window.tryTranslate("Sale Price")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Sale Price")]),
                  fees: {
                    amount: data[window.tryTranslate("Fees")] == window.tryTranslate("N/A") ? null : window.getNumberFromString(data[window.tryTranslate("Fees")]),
                    isPercent: data[window.tryTranslate("Fees")].includes("%")
                  },
                  platform: data[window.tryTranslate("Platform")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Platform")],
                  date: data[window.tryTranslate("Sold Date")] == window.tryTranslate("N/A") ? "1999-01-26" : data[window.tryTranslate("Sold Date")],
                  tracking: {
                    number: data[window.tryTranslate("Sale Tracking Number")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Sale Tracking Number")],
                    carrier: data[window.tryTranslate("Sale Tracking Carrier")] == window.tryTranslate("N/A") ? "unselected" : window.trackingAPI.getCarrierID(data[window.tryTranslate("Sale Tracking Carrier")]),
                    isTracking: false,
                    details: {}
                  }
                },
                quantity: 1,
                selected: true,
                isHovering: false,
                id: window.makeid(10) // assign a new id to each sale
              };
              // push to array
              outObjArry.push(formattedSubscription);
              break;
            case 'tickets':
              // validate import data columns is correct
              if (
                // generic product information
                data[window.tryTranslate("Product Name")] == null ||
                data[window.tryTranslate("Seat")] == null ||
                data[window.tryTranslate("Image URL")] == null ||
                data[window.tryTranslate("Notes")] == null ||
                // sale information
                data[window.tryTranslate("Sale Price")] == null ||
                data[window.tryTranslate("Fees")] == null ||
                data[window.tryTranslate("Platform")] == null ||
                data[window.tryTranslate("Sold Date")] == null ||
                data[window.tryTranslate("Sale Tracking Number")] == null ||
                data[window.tryTranslate("Sale Tracking Carrier")] == null ||
                // purchase information
                data[window.tryTranslate("Purchase Price")] == null ||
                data[window.tryTranslate("Estimated Resell")] == null ||
                data[window.tryTranslate("Store")] == null ||
                data[window.tryTranslate("Purchase Date")] == null ||
                data[window.tryTranslate("Purchase Tracking Number")] == null ||
                data[window.tryTranslate("Purchase Tracking Carrier")] == null ||
                // extra
                data[window.tryTranslate("Currency")] == null
              ) resolve(false);

              // format ticket
              let formattedTicket = {
                // TODO: add implementation
                name: data[window.tryTranslate("Product Name")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Product Name")],
                color: "",
                styleCode: "",
                size: data[window.tryTranslate("Seat")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Seat")],
                imageURL: data[window.tryTranslate("Image URL")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Image URL")],
                notes: data[window.tryTranslate("Notes")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Notes")],
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
                  price: data[window.tryTranslate("Purchase Price")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Purchase Price")]),
                  estimatedResell: data[window.tryTranslate("Estimated Resell")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Estimated Resell")]),
                  store: data[window.tryTranslate("Store")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Store")],
                  date: data[window.tryTranslate("Purchase Date")] == window.tryTranslate("N/A") ? "1999-01-26" : data[window.tryTranslate("Purchase Date")],
                  tracking: {
                    number: data[window.tryTranslate("Purchase Tracking Number")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Purchase Tracking Number")],
                    carrier: data[window.tryTranslate("Purchase Tracking Carrier")] == window.tryTranslate("N/A") ? "unselected" : window.trackingAPI.getCarrierID(data[window.tryTranslate("Purchase Tracking Carrier")]),
                    isTracking: false,
                    details: {}
                  }
                },
                sale: {
                  price: data[window.tryTranslate("Sale Price")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Sale Price")]),
                  fees: {
                    amount: data[window.tryTranslate("Fees")] == window.tryTranslate("N/A") ? null : window.getNumberFromString(data[window.tryTranslate("Fees")]),
                    isPercent: data[window.tryTranslate("Fees")].includes("%")
                  },
                  platform: data[window.tryTranslate("Platform")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Platform")],
                  date: data[window.tryTranslate("Sold Date")] == window.tryTranslate("N/A") ? "1999-01-26" : data[window.tryTranslate("Sold Date")],
                  tracking: {
                    number: data[window.tryTranslate("Sale Tracking Number")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Sale Tracking Number")],
                    carrier: data[window.tryTranslate("Sale Tracking Carrier")] == window.tryTranslate("N/A") ? "unselected" : window.trackingAPI.getCarrierID(data[window.tryTranslate("Sale Tracking Carrier")]),
                    isTracking: false,
                    details: {}
                  }
                },
                quantity: 1,
                selected: true,
                isHovering: false,
                id: window.makeid(10) // assign a new id to each ticket
              };
              // push to array
              outObjArry.push(formattedTicket);
              break;
            case 'cards':
              // validate import data columns is correct
              if (
                // generic product information
                data[window.tryTranslate("Product Name")] == null ||
                data[window.tryTranslate("Grade")] == null ||
                data[window.tryTranslate("Image URL")] == null ||
                data[window.tryTranslate("Notes")] == null ||
                // sale information
                data[window.tryTranslate("Sale Price")] == null ||
                data[window.tryTranslate("Fees")] == null ||
                data[window.tryTranslate("Platform")] == null ||
                data[window.tryTranslate("Sold Date")] == null ||
                data[window.tryTranslate("Sale Tracking Number")] == null ||
                data[window.tryTranslate("Sale Tracking Carrier")] == null ||
                // purchase information
                data[window.tryTranslate("Purchase Price")] == null ||
                data[window.tryTranslate("Estimated Resell")] == null ||
                data[window.tryTranslate("Store")] == null ||
                data[window.tryTranslate("Purchase Date")] == null ||
                data[window.tryTranslate("Purchase Tracking Number")] == null ||
                data[window.tryTranslate("Purchase Tracking Carrier")] == null ||
                // extra
                data[window.tryTranslate("Currency")] == null
              ) resolve(false);

              // format card
              let formattedCard = {
                // TODO: add implementation
                name: data[window.tryTranslate("Product Name")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Product Name")],
                color: "",
                styleCode: "",
                size: data[window.tryTranslate("Grade")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Grade")],
                imageURL: data[window.tryTranslate("Image URL")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Image URL")],
                notes: data[window.tryTranslate("Notes")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Notes")],
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
                  price: data[window.tryTranslate("Purchase Price")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Purchase Price")]),
                  estimatedResell: data[window.tryTranslate("Estimated Resell")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Estimated Resell")]),
                  store: data[window.tryTranslate("Store")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Store")],
                  date: data[window.tryTranslate("Purchase Date")] == window.tryTranslate("N/A") ? "1999-01-26" : data[window.tryTranslate("Purchase Date")],
                  tracking: {
                    number: data[window.tryTranslate("Purchase Tracking Number")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Purchase Tracking Number")],
                    carrier: data[window.tryTranslate("Purchase Tracking Carrier")] == window.tryTranslate("N/A") ? "unselected" : window.trackingAPI.getCarrierID(data[window.tryTranslate("Purchase Tracking Carrier")]),
                    isTracking: false,
                    details: {}
                  }
                },
                sale: {
                  price: data[window.tryTranslate("Sale Price")] == window.tryTranslate("N/A") ? null : Number(data[window.tryTranslate("Sale Price")]),
                  fees: {
                    amount: data[window.tryTranslate("Fees")] == window.tryTranslate("N/A") ? null : window.getNumberFromString(data[window.tryTranslate("Fees")]),
                    isPercent: data[window.tryTranslate("Fees")].includes("%")
                  },
                  platform: data[window.tryTranslate("Platform")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Platform")],
                  date: data[window.tryTranslate("Sold Date")] == window.tryTranslate("N/A") ? "1999-01-26" : data[window.tryTranslate("Sold Date")],
                  tracking: {
                    number: data[window.tryTranslate("Sale Tracking Number")] == window.tryTranslate("N/A") ? "" : data[window.tryTranslate("Sale Tracking Number")],
                    carrier: data[window.tryTranslate("Sale Tracking Carrier")] == window.tryTranslate("N/A") ? "unselected" : window.trackingAPI.getCarrierID(data[window.tryTranslate("Sale Tracking Carrier")]),
                    isTracking: false,
                    details: {}
                  }
                },
                quantity: 1,
                selected: true,
                isHovering: false,
                id: window.makeid(10) // assign a new id to each card
              };
              // push to array
              outObjArry.push(formattedCard);
              break;
          }
        } catch(err) {
          console.error(err);
          resolve(false);
          return;
        }
      })
      .on('end', function() {
        resolve(outObjArry);
      });
  });
}

function trimObjKeys(object) {
  for (var key in object) object[key.trim()] = object[key];
}

function getMembershipID(displayedMembership) {
  if (window.tryTranslate('Lifetime') == displayedMembership) return 'lifetime';
  else if (window.tryTranslate('Weekly') == displayedMembership) return '1week';
  else if (window.tryTranslate('Monthly') == displayedMembership) return '1month';
  else if (window.tryTranslate('Every 2 Months') == displayedMembership) return '2month';
  else if (window.tryTranslate('Every 3 Months') == displayedMembership) return '3month';
  else if (window.tryTranslate('Every 3 Months') == displayedMembership) return '5month';
  else if (window.tryTranslate('Biyearly') == displayedMembership) return '6month';
  else if (window.tryTranslate('Yearly') == displayedMembership) return '1year';
  else if (window.tryTranslate('Every 2 Years') == displayedMembership) return '2year';
  else if (window.tryTranslate('Every 3 Years') == displayedMembership) return '3year';
  else return 'unselected';
}

function getDisplayedMembership(membership) {
  switch (membership) {
    case 'unselected':
      return 'N/A';
    case 'lifetime':
      return 'Lifetime';
    case '1week':
      return 'Weekly';
    case '1month':
      return 'Monthly';
    case '2month':
      return 'Every 2 Months';
    case '3month':
      return 'Every 3 Months';
    case '5month':
      return 'Every 5 Months';
    case '6month':
      return 'Biyearly';
    case '1year':
      return 'Yearly';
    case '2year':
      return 'Every 2 Years';
    case '3year':
      return 'Every 3 Years';
  }
  return 'N/A';
}

module.exports = {
  exportItems: exportItems,
  importItems: importItems
};
