var game = new Phaser.Game(1200, 700, Phaser.AUTO, 'thegame', { preload: preload, create: create, update: update });

const BUFFER_LENGTH = 5;
var lastLocalState;
var localStateHistory = [];
var localState;
var errX = 0, errY = 0;

var keyInput = {};
onkeydown = onkeyup = function (e) {
  keyInput[e.keyCode] = e.type == 'keydown';
}

function preload() {
  game.load.image('outline', '/textures/01-outline.png');
  game.load.image('hair', '/textures/02-hair.png');
  game.load.image('skin', '/textures/03-skin.png');
  game.load.image('shirt', '/textures/04-shirt.png');
  game.load.image('pants', '/textures/05-pants.png');

  game.load.image('rockBottom', '/textures/rock-bottom.png');
  game.load.image('rockLeft', '/textures/rock-left.png');
  game.load.image('rockMain', '/textures/rock-main.png');
  game.load.image('rockRight', '/textures/rock-right.png');
  game.load.image('rockTop', '/textures/rock-top.png');

  game.load.image('dirt', '/textures/dirt.png');

  game.load.audio('music_loop', '/audio/music/turbo-connection-dungeon.wav');
  game.load.audio('music_loop2', '/audio/music/turbo-connection-dungeon2.wav');
}

var music_loop;

function create() {
  music_loop = game.add.audio('music_loop');
  music_loop2 = game.add.audio('music_loop2');

  sounds = [
    music_loop,
    music_loop2
  ];

  game.sound.setDecodedCallback(sounds, start, this);
}

function start() {
  sounds.shift();

  music_loop2.loopFull(0.6);

  renderStart();
}

var started = false;
const TIME_PER_TICK = 1000 / 20;
var thisTimePerTick;
var timeToTick = 0;
function update() {
  updateInput();

  if (!started) {
    if (states.length < 5) return;
    localState = JSON.parse(JSON.stringify(states[0]));
    started = true;
  }

  console.log(states.length);
  // Don't bother with no buffer, trim overlong buffer
  if (states.length <= 1 || !localState) return;
  while (states.length > BUFFER_LENGTH + 1) states.shift();

  var state = states[0];
  if (game.time.elapsed > 1000) return;
  timeToTick -= game.time.elapsed;
  while (timeToTick <= 0 && state) {
    thisTimePerTick = TIME_PER_TICK + (BUFFER_LENGTH - states.length) * 10;
    timeToTick += thisTimePerTick;

    // Progress local simulation
    lastLocalState = localState;
    var tempState = JSON.parse(JSON.stringify(localState));
    localState = JSON.parse(JSON.stringify(state));
    simulate(tempState);
    localState.players[socket.id] = tempState.players[socket.id];
    syncPlayerError();

    // Fix client prediction error
    var dX = errX / 10;
    var dY = errY / 10;
    errX -= dX;
    errY -= dY;
    localState.players[socket.id].pX += dX;
    localState.players[socket.id].pY += dY;

    localStateHistory.push(lastLocalState);

    states.shift();
    state = states[0];
  }

  if (states.length <= 1) return;

  // Interpolate
  var t = 1 - (timeToTick / thisTimePerTick);
  if (t < 0 || t > 1) return;

  interpState = interpolatePlayerState(lastLocalState, localState, t);
  render(interpState);
}

function interpolatePlayerState(fromState, toState, t) {
  var interpState = JSON.parse(JSON.stringify(toState));

  for (var key in fromState.players) {
    var np = toState.players[key];
    var op = fromState.players[key];
    if (!(np && op)) continue;
    var x = (np.pX * t) + (op.pX * (1 - t));
    var y = (np.pY * t) + (op.pY * (1 - t));

    interpState.players[key].pX = x;
    interpState.players[key].pY = y;
  }
}

function syncPlayerError() {
  latestState = states[states.length - 1];
  while (localStateHistory.length && localStateHistory[0].frameCount + BUFFER_LENGTH < latestState.frameCount) {
    localStateHistory.shift();
  }

  if (localStateHistory.length && localStateHistory[0].frameCount + BUFFER_LENGTH == latestState.frameCount) {
    var predictState = localStateHistory.shift();

    errX = latestState.players[socket.id].pX - predictState.players[socket.id].pX;
    errY = latestState.players[socket.id].pY - predictState.players[socket.id].pY;
  }
}


var deltaX = 0, deltaY = 0;
var mouseX = 0, mouseY = 0;
var throwDeltaX = 0, throwDeltaY = 0;
function updateInput() {
  // Input
  if (keyInput[87]) { // W
    deltaY -= 1;
  }
  if (keyInput[65]) { // A
    deltaX -= 1;
  }
  if (keyInput[83]) { // S
    deltaY += 1;
  }
  if (keyInput[68]) { // D
    deltaX += 1;
  }

  mouseX = game.input.mousePointer.x;
  mouseY = game.input.mousePointer.y;

  {
    if (!localState) return;
    let player = localState.players[socket.id];

    let deltaX = mouseX - player.pX;
    let deltaY = mouseY - player.pY;

    let length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    throwDeltaX = deltaX / length;
    throwDeltaY = deltaY / length;
  }
}

var lastMoveX, lastMoveY;
function sendInput() {
  if (!localState) return;
  let player = localState.players[socket.id];

  var dX = deltaX;
  var dY = deltaY;
  var length = Math.sqrt(dX * dX + dY * dY);
  if (length != 0) {
    dX /= length;
    dY /= length;
  }
  if (lastMoveX != dX || lastMoveY != dY) {
    sendMove(dX, dY);
    lastMoveX = dX;
    lastMoveY = dY;
  }

  // Update local simulation
  player.vX = dX;
  player.vY = dY;

  if (game.input.activePointer.isDown) {
    sendThrow(throwDeltaX, throwDeltaY);
  }  

  deltaX = 0; deltaY = 0;
}

setInterval(function () {
  // TODO change to on frame tick
  sendInput();
}, 1000 / 20);

function loadLevel(level) {
  
};