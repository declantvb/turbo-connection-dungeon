var game = new Phaser.Game(1200, 700, Phaser.AUTO, 'thegame', { preload: preload, create: create, update: update });

const BUFFER_LENGTH = 3;
var lastLocalState;
var localStateHistory = [];
var localState;
var errX = 0, errY = 0;
var spriteGroup;
var backgroundGroup;
var foregroundGroup;
var level;
var music;
var player_scream;
var gem;
var fireballs;
var hitboss;

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
  game.load.spritesheet('character', '/textures/character.png', 150, 300, 64);

  game.load.image('body', '/textures/body01.png');
  game.load.image('head', '/textures/head01.png');
  game.load.spritesheet('leg', '/textures/spiderlegs-animated/legs-sheet.png', 300, 600, 28);
  
  game.load.image('spawner', '/textures/cornerpillar.png');
  game.load.image('projectile', '/textures/magic-gem.png');
  game.load.image('fireball', '/textures/fireball.png');

  game.load.image('rockBottom', '/textures/rock-bottom.png');
  game.load.image('rockLeft', '/textures/rock-left.png');
  game.load.image('rockMain', '/textures/rock-main.png');
  game.load.image('rockRight', '/textures/rock-right.png');
  game.load.image('rockTop', '/textures/rock-top.png');

  game.load.image('dirt', '/textures/dirt.png');

  game.load.audio('music_loop', '/audio/music/turbo-connection-dungeon.wav');
  game.load.audio('music_loop2', '/audio/music/turbo-connection-dungeon2.wav');

  game.load.audio('player_scream_001', '/audio/sfx/player/scream/sfx-player-scream-001.wav');
  game.load.audio('player_scream_002', '/audio/sfx/player/scream/sfx-player-scream-002.wav');
  game.load.audio('player_scream_003', '/audio/sfx/player/scream/sfx-player-scream-003.wav');
  game.load.audio('player_scream_004', '/audio/sfx/player/scream/sfx-player-scream-004.wav');
  game.load.audio('player_scream_005', '/audio/sfx/player/scream/sfx-player-scream-005.wav');
  game.load.audio('player_scream_006', '/audio/sfx/player/scream/sfx-player-scream-006.wav');
  game.load.audio('player_scream_007', '/audio/sfx/player/scream/sfx-player-scream-007.wav');
  game.load.audio('player_scream_008', '/audio/sfx/player/scream/sfx-player-scream-008.wav');
  game.load.audio('player_scream_009', '/audio/sfx/player/scream/sfx-player-scream-009.wav');
  game.load.audio('player_scream_010', '/audio/sfx/player/scream/sfx-player-scream-010.wav');
  game.load.audio('player_scream_011', '/audio/sfx/player/scream/sfx-player-scream-011.wav');
  game.load.audio('player_scream_012', '/audio/sfx/player/scream/sfx-player-scream-012.wav');
  game.load.audio('player_scream_013', '/audio/sfx/player/scream/sfx-player-scream-013.wav');
  game.load.audio('player_scream_014', '/audio/sfx/player/scream/sfx-player-scream-014.wav');

  game.load.audio('gem_drop', '/audio/sfx/gem/sfx-gem-drop.wav');
  game.load.audio('gem_grab', '/audio/sfx/gem/sfx-gem-grab.wav');

  game.load.audio('fireball', '/audio/sfx/boss/sfx-fireball.wav');
  game.load.audio('hit_boss_001', '/audio/sfx/boss/sfx-hit-boss-001.wav');
  game.load.audio('hit_boss_002', '/audio/sfx/boss/sfx-hit-boss-002.wav');
}

