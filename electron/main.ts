import {
  app,
  dialog,
  ipcMain,
  BrowserWindow,
  desktopCapturer,
  systemPreferences
} from 'electron';

import path from 'node:path';
import util from 'electron-util';
import { writeFile } from 'node:fs';

const IS_OSX = process.platform === 'darwin';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    width: 700,
    height: 500,
    darkTheme: true,
    autoHideMenuBar: true,
    backgroundColor: '#222831',
    opacity: 1,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // open dev tools by default
  // win.webContents.openDevTools();

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  win = null;
});

app.whenReady().then(createWindow);

ipcMain.handle('electronMain:openScreenSecurity', () =>
  util.openSystemPreferences('security', 'Privacy_ScreenCapture')
);
ipcMain.handle(
  'electronMain:getScreenAccess',
  () =>
    !IS_OSX || systemPreferences.getMediaAccessStatus('screen') === 'granted'
);
ipcMain.handle('electronMain:screen:getSources', () => {
  return desktopCapturer
    .getSources({ types: ['window', 'screen'] })
    .then(async (sources) => {
      return sources.map((source) => {
        const modifiedSource = {
          ...source,
          thumbnailURL: source.thumbnail.toDataURL()
        };

        return modifiedSource;
      });
    });
});

ipcMain.handle('electronMain:getMicrophoneAccess', () => {
  return !IS_OSX || systemPreferences.getMediaAccessStatus('microphone');
});

ipcMain.handle('saveFile', async (__, buffer) => {
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  });

  if (filePath) {
    writeFile(filePath, buffer, () => console.log('video saved successfully!'));
  }
});
