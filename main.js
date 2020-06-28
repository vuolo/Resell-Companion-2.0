const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const open = require('open');

// process.env.NODE_ENV = 'development';
process.env.NODE_ENV = 'production';

// Keep a global reference of the window objects, if you don't, the windows will
// be closed automatically when the JavaScript objects are garbage collected.
let loginWindow;
let loadingWindow
let mainWindow;

// imports
const authAPI = require('./utils/api/auth');

// consts
const ICON_PATH = process.platform == "win32" ? path.resolve(__dirname, './build-assets/icons/win-icon.ico') : undefined; // not needed for mac
const LOGIN_WINDOW_WIDTH = 717;
const LOGIN_WINDOW_HEIGHT = 483;
const LOADING_WINDOW_WIDTH = 960;
const LOADING_WINDOW_HEIGHT = 580;
const MAIN_WINDOW_WIDTH = 1292;
const MAIN_WINDOW_HEIGHT = 867;

// variables
let curLogin;
var loadingFinished = false;

// functions
async function tryStartCompanion() {
  // await authAPI.logout(); // force logout
  curLogin = await authAPI.getCurLogin();
  curLogin.firstLogin = false;
  if (process.env.NODE_ENV === 'development') console.log(curLogin);
  try {
    if (await authAPI.isLoginValid(curLogin)) {
      startMain();
    } else {
      authAPI.logout(); // no need for await since it will finish while login is loading anyway
      startLogin();
    }
  } catch(err) { // auth api connection errored / probably no internet connection or someone trying to break in
    // console.log(err)
    closeApplication();
  }
}

async function startLogin() {
  // Create the browser window.
  loginWindow = new BrowserWindow({
    width: LOGIN_WINDOW_WIDTH,
    height: LOGIN_WINDOW_HEIGHT,
    title: 'Resell Companion⁠ — Login',
    frame: false, // disables default top frame
    resizable: false, // make window follow width x height restraints
    icon: ICON_PATH,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true // allows the use of modules
    }
  });
  if (process.env.NODE_ENV === 'development') console.log("LOGIN WINDOW OPENED");

  // and load the index.html of the app.
  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, './gui/views/login/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Emitted when the window is closed.
  loginWindow.on('closed', function () {
    if (process.env.NODE_ENV === 'development') console.log("LOGIN WINDOW CLOSED");
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    loginWindow = null;
  });

  setupMainMenu();
  trySetTrayIcon();
}

function startMain() {
  startLoading();
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: MAIN_WINDOW_WIDTH,
    height: MAIN_WINDOW_HEIGHT,
    title: 'Resell Companion',
    frame: false, // disables default top frame
    show: false, // false because it shows loading screen first
    transparent: true, // enabled to have the user bar stick out at the top right (con: disables default minimization animation)
    resizable: false, // make window follow width x height restraints
    icon: ICON_PATH,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true, // allows the use of modules
      webviewTag: true, // for the browsers page
      backgroundThrottling: false // ensure the tool always runs full speed even if minimized
    }
  });
  if (process.env.NODE_ENV === 'development') console.log("MAIN WINDOW OPENED");

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './gui/views/main/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-finish-load', async function() {
    loadingFinished = true;
    try { mainWindow.webContents.send('user-transfer', curLogin); } catch(err) { if (process.env.NODE_ENV === 'development') console.log(err); await authAPI.logout(); closeApplication(); }
    try { loadingWindow.close(); } catch(err) { if (process.env.NODE_ENV === 'development') console.log(err); } // hide loading screen
    try { mainWindow.show(); } catch(err) { if (process.env.NODE_ENV === 'development') console.log(err); } // show main application
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    if (process.env.NODE_ENV === 'development') console.log("MAIN WINDOW CLOSED");
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    closeApplication();
  });

  // ################ open all target="_blank" in default browser
  mainWindow.webContents.on('new-window', function(event, url){
    event.preventDefault();
    open(url);
  });

  setupMainMenu();
  trySetTrayIcon();
}

