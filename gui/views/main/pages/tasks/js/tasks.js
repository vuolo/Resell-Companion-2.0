// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
const ShopifyBuy = window.parent.require('../../../utils/downloaded/shopify_sdk.js');
const cpfmClient = ShopifyBuy.buildClient({
  domain: "cactusplantfleamarket.myshopify.com",
  storefrontAccessToken: "574d05e81d915e3c13a16c514c678649"
});

window.tasks = [];

window.modals = {
  'configure': {
    visible: false
  },
  'create': {
    visible: false
  }
}

window.openModal = (modalName) => {
  window.modals[modalName].visible = true;
}

window.modalLoadedCallback = (modalName) => {
  if (modalName == 'configure') {
    tasksApp.configureModal = window.frames['configure-modal'].modalOptions;
  } else if (modalName == 'create') {
    tasksApp.createModal = window.frames['create-modal'].modalOptions;
  }
}

let allowNewTaskCreation = true;

window.setNodeStatus = (node, color, status) => {
  node.status.description = status;
  node.status.color = color;
};

window.tasksApp = new Vue({
  el: "#Rewrite___Tasks",
  data: {
    companionSettings: window.parent.companionSettings,
    tasks: window.tasks,
    captchaSolvers: window.captchaSolvers,
    modals: window.modals,
    activeTaskIndex: -1,
    configureModal: {},
    createModal: {}
  },
  methods: {
    confineTextWidth: window.parent.confineTextWidth,
    getTextWidth: window.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.tryTranslate,
    getThemeColor: window.parent.getThemeColor,
    formatTimestampExpanded: window.parent.formatTimestampExpanded,
    openModal: window.openModal,
    getTitleSwitchLeft: function(maxWidth, title) {
      let titleWidth = window.parent.getTextWidth(title, 'bold 17px \'SF Pro Text\'');
      if (titleWidth >= maxWidth) {
        return 0;
      } else {
        return (maxWidth/2) - ((titleWidth + 60)/2) + 25;
      }
      return 0;
    },
    toggleNodeEnabled: function(node, enabled = null, canceled = false, statusMessage = null) {
      if (node.status.color == 'green') return;
      if (enabled != null) node.enabled = enabled;
      else node.enabled = !node.enabled;
      if (node.enabled) window.setNodeStatus(node, "yellow", "Monitoring...");
      else {
        if (!canceled) window.setNodeStatus(node, "red", "Disabled");
        node.host = undefined;
        node.captchaSiteKey = undefined;
        node.captchaResponse = undefined;
        node.currentCheckoutStep = undefined;
        node.stepsInitialized = {};
        node.DOMReady = false;
        node.paymentFieldsInitialized = {};
        node.retryNum = 0;
        for (var captchaSolver of window.captchaSolvers) {
          if (captchaSolver.node && captchaSolver.node.id == node.id) {
            window.resetCaptchaSolver(captchaSolver);
            break;
          }
        }
      }
      if (node.checkoutWindow !== null || canceled) {
        try { node.checkoutWindow.close(); } catch(err) { /* err: checkout window already closed (user probably closed it) */ }
        node.checkoutWindow = null;
        if (!node.status.description.includes(window.parent.tryTranslate("Size Unavailable (Sold Out)")) && !(node.status.description.includes(window.parent.tryTranslate("Card Declined")) && !node.status.description.includes(window.parent.tryTranslate("Retrying..."))) && !node.status.description.includes(window.parent.tryTranslate("Successfully Checked Out"))) window.setNodeStatus(node, "red", "Checkout Canceled");
      }
      if (statusMessage) window.setNodeStatus(node, statusMessage.color, statusMessage.description)
    },
    openNewTaskModal: function() {
      window.frames['create-modal'].resetModalOptions();
      this.openModal('create');
    },
    openEditTaskModal: function(taskNodeIndex) {
      window.frames['create-modal'].resetModalOptions();
      this.createModal.isEditingTaskIndex = taskNodeIndex;
      this.createModal.sizes = tasks[this.activeTaskIndex].nodes[taskNodeIndex].configuration.sizes;
      this.createModal.useRandomSize = tasks[this.activeTaskIndex].nodes[taskNodeIndex].configuration.useRandomSize;
      this.createModal.checkoutMethod = tasks[this.activeTaskIndex].nodes[taskNodeIndex].configuration.checkoutMethod;
      this.openModal('create');
    },
    getColor: function(color) {
      switch (color) {
        case 'green':
          return 'rgba(53,178,57,1)';
        case 'yellow':
          return 'rgba(253,213,53,1)';
        case 'orange':
          return 'rgba(255,167,78,1)';
        case 'red':
          return 'rgba(253,53,53,1)';
      }
      return this.getThemeColor('rgba(190,190,190,1)');
    },
    getTaskStatusColor: function(taskIndex) {
      if (tasks[taskIndex].nodes.length > 0) {
        let numGreenStatuses = 0;
        let numYellowStatuses = 0;
        let numOrangeStatuses = 0;
        let numRedStatuses = 0;
        for (var node of tasks[taskIndex].nodes) {
          switch (node.status.color) {
            case 'green':
              numGreenStatuses++;
              break;
            case 'yellow':
              numYellowStatuses++;
              break;
            case 'orange':
              numOrangeStatuses++;
              break;
            case 'red':
              numRedStatuses++;
              break;
          }
        }
        if (numGreenStatuses > 0) {
          return this.getColor('green');
        } else if (numOrangeStatuses > 0) {
          return this.getColor('orange');
        } else if (numYellowStatuses > 0) {
          return this.getColor('yellow');
        } else if (numRedStatuses > 0) {
          return this.getColor('red');
        }
      }
      return this.getThemeColor('rgba(190,190,190,1)');
    },
    removeTaskNode: function(nodeIndex) {
      tasks[this.activeTaskIndex].nodes.splice(nodeIndex, 1);
    },
    toggleAllTaskNodes: function(enabled = true) {
      for (var node of tasks[this.activeTaskIndex].nodes) {
        this.toggleNodeEnabled(node, enabled)
      }
    },
    getDisplayedSizes: function(node) {
      return node.configuration.useRandomSize ? this.tryTranslate('Random') : (node.configuration.sizes.length > 0 ? node.configuration.sizes.join(", ") : this.tryTranslate("N/A"));
    },
    shouldDisplayStartButton: function() {
      for (var node of tasks[this.activeTaskIndex].nodes) {
        if (node.enabled) return false;
      }
      return true;
    },
    setActiveTask: function(taskIndex) {
      if (this.activeTaskIndex == taskIndex) return;
      this.activeTaskIndex = taskIndex;
      if (this.activeTaskIndex >= tasks.length) this.activeTaskIndex = tasks.length > 0 ? 0 : -1;
      setTimeout(applyButtonTransitions, 50);
    },
    removeTask: function(taskIndex) {
      if (this.activeTaskIndex == taskIndex) this.setActiveTask(tasks[taskIndex-1] ? taskIndex - 1 : (tasks[taskIndex + 1] ? taskIndex + 1 : -1));
      tasks.splice(taskIndex, 1);
      allowNewTaskCreation = false;
      setTimeout(function() {
        allowNewTaskCreation = true;
      }, 35);
    },
    shouldDisplayModals: function() {
      for (var modal in modals) {
        if (modals[modal].visible) return true;
      }
      return false;
    },
    addProduct: function(options = {}) {
      if (!allowNewTaskCreation) return;
      let separatedDate = separateDate();
      let taskTemplate = {
        configuration: {
          nickname: this.tryTranslate("Product") + " " + (tasks.length + 1),
          imageURL: "",
          rawKeywords: "",
          beginMonitoringAt: {
            enabled: false,
            launched: false,
            date: separatedDate.date,
            time: separatedDate.time,
            timestamp: getTimestampFromDateAndTime(separatedDate.date, separatedDate.time)
          }
        },
        nodes: []
      };
      for (var key in options) {
        taskTemplate.configuration[key] = options[key];
      }
      tasks.push(taskTemplate);
      if (this.activeTaskIndex == -1 && tasks.length == 1) this.setActiveTask(0);
      return tasks.length;
    },
    updateBeginMonitoringAtTimestamp: function() {
      tasks[this.activeTaskIndex].configuration.beginMonitoringAt.launched = false;
      return tasks[this.activeTaskIndex].configuration.beginMonitoringAt.timestamp = getTimestampFromDateAndTime(tasks[this.activeTaskIndex].configuration.beginMonitoringAt.date, tasks[this.activeTaskIndex].configuration.beginMonitoringAt.time);
    }
  }
});

