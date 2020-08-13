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

window.tasks = window.parent.tasks;
var copiedTaskNodeIDs = [];

window.modals = {
  'create': {
    visible: false
  }
}

window.openModal = (modalName) => {
  window.modals[modalName].visible = true;
}

window.modalLoadedCallback = (modalName) => {
  if (modalName == 'create') tasksApp.createModal = window.frames['create-modal'].modalOptions;
}

let allowNewTaskCreation = true;

window.setNodeStatus = (node, color, status) => {
  node.status.description = status;
  node.status.color = color;

  let foundDescription = false; // validate no duplicate statuses
  for (var status of node.statuses) if (node.status.description == status.description) { foundDescription = true; break; }
  if (!foundDescription) node.statuses.push({ description: node.status.description, color: node.status.color });

  try { window.parent.frames['monitors-frame'].frames['checkout-modal'].checkoutApp.$forceUpdate(); } catch(err) {}
};

function setMultipleSelectedTaskNodes(taskNodeIndex) {
  let startTaskNodeIndex = -1;
  for (var i = 0; i < window.tasks[tasksApp.activeTaskIndex].nodes.length; i++) {
    if (window.tasks[tasksApp.activeTaskIndex].nodes[i].selected) {
      startTaskNodeIndex = i;
      break;
    }
  }
  if (startTaskNodeIndex == -1) {
    switchSelectedTaskNodes(taskNodeIndex);
  } else {
    // check if taskNodeIndex is > than startTaskNodeIndex (go in order) else, taskNodeIndex is  < than startTaskNodeIndex, loop reverse
    let allowSetSelected = false;
    if (taskNodeIndex > startTaskNodeIndex) {
      for (var i = 0; i < window.tasks[tasksApp.activeTaskIndex].nodes.length; i++) {
        if (i == startTaskNodeIndex) {
          allowSetSelected = true;
        } else if (i > taskNodeIndex) {
          break;
        } else if (allowSetSelected) {
          window.tasks[tasksApp.activeTaskIndex].nodes[i].selected = true;
        }
      }
    } else {
      for (var i = window.tasks[tasksApp.activeTaskIndex].nodes.length-1; i >= 0; i--) {
        if (i == startTaskNodeIndex) {
          allowSetSelected = true;
        } else if (i < taskNodeIndex) {
          break;
        } else if (allowSetSelected) {
          window.tasks[tasksApp.activeTaskIndex].nodes[i].selected = true;
        }
      }
    }
  }
}

function switchSelectedTaskNodes(taskNodeIndex) {
  window.tasks[tasksApp.activeTaskIndex].nodes[taskNodeIndex].selected = !window.tasks[tasksApp.activeTaskIndex].nodes[taskNodeIndex].selected;
}

