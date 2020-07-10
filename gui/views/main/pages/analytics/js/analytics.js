// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
window.subpages = {
  'overview': {
    visible: true
  },
  'sales': {
    visible: false
  },
  'inventory': {
    visible: false
  },
  'market-lookup': {
    visible: false
  },
  'subscriptions': {
    visible: false
  },
  'tickets': {
    visible: false
  },
  'cards': {
    visible: false
  }
}

window.openSubpage = (subpageName) => {
  for (var subpage in subpages) subpages[subpage].visible = false;
  window.subpages[subpageName].visible = true;
}

window.subpageLoadedCallback = (subpageName) => {
  if (subpageName == 'sales') {
    analyticsApp.sales = window.frames['sales-subpage'].sales;
  }
}

window.analyticsApp = new Vue({
  el: "#subpageContent",
  data: {
    subpages: window.subpages,
    sales: [],
    inventoryItems: [],
    bots: [],
    tickets: [],
    cards: []
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor,
    openSubpage: window.openSubpage
  }
});

window.refreshTracking = () => {
  window.frames['sales-subpage'].refreshTracking();
};
