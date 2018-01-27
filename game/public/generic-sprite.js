var GenericSprite = function (sprite, scale, yOffset) {

  let self = this;
  this.sprites = [];
  this.charSprite = addSprite(sprite);
  
  function addSprite(name) {
    let sprite = game.add.sprite(0, 0, name);
    sprite.anchor.setTo(0.5, 1 - ((yOffset || 0) / (sprite.height * scale)));
    spriteGroup.add(sprite);

    self.sprites.push(sprite);
    return sprite;
  }

  this.scale(scale);
};

GenericSprite.prototype.move = function (x, y) {
  for (var i = 0; i < this.sprites.length; i++) {
    let sprite = this.sprites[i];
    sprite.x = x;
    sprite.y = y;
  }
}

GenericSprite.prototype.scale = function (s) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].scale.x = s;
    this.sprites[i].scale.y = s;
  }
}

GenericSprite.prototype.destroy = function () {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].destroy();
  }
}