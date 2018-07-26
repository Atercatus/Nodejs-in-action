const net = require('net');
const server = net.createServer(function(socket) {
  socket.once('data', function(data, err) {
  if(err) throw err;

  socket.write(data);
  });
});

server.listen(8888);
