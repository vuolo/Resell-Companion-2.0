// imports
const authAPI = require('../../../utils/api/auth.js');
window.memory = require('../../../utils/memory.js');
window.electron = require('electron');
window.path = require('path');

// variables
window.companionSettings = {
  // language: "en",
  language: "es",
  // theme: "light",
  theme: "dark",
};

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36';
const ICON_PATH = process.platform == "win32" ? path.resolve(__dirname, '../../../build-assets/icons/win-icon.ico') : undefined; // not needed for mac
window.DEFAULT_OPEN_INTERNAL_OPTIONS = {
  title: "Resell Companion",
  width: 1050,
  height: 650,
  frame: false,
  show: true,
  autoHideMenuBar: true,
  icon: ICON_PATH,
  webPreferences: {
    nodeIntegration: false,
    enableRemoteModule: false,
    sandbox: true,
    preload: path.join(__dirname, "../../../utils/preload.js")
  }
};

const appVersion = electron.remote.app.getVersion();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// to define a variable that can be accessed from child frames
// window.out_var = "out VAR!";
// or
// out_var = "out VAR!"

// to access a variable from a child frame
// window.frames['monitors-frame'].pokemon

// functions
window.openExternal = (url) => {
  if (!url.includes("://")) {
    url = "http://" + url;
  }
  electron.shell.openExternal(url);
};

window.openInternal = (url, options = {}, combineOptions = true) => {
  if (!url.includes("://")) {
    url = "http://" + url;
  }
  if (combineOptions) {
    for (var key of Object.keys(DEFAULT_OPEN_INTERNAL_OPTIONS)) {
      let foundKey = false;
      for (var optionKey of Object.keys(options)) {
        if (key == optionKey) {
          foundKey = true;
          break;
        }
      }
      if (!foundKey) {
        options[key] = DEFAULT_OPEN_INTERNAL_OPTIONS[key];
      }
    }
  }
  let win = new electron.remote.BrowserWindow(options);
  win.loadURL(url, { userAgent: USER_AGENT });
  win.on('closed', () => {
    win = null;
  });
  return win;
};

window.openURL = (url, useDefaultBrowser, options) => {
  if (useDefaultBrowser) {
    window.openExternal(url);
  } else {
    window.openInternal(url, options);
  }
}

window.getKeyOnCurPlatform = (key) => {
  if (key.toLowerCase() == "ctrl" || key.toLowerCase() == "control" || key.toLowerCase() == "cmd" || key.toLowerCase() == "command") {
    return window.parent.process.platform == "win32" ? "Ctrl" : "Command";
  }
  return key;
};

window.curLogin = authAPI.getLoginTemplate();
electron.ipcRenderer.on('user-transfer', function(event, inLogin) {
  memory.syncObject(window.curLogin, inLogin);
  // login ready to be used
});

window.formatTimestamp = (timestamp) => { // TODO: add option to use 12/24 hour and also translate...
  curDate = new Date(timestamp || undefined),
  weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
  dayOfWeek = weekday[curDate.getDay()],
  domEnder = function() { var a = curDate; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == curDate.getDate() ? "st" : 2 == curDate.getDate() ? "nd" : 3 == curDate.getDate() ? "rd" : "th" }(),
  dayOfMonth = ( curDate.getDate() < 10) ? '0' + curDate.getDate() + domEnder : curDate.getDate() + domEnder,
  months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
  curMonth = months[curDate.getMonth()],
  curYear = curDate.getFullYear(),
  curHour = curDate.getHours() > 12 ? curDate.getHours() - 12 : (curDate.getHours() < 10 ? "0" + curDate.getHours() : curDate.getHours()),
  curMinute = curDate.getMinutes() < 10 ? "0" + curDate.getMinutes() : curDate.getMinutes(),
  curSeconds = curDate.getSeconds() < 10 ? "0" + curDate.getSeconds() : curDate.getSeconds(),
  curMeridiem = curDate.getHours() > 12 ? "PM" : "AM";
  var curDateTime = String(curHour).replace("00", "12") + ":" + curMinute + ":" + curSeconds + " " + curMeridiem;

  return `${curDate.getMonth()+1}/${curDate.getDate()}/${curDate.getFullYear()} • ${curDateTime}`;
};

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 */
window.getTextWidth = (text, font) => {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
};

window.confineTextWidth = (maxWidth, text, incomingFontSize, incomingFontSizeType, incomingFontStyle, incomingFont, includeFontSizeType = true) => {
  var outFontSize = incomingFontSize;
  while (getTextWidth(text, `${incomingFontStyle} ${outFontSize + incomingFontSizeType} ${incomingFont}`) >= maxWidth) {
    outFontSize -= 0.5;
  }
  return includeFontSizeType ? (outFontSize + incomingFontSizeType) : outFontSize;
};

window.calculateUnderlineWidth = (maxWidth, text, incomingFontSize, incomingFontSizeType, incomingFontStyle, incomingFont, multiplier = 0.25) => {
  let textWidth = getTextWidth(text, `${incomingFontStyle} ${confineTextWidth(maxWidth, text, incomingFontSize, incomingFontSizeType, incomingFontStyle, incomingFont)} ${incomingFont}`);
  return Math.floor(textWidth * multiplier);
};

window.calculateUnderlineLeftOffset = (maxWidth, text, incomingFontSize, incomingFontSizeType, incomingFontStyle, incomingFont, isCentered = true, multiplier = 0.10) => {
  let textWidth = getTextWidth(text, `${incomingFontStyle} ${confineTextWidth(maxWidth, text, incomingFontSize, incomingFontSizeType, incomingFontStyle, incomingFont)} ${incomingFont}`);
  return Math.floor((isCentered ? ((maxWidth - textWidth) / 2) : 0) + (textWidth * multiplier));
};

window.numberWithCommas = (x) => {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};
