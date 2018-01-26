var socket = io.connect('http://localhost:4200');

socket.on('connect', function (data) {

});

socket.on('update', function (state) {
    state = state.players[socket.id];
    console.log(`(${p.pX},${p.pY})`)
});

function sendMove(dX, dY) {
    socket.emit('input', {
        type: 'move',
        dX: dX,
        dY: dY
    });   
};

function sendThrow(dX, dY) {
    socket.emit('input', {
        type: 'throw',
        dX: dX,
        dY: dY
    });   
};