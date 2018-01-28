var Bullet = function () {
  let self = this;
  this.sprites = [];
  this.normal = addSprite('fireball');
  this.boom = addSprite('explosion');
  this.boom.animations.add('boom', _.range(9));
  this.boom.visible = false;

  function addSprite(name, xOffset, yOffset) {
    let sprite = game.add.sprite(0, 0, name);
    sprite.anchor.setTo(0.5, 0.5);
    spriteGroup.add(sprite);

    self.sprites.push(sprite);
    return sprite;
  }

  this.scale(0.15);

  console.log("Bullet made");
};

Bullet.prototype.move = function (x, y) {
  for (var i = 0; i < this.sprites.length; i++) {
    let sprite = this.sprites[i];
    sprite.x = x;
    sprite.y = y;
  }
}

Bullet.prototype.scale = function (s) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].scale.x = s;
    this.sprites[i].scale.y = s;
  }
}

Bullet.prototype.destroy = function () {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].destroy();
  }
}

Bullet.prototype.explode = function () {
  this.normal.visible = false;
  this.boom.visible = true;
  this.boom.animations.play('boom', 1, true);
}