const { app, BrowserWindow } = require('electron');
const path = require('path');
app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1920, height: 1080 });
  win.loadFile(path.join(__dirname, 'index.html'));
});
