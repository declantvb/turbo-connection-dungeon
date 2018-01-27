var Wall = function(x, y, width, height) { 
  this.foreSprites = [];
  this.backSprites = [];

  var texWidth = 300;
  var texHeight = 300;

  var desiredScale = 0.5;


  var rockWidth = texWidth * desiredScale;
  var rockHeight = texHeight * desiredScale;

  var i = 30;

  for (var pX = x; pX < x + width; pX += rockWidth) {
    for (var pY = y; pY < y + height; pY += rockHeight) {
      this.backSprites.push(game.add.sprite(pX, pY, 'dirt'));
    }
  }

  for (var pX = x; pX < x + width; pX += rockWidth) {
    this.foreSprites.push(game.add.sprite(pX, y, 'rockBottom'));
    this.foreSprites.push(game.add.sprite(pX, y + height - rockHeight, 'rockTop'));
  }
  for (var pX = x - rockWidth; pX < x + width + rockWidth; pX += rockWidth) {
    this.foreSprites.push(game.add.sprite(pX, y - rockHeight, 'rockMain'));
    this.foreSprites.push(game.add.sprite(pX, y + height, 'rockMain'));
  }
  for (var pY = y; pY < y + height; pY += rockHeight) {
    this.foreSprites.push(game.add.sprite(x, pY, 'rockRight'));
    this.foreSprites.push(game.add.sprite(x + width - rockWidth, pY, 'rockLeft'));
    this.foreSprites.push(game.add.sprite(x - rockWidth, pY, 'rockMain'));
    this.foreSprites.push(game.add.sprite(x + width, pY, 'rockMain'));
  }

  for (var i = 0; i < this.foreSprites.length; i++) {
    foregroundGroup.add(this.foreSprites[i]);
  } 
  for (var i = 0; i < this.backSprites.length; i++) {
    backgroundGroup.add(this.backSprites[i]);
  } 

  this.scale(desiredScale, desiredScale);

};

Wall.prototype.scale = function(x, y) {
  for (var i = 0; i < this.foreSprites.length; i++) {
    this.foreSprites[i].scale.x = x;
    this.foreSprites[i].scale.y = y;
  } 
  for (var i = 0; i < this.backSprites.length; i++) {
    this.backSprites[i].scale.x = x;
    this.backSprites[i].scale.y = y;
  } 
}