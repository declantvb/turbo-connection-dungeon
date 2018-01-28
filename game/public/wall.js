var Wall = function(startX, startY, width, height) { 
  this.foreSprites = [];
  this.backSprites = [];

  var texWidth = 300;
  var texHeight = 300;

  var desiredScale = 0.5;


  var rockWidth = texWidth * desiredScale;
  var rockHeight = texHeight * desiredScale;

  var i = 30;

  for (var x = startX; x < startX + width; x += rockWidth) {
    for (var y = startY; y < startY + height; y += rockHeight) {
      this.backSprites.push(game.add.sprite(x, y, 'dirt'));
    }
  }

  for (var x = startX; x < startX + width; x += rockWidth) {
    this.foreSprites.push(game.add.sprite(x, startY, 'rockBottom'));
    this.foreSprites.push(game.add.sprite(x, startY + height - rockHeight, 'rockTop'));
  }
  for (var x = startX - rockWidth; x < startX + width + rockWidth; x += rockWidth) {
    this.foreSprites.push(game.add.sprite(x, startY - rockHeight, 'rockMain'));
    this.foreSprites.push(game.add.sprite(x, startY + height, 'rockMain'));
  }
  for (var y = startY; y < startY + height; y += rockHeight) {
    this.foreSprites.push(game.add.sprite(startX, y, 'rockRight'));
    this.foreSprites.push(game.add.sprite(startX + width - rockWidth, y, 'rockLeft'));
    this.foreSprites.push(game.add.sprite(startX - rockWidth, y, 'rockMain'));
    this.foreSprites.push(game.add.sprite(startX + width, y, 'rockMain'));
  }

  for (var i = 0; i < this.foreSprites.length; i++) {
    foregroundGroup.add(this.foreSprites[i]);
  } 
  for (var i = 0; i < this.backSprites.length; i++) {
    backgroundGroup.add(this.backSprites[i]);
  } 

  this.scale(desiredScale, desiredScale);

};


Wall.prototype.destroy = function () {
  for (var i = 0; i < this.sprites.length; i++) {
    this.foreSprites[i].destroy();
    this.backSprites[i].destroy();
  }
}

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