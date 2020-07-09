const themes = require("../../../utils/json/themes.json");

window.setTheme = (theme) => {
  window.companionSettings.theme = theme;
  if (window.frames['spoof-frame']) window.frames['spoof-frame'].map.setStyle(
    theme == "light" ? 'mapbox://styles/michaelvuolo/ck6ft4ygk15481iliboylq305' : // light
    'mapbox://styles/michaelvuolo/ckbk3j51700aa1js1dxmg9y2x' // dark
  );
  for (var i = 0; i < window.frames.length; i++) try { window.frames[i].setContextMenuTheme(theme); } catch (err) { }
  window.frames["tasks-frame"].sendThemeToCaptchaSolvers(theme);
  window.frames["analytics-frame"].analyticsApp.$forceUpdate();
  for (var i = 0; i < window.frames['analytics-frame'].frames.length; i++) try { window.frames['analytics-frame'].frames[i].setContextMenuTheme(theme); } catch (err) { }
};

window.getThemeColor = (incomingLightColor, theme = window.companionSettings.theme) => {
  return themes[incomingLightColor] && themes[incomingLightColor].themes[theme] ? themes[incomingLightColor].themes[theme] : incomingLightColor;
};

try { window.setTheme(window.companionSettings.theme); } catch(err) { }
