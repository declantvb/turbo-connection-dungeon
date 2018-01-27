var wall;
var graphics;
var boss;
function renderStart() {
  wall = new Wall(75, 50, 1050, 600);
  graphics = game.add.graphics(0, 0);
  boss = new Boss();
}

function render(state) {
  if (!state) return;

  graphics.clear();

  updatePlayers(state.players);
  updatePickups(state.pickups);
  updateThrow(state);
  updateBoss(state);
  updateUI(state);
  updateDebug(state);

  // Z Sort
  spriteGroup.sort('y', Phaser.Group.SORT_ASCENDING);
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
    var char = playerObjs[key].character;

    if (length(p.vX, p.vY) > 0.1) { 
      var br = p.vX > p.vY;
      var bl = -p.vX > p.vY;

      var direction = br
        ? (bl ? 0 : 3)
        : (bl ? 1 : 2);

      char.direction(direction);
    }
    char.move(p.x, p.y);
    char.holding(!!p.pickup);
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
  graphics.lineStyle(2, 0x0088FF, 1);

  let toX = player.x + throwDeltaX * THROW_LINE_LENGTH;
  let toY = player.y + throwDeltaY * THROW_LINE_LENGTH;

  graphics.moveTo(player.x, player.y);
  graphics.lineTo(
    player.x + throwDeltaX * THROW_LINE_LENGTH,
    player.y + throwDeltaY * THROW_LINE_LENGTH);
}

function updateBoss(state) {  
  boss.state = state.boss.state;
  boss.move(state.boss.x, state.boss.y);
}

function updateUI(state) {
  graphics.lineStyle(1, 0x000000, 1);
  graphics.beginFill(0xFF0000,1);
  graphics.drawRect(20, 20, SCREEN_WIDTH - 40, 40);
  graphics.endFill();
  graphics.beginFill(0x00FF00,1);
  graphics.drawRect(20, 20, (SCREEN_WIDTH - 40) * (state.boss.health / state.boss.maxHealth), 40);
  graphics.endFill();
  
}

function updateDebug(state) {
  graphics.lineStyle(1, 0xFF0000, 1);
  for (var key in state.players) {
    var p = state.players[key];
    graphics.drawCircle(p.x, p.y, PLAYER_RADIUS*2);
  }
  for (var key in state.pickups) {
    var p = state.pickups[key];
    graphics.drawCircle(p.x, p.y, PICKUP_RADIUS*2);
  }
  graphics.drawCircle(state.boss.x, state.boss.y, BOSS_RADIUS*2);
}