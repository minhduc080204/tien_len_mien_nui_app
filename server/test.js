let roomtmp = []
let ROOMS = []
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
ROOMS.map((room, index) => {
    roomtmp.push({
        roomIndex: index,
        numberPlayerPlaying: room.players.length,
    })
})

console.log(roomtmp);
