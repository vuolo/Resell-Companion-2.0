// imports
const authAPI = require('../../../utils/api/auth.js');
window.memory = require('../../../utils/memory.js');
window.electron = require('electron');
window.request = require('request-promise');
window.path = require('path');
window.url = require('url');
window.translate = require('translate');

// Custom APIs
window.trackingAPI = require('../../../utils/api/tracking.js');
window.marketAPI = require('../../../utils/api/market.js');
window.exchangeRatesAPI = require('../../../utils/api/exchange-rates.js');
window.csvAPI = require('../../../utils/api/csv.js');

// variables
window.companionSettings = {
  // language: "en",
  language: "es",
  // theme: "light",
  theme: "dark",
  currency: "CAD",
  currencySymbol: "CA$"
};

window.mainWebContentsID = getMainWebContentsID();
function getMainWebContentsID() {
  for (var webContents of window.electron.remote.webContents.getAllWebContents()) if (webContents.getURL().includes("/main/index.html")) return webContents.id;
}

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

window.sleep = (ms) => {
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

window.openInternal = async (url, options = {}, combineOptions = true, partition = null, proxy = null, webSecurity = true, product = null, variant = null) => {
  if (!url.includes("://")) url = "http://" + url;
  if (combineOptions) window.combineObjects(options, DEFAULT_OPEN_INTERNAL_OPTIONS);
  if (partition) options.webPreferences.partition = partition;
  options.webPreferences.webSecurity = webSecurity;

  let win = new electron.remote.BrowserWindow(options);
  if (product && product.Identifier.startsWith("supreme")) await window.frames['tasks-frame'].injectSupremeCart(product, variant, win);

  if (proxy) { // TODO: check if this works
    let proxyConfig = window.generateProxyConfig(proxy);

    win.webContents.session.setProxy({ pacScript: "", proxyRules: "http://" + proxyConfig.proxy, proxyBypassRules: "" }, () => {
      try {
        win.loadURL(url, { userAgent: USER_AGENT });
      } catch(err) {
        console.error(err);
        win.loadURL(url, { userAgent: USER_AGENT });
      }
    });

    if (proxyConfig.authenticion.username && proxyConfig.authenticion.password) {
      win.webContents.on('login', (event, authenticationResponseDetails, authInfo, callback) => {
        event.preventDefault();
        if (authInfo.isProxy) callback(proxyConfig.authenticion.username, proxyConfig.authenticion.password); // supply credentials to server
      });
    }
  } else win.loadURL(url, { userAgent: USER_AGENT });

  win.on('closed', () => {
    win = null;
  });
  return win;
};

window.openURL = async (url, useDefaultBrowser, options, partition = null, proxy = null, webSecurity = true, product = null, variant = null) => {
  if (useDefaultBrowser) return window.openExternal(url);
  else return await window.openInternal(url, options, true, partition, proxy, webSecurity, product, variant);
}

window.combineObjects = (incomingObj, fullObj) => {
  for (var key of Object.keys(fullObj)) {
    let foundKey = false;
    for (var objKey of Object.keys(incomingObj)) {
      if (key == objKey) {
        foundKey = true;
        break;
      }
    }
    if (!foundKey) {
      incomingObj[key] = fullObj[key];
    }
  }
};

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

window.formatTimestamp = (timestamp = new Date().getTime(), includeTime = true, includeDate = true) => { // TODO: add option to use 12/24 hour and also translate...
  var curDate = new Date(timestamp || undefined),
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

  if (includeTime && includeDate) return `${curDate.getMonth()+1}/${curDate.getDate()}/${curDate.getFullYear()} • ${curDateTime}`;
  else if (includeTime && !includeDate) return curDateTime;
  else if (!includeTime && includeDate) return `${curDate.getMonth()+1}/${curDate.getDate()}/${curDate.getFullYear()}`;
  else return "";
};

window.formatTimestampExpanded = (timestamp = new Date().getTime()) => {
  var curDate = new Date(timestamp || undefined);
  const options = { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" };
  return curDate.toLocaleString(window.companionSettings.language, options);
};

window.makeid = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

window.separateDate = (timestamp = new Date().getTime()) => {
  let date = new Date(timestamp);
  let dateString = date.getFullYear() + '-' + (String(date.getMonth() + 1).length == 1 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (String(date.getDate() + 1).length == 1 ? ("0" + date.getDate()) : date.getDate());
  let timeString = (String(date.getHours() % 24).length == 1 ? ("0" + String(date.getHours() % 24)) : String(date.getHours() % 24)) + ':' + 55;
  return { date: dateString, time: timeString, timestamp: timestamp };
}

async function preloadImages(array, waitForOtherResources, timeout) {
  var loaded = false, list = preloadImages.list, imgs = array.slice(0), t = timeout || 15*1000, timer;
  if (!preloadImages.list) {
    preloadImages.list = [];
  }
  if (!waitForOtherResources || document.readyState === 'complete') loadNow();
  else {
    window.addEventListener("load", function() {
      clearTimeout(timer);
      loadNow();
    });
    // in case window.addEventListener doesn't get called (sometimes some resource gets stuck)
    // then preload the images anyway after some timeout time
    timer = setTimeout(loadNow, t);
  }

  function loadNow() {
    if (!loaded) {
      loaded = true;
      for (var i = 0; i < imgs.length; i++) {
        var img = new Image();
        img.onload = img.onerror = img.onabort = function() {
          var index = list.indexOf(this);
          if (index !== -1) {
            // remove image from the array once it's loaded
            // for memory consumption reasons
            list.splice(index, 1);
          }
        }
        list.push(img);
        img.src = imgs[i];
      }
    }
  }
}
window.preloadImages = preloadImages;

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

window.tryGenerateEllipses = (maxWidth, text, incomingFontSize, incomingFontSizeType, incomingFontStyle, incomingFont) => {
  let outText = text;
  while (getTextWidth(outText, `${incomingFontStyle} ${incomingFontSize + incomingFontSizeType} ${incomingFont}`) >= maxWidth) {
    outText = outText.substring(0, outText.length-4) + "...";
  }
  return outText;
}

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

window.roundNumber = (num, scale = 2) => {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
};
