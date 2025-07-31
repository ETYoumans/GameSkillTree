const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('treeAPI', {
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  read: (treename) => ipcRenderer.invoke('tree:read', treename),
  write: (treename, jsonData) => ipcRenderer.invoke('tree:write', treename, jsonData),
  delete: (treename) => ipcRenderer.invoke('tree:delete', treename)

});
