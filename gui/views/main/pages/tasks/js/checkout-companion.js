const WORDS_PER_MINUTE = 280;
const VALIDATE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function initiateCheckoutCompanion(node, product, variant, billingProfile = null, proxy = null) {
  node.host = product.Store;
  window.setNodeStatus(node, "orange", "Initializing Checkout Session... (1/3)");
  node.checkoutWindow = window.launchCheckout(product, variant, false, proxy, false);
  node.checkoutWindow.once('ready-to-show', () => {
    node.checkoutWindow.show(); // show to visualize checkout (keep false in production)
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
    node.checkoutWindow.webContents.insertCSS('select { visibility: hidden; }');

    var testProfile = {
      settings: {
        autoCheckout: true,
        autoCheckoutDelay: 450,
        simulateTyping: true
      },
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
        billing: {
          cardNumber: "4242424242424242",
          cardType: "Visa",
          expirationDateFull: "06/27",
          expirationDate: {
            month: "06",
            year: "27"
          },
          cvc: "285"
        }
      }
    };



    if (product.Identifier == "shopify") beginShopifyCheckout(node, testProfile);
    else if (product.Identifier.startsWith("supreme")) beginSupremeCheckout(node, testProfile);
  });

  // TODO: figure out a better way to detect status?
  // or just inject a script that logs as below as soon as it detects the status shits
  node.checkoutWindow.webContents.on('console-message', (event, level, message, line, sourceID) => {
    // MESSAGE TEMPLATE: ${CC} <message>
    if (!message.startsWith("${CC}")) return;
    if (message.includes("CHECKOUT SUCCESSFUL")) window.setNodeStatus(node, "green", `Successfully Checked Out (${variant.Name})`);
    else if (message.includes("CARD DECLINED")) window.setNodeStatus(node, "red", `Card Declined (${variant.Name})`); // TODO: add retry feature
    else if (message.includes("CAPTCHA RESPONSE")) node.captchaResponse = message.split("${CC} CAPTCHA RESPONSE: ")[1];
  });

  // TODO: send notification on CHECKOUT SUCCESSFUL
}

async function beginSupremeCheckout(node, billingProfile) {

};

