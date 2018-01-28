var GenericBackground = function (sprite, scale, fore) {

  let self = this;
  this.sprites = [];
  this.charSprite = addSprite(sprite);
  
  function addSprite(name) {
    let sprite = game.add.sprite(0, 0, name);
    if (fore)
      foregroundGroup.add(sprite);
    else
      backgroundGroup.add(sprite);

    self.sprites.push(sprite);
    return sprite;
  }

  this.scale(scale);
};

GenericBackground.prototype.move = function (x, y) {
  for (var i = 0; i < this.sprites.length; i++) {
    let sprite = this.sprites[i];
    sprite.x = x;
    sprite.y = y;
  }
}

GenericBackground.prototype.scale = function (s) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].scale.x = s;
    this.sprites[i].scale.y = s;
  }
}

GenericBackground.prototype.destroy = function () {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].destroy();
  }
}