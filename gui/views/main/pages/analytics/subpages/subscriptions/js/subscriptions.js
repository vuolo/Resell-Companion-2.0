// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
const overviewApp = new Vue({
  el: "#Rewrite___Overview",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    curLogin: window.parent.parent.curLogin
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    calculateUnderlineWidth: window.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor
  }
});
