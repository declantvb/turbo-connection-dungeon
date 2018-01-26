var Character = function() { 
  this.sprites = [];
  this.sprites.push(game.add.sprite(0, 0, 'pants'));
  this.sprites.push(game.add.sprite(0, 0, 'shirt'));
  this.sprites.push(game.add.sprite(0, 0, 'skin'));
  this.sprites.push(game.add.sprite(0, 0, 'hair'));
  this.sprites.push(game.add.sprite(0, 0, 'outline'));

  this.scale(0.1);

  console.log("Character made")
};

Character.prototype.move = function(x,y) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].x = x;
    this.sprites[i].y = y;
  }
}

Character.prototype.scale = function(s) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].scale.x = s;
    this.sprites[i].scale.y = s;
  } 
}