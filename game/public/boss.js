// Ohhh shiiititttt


var Boss = function () {
    this.x = 0, this.y = 0;
    this.width = 300, this.height = 600;

    this.sprites = [];
    this.sprites.push(game.add.sprite(0, 0, 'body'));
    this.sprites.push(game.add.sprite(0, 0, 'head'));
    this.sprites.push(game.add.sprite(0, 0, 'leg'));

    this.scale(0.15);

    console.log('Boss made');
}