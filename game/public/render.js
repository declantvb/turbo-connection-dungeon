const BOSS_TELL_LENGTH = 300;

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
  updateBullets(state.bullets);
  updateThrow(state);
  updateBoss(state);
  updateUI(state);
  //updateDebug(state);

  // Z Sort
  spriteGroup.sort('y', Phaser.Group.SORT_ASCENDING);
}

var playerObjs = {};
function updatePlayers(players) {

  var addKeys = _.difference(_.keys(players), _.keys(playerObjs));
  for (var i in addKeys) {
    playerObjs[addKeys[i]] = {
      oldhealth: 100,
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
    var po = playerObjs[key];
    var char = po.character;

    if (p.pickup) {
      var br = throwDeltaX > throwDeltaY;
      var bl = -throwDeltaX > throwDeltaY;

      var direction = br
        ? (bl ? 0 : 3)
        : (bl ? 1 : 2);

      char.moving(false, direction);
    } else {
      if (length(p.vX, p.vY) > 0.1) {
        var br = p.vX > p.vY;
        var bl = -p.vX > p.vY;

        var direction = br
          ? (bl ? 0 : 3)
          : (bl ? 1 : 2);

        char.moving(true, direction);
      } else {
        char.moving(false);
      }
    }

    if (po.oldhealth > p.health) {
      game.plugins.cameraShake.shake();  
      // PLAYER DEATH SCREAM SOUND
      player_scream[Math.floor(Math.random() * player_scream.length)].play();
    }
    po.oldhealth = p.health;
    char.move(p.x, p.y);
    char.holding(!!p.pickup);
    char.dead(p.health < 100);
  }
}

var pickupObjs = {};
var pickupHolders;
function updatePickups(pickups) {
  // Update holders if not exist
  if (!pickupHolders && level) {
    pickupHolders = [];
    for (var key in level.spawners) {
      let spawner = level.spawners[key];
      let sprite = new GenericSprite('spawner', 0.3, 105);
      sprite.move(spawner.x - 12, spawner.y);
      pickupHolders.push(sprite);
    }
  }

  var addKeys = _.difference(_.keys(pickups), _.keys(pickupObjs));
  for (var i in addKeys) {
    pickupObjs[addKeys[i]] = new Pickup();
  }

  var removeKeys = _.difference(_.keys(pickupObjs), _.keys(pickups));
  for (var i in removeKeys) {
    pickupObjs[removeKeys[i]].destroy();
    if(!pickupObjs[removeKeys[i]].triggered){
      // GEM PICKUP SOUND
      gem[1].play();
    }
    delete pickupObjs[removeKeys[i]];    
  }

  for (var key in pickups) {
    var p = pickups[key];

    if (p.lastPlayer) {
      pickupObjs[key].move(p.x, p.y);
      pickupObjs[key].energy(length(p.velocity.x, p.velocity.y) / THROW_POWER)
    } else {
      pickupObjs[key].spawnerIdle(p.x, p.y);
    }
    if(p.despawn == 10 && !pickupObjs[key].triggered){
      // GEM DROP SOUND
      gem[0].play();
      pickupObjs[key].triggered = true;
    }
  }
}

var bulletObjs = {};
function updateBullets(bullets) {
  var addKeys = _.difference(_.keys(bullets), _.keys(bulletObjs));
  for (var i in addKeys) {
    bulletObjs[addKeys[i]] = new Bullet();
    fireballs[0].play();
  }

  var removeKeys = _.difference(_.keys(bulletObjs), _.keys(bullets));
  for (var i in removeKeys) {
    bulletObjs[removeKeys[i]].destroy();
    delete bulletObjs[removeKeys[i]];
  }

  for (var key in bullets) {
    var p = bullets[key];
    bulletObjs[key].move(p.x, p.y);
  }
}

const THROW_LINE_LENGTH = 75;
function updateThrow(state) {  
  let player = state.players[socket.id];
  if (!player.pickup) return;
  graphics.lineStyle(2, 0x0088FF, 1);

  let fromX = player.x + throwDeltaX * THROW_LINE_LENGTH;
  let fromY = player.y + throwDeltaY * THROW_LINE_LENGTH;

  let toX = fromX + throwDeltaX * THROW_LINE_LENGTH;
  let toY = fromY + throwDeltaY * THROW_LINE_LENGTH;

  graphics.moveTo(fromX, fromY);
  graphics.lineTo(toX, toY);
}

function updateBoss(state) {
  boss.state = state.boss.state;
  boss.move(state.boss.x, state.boss.y);
  if (state.boss.target) {
    graphics.lineStyle(1, 0xFF0000, 1);
    graphics.moveTo(state.boss.x, state.boss.y);
    var line = normalised(state.boss.target.x - state.boss.x, state.boss.target.y - state.boss.y);
    graphics.lineTo(state.boss.x + line.x*BOSS_TELL_LENGTH, state.boss.y+line.y*BOSS_TELL_LENGTH);
  }

  if (boss.oldhealth > state.boss.health) {
    game.plugins.cameraShake.shake();
    boss.oldhealth = state.boss.health;
  }
}

function updateUI(state) {
  graphics.lineStyle(1, 0x000000, 1);
  graphics.beginFill(0xFF0000, 1);
  graphics.drawRect(20, 20, SCREEN_WIDTH - 40, 40);
  graphics.endFill();
  graphics.beginFill(0x00FF00, 1);
  graphics.drawRect(20, 20, (SCREEN_WIDTH - 40) * (Math.max(0, state.boss.health) / state.boss.maxHealth), 40);
  graphics.endFill();
}

function updateDebug(state) {
  graphics.lineStyle(1, 0xFF0000, 1);
  for (var key in state.players) {
    var p = state.players[key];
    graphics.drawCircle(p.x, p.y, PLAYER_RADIUS * 2);
  }
  for (var key in state.pickups) {
    var p = state.pickups[key];
    graphics.drawCircle(p.x, p.y, PICKUP_RADIUS * 2);
  }
  for (var key in state.bullets) {
    var p = state.bullets[key];
    graphics.drawCircle(p.x, p.y, BULLET_RADIUS * 2);
  }
  graphics.drawCircle(state.boss.x, state.boss.y, BOSS_RADIUS * 2);
}