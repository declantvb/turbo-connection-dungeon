var Boss = function () {
    let self = this;

    this.sprites = [];
    
    addSprite('body');
    addSprite('head');
    addSprite('leg', -100, -45);
    addSprite('leg', -100, -27.5);
    addSprite('leg', -100, -10);
    addSprite('leg', 100, -45);
    addSprite('leg', 100, -27.5);
    addSprite('leg', 100, -10);
   
    
    function addSprite(name, xOffset, yOffset){
        let sprite = game.add.sprite(0, 0, name);
        if(name === 'leg') {
            var idle = sprite.animations.add('idle', [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]);
            var moving = sprite.animations.add('moving', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
            sprite.animations.play('idle', 15, true);
        }       

        sprite.anchor.setTo(0.5, 1);
        spriteGroup.add(sprite);        

        self.sprites.push({
            sprite: sprite,
            xOffset: xOffset || 0,
            yOffset: yOffset || 0
        });
    }

    this.scale(0.15);

    for (var i = 0; i < this.sprites.length; i++) {
        if(this.sprites[i].xOffset < 0){
            this.sprites[i].sprite.scale.x *= -1;
        }
    }
    console.log('Boss made');
}



Boss.prototype.move = function (x, y) {
    for (var i = 0; i < this.sprites.length; i++) {
        let sprite = this.sprites[i];
        if(this.state != 'moving'){
            sprite.sprite.animations.play('idle', 15+ Math.random() * 10, true);
        }else{
            sprite.sprite.animations.play('moving', 15 + Math.random() * 10, true);
        }
        
        sprite.sprite.x = x + sprite.xOffset;
        sprite.sprite.y = y + sprite.yOffset;
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