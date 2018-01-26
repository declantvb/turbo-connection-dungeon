// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var gameloop = require('node-gameloop');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(4200);

let state = {
    players: {}
}

let clients = {};

io.on('connection', function(client) {  
    console.log('Client connected...');
    
    let inputBuffer = [];
    clients[client.id] = {
        socket: client,
        buffer: inputBuffer
    };

    state.players[client.id] = {
        pX: 0,
        pY: 0,
        dir: 0
    };
    
    client.on('join', function(data) {
        console.log(data);
        client.emit('messages', 'Hello from server');
    });

    client.on('move', function(data) {
        inputBuffer.add(data);
    });

    client.on('disconnect', function () {
        delete clients[client.id];
        delete state.players[client.id];
        console.log('Client disconnected...');
    });
});

let frameCount = 0;

const id = gameloop.setGameLoop(function(delta) {
    //process


    //send
    for (const key in clients) {
        const client = clients[key].socket;
        client.emit('update', state);
    };

    frameCount++;
}, 1000 / 20);