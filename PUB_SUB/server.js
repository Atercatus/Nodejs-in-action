const events = require('events');
const net = require('net');

let channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(id, client) {
    this.clients[id] = client;
    this.subscriptions[id] = function(senderId, msg) {
        if(id != senderId) {
            this.clients[id].write(msg);
        }
    }
    this.on('broadcast', this.subscriptions[id]);

});

channel.on('leave', function(id) {
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id + " has left the chat.\n");
});

channel.on('shutdown', function() {
    channel.emit('broadcast', '', "Chat has shut down.\n");
    channel.removeAllListeners('broadcast');
});

let server = net.createServer(function (client) {
    let id = client.remoteAddress + ':' + client.remotePort;

    channel.emit('join', id, client);

    client.on('connect', function() {
        chennel.emit('join', id, client);
    });
    client.on('data', function(data) {
        data = data.toString();
        if(data == "shutdown\r\n"){
            channel.emit('shutdown');
        }
        channel.emit('broadcast', id, data);
    });
    client.on('close', function() {
        channel.emit('leave', id);
    });
});

server.listen(8888);
