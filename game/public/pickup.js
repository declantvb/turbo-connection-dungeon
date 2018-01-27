var Pickup = function () {
  let self = this;
  this.sprites = [];
  addSprite('projectile');

  function addSprite(name, xOffset, yOffset) {
    let sprite = game.add.sprite(0, 0, name);
    sprite.anchor.setTo(0.5, 0.5);
    spriteGroup.add(sprite);

    self.sprites.push(sprite);
  }

  this.scale(0.15);

  console.log("Pickup made");
};

Pickup.prototype.move = function (x, y) {
  for (var i = 0; i < this.sprites.length; i++) {
    let sprite = this.sprites[i];
    sprite.x = x;
    sprite.y = y;

    sprite.rotation = ((x + y) / 10)
  }
}

Pickup.prototype.scale = function (s) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].scale.x = s;
    this.sprites[i].scale.y = s;
  }
}

Pickup.prototype.destroy = function () {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].destroy();
  }
}