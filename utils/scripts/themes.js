const themes = require("../../../utils/json/themes.json");

window.setTheme = (theme) => {
  companionSettings.theme = theme;
  if (window.frames['spoof-frame']) window.frames['spoof-frame'].map.setStyle(
    theme == "light" ? 'mapbox://styles/michaelvuolo/ck6ft4ygk15481iliboylq305' :
    'mapbox://styles/michaelvuolo/ckbk3j51700aa1js1dxmg9y2x'
  );
};

window.getThemeColor = (incomingLightColor) => {
  return themes[incomingLightColor] && themes[incomingLightColor].themes[companionSettings.theme] ? themes[incomingLightColor].themes[companionSettings.theme] : incomingLightColor;
};

window.setTheme(companionSettings.theme);
