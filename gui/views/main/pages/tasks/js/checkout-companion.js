const WORDS_PER_MINUTE = 1000; // 420
const VALIDATE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const PAYMENT_FIELDS = [
  '[data-card-fields="number"]',
  '[data-card-fields="name"]',
  '[data-card-fields="expiry"]',
  '[data-card-fields="verification_value"]'
];

async function initiateCheckoutCompanion(node, product, variant, billingProfile = null, proxy = null, overrideURL = "") {
  // proxy = "207.229.93.66:1074";
  node.host = product.Store;
  node.stepsInitialized = {};
  node.paymentFieldsInitialized = {};
  node.retryNum = 0;
  node.maxRetries = 3;
  window.setNodeStatus(node, "orange", `${window.parent.tryTranslate('Initializing Checkout Session...')} (1/3)`);
  node.checkoutWindow = await window.launchCheckout(product, variant, false, proxy, false, overrideURL = "");
  node.checkoutWindow.once('ready-to-show', () => {
    // node.checkoutWindow.show(); // DEV ONLY: show to visualize checkout (keep false in production)
    window.setNodeStatus(node, "orange", `${window.parent.tryTranslate('Inputting Billing Details...')} (2/3)`);
  });
  node.checkoutWindow.once('closed', () => {
    window.tasksApp.toggleNodeEnabled(node, false, true);
  });
  node.checkoutWindow.webContents.on('will-navigate', () => {
    node.DOMReady = false;
  });
  // TODO: does 'did-finish-load' run faster than 'dom-ready'?
  node.checkoutWindow.webContents.on('dom-ready', async () => { // TODO: figure out why this function begins but typing starts WAY AFTER (maybe JS execution bridge needs to wait to be initialized? i have no idea)
    node.DOMReady = true;
    // disable select menu visibility to prevent leaking
    node.checkoutWindow.webContents.insertCSS('select option { display: none; }');
    node.checkoutWindow.webContents.insertCSS('select { visibility: hidden; }');
    node.checkoutWindow.webContents.insertCSS('select { visibility: hidden; }');

    if (product.Identifier == "shopify" || product.Identifier == "cpfm") beginShopifyCheckout(node, billingProfile, variant);
    else if (product.Identifier.startsWith("supreme")) beginSupremeCheckout(node, billingProfile, variant);
  });
  node.checkoutWindow.webContents.on('console-message', (event, level, message, line, sourceID) => {
    // MESSAGE TEMPLATE: ${CC} <message>
    if (!message.startsWith("${CC}")) return;
    if (message.includes("CAPTCHA RESPONSE")) node.captchaResponse = message.split("${CC} CAPTCHA RESPONSE: ")[1];
    else if (message.includes("CONTINUE BUTTON READY")) node.stepsInitialized[node.currentCheckoutStep] = true;
    else if (message.includes("PAYMENT FIELD READY: ")) node.paymentFieldsInitialized[message.split("${CC} PAYMENT FIELD READY: ")[1]] = true;
  });
}

