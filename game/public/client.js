var socket = io.connect('http://localhost:4200');

socket.on('connect', function (data) {

});

socket.on('update', function (data) {
    console.dir(data);
});