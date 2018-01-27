const charDirections = {
  0: 'up',
  1: 'left',
  2: 'down',
  3: 'right'
};

const CHAR_SCALE = 0.3;
const PROJECTILE_SCALE = 0.15;

var Character = function () {

  let self = this;
  this.sprites = [];
  //addSprite('pants');
  //addSprite('shirt');
  //addSprite('skin');
  //addSprite('hair');
  //addSprite('outline');

  this.charSprite = addSprite('character');
  this.charSprite.animations.add('down-idle', [0]);
  this.charSprite.animations.add('side-idle', [15]);
  this.charSprite.animations.add('up-idle', [62]);
  this.charSprite.animations.add('down-moving', _.range(16, 46));
  this.charSprite.animations.add('side-moving', _.range(1, 15));
  this.charSprite.animations.add('up-moving', _.range(46, 62));
  this.charSprite.animations.add('dead', [63]);

  this.pickupSprite = addSprite('projectile', 0, -5);

  function addSprite(name, xOffset, yOffset) {
    let sprite = game.add.sprite(0, 0, name);
    sprite.anchor.setTo(0.5, 1 - ((PLAYER_RADIUS + yOffset) / (sprite.height * 0.15)));
    spriteGroup.add(sprite);

    self.sprites.push(sprite);
    return sprite;
  }

  this.x = this.y = 0;

  this.scale(CHAR_SCALE);
  this.pickupSprite.scale.x = PROJECTILE_SCALE;
  this.pickupSprite.scale.y = PROJECTILE_SCALE;

  console.log("Character made");
};

Character.prototype.move = function (x, y) {
  for (var i = 0; i < this.sprites.length; i++) {
    let sprite = this.sprites[i];
    sprite.x = x;
    sprite.y = y;
  }

  this.lastX = x;
  this.lastY = y;
}


Character.prototype.moving = function (moving, direction) {
  if (direction !== undefined) {
    this.direction = direction;
  }

  if (this.isdead) {
    this.charSprite.animations.play('dead', 1, true);
    return;
  }

  var animName = moving ? 'moving' : 'idle';
  var dir = charDirections[this.direction] || 'down';

  var fps = 20;

  if (dir === 'left') {
    dir = 'side';
  }

  if (dir === 'right') {
    dir = 'side';
    this.charSprite.scale.x = -CHAR_SCALE;
  } else {
    this.charSprite.scale.x = CHAR_SCALE;
  }

  if (dir === 'down') {
    fps = 60;
  }
  if (dir === 'up') {
    fps = 30;
  }

  this.charSprite.animations.play(dir + '-' + animName, fps, true);
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

Character.prototype.dead = function (isdead) {
  this.isdead = isdead;
}