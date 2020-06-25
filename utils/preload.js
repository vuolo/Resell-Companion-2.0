const debugPreload = true;

falseNavigator = {
  vendorSub: "",
  productSub: "20030107",
  vendor: "Google Inc.",
  maxTouchPoints: 0,
  hardwareConcurrency: 12,
  cookieEnabled: true,
  appCodeName: "Mozilla",
  appName: "Netscape",
  appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36",
  platform: "Win32",
  product: "Gecko",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36",
  // language: "es-US",
  // languages: ["es-US", "en", "en-US"],
  onLine: true,
  doNotTrack: "1",

  deviceMemory: 8
}

// ############################################### FALSIFY NAVIGATOR

if (debugPreload) console.log("Setting up false navigator...");
setupFalseNavigator(falseNavigator);
if (debugPreload) console.log("~False navigator setup!");

// ############################################### HEADCHR_IFRAME TEST

// if (debugPreload) console.log("Overwriting IFrame prototype to pass headless chrome iframe test...");
// // Pass the Headless Chrome IFrame Test.
// Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
//   get: function () {
//     return window;
//   }
// });
// if (debugPreload) console.log("~IFrame prototype overwritten!");

// ############################################### LANGUAGES TEST

if (debugPreload) console.log("Overwriting languages to pass languages test...");
// Pass the Languages Test.
Object.defineProperty(navigator, 'languages', {
  get: () => ['en-US', 'en'],
});
if (debugPreload) console.log("~Languages overwritten!");

// ############################################### PERMISSIONS TEST

if (debugPreload) console.log("Overwriting permissions to pass permissions test...");
// Pass the Permissions Test.
const originalQuery = window.navigator.permissions.query;
window.navigator.permissions.__proto__.query = parameters =>
  parameters.name === 'notifications'
    ? Promise.resolve({ state: Notification.permission }) //eslint-disable-line
    : originalQuery(parameters);

// Inspired by: https://github.com/ikarienator/phantomjs_hide_and_seek/blob/master/5.spoofFunctionBind.js
const oldCall = Function.prototype.call;
function call() {
  return oldCall.apply(this, arguments);
}
Function.prototype.call = call;

const nativeToStringFunctionString = Error.toString().replace(
  /Error/g,
  'toString'
);
const oldToString = Function.prototype.toString;

function functionToString() {
  if (this === window.navigator.permissions.query) {
    return 'function query() { [native code] }';
  }
  if (this === functionToString) {
    return nativeToStringFunctionString;
  }
  return oldCall.call(oldToString, this);
}
// eslint-disable-next-line
Function.prototype.toString = functionToString;
if (debugPreload) console.log("~Permissions overwritten!");

// ############################################### CHROME TEST

if (debugPreload) console.log("Overwriting window.chrome to pass Chrome test...");
// Pass the Chrome Test.
const installer = { install() {} }
window.chrome = {
  app: {
    isInstalled: false,
    InstallState: {
      DISABLED: 'disabled',
      INSTALLED: 'installed',
      NOT_INSTALLED: 'not_installed'
    },
    RunningState: {
      CANNOT_RUN: 'cannot_run',
      READY_TO_RUN: 'ready_to_run',
      RUNNING: 'running'
    }
  },
  csi() {},
  loadTimes() {},
  webstore: {
    onInstallStageChanged: {},
    onDownloadProgress: {},
    install(url, onSuccess, onFailure) {
      installer.install(url, onSuccess, onFailure)
    }
  },
  runtime: {
    OnInstalledReason: {
      CHROME_UPDATE: 'chrome_update',
      INSTALL: 'install',
      SHARED_MODULE_UPDATE: 'shared_module_update',
      UPDATE: 'update'
    },
    OnRestartRequiredReason: {
      APP_UPDATE: 'app_update',
      OS_UPDATE: 'os_update',
      PERIODIC: 'periodic'
    },
    PlatformArch: {
      ARM: 'arm',
      MIPS: 'mips',
      MIPS64: 'mips64',
      X86_32: 'x86-32',
      X86_64: 'x86-64'
    },
    PlatformNaclArch: {
      ARM: 'arm',
      MIPS: 'mips',
      MIPS64: 'mips64',
      X86_32: 'x86-32',
      X86_64: 'x86-64'
    },
    PlatformOs: {
      ANDROID: 'android',
      CROS: 'cros',
      LINUX: 'linux',
      MAC: 'mac',
      OPENBSD: 'openbsd',
      WIN: 'win'
    },
    RequestUpdateCheckStatus: {
      NO_UPDATE: 'no_update',
      THROTTLED: 'throttled',
      UPDATE_AVAILABLE: 'update_available'
    },
    connect: function() {}.bind(function() {}), // eslint-disable-line
    sendMessage: function() {}.bind(function() {}) // eslint-disable-line
  }
};
if (debugPreload) console.log("~Chrome overwritten!");

