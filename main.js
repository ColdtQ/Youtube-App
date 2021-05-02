// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  globalShortcut,
  Tray
} = require('electron')
const electron = require('electron');
const path = require('path')
const fs = require('fs')
const client = require('discord-rich-presence')('838508008949415996')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, './icons/icon.png'),
    width: 1024,
    height: 600,
    minWidth: 300,
    minHeight: 300,
    frame: true,
    title: 'Youtube',
    // Enables DRM
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      contextIsolation: false,
      allowRunningInsecureContent: true
    }
  })

  // Hide toolbar tooltips / bar
  mainWindow.setMenuBarVisibility(false);

  // Fix scrollbars

  mainWindow.webContents.once('did-stop-loading', async () => {
    await mainWindow.webContents.insertCSS('::-webkit-scrollbar { display: none; }')
  })
  // Tray Icon
  if (process.platform === 'win32') var trayIcon = new Tray(path.join(__dirname, './icons/icon.ico'))
  else trayIcon = new Tray(path.join(__dirname, './icons/icon.png'))

  app.on('browser-window-nlur', (event, win) => {
    trayIcon.on('click', () => {
      mainWindow.show()
    })
  })


  

  // Set userAgent
  mainWindow.webContents.userAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.11 Safari/537.36 Edg/88.0.705.9"

  // load the renderer of the app.
  mainWindow.loadFile('renderer.js');

  mainWindow.webContents.on('media-started-playing', function () {
    client.updatePresence({
        state: "on YouTube",
        details: "Watching YouTube",
        startTimestamp: Date.now(),
        largeImageKey: 'yt',
        smallImageKey: 'play',
        instance: false,
    });
});


// Update rich presence when YouTube TV is paused or turned off.
mainWindow.webContents.on('media-paused', function () {
    client.updatePresence({
        state: "on YouTube",
        details: "Watching Youtube (Paused)",
        StartTimestamp: Date.now(),
        largeImageKey: 'yt',
        smallImageKey: 'pause',
        instance: false,
    });
});

// Start rich presence service into idle mode.
client.updatePresence({
    state: 'on YouTube',
    details: 'Browsing videos',
    startTimestamp: Date.now(),
    largeImageKey: 'yt',
    smallImageKey: 'stop',
    instance: false,
});




  // Load the URL
  mainWindow.loadURL('https://youtube.com');

  // Custom TitleBar WIP

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});