function startLoading() {
  // Create the browser window.
  loadingWindow = new BrowserWindow({
    width: LOADING_WINDOW_WIDTH,
    height: LOADING_WINDOW_HEIGHT,
    title: 'Resell Companion — Loading',
    frame: false, // disables default top frame
    transparent: true, // enabled to have rounded corners
    resizable: false, // make window follow width x height restraints
    icon: ICON_PATH,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true // allows the use of modules
    }
  });
  if (process.env.NODE_ENV === 'development') console.log("LOADING WINDOW OPENED");

  // and load the index.html of the app.
  loadingWindow.loadURL(url.format({
    pathname: path.join(__dirname, './gui/views/loading/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  loadingWindow.webContents.on('did-finish-load', function() {
    loadingWindow.webContents.send('user-transfer', curLogin);
  });

  // Emitted when the window is closed.
  loadingWindow.on('closed', function () {
    if (process.env.NODE_ENV === 'development') console.log("LOADING WINDOW CLOSED");
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    loadingWindow = null;
    if (!loadingFinished) {
      closeApplication();
    }
  });

  setupMainMenu();
  trySetTrayIcon();
}

function setupMainMenu() {
  // Create menu template
  var mainMenuTemplate =  [
    // Each object is a dropdown
  ];

  // If OSX, add copy/paste etc. support
  if (process.platform == 'darwin') {

    const createMenu = () => {
      const application = {
        label: 'Application',
        submenu: [
          {
            label: 'About Application',
            role: 'about',
          },
          {
            type: 'separator',
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: () => {
              electron.app.quit();
            },
          },
        ],
      };

      const edit = {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo',
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo',
          },
          {
            type: 'separator',
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut',
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy',
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste',
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectAll',
          },
        ],
      };

      mainMenuTemplate.push(application);
      mainMenuTemplate.push(edit);
    };
    createMenu();
  };

  // Add developer tools option if in dev mode or logged in as dev
  if (process.env.NODE_ENV === 'development' || (process.env.NODE_ENV == 'production' && (
    curLogin.discord.id == "344672338744442880" || /* shree */
    curLogin.discord.id == "148666330323746816" || /* incognito */
    curLogin.discord.id == "704495381303525480" || /* incognito's alt */
    curLogin.discord.id == "605282860991119360" /* ben */
  ))) {
    mainMenuTemplate.push({
      label: 'File',
      submenu:[
        {
          label: 'Quit',
          accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click(){
            app.quit();
          }
        }
      ]
    });
    mainMenuTemplate.push({
      label: 'Developer Tools',
      submenu:[
        {
          role: 'reload'
        },
        {
          label: 'Toggle DevTools',
          accelerator:process.platform == 'darwin' ? 'Command+Shift+I' : 'Ctrl+Shift+I',
          click(item, focusedWindow){
            focusedWindow.toggleDevTools();
          }
        }
      ]
    });
  }

  // Build menu from template
  const mainMenu = electron.Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  electron.Menu.setApplicationMenu(mainMenu);
}

function trySetTrayIcon() {
  if (process.platform == "win32") {
    const appIcon = new electron.Tray(ICON_PATH);
    appIcon.setToolTip('Resell Companion');
  }
}

electron.ipcMain.on('resize', (e, coords) => {
  mainWindow.setSize(coords.width, coords.height);
});

electron.ipcMain.on('loginFinished', async (event, code) => {
  curLogin.code = code;
  curLogin.firstLogin = true;
  curLogin = await authAPI.isLoginValid(curLogin);
  if (curLogin) {
    if (process.env.NODE_ENV === 'development') console.log(curLogin);
    try { startMain(); loginWindow.close(); } catch(err) { if (process.env.NODE_ENV === 'development') console.log(err); }
  }
});

electron.ipcMain.on('logoutFinished', (event, restart = false) => {
  if (restart) {
    app.relaunch();
    app.exit();
  } else {
    app.exit();
  }
});

electron.ipcMain.on('toggleMainWindowVisibility', (event, arg) => {
  try { arg ? mainWindow.show() : mainWindow.hide(); } catch(err) { if (process.env.NODE_ENV === 'development') console.log(err); }
});

electron.ipcMain.on('loadingDone', (event, arg) => {
  try { loadingWindow.close(); } catch(err) { if (process.env.NODE_ENV === 'development') console.log(err); }
  try { mainWindow.show(); } catch(err) { if (process.env.NODE_ENV === 'development') console.log(err); }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async function() {
  app.commandLine.appendSwitch('disable-site-isolation-trials');
  tryStartCompanion();

  // for proxy authentication to work without problems
  await electron.session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36';
    details.requestHeaders['DNT'] = '1';
    details.requestHeaders['Cache-Control'] = 'max-age=0';
    details.requestHeaders['Sec-Fetch-Dest'] = 'document';
    details.requestHeaders['Sec-Fetch-Mode'] = 'same-origin';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  // DEPRECIATED: old method used chrome extension for checkout companion - now we just executeJavaScript w/ browser window (allows for easy message sending/parsing)
  // await electron.session.defaultSession.loadExtension(path.join(__dirname, 'Checkout Companion'))
});

// for proxy auths
app.on('login', (event, webContents, request, authInfo, callback) => {
  event.preventDefault();
});
// for browsing without problems
app.commandLine.appendSwitch('ignore-certificate-errors');
// for notifications
app.setAppUserModelId(process.execPath);

// close if app is already opened
if (!app.requestSingleInstanceLock()) {
  closeApplication();
}
// put main window on top if trying to open whilst already open
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    closeApplication();
  }
});

function closeApplication() {
  try { app.quit(); } catch(err) { if (process.env.NODE_ENV === 'development') console.log(err); }
  try { app.exit(); } catch(err) { if (process.env.NODE_ENV === 'development') console.log(err); }
}

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    tryStartCompanion();
  }
});
