const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  startServer: () => ipcRenderer.send('start-server'),
  stopServer: () => ipcRenderer.send('stop-server'),
  // sendTCP: (message) => ipcRenderer.send('send-tcp', message),
  // onTCPData: (callback) => ipcRenderer.on('tcp-data', (event, data) => callback(data))
});
