var game = new Phaser.Game(1200, 700, Phaser.AUTO, 'thegame', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('outline', '/01-outline.png')
  game.load.image('hair', '/02-hair.png')
  game.load.image('skin', '/03-skin.png')
  game.load.image('shirt', '/04-shirt.png')
  game.load.image('pants', '/05-pants.png')
}

function create() {
  var char = new Character();
}

function update() {
}