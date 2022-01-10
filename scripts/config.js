const { BrowserWindow, app } = require("electron");
const path = require("path");

const template = [
  {
    label: 'Setting',
    submenu: [
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
      }
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
  // ["enable-native-gpu-memory-buffers"],
  // ["enable-oop-rasterization"]
]

module.exports.menuItems = template;
module.exports.switches = switches;
module.exports.getResourcePath = (resource) => {
  const appPath = app.getAppPath();
  return path.resolve(appPath, process.env.NODE_ENV === 'development' ? './' : '../', resource);
};

