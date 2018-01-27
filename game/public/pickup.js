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

  this.hover = 0;
  this.fade = 0;

  console.log("Pickup made");
};

Pickup.prototype.move = function (x, y) {
  for (var i = 0; i < this.sprites.length; i++) {
    let sprite = this.sprites[i];
    sprite.x = x;
    sprite.y = y;

    sprite.rotation = ((x + y) / 10)
  }

  this.x = x;
  this.y = y;
}

Pickup.prototype.spawnerIdle = function(x, y) {
  this.hover += Math.random() * 0.02 + 0.01;

  if (this.fade < 1) {
    this.fade += 0.025;
  } else {
    this.fade = 1;
  }

  for (var i = 0; i < this.sprites.length; i++) {
    let sprite = this.sprites[i];
    sprite.x = x + Math.cos(this.hover * 5.4) * 2;
    sprite.y = y + Math.sin(this.hover * 3) * 5;
    sprite.alpha = this.fade;
    //sprite.rotation = ((sprite.x + sprite.y));
  }
}

Pickup.prototype.energy = function (e) {
  for (var i = 0; i < this.sprites.length; i++) {
    let sprite = this.sprites[i];
    let val = Math.log10((e)*9+1) * 100 + 155;
    console.log(val);
    sprite.tint = (val << 16) | (val << 8) | (val);
    sprite.alpha = (val/255);
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