const themes = require("../../../utils/json/themes.json");

window.setTheme = (theme) => {
  companionSettings.theme = theme;
};

window.getThemeColor = (incomingLightColor) => {
  return themes[incomingLightColor] && themes[incomingLightColor].themes[companionSettings.theme] ? themes[incomingLightColor].themes[companionSettings.theme] : incomingLightColor;
};

window.setTheme(companionSettings.theme);
