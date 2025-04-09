const { WebSocketServer } = require('ws');
const express = require('express');
const app = express();

app.use(express.static('./public'));

const port = process.argv.length > 2 ? process.argv[2] : 4000;
server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

const socketServer = new WebSocketServer({ server });

socketServer.on('connection', (socket) => {
    socket.isAlive = true;
  
    socket.on('message', function message(data) {
      socketServer.clients.forEach(function each(client) {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });
  
    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });
  
  setInterval(() => {
    socketServer.clients.forEach(function each(client) {
      if (client.isAlive === false) return client.terminate();
  
      client.isAlive = false;
      client.ping();
    });
  }, 10000);