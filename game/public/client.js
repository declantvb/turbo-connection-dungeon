
var states = [];
var sendMove;
var sendThrow;
var socket;

function connect() {
    socket = io.connect(`http://${window.location.hostname}:4200`);

    socket.on('connect', function (data) {

    });

    socket.on('update', function (newState) {
        states.push(newState);
    });
    socket.on('level', function (newLevel) {
        loadLevel(newLevel);
    });

    sendMove = function sendMove(x, y) {
        socket.emit('input', {
            type: 'move',
            x: x,
            y: y
        });
    };

    sendThrow = function sendThrow(dX, dY) {
        socket.emit('input', {
            type: 'throw',
            dX: dX,
            dY: dY
        });
    };

    sendStart = function sendStart() {
        socket.emit('start', {
        });
    };
}
