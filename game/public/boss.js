var Boss = function () {
    let self = this;

    this.sprites = [];
    addSprite('body');
    addSprite('head');
    addSprite('leg', -50, -10);
    addSprite('leg', -50, 0);
    addSprite('leg', -50, 10);
    addSprite('leg', 50, -10);
    addSprite('leg', 50, 0);
    addSprite('leg', 50, 10);
    
    function addSprite(name, xOffset, yOffset){
        let sprite = game.add.sprite(0, 0, name);
        sprite.anchor.setTo(0.5, 1);
        spriteGroup.add(sprite);

        self.sprites.push({
            sprite: sprite,
            xOffset: xOffset || 0,
            yOffset: yOffset || 0
        });
    }

    this.scale(0.15);

    console.log('Boss made');
}



Boss.prototype.move = function (x, y) {
    for (var i = 0; i < this.sprites.length; i++) {
        let sprite = this.sprites[i];
        sprite.x = x + sprite.xOffset;
        sprite.y = y + sprite.yOffset;
    }

    this.x = x;
    this.y = y;
}
  
Boss.prototype.scale = function (s) {
    for (var i = 0; i < this.sprites.length; i++) {
        this.sprites[i].sprite.scale.x = s;
        this.sprites[i].sprite.scale.y = s;
    }

    this.width = this.width * s;
    this.height = this.height * s;
}