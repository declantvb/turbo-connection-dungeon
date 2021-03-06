const BOSS_TELL_LENGTH = 150;
const REZ_BAR_WIDTH = 60;
const REZ_BAR_HEIGHT = 10;

var wall;
var graphics;
var boss;
var lobby;
var lobbyStartButton;
var lobbyHelp;

function renderStart(level) {
  if (level.walls) wall = new Wall(75, 50, 1050, 600);
  if (level.lobby) {
    lobby = new GenericBackground('lobby', 1);
    lobbyStartButton = new GenericBackground('start-button', 1);
    lobbyStartButton.move(860, 78);
    lobbyStartButton.sprites[0].inputEnabled = true;
    lobbyStartButton.sprites[0].events.onInputDown.add(function () {
      console.log("START!");
      sendStart();
    });

    lobbyHelp = new GenericBackground('howto', 1, true);
    lobbyHelp.move(-470, 240);
    lobbyHelp.target = -470;
    lobbyHelp.sprites[0].inputEnabled = true;
    lobbyHelp.sprites[0].events.onInputDown.add(function () {
      if (lobbyHelp.target != -470)
        lobbyHelp.target = -470;
      else
        lobbyHelp.target = 0;
    });
  }
  graphics = game.add.graphics(0, 0);
  if (level.boss) boss = new Boss();
}

function renderEnd() {
  if (wall) wall.destroy();
  if (graphics) graphics.destroy();
  if (boss) boss.destroy();
  if (lobby) lobby.destroy();
  if (lobbyStartButton) lobbyStartButton.destroy();
  if (lobbyHelp) lobbyHelp.destroy();
  if (pickupObjs) {
    for (var k in pickupObjs) pickupObjs[k].destroy();
  }
  if (bulletObjs) {
    for (var k in bulletObjs) bulletObjs[k].destroy();
  }
  if (pickupHolders) {
    for (var k in pickupHolders) pickupHolders[k].destroy();
    pickupHolders = null;
  }
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

  if (lobbyHelp) {
    lobbyHelp.sprites[0].x += (lobbyHelp.target - lobbyHelp.sprites[0].x) / 10;
  }
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
    playerObjs[addKeys[i]].character.setTint(players[addKeys[i]].tint);
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

    if (p.health < 100) {
      graphics.lineStyle(1, 0x000000, 1);
      graphics.beginFill(0xFF0000, 1);
      graphics.drawRect(p.x - REZ_BAR_WIDTH / 2, p.y - 50, REZ_BAR_WIDTH, REZ_BAR_HEIGHT);
      graphics.endFill();
      graphics.beginFill(0x00FF00, 1);
      graphics.drawRect(p.x - REZ_BAR_WIDTH / 2, p.y - 50, p.health / 100 * REZ_BAR_WIDTH, REZ_BAR_HEIGHT);
      graphics.endFill();
    }
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
    if(pickups[addKeys[i]].thrown){
      gem[2].play();
    }
    pickupObjs[addKeys[i]] = new Pickup();
  }

  var removeKeys = _.difference(_.keys(pickupObjs), _.keys(pickups));
  for (var i in removeKeys) {
    pickupObjs[removeKeys[i]].destroy();
    if (!pickupObjs[removeKeys[i]].triggered) {
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
    if (p.despawn == 10 && !pickupObjs[key].triggered) {
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

    if (p.ttl) {
      bulletObjs[key].explode();
    }
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
  if (!state.boss || !state.boss.state) return;
  boss.state = state.boss.state;
  boss.move(state.boss.x, state.boss.y);
  if (state.boss.target) {
    graphics.lineStyle(1, 0xFF0000, 1);
    if (state.boss.attackType == 0) {
      var line = normalised(state.boss.target.x - state.boss.x, state.boss.target.y - state.boss.y);
      graphics.moveTo(state.boss.x + line.x * BOSS_TELL_LENGTH, state.boss.y + line.y * BOSS_TELL_LENGTH);
      graphics.lineTo(state.boss.x + line.x * BOSS_TELL_LENGTH * 2, state.boss.y + line.y * BOSS_TELL_LENGTH * 2);
    } else {
      graphics.drawCircle(state.boss.x, state.boss.y, BOSS_TELL_LENGTH);
    }
  }

  if (boss.oldhealth > state.boss.health) {
    game.plugins.cameraShake.shake();
    hitboss[Math.floor(Math.random() * hitboss.length)].play();
    boss.hurt(true);
    boss.hurtTimer = 10;
  }
  boss.oldhealth = state.boss.health;

  if (boss.hurtTimer > 0) {
    boss.hurtTimer--;
  }
  else {
    boss.hurt(false);
  }

  if (state.boss.roar) {
    if (!boss.roaring) {
      bossSounds[0].play();
      boss.roaring = true;
    }
  } else {
    boss.roaring = false;
  }
}

function updateUI(state) {
  if (state.boss) {
    // Boss health bar
    graphics.lineStyle(1, 0x000000, 1);
    graphics.beginFill(0xFF0000, 1);
    graphics.drawRect(20, 20, SCREEN_WIDTH - 40, 40);
    graphics.endFill();
    graphics.beginFill(0x00FF00, 1);
    graphics.drawRect(20, 20, (SCREEN_WIDTH - 40) * (Math.max(0, state.boss.health) / state.boss.maxHealth), 40);
    graphics.endFill();
  }
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