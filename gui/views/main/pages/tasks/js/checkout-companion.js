const WORDS_PER_MINUTE = 280;
const VALIDATE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function initiateCheckoutCompanion (node, product, variant, billingProfile = null, proxy = null) {
  window.setNodeStatus(node, "orange", "Initializing Checkout Session... (1/3)");
  node.checkoutWindow = window.launchCheckout(product, variant, false, proxy, false);
  node.checkoutWindow.once('ready-to-show', () => {
    // node.checkoutWindow.show(); // show to visualize checkout (keep false in production)
    window.setNodeStatus(node, "orange", "Inputting billing details... (2/3)");
  });
  node.checkoutWindow.once('closed', () => {
    window.setNodeStatus(node, "red", "Checkout Canceled");
    node.checkoutWindow = null;
    node.enabled = false;
  });
  node.checkoutWindow.webContents.on('dom-ready', async () => {
    // disable select menu visibility to prevent leaking
    node.checkoutWindow.webContents.insertCSS('select option { display: none; }');
    node.checkoutWindow.webContents.insertCSS('select { visibility: hidden; }');

    var testProfile = {
      // settings: {
      //   autoCheckout: false,
      //   autoCheckoutDelay: null,
      //   simulateTyping: false
      // },
      autofillInformation: {
        firstName: "Charles",
        lastName: "Emanuel",
        email: "ce@gmail.com",
        phoneNumber: "4079028902",
        address: "385 Caddie Drive",
        unit: "",
        zipCode: "32713",
        city: "DeBary",
        state: "Florida",
        country: "United States",
        // billing: {
        //   cardNumber: "",
        //   cardType: "",
        //   expirationDateFull: "",
        //   expirationDate: {
        //     month: "",
        //     year: ""
        //   },
        //   cvc: ""
        // }
      }
    };

    // TODO: make another function based on if it is supreme or shopify -> then run fillField based on that.
    // TODO: make new browser session per checkout
    // TODO: check current step w/ getCurrentCheckoutStep() IF SHOPIFY ONLY
    // TODO: detect if item is OOS (display status)

    // TODO: add ALL possible element queries (look at shopify.js from extension)
    // TODO: disable check for "keep me updated" and extra billing shiz at end (look at extension)
    await fillField(node, "#checkout_shipping_address_first_name", testProfile.autofillInformation.firstName);
    await fillField(node, "#checkout_shipping_address_last_name", testProfile.autofillInformation.lastName);
    await fillField(node, "#checkout_shipping_address_address1", testProfile.autofillInformation.address);
    await fillField(node, "#checkout_shipping_address_address2", testProfile.autofillInformation.unit);
    await fillField(node, "#checkout_shipping_address_city", testProfile.autofillInformation.city);
    await fillField(node, "#checkout_shipping_address_country", testProfile.autofillInformation.country);
    await fillField(node, "#checkout_shipping_address_province", testProfile.autofillInformation.state);
    await fillField(node, "#checkout_shipping_address_zip ", testProfile.autofillInformation.zipCode);
    await fillField(node, "#checkout_shipping_address_phone", testProfile.autofillInformation.phoneNumber);
    await fillField(node, "#checkout_email", testProfile.autofillInformation.email);
    await clickField(node, "#checkout_buyer_accepts_marketing"); // disable email marketing notifications from store
    // TODO: detect captcha and send it to client w/ sitekey (look for hidden recaptcha input form box)
    // TODO: wait for button to be ready to clicked on (after calculating taxes/billing information inputted (with this method you probably dont need to wait after inputting billing info) )
    await clickField(node, ".step__footer__continue-btn"); // disable email marketing notifications from store
  });

  // TODO: figure out a better way to detect status? or just inject a script that logs as below as soon as it detects the status shits
  node.checkoutWindow.webContents.on('console-message', (event, level, message, line, sourceID) => {
    // MESSAGE TEMPLATE: ${CC} <message>
    if (!message.startsWith("${CC}")) return;
    if (message.includes("SUBMITTING DETAILS")) window.setNodeStatus(node, "orange", "Submitting billing details... (3/3)");
    else if (message.includes("CHECKOUT SUCCESSFUL")) window.setNodeStatus(node, "green", `Successfully Checked Out (${variant.Name})`);
    else if (message.includes("CARD DECLINED")) window.setNodeStatus(node, "red", `Card Declined (${variant.Name})`); // TODO: add retry feature
  });

  // TODO: send notification
}

