let pages = [
  {
    name: "Home",
    state: "Examining the release calendar..."
  },
  {
    name: "Monitors",
    state: "Watching monitors..."
  },
  {
    name: "Tasks",
    state: "Setting up tasks..."
  },
  {
    name: "Spoof",
    state: "Spoofing device locations..."
  },
  {
    name: "Browser",
    state: "Watching browsers..."
  },
  {
    name: "Analytics",
    state: "Analyzing product data..."
  },
  {
    name: "Social+",
    state: "Watching Social+ monitors..."
  }
];

window.activePageIndex = 1;

const borderApp = new Vue({
  el: "#Rewrite___Application_Border",
  data: {
    curLogin: curLogin,
    pages: pages,
    activePageIndex: window.activePageIndex,
    appVersion: appVersion,
    companionSettings: window.companionSettings
  },
  methods: {
    confineTextWidth: confineTextWidth,
    tryTranslate: window.tryTranslate,
    getThemeColor: window.getThemeColor,
    switchToPage: function(pageIndex) {
      this.activePageIndex = pageIndex;
      try { contentApp.activePageIndex = pageIndex; } catch(err) { console.log(err); }
      curAwaitState = pages[this.activePageIndex];
    }
  }
});
