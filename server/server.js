const net = require('net');

const PORT = 12345;
const HOST = '0.0.0.0';

let roomall = [];

let rooms = {
  1:[cl1, cl2, cl3],
  20: [],
}
const server = net.createServer((socket) => {
  console.log('Client connected');
  clients.push(socket);

  socket.on('data', (data) => {
    try {
      const res = JSON.parse(data);
      const roomId = res.roomId;
      const name = res.name;
      const message = res.message;
      const type = res.type;
      
      clients.forEach((client) => {
        client.write(data);     
        console.log("OKK");
           
      });
    } catch (error) {
      console.error('Error parsing data:', error);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
    clients = clients.filter(cl => cl !== socket);
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});



// // let rooms = [];
// let client = [];

// const server = net.createServer((socket) => {
//   console.log('Client connected');
//   client.push(socket);    

//   socket.on('data', (data) => {
//     const res = JSON.parse(data);
//     const roomId = res.roomId
//     const message = res.message
//     const type = res.type

//     client.forEach(cl=>{
//       console.log("writeent0000");
//       cl.write(message);
//       if(cl !== socket){
//         cl.write(message);
//         console.log("writeent");
        
//       }
//     })
    

//     // if (type === 'join') {

//     //   if (!rooms[roomId]) {
//     //     rooms[roomId] = [socket];
//     //     return;
//     //   }

//     //   if (rooms[roomId].length>=4) {
        
//     //   }

//     //   rooms[roomId].push(socket);      
//     // }
    
//     // if (type === 'chat') {
      
//     //   rooms[roomId].forEach(client => {
//     //     if (client !== socket) {
//     //       client.write(message);
//     //     }
//     //   });
      
//     // }
    
    
//   });

//   socket.on('end', () => {
//     console.log('Client disconnected');
//     clients = clients.filter((client) => client !== socket);
//   });

//   socket.on('error', (err) => {
//     console.log(`Error: ${err.message}`);
//   });
// });

server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});