// ############################################### PLUGINS / MIMETYPES TEST

if (debugPreload) console.log("Overwriting Plugins and Mimetypes to pass Plugins / Mimetypes test...");
// Pass the Plugins/Mimetypes Test.
// Overwrite the `plugins` property to use a custom getter.
function mockPluginsAndMimeTypes() {
  /* global MimeType MimeTypeArray PluginArray */

  // Disguise custom functions as being native
  const makeFnsNative = (fns = []) => {
    const oldCall = Function.prototype.call
    function call() {
      return oldCall.apply(this, arguments)
    }
    // eslint-disable-next-line
    Function.prototype.call = call

    const nativeToStringFunctionString = Error.toString().replace(
      /Error/g,
      'toString'
    )
    const oldToString = Function.prototype.toString

    function functionToString() {
      for (const fn of fns) {
        if (this === fn.ref) {
          return `function ${fn.name}() { [native code] }`
        }
      }

      if (this === functionToString) {
        return nativeToStringFunctionString
      }
      return oldCall.call(oldToString, this)
    }
    // eslint-disable-next-line
    Function.prototype.toString = functionToString
  }

  const mockedFns = []

  const fakeData = {
    mimeTypes: [
      {
        type: 'application/pdf',
        suffixes: 'pdf',
        description: '',
        __pluginName: 'Chrome PDF Viewer'
      },
      {
        type: 'application/x-google-chrome-pdf',
        suffixes: 'pdf',
        description: 'Portable Document Format',
        __pluginName: 'Chrome PDF Plugin'
      },
      {
        type: 'application/x-nacl',
        suffixes: '',
        description: 'Native Client Executable',
        enabledPlugin: Plugin,
        __pluginName: 'Native Client'
      },
      {
        type: 'application/x-pnacl',
        suffixes: '',
        description: 'Portable Native Client Executable',
        __pluginName: 'Native Client'
      }
    ],
    plugins: [
      {
        name: 'Chrome PDF Plugin',
        filename: 'internal-pdf-viewer',
        description: 'Portable Document Format'
      },
      {
        name: 'Chrome PDF Viewer',
        filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
        description: ''
      },
      {
        name: 'Native Client',
        filename: 'internal-nacl-plugin',
        description: ''
      }
    ],
    fns: {
      namedItem: instanceName => {
        // Returns the Plugin/MimeType with the specified name.
        const fn = function(name) {
          if (!arguments.length) {
            throw new TypeError(
              `Failed to execute 'namedItem' on '${instanceName}': 1 argument required, but only 0 present.`
            )
          }
          return this[name] || null
        }
        mockedFns.push({ ref: fn, name: 'namedItem' })
        return fn
      },
      item: instanceName => {
        // Returns the Plugin/MimeType at the specified index into the array.
        const fn = function(index) {
          if (!arguments.length) {
            throw new TypeError(
              `Failed to execute 'namedItem' on '${instanceName}': 1 argument required, but only 0 present.`
            )
          }
          return this[index] || null
        }
        mockedFns.push({ ref: fn, name: 'item' })
        return fn
      },
      refresh: instanceName => {
        // Refreshes all plugins on the current page, optionally reloading documents.
        const fn = function() {
          return undefined
        }
        mockedFns.push({ ref: fn, name: 'refresh' })
        return fn
      }
    }
  }
  // Poor mans _.pluck
  const getSubset = (keys, obj) =>
    keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {})

  function generateMimeTypeArray() {
    const arr = fakeData.mimeTypes
      .map(obj => getSubset(['type', 'suffixes', 'description'], obj))
      .map(obj => Object.setPrototypeOf(obj, MimeType.prototype))
    arr.forEach(obj => {
      arr[obj.type] = obj
    })

    // Mock functions
    arr.namedItem = fakeData.fns.namedItem('MimeTypeArray')
    arr.item = fakeData.fns.item('MimeTypeArray')

    return Object.setPrototypeOf(arr, MimeTypeArray.prototype)
  }

  const mimeTypeArray = generateMimeTypeArray()
  Object.defineProperty(navigator, 'mimeTypes', {
    get: () => mimeTypeArray
  })

  function generatePluginArray() {
    const arr = fakeData.plugins
      .map(obj => getSubset(['name', 'filename', 'description'], obj))
      .map(obj => {
        const mimes = fakeData.mimeTypes.filter(
          m => m.__pluginName === obj.name
        )
        // Add mimetypes
        mimes.forEach((mime, index) => {
          navigator.mimeTypes[mime.type].enabledPlugin = obj
          obj[mime.type] = navigator.mimeTypes[mime.type]
          obj[index] = navigator.mimeTypes[mime.type]
        })
        obj.length = mimes.length
        return obj
      })
      .map(obj => {
        // Mock functions
        obj.namedItem = fakeData.fns.namedItem('Plugin')
        obj.item = fakeData.fns.item('Plugin')
        return obj
      })
      .map(obj => Object.setPrototypeOf(obj, Plugin.prototype))
    arr.forEach(obj => {
      arr[obj.name] = obj
    })

    // Mock functions
    arr.namedItem = fakeData.fns.namedItem('PluginArray')
    arr.item = fakeData.fns.item('PluginArray')
    arr.refresh = fakeData.fns.refresh('PluginArray')

    return Object.setPrototypeOf(arr, PluginArray.prototype)
  }

  const pluginArray = generatePluginArray()
  Object.defineProperty(navigator, 'plugins', {
    get: () => pluginArray
  })

  // Make mockedFns toString() representation resemble a native function
  makeFnsNative(mockedFns)
}
try {
  const isPluginArray = navigator.plugins instanceof PluginArray
  const hasPlugins = isPluginArray && navigator.plugins.length > 0
  // if (!(isPluginArray && hasPlugins)) {
    mockPluginsAndMimeTypes();
  // }
} catch (err) {
  console.error(err);
}
if (debugPreload) console.log("~Plugins and Mimetypes overwritten!");

