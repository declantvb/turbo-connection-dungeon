var socket = io.connect(`http://${window.location.hostname}:4200`);

socket.on('connect', function (data) {

});

var states = [];
socket.on('update', function (newState) {
    states.push(newState);
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