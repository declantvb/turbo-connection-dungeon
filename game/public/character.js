var Character = function () {
  let self = this;
  this.sprites = [];
  addSprite('pants');
  addSprite('shirt');
  addSprite('skin');
  addSprite('hair');
  addSprite('outline');

  this.pickupSprite = addSprite('projectile', 0, -5);

  function addSprite(name, xOffset, yOffset) {
    let sprite = game.add.sprite(0, 0, name);
    sprite.anchor.setTo(0.5, 1 - ((PLAYER_RADIUS + yOffset) / (sprite.height * 0.15)));
    spriteGroup.add(sprite);

    self.sprites.push(sprite);
    return sprite;
  }

  this.scale(0.15);

  console.log("Character made");
};

Character.prototype.move = function (x, y) {
  for (var i = 0; i < this.sprites.length; i++) {
    let sprite = this.sprites[i];
    sprite.x = x;
    sprite.y = y;
  }
}

Character.prototype.scale = function (s) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].scale.x = s;
    this.sprites[i].scale.y = s;
  }
}

Character.prototype.destroy = function () {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].destroy();
  }
}

Character.prototype.holding = function (newVal) {
  this.pickupSprite.visible = newVal ? 1 : 0;
}