async function getCurrentCheckoutStep(node) {
  return await node.checkoutWindow.webContents.executeJavaScript(`
    (() => {
      var curStep = "";
      try {
        if (location.href.includes("&step=")) {
          curStep = location.href.substring(
            location.href.indexOf('&step=') + '&step='.length,
            location.href.length
          );
          curStep = outCheckoutToken.substring(
            0,
            outCheckoutToken.indexOf("&") || outCheckoutToken.length
          ).replace(/(\\r\\n|\\n|\\r)/gm,"").replace(" ", "");
        } else if (location.href.includes("?step=")) {
          curStep = location.href.substring(
            location.href.indexOf('?step=') + '?step='.length,
            location.href.length
          );
          curStep = outCheckoutToken.substring(
            0,
            outCheckoutToken.indexOf("&") || outCheckoutToken.length
          ).replace(/(\\r\\n|\\n|\\r)/gm,"").replace(" ", "");
        } else {
          curStep = document.querySelector('[data-step]').dataset.step;
        }
      } catch(err) {
        return curStep
      }
      return curStep
    })();`, true);
};

async function fillField(node, elementQuery, value, resetField = false) {
  // console.log(`START typing for: ${elementQuery} (${value})`);

  let shouldSendInput = await node.checkoutWindow.webContents.executeJavaScript(`
    fieldElement = document.querySelector("${elementQuery}");
    (() => {
      if (typeof fieldElement === 'undefined' || !fieldElement) return;
      if (${resetField}) fieldElement.value = "";
      return fieldElement.value.length == 0 || fieldElement.tagName == 'SELECT';
    })();`, true);
  if (!shouldSendInput) return;

  await clickField(node, elementQuery);

  for (var char of value) {
    node.checkoutWindow.webContents.sendInputEvent({ type: 'char', keyCode: char });
    await window.parent.sleep(getTypingTimeout());
  }

  let fieldElementDetails = await getFieldDetails(node, elementQuery);
  if (fieldElementDetails.tagName != 'SELECT' && !validateValues(fieldElementDetails.value, value)) await fillField(node, elementQuery, value, true);

  // console.log(`END typing for: ${elementQuery} (${value})`);
};

async function clickField(node, elementQuery) {
  let fieldElementDetails = await getFieldDetails(node, elementQuery, true);
  if (!fieldElementDetails) return;
  let mousePos = { x: Math.floor(fieldElementDetails.position.x + (fieldElementDetails.position.width/2)), y: Math.floor(fieldElementDetails.position.y + (fieldElementDetails.position.height/2)) };
  node.checkoutWindow.webContents.sendInputEvent({ type: 'mouseMove', x: mousePos.x, y: mousePos.y });
  await window.parent.sleep(10);
  node.checkoutWindow.webContents.sendInputEvent({ type: 'mouseEnter', x: mousePos.x, y: mousePos.y });
  await window.parent.sleep(10);
  node.checkoutWindow.webContents.sendInputEvent({ type: 'mouseDown', button: "left", clickCount: 1,  x: mousePos.x, y: mousePos.y });
  await window.parent.sleep(10);
  node.checkoutWindow.webContents.sendInputEvent({ type: 'mouseUp', button: "left", clickCount: 1, x: mousePos.x, y: mousePos.y });
};

async function getFieldDetails(node, elementQuery, scrollTo = false) {
  return await node.checkoutWindow.webContents.executeJavaScript(`
    fieldElement = document.querySelector("${elementQuery}");
    (() => {
      if (typeof fieldElement === 'undefined' || !fieldElement) return;
      if (${scrollTo}) fieldElement.scrollIntoView(false);
      fieldElementPosition = fieldElement.getBoundingClientRect();
      return { tagName: fieldElement.tagName, value: fieldElement.value, position: { x: fieldElementPosition.x, y: fieldElementPosition.y, width: fieldElementPosition.width, height: fieldElementPosition.height } };
    })();`, true);
};

function validateValues(incomingValue, expectedValue) {
  let formattedIncomingValue = "";
  let formattedExpectedValue = "";
  for (var char of incomingValue) for (var validChar of VALIDATE_CHARS) if (char == validChar) formattedIncomingValue += validChar;
  for (var char of expectedValue) for (var validChar of VALIDATE_CHARS) if (char == validChar) formattedExpectedValue += validChar;
  return formattedIncomingValue == formattedExpectedValue;
};

function getTypingTimeout() {
  return Math.floor(1000 / (WORDS_PER_MINUTE * 5 / 60));
};
