var Wall = function(x, y, width, height) { 
  this.sprites = [];

  var rockWidth = game.cache.getImage('rockMain').width;
  var rockHeight = game.cache.getImage('rockMain').height;

  console.log(rockWidth);
  for (var pX = x; x < width; x += rockWidth) {
    this.sprites.push(game.add.sprite(0, 0, 'rockBottom'));
  }

  //this.sprites.push(game.add.sprite(0, 0, 'rockLeft'));
  //this.sprites.push(game.add.sprite(0, 0, 'skin'));
  //this.sprites.push(game.add.sprite(0, 0, 'hair'));
  //this.sprites.push(game.add.sprite(0, 0, 'outline'));

  this.scale(0.15);

};

Wall.prototype.scale = function(s) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].scale.x = s;
    this.sprites[i].scale.y = s;
  } 
}