window.captchaSolvers = [];

const captchaPath = window.parent.url.format({
  pathname: window.parent.path.join(window.parent.__dirname, '../../../gui/views/captcha-solver/index.html'),
  protocol: 'file:',
  slashes: true
});

window.openCaptchaSolver = (node, host, sitekey) => {
  let newCaptchaSolver = {
    node: node,
    host: host,
    sitekey: sitekey,
    window: window.parent.openURL(captchaPath, false, {
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

  let curCaptchaSolverIndex = newCaptchaSolver.length-1;
  newCaptchaSolver.window.once('closed', () => {
    newCaptchaSolver.window = null;
    window.captchaSolvers.splice(curCaptchaSolverIndex, 1);
  });

};
