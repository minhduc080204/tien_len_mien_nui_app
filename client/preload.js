const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  connectTCP: () => ipcRenderer.send('connect-tcp'),
  disconnectTCP: () => ipcRenderer.send('disconnect-tcp'),
  sendTCP: (message) => ipcRenderer.send('send-tcp', message),
  onTCPData: (callback) => ipcRenderer.on('tcp-data', (event, data) => callback(data)),
  
});
