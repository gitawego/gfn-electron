import { app, globalShortcut, BrowserWindow, Menu } from "electron";
import {
  menuItems,
  switches,
  getResourcePath,
  setConfig,
  getConfig,
} from "./config";
import * as path from "path";

let mainWindow: BrowserWindow;
for (const flag of switches) {
  app.commandLine.appendSwitch.apply(app.commandLine, flag);
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,

    },
    icon: getResourcePath("assets/icon.png"),
  });
  setConfig("mainWindow", mainWindow);
  let ua = mainWindow.webContents.userAgent;
  ua = ua.replace(/gfn-electron\/[0-9\.-]*/, "");
  ua = ua.replace(/Electron\/.*? /i, "");
  console.log("user agent", ua);
  mainWindow.webContents.userAgent = ua;

  mainWindow.once("ready-to-show", () => {
    const menu = Menu.buildFromTemplate(menuItems);
    Menu.setApplicationMenu(menu);
    mainWindow.show();
  });
  mainWindow.maximize();
  mainWindow.loadURL(getConfig("gameUrl") as string);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (!mainWindow) {
      createWindow();
    }
  });

  globalShortcut.register("Super+F", () => {
    const isFullScreen = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFullScreen);
  });
});

app.on("browser-window-created", function (e, window) {
  window.setMenu(null);
  window.on("page-title-updated", function (e, title) {
    if (title.includes("on GeForce NOW")) {
      window.setFullScreen(true);
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
