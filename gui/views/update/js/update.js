// imports
const electron = require("electron");

// variables
window.language = "en";
window.theme = "light";

// functions
function updateLanguage(language = window.language) {
  window.language = language;
  document.querySelector('.Install_Class span').innerHTML = window.tryTranslate('Install', window.language);

  document.querySelector('#NotInstallingTitle span').innerText = window.tryTranslate('Oops...', window.language);
  document.querySelector('#notInstallingStart').innerText = window.tryTranslate('Not installing? Click ', window.language) + ' ';
  document.querySelector('#notInstallingHere').innerText = window.tryTranslate('here', window.language);
  document.querySelector('#notInstallingEnd').innerText = ' ' + window.tryTranslate("to view the installer's location, where you can manually run the setup.", window.language);
}

function updateTheme(theme = window.theme) {
  window.theme = theme;
  document.querySelector('#NotInstallingTitle span').style.color = window.getThemeColor('rgba(29,29,29,1)', window.theme);
  document.querySelector('#background').style.backgroundColor = window.getThemeColor('rgba(251,247,241,1)', window.theme);

  document.querySelector('.progress__bar').classList.remove('light-bar');
  document.querySelector('.progress__bar').classList.remove('dark-bar');
  document.querySelector('.progress__bar').classList.add(window.theme + '-bar');

  document.querySelector('.Loading_Rectangle_Class').style.fill = window.getThemeColor('rgba(190,190,190,1)', window.theme);
  document.querySelector('.Header_Background rect').style.fill = window.getThemeColor('rgba(243,224,185,1)', window.theme);

  document.querySelector('.progress__text').style.color = window.getThemeColor('rgba(29,29,29,1)', window.theme);
  document.querySelector('.Version_Number_Class span').style.color = window.getThemeColor('rgba(29,29,29,1)', window.theme);
  document.querySelector('.Downloading_Header_Class span').style.color = window.getThemeColor('rgba(29,29,29,1)', window.theme);

  document.querySelector('#NotInstallingBackground rect').style.fill = window.getThemeColor('rgba(251,247,241,1)', window.theme);
  document.querySelector('#NotInstallingTitle span').style.color = window.getThemeColor('rgba(29,29,29,1)', window.theme);
  document.querySelector('#notInstallingStart').style.color = window.getThemeColor('rgba(29,29,29,1)', window.theme);
  document.querySelector('#notInstallingHere').style.color = window.getThemeColor('rgba(29,29,29,1)', window.theme);
  document.querySelector('#notInstallingEnd').style.color = window.getThemeColor('rgba(29,29,29,1)', window.theme);
}

updateLanguage();
updateTheme();

electron.ipcRenderer.on('updateLanguage', (event, language) => {
	window.language = language;
  updateLanguage();
});

electron.ipcRenderer.on('updateTheme', (event, theme) => {
  window.theme = theme;
  updateTheme();
});
