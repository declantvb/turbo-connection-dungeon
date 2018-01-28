var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var gameloop = require('node-gameloop');
var sim = require('./public/simulation.js');
var util = require('./public/util.js');
var convertColor = require('./public/convertcolor.js');
_ = require('lodash');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(4200);

var level;

loadLevelFromFile('lobby');

function loadLevelFromFile(levelName) {
    let path = __dirname + '/levels/' + levelName + '.json';

    console.log("Loading level: " + path)

    fs.readFile(path, function (err, data) {

        console.log("Loaded level: " + path)
        if (err) {
            throw err;
        }
        level = JSON.parse(data.toString());

        state = {
            timeToDie: 100,
            frameCount: 0,
            boss: level.boss ? {
                x: level.boss.x,
                y: level.boss.y,
                health: 100,
                maxHealth: 100
            } : undefined,
            players: state ? state.players : {},
            pickups: {},
            bullets: {}
        };

        for (const key in clients) {
            const client = clients[key].socket;
            client.emit('level', level);
        };
    });
}

let state = { players: {} };

let clients = {};

io.on('connection', function (client) {
    console.log('Client connected... Level: ' + JSON.stringify(level));
    client.emit('level', level);

    let inputBuffer = [];
    clients[client.id] = {
        socket: client,
        buffer: inputBuffer
    };

    let updown = Math.random() > 0.5;
    let side = Math.random() > 0.5;
    let pos = Math.random() * (updown ? level.playArea.width : level.playArea.height)

    let { r, g, b } = convertColor.HSBToRGB({h:Math.random(), s:1, v:1});
    console.log(r + ' ' + g + ' ' + b);
    state.players[client.id] = {
        tint: `0x${pad(r.toString(16), 2)}${pad(g.toString(16), 2)}${pad(b.toString(16), 2)}`,
        health: 100,
        maxHealth: 100,
        x: level.playArea.x + (side ? level.playArea.height : 0) + (updown ? pos : 0),
        y: level.playArea.y + (side ? level.playArea.width : 0) + (updown ? 0 : pos),
        vX: 0,
        vY: 0
    };

    client.on('input', function (data) {
        inputBuffer.push(data);
    });

    client.on('start', function (data) {
        loadLevelFromFile('0');
    });

    client.on('disconnect', function () {
        delete clients[client.id];
        delete state.players[client.id];
        console.log('Client disconnected...');
    });
});

gameloop.setGameLoop(function (delta) {
    if (!level) return;

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

    sim.serverSimulate(level, state);
    sim.simulate(level, state);

    //send
    for (const key in clients) {
        const client = clients[key].socket;
        client.emit('update', state);
    };

    let alive = false;
    for (let key in state.players) {
        if (state.players[key].health == 100) {
            alive = true;
        }
    }

    if (!alive) {
        state.timeToDie--;
        if (state.timeToDie <= 0) {
            level = null;
            loadLevelFromFile('lobby');
        }
    } else {
        state.timeToDie = 20;
    }
}, 1000 / 20);

function handleMove(player, event) {
    console.log(`moving by ${event.x}, ${event.y}`);

    player.vX = event.x;
    player.vY = event.y;
};

function handleThrow(player, event) {
    console.log(`throwing ${event.dX}, ${event.dY}`);

    player.inputThrow = event;
};

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}