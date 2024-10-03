const net = require('net');

const PORT = 12345;
const HOST = '0.0.0.0';

let ROOMALL = [];
let ROOMS = [];

const ranks = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 20];
const suits = [1, 2, 3, 4];
let desk = []

ROOMS[0] = {
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

const server = net.createServer((socket) => {
    console.log('Client connected');
    ROOMALL.push(socket);
    socket.on('data', (data) => {
        try {
            const { roomId, name, message, type} = JSON.parse(data);

            if (type === 'JOIN') {
                if (!ROOMS[roomId]) {
                    ROOMS[roomId] = {};
                }

                if (!ROOMS[roomId].players) {
                    ROOMS[roomId].players = [];
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
                console.log(`Attack from ${name} in room ${roomId}: ${message}.SIZE: ${ROOMS[roomId].players.length}`);
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
                            isWin=true;
                        }
                    }

                    if(isWin){
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
        }
    });

    socket.on('end', () => {
        console.log('Client disconnected');
        ROOMALL = ROOMALL.filter(player => player !== socket);
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});
