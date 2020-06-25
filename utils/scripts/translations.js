const translations = require("../../../utils/json/translations.json").translations;

window.setLanguage = (language) => {
  window.companionSettings.language = language;
  window.frames["home-frame"].tryTranslateAlertMessages(language);
  window.frames["tasks-frame"].sendLanguageToCaptchaSolvers(language);
};

window.tryTranslate = (incomingText, language = window.companionSettings.language) => {
  if (translations[incomingText] && translations[incomingText].languages[language]) {
    return translations[incomingText].languages[language];
  }
  return incomingText;
};
