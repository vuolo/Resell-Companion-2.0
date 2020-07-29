// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// imports

// variables
var browsers = [];
var browserURLS = [];
let browsersApp;

window.browserModals = {
  'create': {
    visible: false
  }
}

window.openBrowserModal = (modalName) => {
  window.browserModals[modalName].visible = true;
}

window.browserModalLoadedCallback = async (modalName) => {
  if (modalName == 'create') {
    while(!browsersApp) {
      await window.parent.sleep(50);
    }
    browsersApp.createModal = window.frames['create-modal'].modalOptions;
  }
}

window.onload = () => {
  setTimeout(function() { applyButtonTransitions(true) }, 1500);
  browsersApp = new Vue({
    el: "#Rewrite___Browser",
    data: {
      companionSettings: window.parent.companionSettings,
      modals: window.browserModals,
      createModal: {},
      browsers: browsers,
      browserURLS: browserURLS,
      creatingBrowsers: false
    },
    methods: {
      confineTextWidth: window.parent.confineTextWidth,
      getTextWidth: window.parent.getTextWidth,
      tryTranslate: window.parent.tryTranslate,
      getThemeColor: window.parent.getThemeColor,
      openModal: window.openBrowserModal,
      openNewBrowsersModal: function() {
        if (this.creatingBrowsers) return;
        window.frames['create-modal'].resetModalOptions();
        this.openModal('create');
      },
      shouldDisplayModals: function() {
        for (var modal in browserModals) {
          if (browserModals[modal].visible) return true;
        }
        return false;
      },
      getVisualizedBrowserIndex: getVisualizedBrowserIndex,
      shortenURL: function(url) {
        return new URL(url).host.replace("www.", "");
      },
      bindAndLaunchBrowser: bindAndLaunchBrowser,
      calculateBrowserPosition: function(browserIndex) {
        return { top: (Math.floor(browserIndex/5) * (218+9)) + 11 + 'px', left: ((browserIndex%5) * (227+9)) + 10 + 'px' }
      },
      refreshBrowser: function(browserIndex) {
        // TODO: rework this function (maybe there is an actual function to refresh) OR call location.reload() on the frame
        const webviews = document.querySelectorAll('webview');
        const curWebview = webviews[browserIndex];
        curWebview.loadURL(curWebview.getURL());
        window.parent.addStatistic('Browsers', 'Browsers Refreshed');
      },
      deleteBrowser: async function(browserIndex) {
        browsers[browserIndex].active = false;
        var allBrowsersDeleted = true;
        for (var browser of browsers) {
          if (browser.active) {
            allBrowsersDeleted = false;
            break;
          }
        }
        if (allBrowsersDeleted) {
          clearAllBrowsers();
        }
      },
      clearAllBrowsers: clearAllBrowsers
    }
  });
}

function getVisualizedBrowserIndex(actualBrowserIndex) {
  let indexOffset = 0;
  for (var i = 0; i < browsers.length; i++) {
    if (!browsers[i].active) {
      indexOffset--;
    }
    if (i == actualBrowserIndex) {
      return i + indexOffset;
    }
  }
}

async function clearAllBrowsers() {
  browsersApp.creatingBrowsers = false;
  while(browsers.length > 0) {
    // TODO: SET BROWSER VIEW = NULL TO FULLY DELETE BROWSER SESSION
    // browsers[browsers.length-1]

    browsers.pop();
  }
  while (browserURLS.length > 0) {
    browserURLS.pop();
  }
}

window.addNewBrowsers = async (incomingOptions) => {
  let options = window.parent.memory.copyObj(incomingOptions);
  let curProxyIndex = 0;
  browsersApp.creatingBrowsers = true;
  for (var i = 0; i < options.quantity; i++) {
    if (!browsersApp.creatingBrowsers) {
      break;
    }
    let proxy;
    if (options.proxyProfile) {
      // rotate proxies here based on options.proxyProfile
      for (var proxyProfile of []) { // TODO: add proxyprofiles list
        // TODO (possibly): rework proxy profile locator method depending on how we gather the proxyProfile from the <select>
        if (proxyProfile.name == options.proxyProfile) {
          proxy = proxyProfile.proxies.length > curProxyIndex ? proxyProfile.proxies[curProxyIndex] : null;
          curProxyIndex++;
          if (curProxyIndex >= proxyProfile.proxies.length) {
            curProxyIndex = 0;
          }
        }
      }
    }
    // TODO: add to statistics
    await addNewBrowser(options, proxy);
    window.parent.addStatistic('Browsers', 'Browsers Created');
    if (options.creationDelay && i < options.quantity-1) {
      await window.parent.sleep(parseInt(options.creationDelay));
    }
  }
  browsersApp.creatingBrowsers = false;
};

