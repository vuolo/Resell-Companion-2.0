const translations = require("../../../utils/json/translations.json").translations;

window.setLanguage = (language) => {
  window.companionSettings.language = language;
  for (var i = 0; i < window.frames.length; i++) try { window.frames[i].setContextMenuTheme(); } catch (err) { }
  // home page
  if (window.frames["home-frame"]) window.frames["home-frame"].tryTranslateAlertMessages(language);
  // tasks page
  if (window.frames["tasks-frame"]) window.frames["tasks-frame"].sendLanguageToCaptchaSolvers(language);
  // spoof page
  (async () => {
    while(!window.frames['spoof-frame'] || !window.frames['spoof-frame'].document.querySelector(".mapboxgl-ctrl-geocoder--button")) await window.sleep(50);
    window.frames['spoof-frame'].document.querySelector(".mapboxgl-ctrl-geocoder--input").placeholder = window.tryTranslate('Search');
  })();
  // analytics page
  if (window.frames["analytics-frame"]) window.frames["analytics-frame"].refreshTracking();
  if (window.frames["analytics-frame"]) {
    for (var i = 0; i < window.frames['analytics-frame'].frames.length; i++) {
      try { window.frames['analytics-frame'].frames[i].setContextMenuTheme(); } catch (err) { }
      // force language to update on all date searches
      try { window.frames['analytics-frame'].frames[i].overviewApp.updateDateSearch(); continue; } catch (err) { }
      try { window.frames['analytics-frame'].frames[i].salesApp.updateDateSearch(); continue; } catch (err) { }
      try { window.frames['analytics-frame'].frames[i].inventoryApp.updateDateSearch(); continue; } catch (err) { }
      try { window.frames['analytics-frame'].frames[i].subscriptionsApp.updateDateSearch(); continue; } catch (err) { }
      try { window.frames['analytics-frame'].frames[i].ticketsApp.updateDateSearch(); continue; } catch (err) { }
      try { window.frames['analytics-frame'].frames[i].cardsApp.updateDateSearch(); continue; } catch (err) { }
    }
  }
};

window.tryTranslate = (incomingText, language = window.companionSettings.language) => {
  if (translations[incomingText] && translations[incomingText].languages[language]) {
    return translations[incomingText].languages[language];
  }
  return incomingText;
};

try { window.setLanguage(window.companionSettings.language); } catch(err) { }
