const request = require('request-promise');

const ICON_PATH = process.platform == "win32" ? path.resolve(__dirname, '../../build-assets/icons/win-icon.ico') : undefined; // not needed for mac

function launchUpdateWindow() {
  const { BrowserWindow } = require('electron').remote;
  const path = require('path');
  const url = require('url');

  let win = new BrowserWindow({
    title: "Resell Companion — " + window.tryTranslate('Updating') +  "...",
    width: 493,
    height: 332,
    frame: false,
    show: true,
    resizable: false,
    autoHideMenuBar: true,
    transparent: true,
    icon: ICON_PATH,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.on('closed', () => {
    win = null;
  });

  // send theme and language to update window
  win.webContents.once('dom-ready', () => {
    win.webContents.send('updateTheme', window.companionSettings.theme);
    win.webContents.send('updateLanguage', window.companionSettings.language);
  });

  // Load html in window
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../../gui/views/update/index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

async function checkForUpdate(appVersion = appVersion, platform = process.platform) {
  let uri = `https://resell.monster/api/resell-companion/check-for-update?version=${appVersion}&platform=${platform}`;

  const requestOptions = {
    uri: uri,
    simple: false,
    resolveWithFullResponse: true,
    json: true // Automatically parses the JSON string in the response
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') return false;
  else return body;

}

module.exports = {
  checkForUpdate: checkForUpdate,
  launchUpdateWindow: launchUpdateWindow
};
