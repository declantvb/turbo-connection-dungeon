var socket = io.connect(`http://${window.location.hostname}:4200`);
var state;

socket.on('connect', function (data) {

});

socket.on('update', function (newState) {
    state = newState;
    p = state.players[socket.id];
    console.log(`(${p.pX},${p.pY})`)
});

function sendMove(x, y) {
    socket.emit('input', {
        type: 'move',
        x: x,
        y: y
    });   
};

function sendThrow(x, y) {
    socket.emit('input', {
        type: 'throw',
        x: x,
        y: y
    });   
};