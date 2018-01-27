
function render(state) {  
  if (!state) return;
  
  updatePlayers(state.players);
  updatePickups(state.pickups);
  updateThrow(state);
  updateBoss(state);

  // Z Sort
  spriteGroup.sort('y', Phaser.Group.SORT_ASCENDING);
}

var wall;
var throwLine;
var boss;
function renderStart() {
  wall = new Wall(75, 50, 1050, 600);
  throwLine = game.add.graphics(0,0);
  boss = new Boss();
}

var playerObjs = {};
function updatePlayers(players) {

  var addKeys = _.difference(_.keys(players), _.keys(playerObjs));
  for (var i in addKeys) {
    playerObjs[addKeys[i]] = {
      character: new Character()
    };
  }

  var removeKeys = _.difference(_.keys(playerObjs), _.keys(players));
  for (var i in removeKeys) {
    playerObjs[removeKeys[i]].character.destroy();
    delete playerObjs[removeKeys[i]];
  }

  // Update player graphics
  for (var key in players) {
    var p = players[key];
    playerObjs[key].character.move(p.x, p.y);
  }
}

var pickupObjs = {};
function updatePickups(pickups) {
  var addKeys = _.difference(_.keys(pickups), _.keys(pickupObjs));
  for (var i in addKeys) {
    pickupObjs[addKeys[i]] = new Pickup();
  }

  var removeKeys = _.difference(_.keys(pickupObjs), _.keys(pickups));
  for (var i in removeKeys) {
    pickupObjs[removeKeys[i]].destroy();
    delete pickupObjs[removeKeys[i]];
  }

  for (var key in pickups) {
    var p = pickups[key];
    pickupObjs[key].move(p.x, p.y);
  }
}

const THROW_LINE_LENGTH = 75;
function updateThrow(state) {
  let player = state.players[socket.id];

  throwLine.clear();
  throwLine.lineStyle(2,0x0088FF,1);

  let toX = player.x + throwDeltaX * THROW_LINE_LENGTH;
  let toY = player.y + throwDeltaY * THROW_LINE_LENGTH;

  throwLine.moveTo(player.x, player.y);
  throwLine.lineTo(
    player.x + throwDeltaX * THROW_LINE_LENGTH,
    player.y + throwDeltaY * THROW_LINE_LENGTH);  
}

function updateBoss(state) {
  boss.move(state.boss.x, state.boss.y);
}