window.tasksApp = new Vue({
  el: "#Rewrite___Tasks",
  data: {
    companionSettings: window.parent.companionSettings,
    tasks: window.tasks,
    captchaSolvers: window.captchaSolvers,
    modals: window.modals,
    activeTaskIndex: -1,
    createModal: {}
  },
  methods: {
    confineTextWidth: window.parent.confineTextWidth,
    getTextWidth: window.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.tryTranslate,
    getThemeColor: window.parent.getThemeColor,
    getColor: window.parent.getColor,
    formatTimestampExpanded: window.parent.formatTimestampExpanded,
    openModal: window.openModal,
    handleSelectClick: function(e, taskNodeIndex) {
      for (var elem of $('.Action_Row_1_Class')) if ($(elem).is(":hover")) return; // ignore if clicking on action buttons
      if (e.ctrlKey) switchSelectedTaskNodes(taskNodeIndex);
      else if (e.shiftKey) setMultipleSelectedTaskNodes(taskNodeIndex);
      else {
        let isSelected = window.tasks[this.activeTaskIndex].nodes[taskNodeIndex].selected;
        for (var node of window.getSelectedTaskNodes()) node.selected = false;
        window.tasks[this.activeTaskIndex].nodes[taskNodeIndex].selected = !isSelected;
      }
    },
    getProxyProfileByID: function(id) {
      for (var proxyProfile of window.parent.proxyProfiles) if (id == proxyProfile.settings.id) return proxyProfile;
    },
    getBillingProfileByID: function(id) {
      for (var billingProfile of window.parent.billingProfiles) if (id == billingProfile.settings.id) return billingProfile;
    },
    getTitleSwitchLeft: function(maxWidth, title) {
      let titleWidth = window.parent.getTextWidth(title, 'bold 17px \'SF Pro Text\'');
      if (titleWidth >= maxWidth) {
        return 0;
      } else {
        return (maxWidth/2) - ((titleWidth + 60)/2) + 25;
      }
      return 0;
    },
    toggleNodeEnabled: function(node, enabled = null, canceled = false, statusMessage = null, force = false) {
      if ((node.configuration.checkoutMethod.useCheckoutCompanion && node.configuration.checkoutMethod.billingProfile == "unselected" && enabled == null) || force) return;
      if (node.status.color == 'green' && !force) return;
      if (enabled != null) node.enabled = enabled;
      else node.enabled = !node.enabled;
      if (node.enabled) {
        if (node.statuses) while (node.statuses.length > 0) node.statuses.pop(); // clear status cache
        window.setNodeStatus(node, "yellow", "Monitoring...");
      } else {
        if (!canceled) window.setNodeStatus(node, "red", "Disabled");
        node.host = undefined;
        node.captchaSiteKey = undefined;
        node.captchaResponse = undefined;
        node.currentCheckoutStep = undefined;
        node.stepsInitialized = {};
        node.DOMReady = false;
        node.paymentFieldsInitialized = {};
        node.retryNum = 0;
        for (var captchaSolver of window.captchaSolvers) if (captchaSolver.node && captchaSolver.node.id == node.id) { window.resetCaptchaSolver(captchaSolver); break; }
      }
      if (node.checkoutWindow !== null || canceled) {
        try { node.checkoutWindow.close(); } catch(err) { /* err: checkout window already closed (user probably closed it) */ }
        node.checkoutWindow = null;
        if (
          statusMessage == null &&
          !node.status.description.includes(window.parent.tryTranslate("Cart Unavailable")) &&
          !node.status.description.includes(window.parent.tryTranslate("Size Unavailable (Sold Out)")) &&
          !(
            node.status.description.includes(window.parent.tryTranslate("Card Declined")) &&
            !node.status.description.includes(window.parent.tryTranslate("Retrying..."))
          ) &&
          !node.status.description.includes(window.parent.tryTranslate("Successfully Checked Out"))
        ) window.setNodeStatus(node, "red", "Checkout Canceled");
      }
      if (statusMessage) window.setNodeStatus(node, statusMessage.color, statusMessage.description);
      if (node.status.color == 'green') try { if (node == window.parent.frames['monitors-frame'].frames['checkout-modal'].modalOptions.node) window.parent.frames['monitors-frame'].frames['checkout-modal'].triggerSuccessful(); } catch(err) {}
      if (node.status.color == 'red') try { if (node == window.parent.frames['monitors-frame'].frames['checkout-modal'].modalOptions.node) window.parent.frames['monitors-frame'].frames['checkout-modal'].triggerFailed(); } catch(err) {}
      if (!node.enabled && (node.status.color != 'red' && node.status.color != 'green')) try { window.parent.frames['monitors-frame'].frames['checkout-modal'].checkoutApp.closeModal(); } catch(err) {}
    },
    openNewTaskModal: async function() {
      while (!window.frames['create-modal']) await window.parent.sleep(50);
      window.frames['create-modal'].resetModalOptions();
      this.openModal('create');
    },
    openEditTaskModal: async function(taskNodeIndex) {
      while (!window.frames['create-modal']) await window.parent.sleep(50);
      window.frames['create-modal'].resetModalOptions();
      this.createModal.isEditingTaskIndex = taskNodeIndex;
      this.createModal.sizes = tasks[this.activeTaskIndex].nodes[taskNodeIndex].configuration.sizes;
      this.createModal.useRandomSize = tasks[this.activeTaskIndex].nodes[taskNodeIndex].configuration.useRandomSize;
      this.createModal.checkoutMethod = tasks[this.activeTaskIndex].nodes[taskNodeIndex].configuration.checkoutMethod;
      this.openModal('create');
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
      for (var modal in modals) if (modals[modal].visible) return true;
      return false;
    },
    addProduct: function(options = {}) {
      if (!allowNewTaskCreation) return;
      let separatedDate = window.parent.separateDate();
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
          },
          id: window.parent.makeid(10) // assign a new id to each task product
        },
        nodes: []
      };
      for (var key in options) {
        taskTemplate.configuration[key] = options[key];
      }
      tasks.push(taskTemplate);
      if (this.activeTaskIndex == -1 && tasks.length == 1) this.setActiveTask(0);
      window.parent.addStatistic('Tasks', 'Products Created');
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
    enabled: true,
    stepsInitialized: {},
    DOMReady: false,
    paymentFieldsInitialized: {},
    retryNum: 0,
    checkoutWindow: null,
    statuses: [],
    selected: false
  };

  let billingProfileIndex = 0;
  let proxyProfileIndex = 0;
  for (var i = 0; i < tasksApp.createModal.quantity; i++) {

    if (newTaskNode.configuration.checkoutMethod.useCheckoutCompanion) {
      // ASSIGN billingProfile ID
      if (newTaskNode.configuration.checkoutMethod.rotateBillingProfiles) {
        if (window.parent.billingProfiles.length == 0) newTaskNode.configuration.checkoutMethod.billingProfile = "unselected";
        else {
          if (window.parent.billingProfiles[billingProfileIndex]) newTaskNode.configuration.checkoutMethod.billingProfile = window.parent.billingProfiles[billingProfileIndex].settings.id;
          billingProfileIndex = (billingProfileIndex + 1 >= window.parent.billingProfiles.length) ? 0 : billingProfileIndex + 1;
        }
      } else if (!newTaskNode.configuration.checkoutMethod.rotateBillingProfiles && newTaskNode.configuration.checkoutMethod.useFavoritedBillingProfile) {
        if (window.parent.billingProfiles.length == 0) newTaskNode.configuration.checkoutMethod.billingProfile = "unselected";
        else for (var billingProfile of window.parent.billingProfiles) if (billingProfile.settings.favorited) { newTaskNode.configuration.checkoutMethod.billingProfile = window.parent.billingProfiles[billingProfileIndex].settings.id; break; }
      }
      // if NO billing profile is ASSIGNED to task node, do NOT ALLOW it to be enabled.
      if (newTaskNode.configuration.checkoutMethod.billingProfile == "unselected") window.tasksApp.toggleNodeEnabled(newTaskNode, false);
    }

    newTaskNode.id = window.parent.makeid(10); // assign a new id to each node
    tasks[tasksApp.activeTaskIndex].nodes.push(window.parent.memory.copyObj(newTaskNode));
    window.parent.addStatistic('Tasks', 'Tasks Created');
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
  if (updatedTaskNode.configuration.checkoutMethod.useCheckoutCompanion && updatedTaskNode.configuration.checkoutMethod.billingProfile == "unselected") window.tasksApp.toggleNodeEnabled(tasks[tasksApp.activeTaskIndex].nodes[taskNodeIndex], false);
};

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

