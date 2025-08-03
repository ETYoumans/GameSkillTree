
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
const { electron } = require('process');
const treeManager = require('./file_manager.js');

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`),
  ignored: /trees|[\/\\]\./
})

dotenv.config();
app.whenReady().then(() => {
  
  const win = new BrowserWindow({ 
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });
  win.webContents.openDevTools();
  win.loadFile(path.join(__dirname, 'index.html'));
});


ipcMain.handle('get-api-key', () => {
  return process.env.MY_API_KEY;
});

ipcMain.handle('tree:read', async (_, treename) => {
  return treeManager.read(treename);
});

ipcMain.handle('tree:write', async (_, treename, data) => {
  treeManager.write(treename, data);
  return true;
});

ipcMain.handle('tree:listdir', () => {
  return treeManager.listdir();
});

ipcMain.handle('tree:delete', async (_, treename) => {
  return treeManager.del(treename);
});

ipcMain.handle('tree:txt_to_list', async (_, upload) => {
  return await treeManager.txtReader(upload);
})

ipcMain.handle('selectUpload', async () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();

  if (!focusedWindow) {
    console.error("No focused window available.");
    return [];
  }

  try {
    const result = await dialog.showOpenDialog(focusedWindow, {
      properties: ['openFile'],
      filters: [{ name: "Text Files", extensions: ['txt'] }]
    });
    return result.filePaths[0];
  } catch (err) {
    console.error("Error selecting upload: ", err);
    return []; 
  }
})