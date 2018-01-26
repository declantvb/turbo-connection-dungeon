var socket = io.connect('http://localhost:4200');

socket.on('connect', function (data) {

});

socket.on('update', function (state) {
    let p = state.players[socket.id];
    console.log(`(${p.pX},${p.pY})`)
});

function sendMove(dX, dY) {
    socket.emit('move', {
        dX: dX,
        dY: dY
    });   
}