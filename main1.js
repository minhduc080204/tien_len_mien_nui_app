const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const net = require('net');

const PORT = 12345;
const HOST = '0.0.0.0';

let mainWindow;
let tcpClient;

function createWindow() {
    mainWindow = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    mainWindow.loadURL('http://localhost:3000');    
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('connect-tcp', () => {
        if (!tcpClient) {

            tcpClient = net.createConnection(PORT, HOST, () => {
                console.log('Connected to TCP server');
            });

            tcpClient.on('data', (data) => {
                mainWindow.webContents.send('tcp-data', JSON.parse(data));
                console.log("ok ", JSON.parse(data));

            });

            tcpClient.on('end', () => {
                console.log('Disconnected from TCP server');
            });
        }
    });

    ipcMain.on('disconnect-tcp', () => {
        if (tcpClient) {
            tcpClient.end(() => {
                console.log('TCP connection closed');
                tcpClient = null;
            });
        }
    })

    ipcMain.on('send-tcp', (event, message) => {
        if (tcpClient) {
            tcpClient.write(message);
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