async function beginSupremeCheckout(node, billingProfile, variant) {
  // check current checkout step to provide correct actions/fields to fill
  node.currentCheckoutStep = await getCurrentCheckoutStep('supreme', node);
  switch (node.currentCheckoutStep) {
    case 'stock_problems': // detect if item is OOS // TODO: ADD DETECTION FOR THIS. (THIS IS WHEN IT IS AT THE CART BEFORE TYPING IN INFO.)
      window.tasksApp.toggleNodeEnabled(node, false, true, { color: "red", description: `${window.parent.tryTranslate('Size Unavailable (Sold Out)')} [${variant.Name}]` });
      // TODO: send notification
      window.parent.addStatistic('Tasks', 'Failed Tasks');
      window.parent.addCheckoutStatistic('failed', 'supreme');
      return;
    case 'thank_you': // detect if item was successfully checked out
      window.tasksApp.toggleNodeEnabled(node, false, true, { color: "green", description: `${window.parent.tryTranslate('Successfully Checked Out')} [${variant.Name}]` });
      // TODO: send notification
      // TODO: add to inventory. (requires to add product to arguments)
      window.parent.addStatistic('Tasks', 'Successful Tasks');
      window.parent.addCheckoutStatistic('successful', 'supreme');
      break;
    case 'payment_method': // TODO: add detection for this.
      const hasPaymentNotice = await getPaymentNotice('supreme', node);
      if (hasPaymentNotice) {
        node.retryNum++;
        if (node.retryNum <= node.maxRetries) window.setNodeStatus(node, "red", `${window.parent.tryTranslate('Card Declined')}. ${window.parent.tryTranslate('Retrying...')} (${node.retryNum}/${node.maxRetries})`);
        else {
          window.tasksApp.toggleNodeEnabled(node, false, true, { color: "red", description: `${window.parent.tryTranslate('Card Declined')} [${variant.Name}]` });
          // TODO: send notification
          window.parent.addStatistic('Tasks', 'Failed Tasks');
          window.parent.addCheckoutStatistic('failed', 'supreme');
          return;
        }
      }

      // main autofill information fields
      await fillField(node, '#order_billing_name', billingProfile.autofillInformation.firstName + ' ' + billingProfile.autofillInformation.lastName);
      await fillField(node, '#order_email', billingProfile.autofillInformation.email);
      await fillField(node, '#order_tel', billingProfile.autofillInformation.phoneNumber);
      await fillField(node, '#bo', billingProfile.autofillInformation.address);
      await fillField(node, '#oba3', billingProfile.autofillInformation.unit);
      await fillField(node, '#order_billing_zip ', billingProfile.autofillInformation.zipCode);
      await fillField(node, '#order_billing_city', billingProfile.autofillInformation.city);
      await fillField(node, '#order_billing_country', billingProfile.autofillInformation.country); // TODO: try shorten the billing profile country, and if it couldnt find shortened version then just type out full version
      await fillField(node, '#order_billing_state', billingProfile.autofillInformation.state); // TODO: try shorten the billing profile state/province, and if it couldnt find shortened version then just type out full version

      // payment information fields
      await fillField(node, '#credit_card_type', activeProfile.autofillInformation.billing.cardType); // EU only?
      await fillField(node, '#rnsnckrn', activeProfile.autofillInformation.billing.cardNumber.replace(new RegExp(" ", 'g'), ""));
      await fillField(node, '#credit_card_month', activeProfile.autofillInformation.billing.expirationDate.month);
      await fillField(node, '#credit_card_year', "20" + activeProfile.autofillInformation.billing.expirationDate.year);
      await fillField(node, '#orcer', activeProfile.autofillInformation.billing.cvc);
      await fillField(node, '#vval', activeProfile.autofillInformation.billing.cvc); // EU only?

      // accept terms
      await clickField(node, '.terms .icheckbox_minimal');

      // detect captcha and send it to client w/ sitekey
      if (await hasCaptcha(node)) {
        addCaptchaListener(node);
        window.setNodeStatus(node, "orange", `${window.parent.tryTranslate('Waiting for Captcha Response...')} (2/3)`);
        // export captcha sitekey from checkout page
        node.captchaSiteKey = await getCaptchaSiteKey(node);
        // open new solver/use already made solver on resell companion for captcha
        window.initiateCaptchaSolver(node, node.host, node.captchaSiteKey);
        while (!node.captchaResponse || node.captchaResponse.length == 0) await window.parent.sleep(50);
        // inject solved captcha response (from resell companion) into checkout page (injects to hidden #g-recaptcha-response textarea)
        await injectCaptchaResponse(node, node.captchaResponse);
        node.captchaResponse = undefined;
        window.setNodeStatus(node, "orange", `${window.parent.tryTranslate('Submitting Billing Details...')} (3/3)`);
      }

      // wait for ACO delay (if setup)
      await window.parent.sleep(billingProfile.settings.autoCheckoutDelay || 0);

      // continue to next page
      await clickField(node, '.button, .checkout');
      if (node.retryNum == 0) window.setNodeStatus(node, "orange", `${window.parent.tryTranslate('Submitting Billing Details...')} (3/3)`);
      break;
  }
};

