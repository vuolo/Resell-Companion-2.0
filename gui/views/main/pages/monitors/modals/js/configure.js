// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// imports
const MODAL_NAME = 'configure';

const MODAL_OPTIONS_TEMPLATE = {
  filters: {
    filteredKeywords: [
      // {
      //   keywords: [
      //     {
      //       term: "dad",
      //       prefix: "+"
      //     },
      //     {
      //       term: "cap",
      //       prefix: "+"
      //     },
      //     {
      //       term: "redX",
      //       prefix: "-"
      //     },
      //     {
      //       term: "chicken",
      //       prefix: "-"
      //     }
      //   ],
      //   raw: "+dad, +cap, -redX, -chicken",
      //   enabled: true
      // }
    ],
    filteredKeywordIndex: -1,
    useFavoritedStoresOnly: false,
  },
  preferences: {
    automaticallyCheckout: true,
    useDefaultBrowser: false
  }
};

window.modalOptions = {};
window.resetModalOptions = () => {
  window.parent.parent.memory.syncObject(window.modalOptions, window.parent.parent.memory.copyObj(MODAL_OPTIONS_TEMPLATE));
}
window.resetModalOptions();

const KEYWORD_PADDING_LEFT_RIGHT = 12;
const KEYWORD_GAP = 6;
const KEYWORDS_OFFSET = 23;

const configureApp = new Vue({
  el: "#Rewrite___Monitors_Modal",
  data: {
    companionSettings: window.parent.parent.companionSettings,
    modalOptions: modalOptions,
    filteredKeywords: modalOptions.filters.filteredKeywords,
    tempRawKeywords: ""
  },
  methods: {
    confineTextWidth: window.parent.parent.confineTextWidth,
    getTextWidth: window.parent.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.getThemeColor,
    openExternal: window.parent.parent.openExternal,
    refreshDisplayedProducts: window.parent.refreshDisplayedProducts,
    toggleFilteredKeyword: function(filteredKeyword) {
      filteredKeyword.enabled = !filteredKeyword.enabled;
      if (window.parent.monitorsApp.useFilteredKeywords) this.refreshDisplayedProducts();
      this.$forceUpdate();
    },
    getTitleSwitchLeft: function(maxWidth, title) {
      let titleWidth = this.getTextWidth(title, 'bold 20px \'SF Pro Text\'');
      if (titleWidth >= maxWidth) {
        return 0;
      } else {
        return (maxWidth/2) - ((titleWidth + 60)/2) + 20;
      }
      return 0;
    },
    removeFilteredKeyword: function(filteredKeywordIndex) {
      modalOptions.filters.filteredKeywordIndex = -1;
      this.filteredKeywords.splice(filteredKeywordIndex, 1);
      if (window.parent.monitorsApp.useFilteredKeywords) this.refreshDisplayedProducts();
      this.$forceUpdate();
    },
    getKeywordsFromString: function(string) { // TODO: detect empty strings, empty terms, no prefix cases etc.
      let outKeywords = [];
      // reformat string
      string = string.toLowerCase();
      for (var i = 0; i < string.length; i++) {
        if (string.charAt(i) == "+" || string.charAt(i) == "-") {
          let prefix = string.charAt(i); // get prefix
          let term = string.substring(i+1, string.length); // get keyword string without initial prefix
          term = term.substring(0, (term.indexOf("+") == -1 && term.indexOf("-") == -1) ? term.length : ((term.indexOf("+") != -1 && (term.indexOf("+") < term.indexOf("-") || term.indexOf("-") == -1)) ? term.indexOf("+") : term.indexOf("-"))); // get keyword with whitespace
          i += term.length; // skip ahead in the search (not necessary)
          term = term.replace(/\s/g, ''); // remove whitespace
          term = term.replace(/,/g, ''); // replace commas
          if (term.length == 0) {
            continue;
          }
          outKeywords.push(
            {
              term: term,
              prefix: prefix
            }
          );
        }
      }
      return outKeywords;
    },
    handleAddFilteredKeyword: function() {
      if (modalOptions.filters.filteredKeywordIndex == -1) {
        let keywords = this.getKeywordsFromString(this.tempRawKeywords);
        if (keywords.length == 0) return;
        this.filteredKeywords.push(
          {
            keywords: keywords,
            raw: this.stringifyKeywords(keywords),
            enabled: true
          }
        );
        this.tempRawKeywords = "";
        if (window.parent.monitorsApp.useFilteredKeywords) this.refreshDisplayedProducts();
        return true;
      } else {
        let keywords = this.getKeywordsFromString(this.filteredKeywords[modalOptions.filters.filteredKeywordIndex].raw);
        if (keywords.length == 0) return;
        window.parent.parent.memory.syncObject(this.filteredKeywords[modalOptions.filters.filteredKeywordIndex].keywords, keywords);
        this.filteredKeywords[modalOptions.filters.filteredKeywordIndex].raw = this.stringifyKeywords(keywords);
        modalOptions.filters.filteredKeywordIndex = -1;
        if (window.parent.monitorsApp.useFilteredKeywords) this.refreshDisplayedProducts();
        return true;
      }
      return false;
    },
    stringifyKeywords: function(keywords) {
      let outRaw = "";
      for (var i = 0; i < keywords.length; i++) {
        outRaw += keywords[i].prefix + keywords[i].term;
        if (i != keywords.length-1) {
          outRaw += ", ";
        }
      }
      return outRaw;
    },
    getMaxDisplayedKeywordIndex: function(maxWidth, keywords) {
      let maxIndex = -1;
      for (var i = 0; i < keywords.length; i++) {
        let keywordTermWidth = this.getKeywordTermWidth(keywords[i].term);
        if ((KEYWORD_PADDING_LEFT_RIGHT*2 + keywordTermWidth + KEYWORD_GAP)*(i+1) > maxWidth) {
          break;
        }
        maxIndex = i;
      }
      return maxIndex;
    },
    getKeywordTermWidth: function(term) {
      return window.parent.parent.getTextWidth(term, 'normal 14px \'SF Pro Text\'')
    },
    getKeywordPosLeft: function(keywords, keywordIndex) {
      let outLeft = 0;
      for (var i = 0; i < keywords.length; i++) {
        if (keywordIndex == i) {
          break;
        }
        let keywordTermWidth = this.getKeywordTermWidth(keywords[i].term);
        outLeft += KEYWORD_PADDING_LEFT_RIGHT*2 + keywordTermWidth + KEYWORD_GAP;
      }
      return outLeft + KEYWORDS_OFFSET;
    },
    closeModal: function() {
      window.parent.modals[MODAL_NAME].visible = false;
    }
  }
});

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
