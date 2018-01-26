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
    players: []
}

let clients = {};

io.on('connection', function(client) {  
    console.log('Client connected...');
    
    let inputBuffer = [];
    clients[client.id] = {
        socket: client,
        buffer: inputBuffer
    }
    
    client.on('join', function(data) {
        console.log(data);
        client.emit('messages', 'Hello from server');
    });

    client.on('move', function(data) {
        inputBuffer.add(data);
    });
});

let frameCount = 0;

const id = gameloop.setGameLoop(function(delta) {
    // `delta` is the delta time from the last frame 
    console.log('Hi there! (frame=%s, delta=%s)', frameCount++, delta);

    for (const key in clients) {
        const client = clients[key].socket;
        client.emit('update', state);
    }

}, 1000 / 20);