async function addNewBrowser(options, proxy) {
  const electron = window.parent.require('electron');
  let formattedURL = (options.URL.includes('https://') ? 'https://' : 'http://') + options.URL.replace(new RegExp('https://', 'g'), '').replace(new RegExp('http://', 'g'), '');
  if (proxy && proxy.includes("@")) {
    // document.querySelector('#BrowserAuthentication_Modal').style.display = "block";
  }
  browsers.push({
    active: true,
    URL: formattedURL,
    identifier: window.parent.makeid(10),
    proxy: proxy,
    disableImages: options.disableImages
  });
  console.log("browser created");
  browserURLS.push(formattedURL);
  let curBrowserIndex = browsers.length-1;
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36';
  console.log("declared constants");

  await window.parent.sleep(50);
  if (browsers[curBrowserIndex].proxy) { // setup proxy

    let proxyConfig = window.parent.generateProxyConfig(proxy);

    console.log("setting up proxy...");
    const curWebview = document.querySelectorAll('webview')[getVisualizedBrowserIndex(curBrowserIndex)];
    electron.remote.webContents.fromId(curWebview.getWebContentsId()).session.setProxy({ pacScript: "", proxyRules: "http://" + proxyConfig.proxy, proxyBypassRules: "" }, () => {
      try {
        curWebview.loadURL(formattedURL, {userAgent: userAgent});
      } catch(err) {
        console.log(err);
        curWebview.loadURL(formattedURL, {userAgent: userAgent});
      }
    });

    if (proxyConfig.authenticion.username && proxyConfig.authenticion.password) {
      electron.remote.webContents.fromId(curWebview.getWebContentsId()).on('login', (event, authenticationResponseDetails, authInfo, callback) => {
        event.preventDefault();
        if (authInfo.isProxy) {
          callback(proxyConfig.authenticion.username, proxyConfig.authenticion.password); // supply credentials to server
        }
      });
    }

    console.log("setup proxy");
    // document.querySelector('#BrowserAuthentication_Modal').style.display = "none";
  }
}

async function bindAndLaunchBrowser(browserIndex) {

  try {
    const webviews = document.querySelectorAll('webview');
    const curWebview = webviews[getVisualizedBrowserIndex(browserIndex)];

    const electron = window.parent.require('electron');
    const BrowserWindow = electron.remote.BrowserWindow;
    const BrowserView = electron.remote.BrowserView;
    const path = window.parent.require('path');
    const iconPath = window.parent.process.platform != "darwin" ? path.resolve(window.parent.__dirname, '../../../build-assets/icons/win-icon.ico') : undefined;

    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36';

    // let win = new BrowserWindow({width: 1050, height: 650, icon: iconPath})
    let win = new BrowserWindow({ title: curWebview.getTitle(), width: 1050, height: 650, frame: false, show: true, autoHideMenuBar: true, icon: iconPath, webPreferences: { partition: `persist:${browsers[browserIndex].identifier}`, nodeIntegration: false, enableRemoteModule: false, sandbox: true, images: !browsers[browserIndex].disableImages, preload: path.join(window.parent.__dirname, "../../../utils/preload.js") } });

    const winSession = win.webContents.session;
    const webviewSession = electron.remote.webContents.fromId(curWebview.getWebContentsId()).session;

    win.on('closed', () => {
      win = null;
    });
    let curURL = "";
    win.webContents.on('did-navigate', (event, url) => {
      console.log(url);
      // if (url == "https://www.supremenewyork.com/checkout" && (autofillSettings.email && autofillSettings.email != "")) {
      //   win.loadURL(`https://www.supremenewyork.com/checkout${generateAutofillQueryString('supreme')}`, {userAgent: userAgent});
      // }

      curWebview.loadURL(url, {userAgent: userAgent});
      const curWebviews = document.querySelectorAll('webview');
      for (var i = 0; i < curWebviews.length; i++) {
        console.log(curWebviews[i].getWebContentsId());
        if (curWebviews[i].getWebContentsId() == curWebview.getWebContentsId()) {
          browserURLS[i] = url;
          break;
        }
      }
    });
    win.loadURL(curWebview.getURL(), {userAgent: userAgent});
  } catch(err) {
    console.log(err);
  }

}
