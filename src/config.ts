import {
  BrowserWindow,
  app,
  MenuItem,
  MenuItemConstructorOptions,
  KeyboardEvent,
} from "electron";
import * as fs from "fs";
import * as path from "path";
import { AppConfig, GameId, Games } from "./model";

const games: Games = {
  stadia: "https://stadia.google.com",
  gfn: "https://play.geforcenow.com",
};

const handleClick = (
  menuItem: MenuItem,
  browserWindow: BrowserWindow | undefined,
  event: KeyboardEvent
) => {
  const gameId = (menuItem.id || "stadia") as GameId;
  if (config.gameId === gameId) {
    return;
  }
  config.gameId = gameId;
  config.gameUrl = games[gameId];
  config.mainWindow?.loadURL(config.gameUrl);
  userConfig("gameId", config.gameId);
};

const usesrConfigPath = path.resolve(app.getPath("userData"), "config.json");

function getUserConfig() {
  try {
    return JSON.parse(fs.readFileSync(usesrConfigPath, "utf-8"));
  } catch (err) {
    return {};
  }
}

export const userConfig = (...args: any[]) => {
  const userCfg = getUserConfig();
  if (args.length === 0) {
    return userCfg;
  }
  if (args.length === 1) {
    return userCfg[args[0]];
  }
  userCfg[args[0]] = args[1];
  fs.writeFileSync(usesrConfigPath, JSON.stringify(userCfg, null, " "));
  return args[1];
};

const currentGameId = (userConfig("gameId") || "stadia") as GameId;

const config: AppConfig = {
  gameId: currentGameId,
  gameUrl: games[currentGameId],
};

export const menuItems: MenuItemConstructorOptions[] = [
  {
    label: "Setting",
    submenu: [
      {
        label: "Game Platform",
        submenu: [
          {
            id: "stadia",
            label: "Google Stadia",
            type: "radio",
            click: handleClick,
            checked: currentGameId === "stadia",
          },
          {
            id: "gfn",
            label: "Geforce Now",
            type: "radio",
            click: handleClick,
            checked: currentGameId === "gfn",
          },
        ],
      },
      {
        label: "GPU Info",
        click: () => {
          const win = new BrowserWindow({
            show: false,
            center: true,
            resizable: false,
          });
          win.loadURL("chrome://gpu");
          win.once("ready-to-show", () => {
            win.show();
          });
        },
      },
      {
        label: "Toggle Developer Tools",
        click: () => {
          config.mainWindow?.webContents.openDevTools();
        },
      },
    ],
  },
];

export const switches: [string, (string | undefined)?][] = [
  ["enable-features", "VaapiVideoDecoder"],
  ["enable-gpu-rasterization"],
  ["enable-zero-copy"],
  ["enable-accelerated-mjpeg-decode"],
  ["enable-accelerated-video"],
  ["use-gl", "desktop"],
  ["ignore-gpu-blacklist"],
  ["disable-gpu-driver-bug-workarounds"],
  ["disable-features", "UseSkiaRenderer"],
  ["enable-raw-draw"],
  // ["enable-native-gpu-memory-buffers"],
  // ["enable-oop-rasterization"]
];

export const getResourcePath = (resource: string) => {
  const appPath = app.getAppPath();
  return path.resolve(
    appPath,
    process.env.NODE_ENV === "development" ? "./" : "../",
    resource
  );
};

export const setConfig = (key: keyof AppConfig, val: any) => {
  config[key] = val;
};
export const getConfig = (key: keyof AppConfig) => config[key];
