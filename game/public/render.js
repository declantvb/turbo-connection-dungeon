
function render(state) {  
  if (!state) return;
  
  updatePlayers(state.players);
  updateThrow(state);
  updateBoss(state);
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

  var keys = _.difference(_.keys(players), _.keys(playerObjs));
  for (var i in keys) {
    playerObjs[keys[i]] = {
      character: new Character()
    };
  }

  // Update player graphics
  for (var key in players) {
    var p = players[key];
    playerObjs[key].character.move(p.pX, p.pY);
  }
}

const THROW_LINE_LENGTH = 75;
function updateThrow(state) {
  let player = state.players[socket.id];

  throwLine.clear();
  throwLine.lineStyle(2,0x0088FF,1);

  let toX = player.pX + throwDeltaX * THROW_LINE_LENGTH;
  let toY = player.pY + throwDeltaY * THROW_LINE_LENGTH;

  throwLine.moveTo(player.pX, player.pY);
  throwLine.lineTo(
    player.pX + throwDeltaX * THROW_LINE_LENGTH,
    player.pY + throwDeltaY * THROW_LINE_LENGTH);  
}

function updateBoss(state) {
  boss.move(state.boss.x, state.boss.y);
}