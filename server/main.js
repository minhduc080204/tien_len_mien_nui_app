const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const net = require('net');
const { ipcMain } = require('electron');
const { log } = require('node:console');

const PORT = 12345;
const HOST = '0.0.0.0';

let ROOMALL = [];
let ROOMS = [];

const ranks = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 20];
const suits = [1, 2, 3, 4];
let desk = []

ROOMS[0] = {
  messages: [{name: "test", message: "alooooooo"}],
  players: [
    {
      socket: "",
      hand: [{
        rank: 1,
        suit: 1,
      }],
      status: false,
    }
  ],
  desk: [{
    rank: 1,
    suit: 1,
  }],
  card: [],
}

ranks.forEach((rank) => {
  suits.forEach((suit) => {
    desk.push({
      rank: rank,
      suit: suit,
    })
  })
})

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const DESK = shuffle(desk);

let tcpServer;
let mainWindow;

function updateInformation() {
  let roomstmp = []
  ROOMS.map((room, index) => {
    roomstmp.push({
      roomId: index,
      messages: room.messages,
      numberPlayerPlaying: room.players.length,
    })
  })
  mainWindow.webContents.send('tcp-data', JSON.stringify({
    numberPlayerOnline: ROOMALL.length,
    Rooms: roomstmp,
  }));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  })

  mainWindow.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  createWindow()

  ipcMain.on('start-server', () => {
    if (!tcpServer) {
      tcpServer = net.createServer((socket) => {

        ROOMALL.push(socket);
        updateInformation()

        socket.on('data', (data) => {
          try {
            const { roomId, name, message, type } = JSON.parse(data);

            if (type === 'JOIN') {
              if (!ROOMS[roomId]) {
                ROOMS[roomId] = {};
              }

              if (!ROOMS[roomId].players) {
                ROOMS[roomId].players = [];
                ROOMS[roomId].messages = [];
              }

              if (ROOMS[roomId].players.length > 3) {
                console.log("FULL PLAYER");
                return;
              }

              ROOMS[roomId].players.push({ id: socket.id, socket: socket, hand: null });
              ROOMS[roomId].players.forEach((player) => {
                player.socket.write(JSON.stringify({ roomId: roomId, name: 'THÔNG BÁO', message: `Anh ${name} tới chơi. YEAH !!` }));
              });
              console.log(`Client joined room ${roomId}`);
            }

            if (type === 'OUT') {
              if (ROOMS[roomId].players.length == 1) {
                console.log("out of room: ", roomId);
                delete ROOMS[roomId];                
                return;
              }
              ROOMS[roomId].players = ROOMS[roomId].players.filter(player => player.socket !== socket);              
            }

            if (type === 'CHAT') {              
              ROOMS[roomId].messages.push({
                name: name,
                message: message,
              })
              ROOMS[roomId].players.forEach((player) => {
                player.socket.write(data);
              });
              
            }            

            if (type === 'START') {
              console.log(`Attack from ${name} in room ${roomId}: ${message}.SIZE: ${ROOMS[roomId].players.length}`);

              ROOMS[roomId].desk = [...shuffle(DESK)];
              ROOMS[roomId].players.forEach((player) => {
                player.hand = ROOMS[roomId].desk.splice(0, 13);
                player.socket.write(JSON.stringify({ hand: player.hand }));
              });
            }

            if (type === 'ATTACK') {
              const card = JSON.parse(data).card;
              const hand = JSON.parse(data).hand;

              ROOMS[roomId].players.forEach((player) => {
                let isWin = false;
                player.socket.write(JSON.stringify({ card: card }));

                if (player.socket == socket) {
                  player.hand = hand;

                  if (player.hand.length == 0) {
                    isWin = true;
                  }
                }

                if (isWin) {
                  console.log("ƯINNNNN");

                  player.socket.write(JSON.stringify({
                    roomId: roomId,
                    name: 'THÔNG BÁO',
                    message: ` ${name} CHIẾN THẮNG. YEAH !!`,
                  }));
                }
              });

            }

          } catch (error) {
            console.error('Error parsing data:', error);
          } finally{
            updateInformation();
          }
        });

        socket.on('end', () => {
          ROOMS.map(room=>{
            room.players = room.players.filter(player => player.socket !== socket);   
            if(room.players.length==0){
              delete room.players;
            }
          })
          ROOMALL = ROOMALL.filter(player => player !== socket);
          console.log('Client disconnected');
        });

        socket.on('error', (err) => {
          console.error('Socket error:', err);
        });
      });

      tcpServer.listen(PORT, HOST, () => {
        console.log(`Server listening on ${HOST}:${PORT}`);
      });
    }
  });

  ipcMain.on('stop-server', () => {
    if (tcpServer) {
      tcpServer.close()
      console.log("Server is closed");
      tcpServer = null;
    }
  })

  ipcMain.on('send-tcp', (event, data) => {
    if (tcpServer) {
      const { roomId, name, message } = JSON.parse(data);                  
      ROOMS[roomId].players.forEach((player) => {
        player.socket.write(data);
      });
      
      ROOMS[roomId].messages.push({
        name: name,
        message: message,
      })
      
      updateInformation()
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})