async function beginShopifyCheckout(node, billingProfile, variant) {

  let webURL = node.checkoutWindow.webContents.getURL();

  // URL checker to ensure checkout is on-track
  if (!webURL.includes('/checkouts/')) { // all checkout pages have '/checkouts/' on it
    if (webURL.includes('account/login')) { // if: 'account/login' IS in URL, then launch login helper (notify awaiting authentication)
      window.setNodeStatus(node, "orange", `${window.parent.tryTranslate('Authentication Required')}`);
      //   - ONLY prompt for ONE task (ex: if 3 tasks all require authentication... if one is already launched then await for it to be closed (setInterval check and whenever launches, clearInterval).)
    } else { // else: the cart has been lost.
      window.tasksApp.toggleNodeEnabled(node, false, true, { color: "red", description: `${window.parent.tryTranslate('Cart Unavailable')} [${variant.Name}]` });
      window.parent.addStatistic('Tasks', 'Failed Tasks');
      window.parent.addCheckoutStatistic('failed', 'shopify');
    }
  }

  // check current checkout step to provide correct actions/fields to fill
  node.currentCheckoutStep = await getCurrentCheckoutStep('shopify', node);
  switch (node.currentCheckoutStep) {
    case 'stock_problems': // detect if item is OOS
      window.tasksApp.toggleNodeEnabled(node, false, true, { color: "red", description: `${window.parent.tryTranslate('Size Unavailable (Sold Out)')} [${variant.Name}]` });
      // TODO: send notification
      window.parent.addStatistic('Tasks', 'Failed Tasks');
      window.parent.addCheckoutStatistic('failed', 'shopify');
      return;
    case 'thank_you': // detect if item was successfully checked out
      window.tasksApp.toggleNodeEnabled(node, false, true, { color: "green", description: `${window.parent.tryTranslate('Successfully Checked Out')} [${variant.Name}]` });
      // TODO: send notification
      // TODO: add to inventory. (requires to add product to arguments)
      window.parent.addStatistic('Tasks', 'Successful Tasks');
      window.parent.addCheckoutStatistic('successful', 'shopify');
      break;
    case 'contact_information':
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
      break;
    case 'payment_method':
      const paymentNotice = await getPaymentNotice('shopify', node);
      if (paymentNotice && paymentNotice.length > 0) {
        node.retryNum++;
        if (node.retryNum <= node.maxRetries) window.setNodeStatus(node, "red", `${window.parent.tryTranslate('Card Declined')}. ${window.parent.tryTranslate('Retrying...')} (${node.retryNum}/${node.maxRetries})`);
        else {
          window.tasksApp.toggleNodeEnabled(node, false, true, { color: "red", description: `${window.parent.tryTranslate('Card Declined')} [${variant.Name}]` });
          // TODO: send notification
          window.parent.addStatistic('Tasks', 'Failed Tasks');
          window.parent.addCheckoutStatistic('failed', 'shopify');
          return;
        }
      }
      // wait for payment information fields to be ready
      addPaymentFieldListeners(node);
      for (var paymentField of PAYMENT_FIELDS) {
        while (!node.paymentFieldsInitialized[paymentField]) await window.parent.sleep(50);
        let paymentInfo = "";
        switch (paymentField) {
          case '[data-card-fields="number"]':
          paymentInfo = billingProfile.autofillInformation.billing.cardNumber.replace(new RegExp(" ", 'g'), "");
          break;
          case '[data-card-fields="name"]':
          paymentInfo = billingProfile.autofillInformation.firstName + " " + billingProfile.autofillInformation.lastName;
          break;
          case '[data-card-fields="expiry"]':
          paymentInfo = billingProfile.autofillInformation.billing.expirationDate.month + "/" + "20" + billingProfile.autofillInformation.billing.expirationDate.year; // this only works if card expires in 20xx
          break;
          case '[data-card-fields="verification_value"]':
          paymentInfo = billingProfile.autofillInformation.billing.cvc;
          break;
        }
        // type payment information
        await fillField(node, paymentField, paymentInfo);
      }
      node.paymentFieldsInitialized = {}; // clear to allow for retries

      // enable use same address as shipping (disables need to type fields below)
      await clickField(node, '#checkout_different_billing_address_false');

      // POSSIBLE billing autofill information fields (not all stores have this extra set of fields)
      // await fillField(node, '#checkout_billing_address_first_name', billingProfile.autofillInformation.firstName);
      // await fillField(node, '#checkout_billing_address_last_name', billingProfile.autofillInformation.lastName);
      // await fillField(node, '#checkout_billing_address_address1', billingProfile.autofillInformation.address);
      // await fillField(node, '#checkout_billing_address_address2', billingProfile.autofillInformation.unit);
      // await fillField(node, '#checkout_billing_address_city', billingProfile.autofillInformation.city);
      // await fillField(node, '#checkout_billing_address_country', billingProfile.autofillInformation.country);
      // await fillField(node, '#checkout_billing_address_province', billingProfile.autofillInformation.state);
      // await fillField(node, '#checkout_billing_address_zip ', billingProfile.autofillInformation.zipCode);
      // await fillField(node, '#checkout_billing_address_phone', billingProfile.autofillInformation.phoneNumber);
      break;
  }

  // detect captcha and send it to client w/ sitekey
  if (await hasCaptcha(node)) {
    addCaptchaListener(node);
    window.setNodeStatus(node, "orange", `${window.parent.tryTranslate('Waiting for Captcha Response...')} (2/3)`);
    // export captcha sitekey from checkout page
    node.captchaSiteKey = await getCaptchaSiteKey(node);
    // open new solver/use already made solver on resell companion for captcha
    window.initiateCaptchaSolver(node, node.host, node.captchaSiteKey);
    while (!node.captchaResponse || node.captchaResponse.length == 0) await window.parent.sleep(50);
    // inject solved captcha response (from resell companion) into checkout page (injects to hidden #g-recaptcha-response textarea)
    await injectCaptchaResponse(node, node.captchaResponse);
    node.captchaResponse = undefined;
    window.setNodeStatus(node, "orange", `${window.parent.tryTranslate('Submitting Billing Details...')} (3/3)`);
  }

  // wait for ACO delay (if setup)
  if (node.currentCheckoutStep == 'payment_method') await window.parent.sleep(billingProfile.settings.autoCheckoutDelay || 0);

  // wait for continue button to be ready
  addContinueListener(node);
  while (!node.stepsInitialized[node.currentCheckoutStep]) await window.parent.sleep(50);

  // continue to next page
  await clickField(node, '.step__footer__continue-btn');
  if (node.currentCheckoutStep == 'payment_method' && node.retryNum == 0) window.setNodeStatus(node, "orange", `${window.parent.tryTranslate('Submitting Billing Details...')} (3/3)`);
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

function addPaymentFieldListeners(node) {
  for (var paymentField of PAYMENT_FIELDS) {
    node.checkoutWindow.webContents.executeJavaScript(`
      (async () => {
        function paymentSleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
        while (!document.querySelector('${paymentField} iframe')) await paymentSleep(50);
        console.log("\${CC} PAYMENT FIELD READY: " + '${paymentField}');
        // document.querySelector('${paymentField} iframe').onload = function() {
        //   console.log("\${CC} PAYMENT FIELD READY: " + '${paymentField}');
        // }
      })();`, true);
  }
};

function addContinueListener(node) {
  node.checkoutWindow.webContents.executeJavaScript(`
    (async () => {
      function continueSleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      while (!document.querySelector('.step__footer__continue-btn') || document.querySelector('.step__footer__continue-btn').getAttribute("disabled") !== null) await continueSleep(50);
      console.log("\${CC} CONTINUE BUTTON READY");
    })();`, true);
};

async function getPaymentNotice(type, node) {
  switch (type) {
    case 'shopify':
      return await node.checkoutWindow.webContents.executeJavaScript(`
        (() => {
          const notices = document.querySelectorAll(".notice");
          for (var notice of notices) if (!notice.classList.contains("hidden")) return notice.innerText;
        })();`, true);
    case 'supreme':
      return await node.checkoutWindow.webContents.executeJavaScript(`
        document.querySelector(".errors").innerText.trim().length > 0 ? true : false;
        `, true);
  }
};

async function getCurrentCheckoutStep(type, node) {
  switch (type) {
    case 'shopify':
      return await node.checkoutWindow.webContents.executeJavaScript(`
        Shopify.Checkout.step;
        `, true);
    case 'supreme':
      return await node.checkoutWindow.webContents.executeJavaScript(`
        (() => {
          if (document.querySelector(".tab-confirmation").classList.contains("selected")) return 'thank_you';
          else return 'payment_method'; // TODO: detect if on first page (cart) or on checkout page.
        })();`, true);
  }
};

async function fillField(node, elementQuery, value, resetField = false) {
  if (!node.DOMReady) return;
  // console.log(`START typing for: ${elementQuery} (${value})`);

  let shouldSendInput = await node.checkoutWindow.webContents.executeJavaScript(`
    fieldElement = document.querySelector('${elementQuery}');
    (() => {
      if (typeof fieldElement === 'undefined' || !fieldElement) return;
      if (${resetField}) fieldElement.value = "";
      return fieldElement.querySelector('iframe') ? true : false || fieldElement.value.length == 0 || fieldElement.tagName == 'SELECT';
    })();`, true);
  if (!shouldSendInput) return;

  await clickField(node, elementQuery);

  for (var char of value) {
    node.checkoutWindow.webContents.sendInputEvent({ type: 'char', keyCode: char });
    await window.parent.sleep(getTypingTimeout());
  }

  let fieldElementDetails = await getFieldDetails(node, elementQuery);
  if (!fieldElementDetails || !fieldElementDetails.value) return;
  if (fieldElementDetails.tagName != 'SELECT' && !validateValues(fieldElementDetails.value, value)) await fillField(node, elementQuery, value, true);

  // console.log(`END typing for: ${elementQuery} (${value})`);
};

async function clickField(node, elementQuery) { // TODO: mess with sleep timing
  if (!node.DOMReady) return;
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
  if (!node.DOMReady) return;
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
