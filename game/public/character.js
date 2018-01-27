var Character = function () {
  let self = this;
  this.sprites = [];
  addSprite('pants');
  addSprite('shirt');
  addSprite('skin');
  addSprite('hair');
  addSprite('outline');

  function addSprite(name, xOffset, yOffset) {
    let sprite = game.add.sprite(0, 0, name);
    sprite.anchor.setTo(0.5, 1 - (PLAYER_RADIUS / (sprite.height * 0.15)));
    spriteGroup.add(sprite);

    self.sprites.push({
      sprite: sprite,
      xOffset: xOffset || 0,
      yOffset: yOffset || 0
    });
  }

  this.scale(0.15);

  console.log("Character made");
};

Character.prototype.move = function (x, y) {
  for (var i = 0; i < this.sprites.length; i++) {
    let sprite = this.sprites[i];
    sprite.sprite.x = x + sprite.xOffset;
    sprite.sprite.y = y + sprite.yOffset;
  }
}

Character.prototype.scale = function (s) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].sprite.scale.x = s;
    this.sprites[i].sprite.scale.y = s;
  }
}