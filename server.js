const net = require('net');

const PORT = 12345; // Cổng TCP
const HOST = '127.0.0.1'; // Địa chỉ IP của server

let clients = []; // Lưu danh sách các client kết nối

const server = net.createServer((socket) => {
  console.log('Client connected');

  // Thêm client vào danh sách khi kết nối
  clients.push(socket);

  // Xử lý khi nhận được dữ liệu từ một client
  socket.on('data', (data) => {
    clients.forEach((client) => {
      client.write(data.toString());
      
    });
  });

  // Xử lý khi một client ngắt kết nối
  socket.on('end', () => {
    console.log('Client disconnected');
    clients = clients.filter((client) => client !== socket);
  });

  // Xử lý lỗi
  socket.on('error', (err) => {
    console.log(`Error: ${err.message}`);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});
