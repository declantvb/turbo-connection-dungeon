var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var gameloop = require('node-gameloop');
var sim = require('./public/simulation.js');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(4200);

var level;
fs.readFile( __dirname + '/levels/0.json', function (err, data) {
    if (err) {
      throw err; 
    }
    level = data;
    state.boss = level.boss;
});

let state = {
    frameCount: 0,
    boss: {
        x: 0,
        y: 0
    },
    players: {},
    thrown: []
};

let clients = {};

io.on('connection', function (client) {
    console.log('Client connected...');
    client.emit('level', level);

    let inputBuffer = [];
    clients[client.id] = {
        socket: client,
        buffer: inputBuffer
    };

    state.players[client.id] = {
        pX: 20,
        pY: 20,
        vX: 0,
        vY: 0
    };

    client.on('input', function (data) {
        inputBuffer.push(data);
    });

    client.on('disconnect', function () {
        delete clients[client.id];
        delete state.players[client.id];
        console.log('Client disconnected...');
    });
});

gameloop.setGameLoop(function (delta) {
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

    sim.simulate(state);

    //send
    for (const key in clients) {
        const client = clients[key].socket;
        client.emit('update', state);
    };
}, 1000 / 20);

function handleMove(player, event) {
    console.log(`moving by ${event.x}, ${event.y}`);

    player.vX = event.x;
    player.vY = event.y;
};

function handleThrow(player, event) {
    console.log(`throwing ${event.dX}, ${event.dY}`);
};