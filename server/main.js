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
  messages: [{ name: "test", message: "alooooooo" }],
  players: [
    {
      socket: "",
      userId: "",
      name: "",
      isTurn: false,
      isReady: false,
      hand: [{
        rank: 1,
        suit: 1,
      }],
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

function updateInformationGame(roomId, message, isAllReady) {
  if (!ROOMS[roomId]) {
    return;
  }

  if (!ROOMS[roomId].players) {
    return;
  }

  const playersCopy = ROOMS[roomId].players.map(player => ({ ...player }));
  ROOMS[roomId].players.forEach((player, index) => {
    if (!playersCopy[index].hand) {
      playersCopy[index].hand = []
    }
    // playersCopy[index].number=playersCopy[index].hand.length
    // delete playersCopy[index].hand;          
    // delete playersCopy[index].socket;

    let data = {
      roomId: roomId,
      name: 'THÔNG BÁO',
      type: 'JOINOK',
      message: message,
      card: ROOMS[roomId].card,
      players: playersCopy,
      isAllReady: isAllReady,
    }

    player.socket.write(JSON.stringify(data));
  });

}

function updateInformation() {
  let roomstmp = []
  ROOMS.map((room, index) => {
    if (room.players) {
      roomstmp.push({
        roomId: index,
        messages: room.messages,
        numberPlayerPlaying: room.players.length,
      })
    }
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
            const { roomId, userId, isReady, name, message, type } = JSON.parse(data);

            if (type === 'JOIN') {
              if (!ROOMS[roomId]) {
                ROOMS[roomId] = {};
              }

              if (!ROOMS[roomId].players) {
                ROOMS[roomId].players = [];
                ROOMS[roomId].messages = [];
              }

              if (ROOMS[roomId].players.length >= 4) {
                socket.write(JSON.stringify({
                  type: 'FULL', message: `Phòng ${roomId} đã đầy!!`
                }));
                return;
              }

              ROOMS[roomId].players.push({
                isTurn: false,
                isReady: false,
                name: name,
                userId: userId,
                socket: socket,
                hand: []
              });

              const ms = `Anh ${name} tới chơi. YEAH !!`;
              updateInformationGame(roomId, ms);

              console.log(`Client joined room ${roomId}`);
            }

            if (type === 'OUT') {
              if (ROOMS[roomId].players.length == 1) {
                console.log("out of room: ", roomId);
                delete ROOMS[roomId];
                return;
              }
              ROOMS[roomId].players = ROOMS[roomId].players.filter(player => player.socket !== socket);
              updateInformationGame(roomId);
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
              ROOMS[roomId].desk = [...shuffle(DESK)];
              ROOMS[roomId].players.forEach((player) => {
                player.hand = ROOMS[roomId].desk.splice(0, 13);
                if (player.socket == socket) {
                  player.isTurn = true;
                } else {
                  player.isTurn = false;
                }
              });

              updateInformationGame(roomId, null, false);
            }

            if (type === 'ATTACK') {
              const card = JSON.parse(data).card;
              const hand = JSON.parse(data).hand;

              ROOMS[roomId].players.forEach((player) => {
                let isWin = false;

                if (player.socket == socket) {
                  player.hand = hand;

                  if (player.hand.length == 0) {
                    isWin = true;
                  }
                }

                for (let i = 0; i < ROOMS[roomId].players.length; i++) {
                  if (ROOMS[roomId].players[i].socket == socket) {
                    if (i == ROOMS[roomId].players.length - 1) {
                      ROOMS[roomId].players[i].isTurn = false;
                      ROOMS[roomId].players[0].isTurn = true;
                    } else {
                      ROOMS[roomId].players[i].isTurn = false;
                      ROOMS[roomId].players[i + 1].isTurn = true;
                    }
                    break;
                  }
                }

                player.socket.write(JSON.stringify({
                  card: card,
                  roomId: roomId,
                  players: ROOMS[roomId].players,
                  isAllReady: false,
                }));


                if (isWin) {
                  console.log("ƯINNNNN");

                  player.socket.write(JSON.stringify({
                    roomId: roomId,
                    name: 'THÔNG BÁO',
                    message: ` ${name} CHIẾN THẮNG. YEAH !!`,
                  }));


                }
              });

              // updateInformationGame(roomId, null, false);
            }

            if (type == 'SKIP') {
              for (let i = 0; i < ROOMS[roomId].players.length; i++) {
                if (ROOMS[roomId].players[i].socket == socket) {
                  if (i == ROOMS[roomId].players.length - 1) {
                    ROOMS[roomId].players[i].isTurn = false;
                    ROOMS[roomId].players[0].isTurn = true;
                  } else {
                    ROOMS[roomId].players[i].isTurn = false;
                    ROOMS[roomId].players[i + 1].isTurn = true;
                  }
                  break;
                }
              }
              ROOMS[roomId].card=[];
              // player.socket.write(JSON.stringify({
              //   card: card,
              //   roomId: roomId,                
              // }));



              updateInformationGame(roomId, null, false);
            }

            if (type == 'READY') {
              let isAllReady = true;
              ROOMS[roomId].players.forEach((player) => {
                if (player.socket == socket) {
                  player.isReady = isReady;
                  player.socket.write(JSON.stringify({ isReady: isReady }))
                  console.log("readyyy");

                }

                if (!player.isReady) {
                  isAllReady = false;
                }
              })


              updateInformationGame(roomId, null, isAllReady);
            }

          } catch (error) {
            console.error('Error parsing data:', error);
          } finally {
            updateInformation();
          }
        });

        socket.on('end', () => {
          ROOMS.map(room => {
            room.players = room.players.filter(player => player.socket !== socket);
            if (room.players.length == 0) {
              delete room.players;
            }
          })
          ROOMALL = ROOMALL.filter(player => player !== socket);
          updateInformation()
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