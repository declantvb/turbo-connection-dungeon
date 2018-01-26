var game = new Phaser.Game(1200, 700, Phaser.AUTO, 'thegame', { preload: preload, create: create, update: update });

var keyInput = {};
onkeydown = onkeyup = function(e){
    keyInput[e.keyCode] = e.type == 'keydown';
}

function preload() {
  game.load.image('outline', '/01-outline.png');
  game.load.image('hair', '/02-hair.png');
  game.load.image('skin', '/03-skin.png');
  game.load.image('shirt', '/04-shirt.png');
  game.load.image('pants', '/05-pants.png');

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
}

function update() {
  if (!state) return;

  updatePlayers(state.players);

  updateInput();


}


var players = {};
function updatePlayers(newPlayers) {
  var keys = _.difference(_.keys(newPlayers), _.keys(players));


  for (var i in keys) {
    players[keys[i]] = {
      character: new Character()
    };
  }

  // Update players state
  for (var key in newPlayers) {

    
    console.log(key);
    console.log(players);

        var np = newPlayers[key];


    players[key].character.move(np.pX, np.pY);
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

setInterval(function() {
  var length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  sendMove(deltaX / length, deltaY / length);
  deltaX = 0; deltaY = 0;
}, 1000 / 20);