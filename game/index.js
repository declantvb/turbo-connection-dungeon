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

const PLAYER_RADIUS = 10;
const ROOM_WIDTH = 800;
const ROOM_HEIGHT = 600;

let state = {
    players: {},
    thrown: []
}

let clients = {};

io.on('connection', function (client) {
    console.log('Client connected...');

    let inputBuffer = [];
    clients[client.id] = {
        socket: client,
        buffer: inputBuffer
    };

    state.players[client.id] = {
        pX: 0,
        pY: 0,
        vX: 0,
        vY: 0
    };

    client.on('join', function (data) {
        console.log(data);
        client.emit('messages', 'Hello from server');
    });

    client.on('input', function (data) {
        inputBuffer.push(data);
    });

    client.on('disconnect', function () {
        delete clients[client.id];
        delete state.players[client.id];
        console.log('Client disconnected...');
    });
});

let frameCount = 0;

const id = gameloop.setGameLoop(function (delta) {
    //process
    for (const key in clients) {
        const buffer = clients[key].buffer;
        while (buffer.length > 0) {
            let event = buffer.shift();
            let player = state.players[key];

            switch (event.type) {
                case 'move':
                    handleMove(player, event);
                    break;
                case 'throw':
                    handleThrow(player, event);
                    break;
                default:
                    console.log(`unknown event ${event.type}`);
                    break;
            }
        }
    }

    //send
    for (const key in clients) {
        const client = clients[key].socket;
        client.emit('update', state);
    };

    frameCount++;
}, 1000 / 20);

function handleMove(player, event) {    
    console.log(`moving by ${event.x}, ${event.y}`);

    player.vX = event.x;
    player.vY = event.y;

    let newX = player.pX + player.vX;
    let newY = player.pY + player.vY;

    //bounds
    newX = Math.max(0, Math.min(newX, ROOM_WIDTH));
    newY = Math.max(0, Math.min(newY, ROOM_HEIGHT));

    player.pX = newX;
    player.pY = newY;
}

function handleThrow(player, event) {
    console.log('attacking');
}