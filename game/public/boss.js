// Ohhh shiiititttt


var Boss = function (x, y, width, height) {
    this.x = x, this.y = y;
    this.width = width, this.height = height;

    this.sprites = [];
    this.sprites.push(game.add.sprite(0, 0, 'body'));
    this.sprites.push(game.add.sprite(0, 0, 'head'));
    this.sprites.push(game.add.sprite(0, 0, 'leg'));

    this.scale(0.15);

    console.log('Boss made');
}

Boss.prototype.move = function (x, y) {
    for (var i = 0; i < this.sprites.length; i++) {
        this.sprites[i].x = x - this.width / 2;
        this.sprites[i].y = y - this.height + PLAYER_RADIUS;
    }

    this.x = x;
    this.y = y;
}
  
Boss.prototype.scale = function (s) {
    for (var i = 0; i < this.sprites.length; i++) {
        this.sprites[i].scale.x = s;
        this.sprites[i].scale.y = s;
    }

    this.width = this.width * s;
    this.height = this.height * s;
}