window.launchCheckout = async (product, variant, useDefaultBrowser = false, proxy = null, show = true, overrideURL = "") => {
  let win = await window.parent.openURL(overrideURL || (await window.getCheckoutURL(product, variant)), useDefaultBrowser, { title: 'Resell Companion — ' + product.Name + ' Checkout', show: show }, `persist:${product.Store /* + window.parent.makeid(10)*/}`, proxy, false, product, variant);
  if (product.Identifier.startsWith("supreme")) try { await injectSupremeCart(product, variant, win) } catch(err) {};
  return win;
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

window.launchTaskNode = (node, product, variant, overrideURL = "") => {
  if (node.configuration.checkoutMethod.useCheckoutCompanion) { // use checkout companion
    if (
      product.Identifier != "shopify" &&
      product.Identifier != "cpfm" &&
      !product.Identifier.startsWith("supreme")
    ) return; // validate checkout companion can be used for the product
    if (node.configuration.checkoutMethod.billingProfile == 'unselected') return;
    let proxy;
    // TODO: rotate proxies in window.tasksApp.getProxyProfileByID(node.configuration.checkoutMethod.proxyProfile)
    initiateCheckoutCompanion(node, product, variant, window.tasksApp.getBillingProfileByID(node.configuration.checkoutMethod.billingProfile), proxy, overrideURL);
  } else { // use connected bots

  }
  window.parent.addStatistic('Tasks', 'Tasks Launched');
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
  for (var task of window.tasks) window.tryLaunchTask(task, product);
};

window.resetTaskNode = (node) => {
  // FORCE disable task node
  window.tasksApp.toggleNodeEnabled(node, false, false, null, true);
  // enable task node
  window.tasksApp.toggleNodeEnabled(node, true);
};

window.getTaskByID = (id) => {
  for (var task of window.tasks) if (task.configuration.id == id) return task;
}

window.getTaskNodeByID = (id) => {
  for (var task of window.tasks) for (var node of task.nodes) if (node.id == id) return node;
}

window.getSelectedTaskNodes = (productIndex = tasksApp.activeTaskIndex) => {
  let outTaskNodes = [];
  for (var node of window.tasks[productIndex].nodes) if (node.selected) outTaskNodes.push(node);
  return outTaskNodes;
}

function copyTaskNodes() {
  while (copiedTaskNodeIDs.length > 0) copiedTaskNodeIDs.pop();
  for (var node of window.getSelectedTaskNodes()) copiedTaskNodeIDs.push(node.id);
}

function pasteTaskNodes() {
  let outTaskNodes = [];
  for (var copiedTaskNodeID of copiedTaskNodeIDs) {
    let node = window.getTaskNodeByID(copiedTaskNodeID);
    if (node) outTaskNodes.push(node);
  }
  for (var node of window.getSelectedTaskNodes()) node.selected = false;
  duplicateTaskNodes(outTaskNodes);
}

function duplicateTaskNodes(incomingTaskNodes = null) {
  if (incomingTaskNodes) {
    for (var incomingTaskNode of incomingTaskNodes) {
      let duplicateTaskNode = {};
      window.parent.memory.syncObject(duplicateTaskNode, window.parent.memory.copyObj(incomingTaskNode));
      duplicateTaskNode.id = window.parent.makeid(10); // assign a new id to each duplicated node
      duplicateTaskNode.selected = true; // force select on new nodes ONLY
      window.resetTaskNode(duplicateTaskNode); // reset duplicated task node status
      window.tasks[tasksApp.activeTaskIndex].nodes.push(duplicateTaskNode);
      window.parent.addStatistic('Tasks', 'Tasks Created');
    }
  } else {
    for (var node of window.tasks[tasksApp.activeTaskIndex].nodes) {
      if (node.selected) {
        node.selected = false; // force deselect on BOTH new AND duplciated nodes
        let duplicateTaskNode = {};
        window.parent.memory.syncObject(duplicateTaskNode, window.parent.memory.copyObj(node));
        duplicateTaskNode.id = window.parent.makeid(10); // assign a new id to each duplicated node
        window.resetTaskNode(duplicateTaskNode); // reset duplicated task node status
        window.tasks[tasksApp.activeTaskIndex].nodes.push(duplicateTaskNode);
        window.parent.addStatistic('Tasks', 'Tasks Created');
      }
    }
  }
}

document.addEventListener("click", function() {
  let isHoveringOverItem = false;
  if (!isHoveringOverItem) for (var elem of $('.Group_215_Class')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var elem of $('body > ul.context-menu-root')) if ($(elem).is(":hover")) { isHoveringOverItem = true; break; }
  if (!isHoveringOverItem) for (var task of window.tasks) for (var node of task.nodes) node.selected = false;
});

// DISABLE SELECT ALL TEXT FROM Ctrl + A
$(function(){
  $(document).keydown(function(objEvent) {
    if (objEvent.ctrlKey && objEvent.keyCode == 65 && objEvent.target.tagName != "INPUT" && objEvent.target.tagName != "TEXTAREA") objEvent.preventDefault();
  });
});

// KEYBINDS
document.onkeyup = function(e) {
  if (e.which == 46) { // Delete: display delete prompt
    let afterRemoveCount = window.tasks[tasksApp.activeTaskIndex].nodes.length - window.getSelectedTaskNodes().length;
    while (window.tasks[tasksApp.activeTaskIndex].nodes.length > afterRemoveCount) for (var node of window.getSelectedTaskNodes()) { window.tasks[tasksApp.activeTaskIndex].nodes.splice(window.tasks[tasksApp.activeTaskIndex].nodes.indexOf(node), 1); break; }
  } else if (e.ctrlKey && e.which == 65) { // Ctrl + A: select all displayed taskNodes
    for (var node of window.tasks[tasksApp.activeTaskIndex].nodes) node.selected = true;
  } else if (e.ctrlKey && e.which == 68) { // Ctrl + D: deselect all displayed taskNodes
    for (var node of window.getSelectedTaskNodes()) node.selected = false;
  } else if (e.ctrlKey && e.which == 67) { // Ctrl + C: copy taskNodes
    copyTaskNodes();
  } else if (e.ctrlKey && e.which == 86) { // Ctrl + V: paste taskNodes
    pasteTaskNodes();
  }
};

setInterval(function() {
  for (var task of window.tasks) if (task.configuration.beginMonitoringAt.enabled && !task.configuration.beginMonitoringAt.launched && task.configuration.beginMonitoringAt.timestamp < new Date().getTime()) {
    task.configuration.beginMonitoringAt.launched = true;
    for (var node of task.nodes) tasksApp.toggleNodeEnabled(node, true);
  }
}, 1 * 1000);
