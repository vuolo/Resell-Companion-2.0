window.getKeywordsFromString = (string) => { // TODO: detect empty strings, empty terms, no prefix cases etc.
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
};

window.stringifyKeywords = (keywords) => {
  let outRaw = "";
  for (var i = 0; i < keywords.length; i++) {
    outRaw += keywords[i].prefix + keywords[i].term;
    if (i != keywords.length-1) {
      outRaw += ", ";
    }
  }
  return outRaw;
};

window.areKeywordsMatching = (keywords, incomingString) => {
  for (var keyword of keywords) {
    if (keyword.prefix == "+") {
      if (!incomingString.toLowerCase().includes(keyword.term.toLowerCase())) {
        return false;
      }
    } else if (keyword.prefix == "-") {
      if (incomingString.toLowerCase().includes(keyword.term.toLowerCase())) {
        return false;
      }
    }
  }
  return true;
};