function create() {
  game.plugins.cameraShake = game.plugins.add(Phaser.Plugin.CameraShake);
  game.plugins.cameraShake.setup({
    shakeRange: 20,
    shakeCount: 3,
    shakeInterval: 30,
    randomShake: false,
    randomizeInterval: false,
    shakeAxis: 'xy'
  });

  var music_loop = game.add.audio('music_loop');
  var music_loop2 = game.add.audio('music_loop2');

  var player_scream_001 = game.add.audio('player_scream_001');
  var player_scream_002 = game.add.audio('player_scream_002');
  var player_scream_003 = game.add.audio('player_scream_003');
  var player_scream_004 = game.add.audio('player_scream_004');
  var player_scream_005 = game.add.audio('player_scream_005');
  var player_scream_006 = game.add.audio('player_scream_006');
  var player_scream_007 = game.add.audio('player_scream_007');
  var player_scream_008 = game.add.audio('player_scream_008');
  var player_scream_009 = game.add.audio('player_scream_009');
  var player_scream_010 = game.add.audio('player_scream_010');
  var player_scream_011 = game.add.audio('player_scream_011');
  var player_scream_012 = game.add.audio('player_scream_012');
  var player_scream_013 = game.add.audio('player_scream_013');
  var player_scream_014 = game.add.audio('player_scream_014');

  var gem_drop = game.add.audio('gem_drop');
  var gem_grab = game.add.audio('gem_grab');

  var fireball = game.add.audio('fireball');
  var hit_boss_001 = game.add.audio('hit_boss_001');
  var hit_boss_002 = game.add.audio('hit_boss_002');

  music = [
    music_loop,
    music_loop2
  ]

  player_scream = [
    player_scream_001,
    player_scream_002,
    player_scream_003,
    player_scream_004,
    player_scream_005,
    player_scream_006,
    player_scream_007,
    player_scream_008,
    player_scream_009,
    player_scream_010,
    player_scream_011,
    player_scream_012,
    player_scream_013,
    player_scream_014   
  ]

  gem = [
    gem_drop,
    gem_grab
  ]

  fireballs = [
    fireball
  ]

  hitboss = [
    hit_boss_001,
    hit_boss_002
  ]

  var sounds = _.flatten([
    music,
    player_scream,
    gem,
    fireballs,
    hitboss
  ]);

  game.sound.setDecodedCallback(sounds, function(){
    console.log('Sounds decoded');
    music[Math.floor(Math.random() * 2)].loopFull(1);
  }, this);

  backgroundGroup = game.add.group();
  spriteGroup = game.add.group();
  foregroundGroup = game.add.group();

  game.world.bringToTop(backgroundGroup);
  game.world.bringToTop(spriteGroup);
  game.world.bringToTop(foregroundGroup);

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

  // Don't bother with no buffer, trim overlong buffer
  if (states.length <= 1 || !localState) return;
  while (states.length > BUFFER_LENGTH + 1) states.shift();

  var state = states[0];
  var sendInputThisFrame = false;
  if (game.time.elapsed > 1000) return;
  timeToTick -= game.time.elapsed;
  while (timeToTick <= 0 && state) {
    sendInputThisFrame = true;
    thisTimePerTick = TIME_PER_TICK + (BUFFER_LENGTH - states.length) * 10;
    timeToTick += thisTimePerTick;

    // Progress local simulation
    lastLocalState = localState;
    var tempState = JSON.parse(JSON.stringify(localState));
    localState = JSON.parse(JSON.stringify(state));
    simulate(level, tempState);
    localState.players[socket.id].x = tempState.players[socket.id].x;
    localState.players[socket.id].y = tempState.players[socket.id].y;
    syncPlayerError();

    // Fix client prediction error
    var dX = errX / 10;
    var dY = errY / 10;
    errX -= dX;
    errY -= dY;
    localState.players[socket.id].x += dX;
    localState.players[socket.id].y += dY;

    localStateHistory.push(lastLocalState);

    states.shift();
    state = states[0];
  }

  if (sendInputThisFrame) {
    sendInput();
  }

  if (states.length <= 1) return;

  // Interpolate
  var t = 1 - (timeToTick / thisTimePerTick);
  if (t < 0 || t > 1) return;

  interpState = interpolateState(lastLocalState, localState, t);
  render(interpState);
}

function interpolateState(fromState, toState, t) {
  var interpState = JSON.parse(JSON.stringify(toState));

  for (var key in fromState.players) {
    let np = toState.players[key];
    let op = fromState.players[key];
    if (!(np && op)) continue;
    let {x, y} = interpObj(op, np, t);
    interpState.players[key].x = x;
    interpState.players[key].y = y;
  }

  for (var key in fromState.pickups) {
    if (!(fromState.pickups[key] && toState.pickups[key])) continue;
    let {x, y} = interpObj(fromState.pickups[key], toState.pickups[key], t);
    interpState.pickups[key].x = x;
    interpState.pickups[key].y = y;
  }

  for (var key in fromState.bullets) {
    if (!(fromState.bullets[key] && toState.bullets[key])) continue;
    let {x, y} = interpObj(fromState.bullets[key], toState.bullets[key], t);
    interpState.bullets[key].x = x;
    interpState.bullets[key].y = y;
  }

  if (fromState.boss && toState.boss) {
    let {x, y} = interpObj(fromState.boss, toState.boss, t);
    interpState.boss.x = x;
    interpState.boss.y = y;

    if (fromState.boss.target && toState.boss.target) {
      let {x: tX, y: tY} = interpObj(fromState.boss.target, toState.boss.target, t);
      interpState.boss.target.x = tX;
      interpState.boss.target.y = tY;
    }
  }


  return interpState;
}

function syncPlayerError() {
  latestState = states[states.length - 1];
  while (localStateHistory.length && localStateHistory[0].frameCount + BUFFER_LENGTH < latestState.frameCount) {
    localStateHistory.shift();
  }

  if (localStateHistory.length && localStateHistory[0].frameCount + BUFFER_LENGTH == latestState.frameCount) {
    var predictState = localStateHistory.shift();

    errX = latestState.players[socket.id].x - predictState.players[socket.id].x;
    errY = latestState.players[socket.id].y - predictState.players[socket.id].y;
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

    let deltaX = mouseX - player.x;
    let deltaY = mouseY - player.y;

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

function loadLevel(newLevel) {
  console.log('loading new level');
  level = newLevel;
};