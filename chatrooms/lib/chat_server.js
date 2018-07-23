const socketio = require('socket.io');
let io;
let guestNumber = 1;
let nickNames = {};
let namesUsed = [];
let currentRoom = {};

exports.listen = function (server) {
    io = socketio.listen(server);
    io.log_level = 1;

    io.on('connection', function (socket) {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, 'Lobby');

        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        socket.on('rooms', function () {
            socket.emit('rooms', io.of('/').adapter.rooms);
        });

        //handleClientDisconnection(socket, nickNames, namesUsed);
    });
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) { // 손님 닉네임 부여
    let name = "Guest" + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    namesUsed.push(name);

    return guestNumber + 1;
}

function joinRoom(socket, room) { // 채팅방 입장
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.leave(socket.id);
    socket.emit('joinResult', { room: room });
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + 'has joined ' + room + '.'
    });
/*
    let usersInRoom = io.of('/').in(room).clients(function (err, clients) {
        if (err)
            throw err;

        console.log(clients[0]); // => [Anw2LatarvGVVXEIAAAD]
        //console.log(io.sockets.sockets[clients[0]]); //socket detail
        return clients;
    });
*/
    let usersInRoom = Object.keys(io.of('/').in(room).clients().connected);

    if (usersInRoom.length > 0) {
        let usersInRoomSummary = 'User currently in ' + room + ': ';
        for (let index in usersInRoom) {
            let userSocketId = usersInRoom[index];
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }

                usersInRoomSummary += nickNames[userSocketId];
            }
        }

        usersInRoomSummary += '.';
        socket.emit('message', { text: usersInRoomSummary });
    }
    else {
        console.log("x됨");
    }

    /*
    io.of('/').in(room).clients(function (err, usersInRoom) {
        if (err)
            throw err;

        if (usersInRoom.length > 0) {
            let usersInRoomSummary = 'User currently in ' + room + ': ';
            for (let index in usersInRoom) {
                console.log(usersInRoom[index]);
                let userSocketId = usersInRoom[index];
                if (userSocketId != socket.id) {
                    if (index > 0) {
                        usersInRoomSummary += ', ';
                    }

                    usersInRoomSummary += nickNames[userSocketId];
                }
            }

            usersInRoomSummary += '.';
            socket.emit('message', { text: usersInRoomSummary });
            console.log(usersInRoomSummary);
        }
        else {
            console.log("x됨");
        }

        //console.log(clients[0]); // => [Anw2LatarvGVVXEIAAAD]
        //console.log(io.sockets.sockets[clients[0]]); //socket detail
        //return clients;
    });*/ 
}

function handleNameChangeAttempts(socket, nicknNames, namesUsed) {
    socket.on('nameAttempt', function (name) {
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Name cannot begin with "Guest".'
            });
        }
        else {
            if (namesUsed.indexOf(name) == -1) {
                let previousName = nickNames[socket.id];
                let previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
            }
            else {
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use. '
                });
            }
        }
    });
}

function handleMessageBroadcasting(socket) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
        });
    });
}

function handleRoomJoining(socket) {
    socket.on('join', function (room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    });
}

function handleClientDisconnection(socket) {
    socket.on('disconnect', function () {
    console.log("disconnect");
        
        let nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    });
}

