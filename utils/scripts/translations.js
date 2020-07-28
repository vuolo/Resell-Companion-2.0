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
  // analytics -> overview page
  (async () => {
    while(!window.frames["analytics-frame"] || !window.frames["analytics-frame"].frames['overview-subpage'] || !window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph) await window.sleep(50);
    window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph.options.title.text = window.tryTranslate('Reselling Portfolio');

    window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph.data.labels = [
      window.tryTranslate('January'),
      window.tryTranslate('Februrary'),
      window.tryTranslate('March'),
      window.tryTranslate('April'),
      window.tryTranslate('May'),
      window.tryTranslate('June'),
      window.tryTranslate('July'),
      window.tryTranslate('August'),
      window.tryTranslate('September'),
      window.tryTranslate('October'),
      window.tryTranslate('November'),
      window.tryTranslate('December')
    ];

    window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph.data.datasets[0].label = window.tryTranslate('Spent');
    window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph.data.datasets[1].label = window.tryTranslate('Revenue');
    window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph.data.datasets[2].label = window.tryTranslate('Profit');
    window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph.options.scales.yAxes[0].scaleLabel.labelString = `${window.tryTranslate(window.companionSettings.currencyName)} (${window.companionSettings.currency})`;

    window.frames["analytics-frame"].frames['overview-subpage'].portfolioGraph.update();

    window.frames["analytics-frame"].frames['overview-subpage'].doughnutGraph.data.labels[0] = window.tryTranslate('Sales');
    window.frames["analytics-frame"].frames['overview-subpage'].doughnutGraph.data.labels[1] = window.tryTranslate('Inventory');
    window.frames["analytics-frame"].frames['overview-subpage'].doughnutGraph.data.labels[2] = window.tryTranslate('Subscriptions');
    window.frames["analytics-frame"].frames['overview-subpage'].doughnutGraph.data.labels[3] = window.tryTranslate('Tickets');
    window.frames["analytics-frame"].frames['overview-subpage'].doughnutGraph.data.labels[4] = window.tryTranslate('Cards');
    window.frames["analytics-frame"].frames['overview-subpage'].doughnutGraph.options.title.text = window.tryTranslate('Number of Items')

    window.frames["analytics-frame"].frames['overview-subpage'].doughnutGraph.update();
  })();
};

window.tryTranslate = (incomingText, language = window.companionSettings.language) => {
  if (translations[incomingText] && translations[incomingText].languages[language]) return translations[incomingText].languages[language];
  return incomingText;
};

try { window.setLanguage(window.companionSettings.language); } catch(err) { }
