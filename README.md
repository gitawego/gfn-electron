# Stadia/Geforce Now Electron for linux

Electron based Stadia and Geforce Now application, inspired by [geforcenow-electron](https://github.com/hmlendea/geforcenow-electron).

## Requirement

Please follow [How To Enable Hardware Accelerated Video Decode](https://www.linuxuprising.com/2021/01/how-to-enable-hardware-accelerated.html) to install required dependencies in linux

Basically you will have to install follow dependencies, most of them should be already installed by the OS.

### For Intel Gen 7 and earlier hardware:

```bash
sudo apt install i965-va-driver-shaders libva-drm2 libva-x11-2
```

### For Intel Gen 8+ hardware:

```bash
sudo apt install intel-media-va-driver-non-free libva-drm2 libva-x11-2
```

### For Nouveau and AMD drivers

```bash
sudo apt install mesa-va-drivers libva-drm2 libva-x11-2
```

### Also install additional drivers

```bash
sudo apt install libva-glx2 libva-x11-2 chromium-codecs-ffmpeg-extra libgl1-mesa-glx
```

## Features

- added required chromium flags for Hardware video decoder
- included extension: StadiaEnhanced
- support both stadia and geforce now
