const { app, globalShortcut, BrowserWindow, Menu } = require("electron");
const { menuItems, switches, getResourcePath, setConfig, getConfig } = require('./config');
const path = require("path");

let isFullScreen = false;

for (const flag of switches) {
  app.commandLine.appendSwitch.apply(app.commandLine, flag);
}


async function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,
      nativeWindowOpen: false
    },
    icon: path.resolve(__dirname, './assets/icon.png')
  });
  setConfig('mainWindow', mainWindow);
  const session = mainWindow.webContents.session
  await session.loadExtension(getResourcePath('StadiaEnhanced/extension'));
  let ua = mainWindow.webContents.userAgent;
  ua = ua.replace(/stadia-electron\/[0-9\.-]*/, '');
  ua = ua.replace(/Electron\/*/, '');
  mainWindow.webContents.userAgent = ua;

  mainWindow.once('ready-to-show', () => {
    const menu = Menu.buildFromTemplate(menuItems);
    Menu.setApplicationMenu(menu);
    mainWindow.show();
  })

  mainWindow.loadURL(getConfig('gameUrl'));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  globalShortcut.register("Super+F", () => {
    isFullScreen = BrowserWindow.getAllWindows()[0].isFullScreen();
    if (isFullScreen) {
      BrowserWindow.getAllWindows()[0].setFullScreen(false);
      isFullScreen = false;
    } else {
      BrowserWindow.getAllWindows()[0].setFullScreen(true);
      isFullScreen = true;
    }
  });
});

app.on("browser-window-created", function (e, window) {
  window.setMenu(null);
  window.on("leave-full-screen", function (e, win) {
    if (isFullScreen) {
      BrowserWindow.getAllWindows()[0].setFullScreen(true);
    }
  });
  window.on("page-title-updated", function (e, title) {
    if (title.includes("on GeForce NOW")) {
      window.setFullScreen(true);
      isFullScreen = true;
    }
  });
});



app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
