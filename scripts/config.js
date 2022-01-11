const { BrowserWindow, app } = require("electron");
const fs = require('fs');
const path = require("path");

const games = {
  stadia: 'https://stadia.google.com',
  gfn: 'https://play.geforcenow.com'
}


const handleClick = (menuItem, browserWindow, event) => {
  const gameId = menuItem.id || 'stadia';
  if (config.gameId === gameId) {
    return;
  }
  config.gameId = gameId;
  config.gameUrl = games[config.gameId];
  config.mainWindow.loadURL(config.gameUrl);
  userConfig('gameId', config.gameId);
}


const usesrConfigPath = path.resolve(app.getPath('userData'), 'config.json');

function getUserConfig() {
  try {
    return JSON.parse(fs.readFileSync(usesrConfigPath));
  } catch (err) {
    return {};
  }
}

const userConfig = (...args) => {
  const userCfg = getUserConfig();
  if (args.length === 0) {
    return userCfg;
  }
  if (args.length === 1) {
    return userCfg[args[0]];
  }
  userCfg[args[0]] = args[1];
  fs.writeFileSync(usesrConfigPath, JSON.stringify(userCfg, null, ' '));
  return args[1];
};

const currentGameId = userConfig('gameId') || 'stadia';

const config = {
  gameId: currentGameId,
  gameUrl: games[currentGameId]
};

const template = [
  {
    label: 'Setting',
    submenu: [
      {
        label: 'Game Platform',
        submenu: [
          { id: 'stadia', label: 'Google Stadia', type: 'radio', click: handleClick, checked: currentGameId === 'stadia' },
          { id: 'gfn', label: 'Geforce Now', type: 'radio', click: handleClick, checked: currentGameId === 'gfn' }
        ]
      },
      {
        label: 'GPU Info',
        click: () => {
          let win = new BrowserWindow({ show: false, center: true, resizable: false });
          win.on('close', function () { win = null });
          win.loadURL("chrome://gpu");
          win.once('ready-to-show', () => {
            win.show();
          });
        }
      },
      {
        label: 'Toggle Developer Tools',
        click: () => {
          config.mainWindow.webContents.openDevTools();
        }
      },
    ]
  }
];



const switches = [
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
]


module.exports.menuItems = template;
module.exports.switches = switches;
module.exports.getResourcePath = (resource) => {
  const appPath = app.getAppPath();
  return path.resolve(appPath, process.env.NODE_ENV === 'development' ? './' : '../', resource);
};

module.exports.setConfig = (key, val) => {
  config[key] = val;
};
module.exports.getConfig = (key) => config[key];
module.exports.userConfig = userConfig
