const { app, BrowserWindow } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1920, height: 1080 });
  win.loadFile(path.join(__dirname, 'index.html'));
});

ipcMain.handle('get-api-key', () => {
  return process.env.MY_API_KEY;
});
