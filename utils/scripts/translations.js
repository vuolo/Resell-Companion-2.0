const translations = require("../../../utils/json/translations.json").translations;

window.tryTranslate = (incomingText, language = companionSettings.language) => {
  if (translations[incomingText] && translations[incomingText].languages[language]) {
    return translations[incomingText].languages[language];
  }
  return incomingText;
}
