var Character = function () {
  this.x = 0, this.y = 0;
  this.width = 300, this.height = 600;

  this.sprites = [];
  this.sprites.push(game.add.sprite(0, 0, 'pants'));
  this.sprites.push(game.add.sprite(0, 0, 'shirt'));
  this.sprites.push(game.add.sprite(0, 0, 'skin'));
  this.sprites.push(game.add.sprite(0, 0, 'hair'));
  this.sprites.push(game.add.sprite(0, 0, 'outline'));

  this.scale(0.15);

  console.log("Character made");
};

Character.prototype.move = function (x, y) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].x = x - this.width / 2;
    this.sprites[i].y = y - this.height + PLAYER_RADIUS;
  }

  this.x = x;
  this.y = y;
}

Character.prototype.scale = function (s) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].scale.x = s;
    this.sprites[i].scale.y = s;
  }

  this.width = this.width * s;
  this.height = this.height * s;
}