// ############################################### FUNCS

function falsifyNavigator(key, value) {
  if (Object.defineProperty) {
    Object.defineProperty(navigator, key, {
      get: function () { return value; }
    });
  } else if (Object.prototype.__defineGetter__) {
    navigator.__defineGetter__(key, function () { return value; });
  }
}

function setupFalseNavigator(navOpts) {
  for (var key in navOpts) {
    falsifyNavigator(key, navOpts[key]);
  }
}

// ############################################### BROWSER TOP

var topBarInjected = false;

document.addEventListener('DOMContentLoaded', function() {
  if (debugPreload) console.log("Injecting top URL bar...");
  tryInjectTopBar();
  if (debugPreload) console.log("~Injected top URL bar!");
}, false);

function tryInjectTopBar() {

  if (topBarInjected) {
    return;
  }
  topBarInjected = true;

  // disable for small browser
  if (
    (location.href == "chrome-error://chromewebdata/") || // dont inject on error browser
    (window.innerWidth == 420 && window.innerHeight == 340) || // browser window (small)
    (window.innerWidth == 400 && window.innerHeight == 725) || // captcha solver window
    (window.innerWidth == 390 && window.innerHeight == 674) // captcha frame window
    // (window.innerWidth == 500 && window.innerHeight == 820) // login window
  ) {
    return;
  }

  const topBarCode = `
    <div id="resell_companion_injection" style="background: rgba(251,247,241,1);">
      <style>
        .resell_companion_clickable:hover {
          cursor: pointer;
          opacity: 0.8;
        }

        /* The navigation bar */
        #resell_companion_top_bar {
          user-select: text;
          width: 99%;
          height: 36px;
          background: rgba(255,237,200,1);
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
          filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.161));
          -webkit-app-region: drag;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 999999;
        }

        #resell_companion_left_arrow {
          top: 26%;
          left: 10px;
          position: fixed;
          -webkit-app-region: no-drag;
        }

        #resell_companion_right_arrow {
          top: 26%;
          left: 40px;
          position: fixed;
          -webkit-app-region: no-drag;
        }

        #resell_companion_refresh_icon {
          top: 26%;
          left: 72px;
          position: fixed;
          -webkit-app-region: no-drag;
        }

        #resell_companion_lock_icon {
          top: 26%;
          left: 105px;
          position: fixed;
          -webkit-app-region: no-drag;
          z-index: 2;
          transform: scale(0.6);
          opacity: 0.85;
        }

        #resell_companion_unlock_icon {
          top: 26%;
          left: 105px;
          position: fixed;
          -webkit-app-region: no-drag;
          z-index: 2;
          transform: scale(0.6);
          opacity: 0.85;
        }

        #resell_companion_url_bar {
          top: 26%;
          position: fixed;
          left: 100px;
          width: 80%;
          -webkit-app-region: no-drag;
        }

        #resell_companion_url_bar input {
          text-transform: none;
          min-height: 20px;
          height: 20px;
          max-height: 20px;
          min-width: 80%;
          width: 80%;
          max-width: 80%;
          -webkit-app-region: no-drag;
          font-family: Arial, Helvetica, sans-serif;
          border-radius: 10px;
          border: none;
          font-size: 14px;
          padding: 0;
          padding-left: 25px;
          background: rgba(243,224,185,1);
          color: #1d1d1d;
          top: 8px;
          left: 99px;
          position: fixed;
        }

        /* Main content */
        #resell_companion_main {
          margin-top: 36px; /* Add a top margin to avoid content overlay */
        }

        #resell_companion_Window_Buttons {
          position: absolute;
          width: 51.111px;
          height: 20px;
          right: 10px;
          top: 7.5px;
          overflow: visible;
        }
        .resell_companion_Close_Icon:hover {
          fill: #d72c2e;
          cursor: pointer;
          opacity: 0.85;
        }
        .resell_companion_Close_Icon {
          -webkit-app-region: no-drag;
          overflow: visible;
          position: absolute;
          width: 20px;
          height: 20px;
          left: 31.11px;
          top: 0px;
          transform: matrix(1,0,0,1,0,0);
          z-index: 999;
        }
        .resell_companion_Maximize_Icon:hover {
          fill: #db8f44;
          cursor: pointer;
          opacity: 0.85;
        }
        .resell_companion_Maximize_Icon {
          -webkit-app-region: no-drag;
          overflow: visible;
          position: absolute;
          width: 20px;
          height: 20px;
          left: 0px;
          top: 0px;
          transform: matrix(1,0,0,1,0,0);
          z-index: 999;
        }
        .resell_companion_Minimize_Icon:hover {
          fill: #db8f44;
          cursor: pointer;
          opacity: 0.85;
        }
        .resell_companion_Minimize_Icon {
          -webkit-app-region: no-drag;
          overflow: visible;
          position: absolute;
          width: 20px;
          height: 20px;
          left: 0px;
          top: 0px;
          transform: matrix(1,0,0,1,0,0);
          z-index: 999;
        }

        /* Scrollbar styles */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          /* border: 1px solid rgba(243,224,185,1); */
          /* border-radius: 10px; */

          /* background: #fbf7f1; */
          /* background: transparent; */
          background: rgba(251,247,241,1);
        }

        ::-webkit-scrollbar-corner {
          background: rgba(0,0,0,0);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(243,224,185,1);
          filter: drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.161));
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #dfcfac;
        }

      </style>

      <div id="resell_companion_top_bar">
        <svg id="resell_companion_left_arrow" onclick="window.history.back();" class="resell_companion_clickable" xmlns="http://www.w3.org/2000/svg" width="18.134" height="17.674" viewBox="0 0 18.134 17.674">
          <path d="M10.42,19.138l-.9.9a.967.967,0,0,1-1.372,0L.282,12.172a.967.967,0,0,1,0-1.372L8.15,2.933a.967.967,0,0,1,1.372,0l.9.9A.972.972,0,0,1,10.4,5.219L5.527,9.866H17.159a.969.969,0,0,1,.971.971v1.3a.969.969,0,0,1-.971.971H5.527L10.4,17.75A.965.965,0,0,1,10.42,19.138Z" transform="translate(0.004 -2.647)" fill="#1d1d1d"/>
        </svg>
        <svg id="resell_companion_right_arrow" onclick="window.history.forward();" class="resell_companion_clickable" xmlns="http://www.w3.org/2000/svg" width="18.134" height="17.674" viewBox="0 0 18.134 17.674">
          <path d="M7.71,3.831l.9-.9a.967.967,0,0,1,1.372,0L17.848,10.8a.967.967,0,0,1,0,1.372L9.981,20.036a.967.967,0,0,1-1.372,0l-.9-.9a.972.972,0,0,1,.016-1.388L12.6,13.1H.971A.969.969,0,0,1,0,12.132v-1.3a.969.969,0,0,1,.971-.971H12.6L7.726,5.219A.965.965,0,0,1,7.71,3.831Z" transform="translate(0 -2.647)" fill="#1d1d1d"/>
        </svg>
        <svg id="resell_companion_refresh_icon" onclick="location.reload();" class="resell_companion_clickable" xmlns="http://www.w3.org/2000/svg" width="18.134" height="17.674" viewBox="0 0 18.134 17.674">
          <path d="M21.082,8.6a8.839,8.839,0,1,0,2.3,8.451h-2.3a6.625,6.625,0,1,1-6.241-8.837A6.534,6.534,0,0,1,19.5,10.176l-3.557,3.557h7.733V6Z" transform="translate(-6.015 -6)" fill="#1d1d1d"/>
        </svg>

        <svg id="resell_companion_lock_icon" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="18.134" height="17.674" viewBox="0 0 18.134 17.674">
          <path d="M6.427,22.614V12.265h1.94V9.031a5.174,5.174,0,0,1,5.175-5.175h.647a5.175,5.175,0,0,1,5.175,5.175v3.234H21.3V22.614H6.427ZM13.376,17.3l-.481,3.372h1.94L14.354,17.3a1.293,1.293,0,1,0-.977,0Zm4.046-7.948a3.558,3.558,0,1,0-7.115,0v2.911h7.115Z" transform="translate(-6.427 -3.856)" fill="#1d1d1d"/>
        </svg>
        <svg id="resell_companion_unlock_icon" style="display: block;" xmlns="http://www.w3.org/2000/svg" width="18.134" height="17.674" viewBox="0 0 18.134 17.674">
          <path d="M21.373,12.285V9.367a3.566,3.566,0,1,0-7.132,0v2.964h3.242V22.658H2.571V12.285H12.3V9.043a5.187,5.187,0,0,1,5.187-5.187h.648a5.187,5.187,0,0,1,5.187,5.187v3.242H21.373ZM10.027,14.838a1.3,1.3,0,0,0-.49,2.5l-.482,3.379H11l-.483-3.38a1.3,1.3,0,0,0-.49-2.5Z" transform="translate(-2.571 -3.856)" fill="#1d1d1d"/>
        </svg>

        <form id="resell_companion_url_bar" action="#">
          <input type="text" onChange="this.form.action=this.value" value="">
          <!-- <input type="submit" value="Go"> -->
        </form>

        <div id="resell_companion_Window_Buttons">
          <svg id="resell_companion_close-btn" class="resell_companion_Close_Icon" viewBox="3.375 3.375 20 20">
            <path fill="rgba(253,53,53,1)" id="Close_Icon" d="M 13.37498569488525 3.375 C 7.850955486297607 3.375 3.375 7.850955486297607 3.375 13.37498569488525 C 3.375 18.89901542663574 7.850955486297607 23.37496948242188 13.37498569488525 23.37496948242188 C 18.89901542663574 23.37496948242188 23.37496948242188 18.89901542663574 23.37496948242188 13.37498569488525 C 23.37496948242188 7.850954532623291 18.89901542663574 3.375 13.37498569488525 3.375 Z M 15.90863418579102 16.99517250061035 L 13.37498569488525 14.46152019500732 L 10.84133434295654 16.99517250061035 C 10.54325771331787 17.29324913024902 10.0528736114502 17.29324913024902 9.75479793548584 16.99517250061035 C 9.605758666992188 16.84613227844238 9.528836250305176 16.64901733398438 9.528836250305176 16.45190238952637 C 9.528836250305176 16.25478935241699 9.605758666992188 16.05767250061035 9.75479793548584 15.90863418579102 L 12.2884464263916 13.37498569488525 L 9.75479793548584 10.84133434295654 C 9.605758666992188 10.69229602813721 9.528835296630859 10.49518203735352 9.528835296630859 10.29806613922119 C 9.528835296630859 10.10095119476318 9.605758666992188 9.903835296630859 9.75479793548584 9.754798889160156 C 10.0528736114502 9.456722259521484 10.54325580596924 9.456722259521484 10.84133434295654 9.754798889160156 L 13.3749828338623 12.28844738006592 L 15.90863418579102 9.754798889160156 C 16.20671081542969 9.456722259521484 16.69709396362305 9.456722259521484 16.99517059326172 9.754798889160156 C 17.29324722290039 10.05287456512451 17.29324722290039 10.54325866699219 16.99517059326172 10.84133529663086 L 14.46152019500732 13.37498569488525 L 16.99517250061035 15.90863418579102 C 17.29324913024902 16.20671081542969 17.29324913024902 16.69709587097168 16.99517250061035 16.99517250061035 C 16.69709396362305 17.29805374145508 16.20671081542969 17.29805374145508 15.90863418579102 16.99517250061035 Z">
            </path>
          </svg>
          <!--
          <svg id="resell_companion_max-btn" class="resell_companion_Maximize_Icon" viewBox="0.563 0.563 20 20">
            <path fill="rgba(255,167,78,1)" id="Maximize_Icon" d="M 10.56248474121094 0.5625000596046448 C 5.038299083709717 0.5625000596046448 0.5625000596046448 5.038299083709717 0.5625000596046448 10.56248474121094 C 0.5625000596046448 16.086669921875 5.038299083709717 20.56246757507324 10.56248474121094 20.56246757507324 C 16.086669921875 20.56246757507324 20.56246757507324 16.086669921875 20.56246757507324 10.56248474121094 C 20.56246757507324 5.038299083709717 16.086669921875 0.5625000596046448 10.56248474121094 0.5625000596046448 Z M 5.239912033081055 12.17538452148438 C 4.973783016204834 12.17538452148438 4.756041526794434 11.95764350891113 4.756041526794434 11.69151401519775 L 4.756041526794434 9.433454513549805 C 4.756041526794434 9.167325973510742 4.973783016204834 8.949583053588867 5.239912033081055 8.949583053588867 L 15.8850564956665 8.949583053588867 C 16.15118598937988 8.949583053588867 16.36892700195313 9.167325973510742 16.36892700195313 9.433454513549805 L 16.36892700195313 11.69151401519775 C 16.36892700195313 11.95764350891113 16.15118598937988 12.17538452148438 15.8850564956665 12.17538452148438 L 5.239912033081055 12.17538452148438 Z">
            </path>
          </svg>
          -->
          <!--
          <svg id="resell_companion_min-btn" class="resell_companion_Minimize_Icon" viewBox="0.563 0.563 20 20">
            <path fill="rgba(255,167,78,1)" id="Minimize_Icon" d="M 10.56248474121094 0.5625000596046448 C 5.038299083709717 0.5625000596046448 0.5625000596046448 5.038299083709717 0.5625000596046448 10.56248474121094 C 0.5625000596046448 16.086669921875 5.038299083709717 20.56246757507324 10.56248474121094 20.56246757507324 C 16.086669921875 20.56246757507324 20.56246757507324 16.086669921875 20.56246757507324 10.56248474121094 C 20.56246757507324 5.038299083709717 16.086669921875 0.5625000596046448 10.56248474121094 0.5625000596046448 Z M 5.239912033081055 12.17538452148438 C 4.973783016204834 12.17538452148438 4.756041526794434 11.95764350891113 4.756041526794434 11.69151401519775 L 4.756041526794434 9.433454513549805 C 4.756041526794434 9.167325973510742 4.973783016204834 8.949583053588867 5.239912033081055 8.949583053588867 L 15.8850564956665 8.949583053588867 C 16.15118598937988 8.949583053588867 16.36892700195313 9.167325973510742 16.36892700195313 9.433454513549805 L 16.36892700195313 11.69151401519775 C 16.36892700195313 11.95764350891113 16.15118598937988 12.17538452148438 15.8850564956665 12.17538452148438 L 5.239912033081055 12.17538452148438 Z">
            </path>
          </svg>
          -->
        </div>
      </div>

      <div id="resell_companion_main"></div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', topBarCode);

  const close = document.querySelector("#resell_companion_close-btn");
  close.addEventListener("click", function (e) {
    window.opener = self;
    window.close();
  });

  // function Maximize() {
  //   // window.innerWidth = screen.width;
  //   // window.innerHeight = screen.height;
  //   // window.screenX = 0;
  //   // window.screenY = 0;
  //   // alwaysLowered = false;
  //   // if (top.moveTo)
  //   //     top.moveTo(0,0);
  //   // if (top.resizeTo)
  //   //     top.resizeTo(screen.availWidth,screen.availHeight);
  //   // if (top.outerWidth)
  //   //     top.outerWidth  = screen.availWidth;
  //   // if (top.outerHeight)
  //   //     top.outerHeight = screen.availHeight;
  // }
  //
  // const maximize = document.querySelector("#resell_companion_max-btn");
  // close.addEventListener("click", function (e) {
  //   Maximize();
  // });
  //
  // function Minimize() {
  //   window.innerWidth = 100;
  //   window.innerHeight = 100;
  //   window.screenX = screen.width;
  //   window.screenY = screen.height;
  //   alwaysLowered = true;
  // }

  const urlBar = document.querySelector("#resell_companion_url_bar input");
  urlBar.value = location.href;

  if (location.href.startsWith("https://")) {
    document.querySelector("#resell_companion_lock_icon").style.display = "block";
    document.querySelector("#resell_companion_unlock_icon").style.display = "none";
  }

  let lastSetUrlBarWidth;
  setInterval(function() {
    let newUrlBarWidth = window.innerWidth - 155 - 30;
    if (newUrlBarWidth != lastSetUrlBarWidth) {
      urlBar.style.width = newUrlBarWidth + 'px';
      lastSetUrlBarWidth = newUrlBarWidth;
    }
  }, 50);
}