async function beginShopifyCheckout(node, billingProfile) {
  // TODO: detect if item is OOS (display status and return)
  // check current checkout step to provide correct actions/fields to fill
  let currentCheckoutStep = await getCurrentCheckoutStep(node);
  if (currentCheckoutStep == 'contact_information') {
    // main autofill information fields
    await fillField(node, '#checkout_shipping_address_first_name', billingProfile.autofillInformation.firstName);
    await fillField(node, '#checkout_shipping_address_last_name', billingProfile.autofillInformation.lastName);
    await fillField(node, '#checkout_shipping_address_address1', billingProfile.autofillInformation.address);
    await fillField(node, '#checkout_shipping_address_address2', billingProfile.autofillInformation.unit);
    await fillField(node, '#checkout_shipping_address_city', billingProfile.autofillInformation.city);
    await fillField(node, '#checkout_shipping_address_country', billingProfile.autofillInformation.country);
    await fillField(node, '#checkout_shipping_address_province', billingProfile.autofillInformation.state);
    await fillField(node, '#checkout_shipping_address_zip ', billingProfile.autofillInformation.zipCode);
    await fillField(node, '#checkout_shipping_address_phone', billingProfile.autofillInformation.phoneNumber);

    // several possible email field queries
    await fillField(node, '#checkout_email', billingProfile.autofillInformation.email);
    await fillField(node, '#checkout_email_or_phone', billingProfile.autofillInformation.email);
    await fillField(node, '[name="checkout[email_or_phone]"]', billingProfile.autofillInformation.email);
    await fillField(node, '[name="checkout[email]"]', billingProfile.autofillInformation.email);

    // disable email marketing notifications from store
    await clickField(node, '#checkout_buyer_accepts_marketing');
  } else if (currentCheckoutStep == 'payment_method') {
    // TODO: type card information

    // enable use same address as shipping (disables need to type fields below)
    await clickField(node, '#checkout_different_billing_address_false');

    // POSSIBLE billing autofill information fields (not all stores have this extra set of fields)
    await fillField(node, '#checkout_billing_address_first_name', billingProfile.autofillInformation.firstName);
    await fillField(node, '#checkout_billing_address_last_name', billingProfile.autofillInformation.lastName);
    await fillField(node, '#checkout_billing_address_address1', billingProfile.autofillInformation.address);
    await fillField(node, '#checkout_billing_address_address2', billingProfile.autofillInformation.unit);
    await fillField(node, '#checkout_billing_address_city', billingProfile.autofillInformation.city);
    await fillField(node, '#checkout_billing_address_country', billingProfile.autofillInformation.country);
    await fillField(node, '#checkout_billing_address_province', billingProfile.autofillInformation.state);
    await fillField(node, '#checkout_billing_address_zip ', billingProfile.autofillInformation.zipCode);
    await fillField(node, '#checkout_billing_address_phone', billingProfile.autofillInformation.phoneNumber);
  }

  // detect captcha and send it to client w/ sitekey
  if (await hasCaptcha(node)) {
    addCaptchaListener(node);
    window.setNodeStatus(node, "orange", "Waiting for Captcha Response... (2/3)");
    // export captcha sitekey from checkout page
    node.captchaSiteKey = await getCaptchaSiteKey(node);
    // open solver on resell companion for captcha
    // TODO: try to use an unused captcha solver if some are already opened (make a new function that loops through all captcha solvers and if none are attached to a node, then just populate that captcha solver w/ the captcha details etc.)
    window.openCaptchaSolver(node, node.host, node.captchaSiteKey);
    while (!node.captchaResponse || node.captchaResponse.length == 0) await window.parent.sleep(50);
    // inject solved captcha response (from resell companion) into checkout page (injects to hidden #g-recaptcha-response textarea)
    await injectCaptchaResponse(node, node.captchaResponse);
    node.captchaResponse = undefined;
  }

  // TODO: wait for button to be ready to clicked on (after calculating taxes/billing information inputted (with this method you probably dont need to wait after inputting billing info) )

  // continue to next page
  await clickField(node, '.step__footer__continue-btn');
  if (currentCheckoutStep == 'payment_method') window.setNodeStatus(node, "orange", "Submitting billing details... (3/3)");
};

async function getCaptchaSiteKey(node) {
  return await node.checkoutWindow.webContents.executeJavaScript(`
    (() => {
      if (document.querySelector(".g-recaptcha").dataset.sitekey) return document.querySelector(".g-recaptcha").dataset.sitekey;
      else for (var script of document.querySelectorAll("script")) if (script.text.includes("sitekey:")) return script.text.split("sitekey:")[1].split(",")[0].replace(new RegExp('"', 'g'), '').trim();
    })();`, true);
};

async function injectCaptchaResponse(node, captchaResponse) {
  await node.checkoutWindow.webContents.executeJavaScript(`
    document.querySelector("#g-recaptcha-response").value = "${captchaResponse}";
    `, true);
};

async function hasCaptcha(node) {
  return await node.checkoutWindow.webContents.executeJavaScript(`
    document.querySelector("#g-recaptcha-response") ? true : false;
    `, true);
};

function addCaptchaListener(node) {
  node.checkoutWindow.webContents.executeJavaScript(`
    (async () => {
      let captchaResponseElement = document.querySelector("#g-recaptcha-response");
      if (!captchaResponseElement) return;
      function captchaSleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      let previousCaptchaResponse = "";
      while (true) {
        if (captchaResponseElement.value != previousCaptchaResponse) {
          console.log("\${CC} CAPTCHA RESPONSE: " + captchaResponseElement.value);
          previousCaptchaResponse = captchaResponseElement.value;
        }
        await captchaSleep(50);
      }
    })();`, true);
};

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
    fieldElement = document.querySelector('${elementQuery}');
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

async function clickField(node, elementQuery) { // TODO: mess with sleep timing
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
    fieldElement = document.querySelector('${elementQuery}');
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
