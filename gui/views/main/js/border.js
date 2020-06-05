let pages = [
  {
    name: "Home"
  },
  {
    name: "Monitors"
  },
  {
    name: "Tasks"
  },
  {
    name: "Spoof"
  },
  {
    name: "Browser"
  },
  {
    name: "Analytics"
  },
  {
    name: "Social+"
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
    tryApplyDarkMode: window.tryApplyDarkMode,
    switchToPage: function(pageIndex) {
      this.activePageIndex = pageIndex;
      try { contentApp.activePageIndex = pageIndex; } catch(err) { console.log(err); }
    }
  }
});
