var Wall = function(x, y, width, height) { 
  this.sprites = [];

  var texWidth = 300;
  var texHeight = 300;

  var desiredScale = 0.5;


  var rockWidth = texWidth * desiredScale;
  var rockHeight = texHeight * desiredScale;

  var i = 30;

  for (var pX = x; pX < x + width; pX += rockWidth) {
    for (var pY = y; pY < y + height; pY += rockHeight) {
      this.sprites.push(game.add.sprite(pX, pY, 'dirt'));
    }
  }
  
  for (var pX = x; pX < x + width; pX += rockWidth) {
    this.sprites.push(game.add.sprite(pX, y, 'rockBottom'));
    this.sprites.push(game.add.sprite(pX, y + height - rockHeight, 'rockTop'));
  }
  for (var pX = x - rockWidth; pX < x + width + rockWidth; pX += rockWidth) {
    this.sprites.push(game.add.sprite(pX, y - rockHeight, 'rockMain'));
    this.sprites.push(game.add.sprite(pX, y + height, 'rockMain'));
  }
  for (var pY = y; pY < y + height; pY += rockHeight) {
    game.debug.geom( new Phaser.Rectangle(x, pY, rockWidth, rockHeight), 'rgba('+ (i++ * 20 % 250) + ',0,0,1)' ) ;
    this.sprites.push(game.add.sprite(x, pY, 'rockRight'));
    this.sprites.push(game.add.sprite(x + width - rockWidth, pY, 'rockLeft'));
    this.sprites.push(game.add.sprite(x - rockWidth, pY, 'rockMain'));
    this.sprites.push(game.add.sprite(x + width, pY, 'rockMain'));
  }


  //this.sprites.push(game.add.sprite(0, 0, 'rockLeft'));
  //this.sprites.push(game.add.sprite(0, 0, 'skin'));
  //this.sprites.push(game.add.sprite(0, 0, 'hair'));
  //this.sprites.push(game.add.sprite(0, 0, 'outline'));

  this.scale(desiredScale, desiredScale);

};

Wall.prototype.scale = function(x, y) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].scale.x = x;
    this.sprites[i].scale.y = y;
  } 
}