window.addTaskNode = () => {
  let newTaskNode = {
    configuration: {
      sizes: tasksApp.createModal.sizes,
      useRandomSize: tasksApp.createModal.useRandomSize,
      checkoutMethod: tasksApp.createModal.checkoutMethod
    },
    status: {
      description: 'Monitoring...',
      color: 'yellow'
    },
    enabled: true
  };
  for (var i = 0; i < tasksApp.createModal.quantity; i++) {
    newTaskNode.id = window.parent.makeid(10); // assign a new id to each node
    tasks[tasksApp.activeTaskIndex].nodes.push(window.parent.memory.copyObj(newTaskNode));
  }
};

window.updateTaskNode = (taskNodeIndex) => {
  let updatedTaskNode = {
    configuration: {
      sizes: tasksApp.createModal.sizes,
      useRandomSize: tasksApp.createModal.useRandomSize,
      checkoutMethod: tasksApp.createModal.checkoutMethod
    }
  };
  window.parent.memory.syncObject(tasks[tasksApp.activeTaskIndex].nodes[taskNodeIndex], updatedTaskNode);
};

function separateDate(timestamp = new Date().getTime()) {
  let date = new Date(timestamp);
  let dateString = date.getFullYear() + '-' + (String(date.getMonth() + 1).length == 1 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (String(date.getDate() + 1).length == 1 ? ("0" + date.getDate()) : date.getDate());
  let timeString = (String(date.getHours() % 24).length == 1 ? ("0" + String(date.getHours() % 24)) : String(date.getHours() % 24)) + ':' + 55;
  return { date: dateString, time: timeString, timestamp: timestamp };
}

function getTimestampFromDateAndTime(date, time) {
  return new Date(date).getTime() + (parseInt(time.split(":")[0]) * 60 * 60 * 1000) + (parseInt(time.split(":")[1]) * 60 * 1000) + (new Date().getTimezoneOffset() * 60 * 1000);
}

window.getAvailableVariants = (product) => {
  let availableVariants = [];
  for (var variant of product.Variants) if (variant.Available) availableVariants.push(variant);
  return availableVariants;
};

window.getCheckoutURL = async (product, variant, quantity = 1) => {
  if (product.Identifier.startsWith("supreme")) return "https://www.supremenewyork.com/checkout";
  else if (product.Identifier == "cpfm") return await window.generateCPFMCartURL([variant], [quantity]);
  else if (product.Identifier == "shopify") return "https://" + product.Store + "/cart/" + variant.ID + ":" + quantity;
  return "https://" + product.Store;
};

window.launchCheckout = async (product, variant, useDefaultBrowser = false, proxy = null, show = true) => {
  return await window.parent.openURL(await window.getCheckoutURL(product, variant), useDefaultBrowser, { title: 'Resell Companion — ' + product.Name + ' Checkout', show: show }, `persist:${window.parent.makeid(10)}`, proxy, false, product, variant);
};

// ============================ CPFM ATC START ============================ \\
window.generateCPFMCartURL = async (variants, quantities) => {
  var checkout = await cpfmClient.checkout.create();
  let cart;
  for (var i = 0; i < variants.length; i++) cart = await cpfmClient.checkout.addLineItems(checkout.id, { variantId: variants[i].ID, quantity: quantities[i] });

  return cart.webUrl;
};
// ============================ CPFM ATC END ============================ //

// ============================ SUPREME ATC START ============================ \\
async function injectSupremeCart(product, variant, win) {
  let chopped_url = product.OverrideURL.substring(product.OverrideURL.indexOf('new/'), product.OverrideURL.length);
  let pid = chopped_url.substring(chopped_url.indexOf('/')+1, chopped_url.lastIndexOf('/'));
  let id = variant.ID;

  const uri = `https://www.supremenewyork.com/shop/${id}/add.json`;
  var cookiejar = window.parent.request.jar();

  const requestOptions = {
    method: 'POST',
    uri: uri,
    headers: {
      "credentials": "include",
      "headers": {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      "method": "POST",
      "mode": "no-cors"
    },
    simple: false,
    resolveWithFullResponse: true,
    form: {
      utf8: '✓',
      style: pid,
      size: id,
      commit: 'add+to+basket' // add+to+cart ?
    },
    jar: cookiejar
  };

  const res = await window.parent.request(requestOptions);
  const cookies = cookiejar.getCookies('https://www.supremenewyork.com');

  const ses = win.webContents.session;
  for (var cookie of cookies) { // inject cookies from request
    let curCookie = cookie;
    await ses.cookies.set(
      {
        url: `https://www.supremenewyork.com/`,
        name: curCookie.key,
        value: curCookie.value,
        domain: curCookie.key == '_supreme_sess' ? '.supremenewyork.com' : 'www.supremenewyork.com',
        path: '/',
        httpOnly: curCookie.key == '_supreme_sess' ? true : false
      }
    ).then(() => {
      // success
      // console.log('success: ' + curCookie.key);
    }, (error) => {
      // console.log('failed: ' + curCookie.key);
      // console.error(error);
    })
  }
  // http://resell.monster/atc?store=supreme&pid=173076&id=76794
  // injectSupremeCart(173076, 76794, win)
}
// ============================ SUPREME ATC END ============================ //

window.launchTaskNode = (node, product, variant) => {
  if (node.configuration.checkoutMethod.useCheckoutCompanion) { // use checkout companion
    if (product.Identifier != "shopify" && !product.Identifier.startsWith("supreme")) return; // validate checkout companion can be used for the product

    // temp
    let billingProfile = {
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

    let proxy; // temp
    if (node.configuration.checkoutMethod.rotateBillingProfiles) { // TODO: rotate through billing profiles
      // TODO: use proxy profile if selected (make new function above) - node.configuration.checkoutMethod.proxyProfile
      // TODO: make proxy profile remember per task and efficiently spread proxies
      initiateCheckoutCompanion(node, product, variant, billingProfile, proxy);
    } else if (node.configuration.checkoutMethod.useCheckoutCompanion.useFavoritedBillingProfile) { // TODO: use favorited billing profile ONLY
      // TODO: use proxy profile if selected (make new function above) - node.configuration.checkoutMethod.proxyProfile
      initiateCheckoutCompanion(node, product, variant, billingProfile, proxy);
    } else if (node.configuration.checkoutMethod.useCheckoutCompanion.billingProfile) { // TODO: use selected billing profile
      // TODO: use proxy profile if selected (make new function above) - node.configuration.checkoutMethod.proxyProfile
      initiateCheckoutCompanion(node, product, variant, billingProfile, proxy);
    } else {
      // throw error... no billing profile selected.
    }
  } else { // use connected bots

  }
};

window.trylaunchTaskNodes = (task, product) => {
  for (var node of task.nodes) {
    if (node.status.color != "yellow") continue; // only check if "monitoring" aka yellow status color
    let availableVariants = window.getAvailableVariants(product);
    if (availableVariants.length == 0) return;
    if (node.configuration.useRandomSize) {
      window.launchTaskNode(node, product, availableVariants[Math.floor(Math.random() * availableVariants.length)]);
      task.configuration.imageURL = product.ImageURL; // set current task picture to product url
      if (task.configuration.nickname.includes(window.parent.tryTranslate("Product") + " ")) task.configuration.nickname = product.Name;
    } else {
      for (var variant of availableVariants) {
        // TODO: check if variant is right size
      }
    }
  }
};

window.tryLaunchTask = (task, product = null) => {
  let keywordsInput = document.getElementById("keywordsInput");
  if (!keywordsInput || $(keywordsInput).is(':focus')) return; // validate user is done typing keywords (blurred from input) to prevent checkout on random items

  let keywords = window.parent.getKeywordsFromString(task.configuration.rawKeywords);
  if (keywords.length == 0) return;
  if (product) { if (window.parent.areKeywordsMatching(keywords, product.Name)) window.trylaunchTaskNodes(task, product); }
  else for (var curProduct of window.parent.frames['monitors-frame'].products) if (window.parent.areKeywordsMatching(keywords, curProduct.Name)) window.trylaunchTaskNodes(task, curProduct);
};

window.tryLaunchTasks = (product = null) => {
  for (var task of window.tasks) {
    window.tryLaunchTask(task, product);
  }
};
