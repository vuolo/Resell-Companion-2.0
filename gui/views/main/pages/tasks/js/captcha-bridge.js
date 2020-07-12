window.captchaSolvers = [];

const captchaSolverPath = window.parent.url.format({
  pathname: window.parent.path.join(window.parent.__dirname, '../../../gui/views/captcha-solver/index.html'),
  protocol: 'file:',
  slashes: true
});

window.openCaptchaSolver = async (node, host = "resell.monster", sitekey) => {
  let newCaptchaSolver = {
    node: node,
    host: host,
    sitekey: sitekey,
    window: await window.parent.openURL(captchaSolverPath, false, {
      title: 'Resell Companion — Captcha Solver ' + window.captchaSolvers.length + 1,
      show: true,
      width: 400,
      height: 725,
      resizable: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        webviewTag: true, // for the captcha frame
        preload: window.parent.path.join(window.parent.__dirname, "../../../utils/preload.js")
      }
    }, `persist:${window.parent.makeid(10)}`)
  };
  window.captchaSolvers.push(newCaptchaSolver);
  console.log(newCaptchaSolver);

  newCaptchaSolver.window.webContents.once('dom-ready', () => {
    if (node) window.sendOptionsToCaptchaSolver({ mainWebContentsID: window.parent.mainWebContentsID, nodeID: node.id, host: host, sitekey: sitekey }, window.captchaSolvers.indexOf(newCaptchaSolver));
    window.sendThemeToCaptchaSolvers(window.parent.companionSettings.theme, window.captchaSolvers.indexOf(newCaptchaSolver));
    window.sendLanguageToCaptchaSolvers(window.parent.companionSettings.language, window.captchaSolvers.indexOf(newCaptchaSolver));
    window.refreshCaptchaSolverNumbers(window.captchaSolvers.indexOf(newCaptchaSolver));
  });
  newCaptchaSolver.window.once('closed', () => {
    newCaptchaSolver.window = null;
    if (newCaptchaSolver.node && newCaptchaSolver.node.checkoutWindow) newCaptchaSolver.node.checkoutWindow.close();
    window.captchaSolvers.splice(window.captchaSolvers.indexOf(newCaptchaSolver), 1);
    window.refreshCaptchaSolverNumbers();
  });
};

// TODO: spread captchas around screen upon focus?
// try to use an unused captcha solver if some are already opened
window.initiateCaptchaSolver = (node, host = "resell.monster", sitekey) => {
  for (var i = 0; i < window.captchaSolvers.length; i++) {
    if (!window.captchaSolvers[i].node) {
      window.captchaSolvers[i].node = node;
      window.captchaSolvers[i].host = sitekey;
      window.captchaSolvers[i].sitekey = sitekey;
      window.captchaSolvers[i].window.focus();
      window.sendOptionsToCaptchaSolver({ mainWebContentsID: window.parent.mainWebContentsID, nodeID: node.id, host: host, sitekey: sitekey }, i);
      return;
    }
  }
  // no free solver found -> make new
  window.openCaptchaSolver(node, host, sitekey);
};

window.resetCaptchaSolver = (captchaSolver) => {
  captchaSolver.node = null;
  captchaSolver.host = "resell.monster";
  captchaSolver.sitekey = null;
  captchaSolver.window.webContents.send('resetOptions');
};

function setCaptchaResponse(nodeID, captchaResponse) {
  for (var captchaSolver of window.captchaSolvers) {
    if (captchaSolver.node && captchaSolver.node.id == nodeID) {
      captchaSolver.node.captchaResponse = captchaResponse;
      window.resetCaptchaSolver(captchaSolver);
      return;
    }
  }
}

window.parent.electron.ipcRenderer.on('captchaResponse', (event, captchaResponseOptions) => {
  setCaptchaResponse(captchaResponseOptions.nodeID, captchaResponseOptions.captchaResponse);
});

window.sendOptionsToCaptchaSolver = (options, captchaSolverIndex) => {
  window.captchaSolvers[captchaSolverIndex].window.webContents.send('updateOptions', options);
};

window.sendThemeToCaptchaSolvers = (theme, captchaSolverIndex = null) => {
  if (captchaSolverIndex) {
    window.captchaSolvers[captchaSolverIndex].window.webContents.send('updateTheme', theme);
    return;
  }
  for (var captchaSolver of window.captchaSolvers) {
    captchaSolver.window.webContents.send('updateTheme', theme);
  }
};

window.sendLanguageToCaptchaSolvers = (language, captchaSolverIndex = null) => {
  if (captchaSolverIndex) {
    window.captchaSolvers[captchaSolverIndex].window.webContents.send('updateLanguage', language);
    return;
  }
  for (var captchaSolver of window.captchaSolvers) {
    captchaSolver.window.webContents.send('updateLanguage', language);
  }
};

window.refreshCaptchaSolverNumbers = (captchaSolverIndex = null) => {
  if (captchaSolverIndex) {
    window.captchaSolvers[captchaSolverIndex].window.webContents.send('updateNumber', captchaSolverIndex+1);
    return;
  }
  for (var i = 0; i < window.captchaSolvers.length; i++) {
    window.captchaSolvers[i].window.webContents.send('updateNumber', i+1);
  }
};
