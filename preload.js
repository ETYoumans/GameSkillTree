const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('treeAPI', {
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  read: (treename) => ipcRenderer.invoke('tree:read', treename),
  write: (treename, jsonData) => ipcRenderer.invoke('tree:write', treename, jsonData),
  delete: (treename) => ipcRenderer.invoke('tree:delete', treename),
  listdir: () => ipcRenderer.invoke('tree:listdir'),
  txt_to_list: (upload) => ipcRenderer.invoke('tree:txt_to_list', upload),
  selectUpload: () => ipcRenderer.invoke('selectUpload'),
});
