var game = new Phaser.Game(1200, 700, Phaser.AUTO, 'thegame', { preload: preload, create: create, update: update });

const BUFFER_LENGTH = 5;
var lastLocalState;
var localStateHistory = [];
var localState;
var errX = 0, errY = 0;

var keyInput = {};
onkeydown = onkeyup = function(e){
    keyInput[e.keyCode] = e.type == 'keydown';
}

function preload() {
  game.load.image('outline', '/textures/01-outline.png');
  game.load.image('hair', '/textures/02-hair.png');
  game.load.image('skin', '/textures/03-skin.png');
  game.load.image('shirt', '/textures/04-shirt.png');
  game.load.image('pants', '/textures/05-pants.png');

  game.load.audio('music_loop', '/audio/music/turbo-connection-dungeon.wav')
}

var music_loop;

function create() {
  music_loop = game.add.audio('music_loop');

  sounds = [
    music_loop
  ];

  game.sound.setDecodedCallback(sounds, start, this);
}

function start() {
  sounds.shift();

  music_loop.loopFull(0.6);

  while(states.length < BUFFER_LENGTH) {
    // Do nothing, wait to get a buffer;
  }
  lastLocalState = JSON.parse(JSON.stringify(states[0]));
}

const TIME_PER_TICK = 1000 / 20;
var timeToTick = 0;
function update() {
  // Don't bother with no buffer, trim overlong buffer
  if (states.length <= 1 || !lastLocalState) return;
  while (states.length > BUFFER_LENGTH + 1) states.shift();

  var state = states[0];
  timeToTick -= game.time.elapsed;
  while (timeToTick <= 0 && state) {
    timeToTick += TIME_PER_TICK;

    console.log(game.time.elapsed)

    
    // Progress local simulation
    localState = JSON.parse(JSON.stringify(state));
    simulate(lastLocalState);
    localState.players[socket.id] = lastLocalState.players[socket.id];
    syncPlayerError();



    localStateHistory.push(lastLocalState);
    lastLocalState = localState;
    updateInput();

    states.shift();
    state = states[0];
  }

  if (states.length <= 1) return;
  // Interpolate
  var t = timeToTick / TIME_PER_TICK;
  console.log(t);
  if (t < 0 || t > 1) return;

  var nextState = states[1];
  updatePlayers(state.players, nextState.players, t);

}


var playerObjs = {};
function updatePlayers(oldPlayers, newPlayers, t) {
  var keys = _.difference(_.keys(newPlayers), _.keys(playerObjs));
  for (var i in keys) {
    playerObjs[keys[i]] = {
      character: new Character()
    };
  }

  // Update players state
  for (var key in newPlayers) {
    var np = newPlayers[key];
    var op = oldPlayers[key];
    var x = (np.pX * t) + (op.pX * (1 - t));
    var y = (np.pY * t) + (op.pY * (1 - t));
    playerObjs[key].character.move(np.pX, np.pY);
  }
}

function syncPlayerError() {
  latestState = states[states.length-1];
  while (localStateHistory.length && localStateHistory[0].frameCount + BUFFER_LENGTH < latestState.frameCount) {
    localStateHistory.shift();
  }

  if (localStateHistory.length && localStateHistory[0].frameCount + BUFFER_LENGTH == latestState.frameCount) {
    var predictState = localStateHistory.shift();

    errX = latestState.players[socket.id].pX - predictState.players[socket.id].pX;
    errY = latestState.players[socket.id].pY - predictState.players[socket.id].pY;
  }
}


var deltaX = 0;
var deltaY = 0;
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

}

function sendInput() {
  if (!localState) return;
  var dX = deltaX;
  var dY = deltaY;
  var length = Math.sqrt(dX * dX + dY * dY);
  if (length != 0) {
    dX /= length;
    dY /= length;
  }
  sendMove(dX, dY);

  // Update local simulation
  localState.players[socket.id].vX = dX;
  localState.players[socket.id].vY = dY;

  deltaX = 0; deltaY = 0;
}

setInterval(function() {
  // TODO change to on frame tick
  sendInput();
}, 1000 / 20);