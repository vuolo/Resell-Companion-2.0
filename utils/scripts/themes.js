const themes = require("../../../utils/json/themes.json");

window.setTheme = (theme = window.companionSettings.theme) => {
  window.companionSettings.theme = theme;
  for (var i = 0; i < window.frames.length; i++) try { window.frames[i].setContextMenuTheme(theme); } catch (err) { }
  // tasks page
  if (window.frames['tasks-frame']) window.frames["tasks-frame"].sendThemeToCaptchaSolvers(theme);
  // spoof page
  if (window.frames['spoof-frame']) window.frames['spoof-frame'].map.setStyle(
    theme == "light" ? 'mapbox://styles/michaelvuolo/ck6ft4ygk15481iliboylq305' : // light
    'mapbox://styles/michaelvuolo/ckbk3j51700aa1js1dxmg9y2x' // dark
  );
  (async () => {
    while(!window.frames['spoof-frame'] || !window.frames['spoof-frame'].document.querySelector(".mapboxgl-ctrl-geocoder--button")) await window.sleep(50);
    window.frames['spoof-frame'].document.querySelector(".mapboxgl-ctrl-geocoder").style.backgroundColor = window.getThemeColor('rgba(255,255,255,1)');
    window.frames['spoof-frame'].document.querySelector(".mapboxgl-ctrl-geocoder--input").style.backgroundColor = window.getThemeColor('rgba(255,255,255,1)');
    window.frames['spoof-frame'].document.querySelector(".mapboxgl-ctrl-geocoder--input").style.color = window.getThemeColor('rgba(29,29,29,1)');
    window.frames['spoof-frame'].document.querySelector(".mapboxgl-ctrl-geocoder--button").style.backgroundColor = window.getThemeColor('rgba(255,255,255,1)');
    window.frames['spoof-frame'].document.querySelector(".mapboxgl-ctrl-geocoder--icon").style.fill = window.getThemeColor('rgba(29,29,29,1)');
    window.frames['spoof-frame'].document.querySelector(".mapboxgl-ctrl-geocoder--icon").style.opacity = 0.66;
  })();
  // analytics page
  if (window.frames["analytics-frame"]) window.frames["analytics-frame"].analyticsApp.$forceUpdate();
  if (window.frames["analytics-frame"]) for (var i = 0; i < window.frames['analytics-frame'].frames.length; i++) try { window.frames['analytics-frame'].frames[i].setContextMenuTheme(theme); } catch (err) { }
  // analytics -> overview page
  (async () => {
    while(!window.frames["analytics-frame"] || !window.frames["analytics-frame"].frames['overview-subpage'] || !window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph) await window.sleep(50);
    window.frames["analytics-frame"].frames['overview-subpage'].Chart.defaults.global.defaultFontColor = window.getThemeColor('rgba(29,29,29,1)');
    window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph.options.scales.xAxes[0].gridLines.color = window.getThemeColor('rgba(190,190,190,1)');
    window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph.options.scales.yAxes[0].gridLines.color = window.getThemeColor('rgba(190,190,190,1)');
    window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph.update();

    window.frames["analytics-frame"].frames['overview-subpage'].doughnutGraph.options.elements.arc.borderColor = window.getThemeColor('rgba(255,255,255,1)');
    window.frames["analytics-frame"].frames['overview-subpage'].doughnutGraph.update();
  })();
  // settings page
  if (window.frames["settings-frame"] && window.frames["settings-frame"].updateAPI) window.frames["settings-frame"].updateAPI.tryUpdateWindowTheme(theme);
};

window.getThemeColor = (incomingLightColor, theme = window.companionSettings ? window.companionSettings.theme : 'light') => {
  return themes[incomingLightColor] && themes[incomingLightColor].themes[theme] ? themes[incomingLightColor].themes[theme] : incomingLightColor;
};

window.getColor = (color) => {
  switch (color) {
    case 'green': return 'rgba(53,178,57,1)';
    case 'yellow': return 'rgba(253,213,53,1)';
    case 'orange': return 'rgba(255,167,78,1)';
    case 'red': return 'rgba(253,53,53,1)';
    case 'blue': return 'rgba(91,182,187,1)';
    case 'purple': return 'rgba(206,140,229,1)';
    default: return window.getThemeColor('rgba(29,29,29,1)');
  }
};

try { window.setTheme(window.companionSettings.theme); } catch(err) { }
