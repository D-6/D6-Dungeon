/* global Phaser */

class Weasel {
  constructor(game, x, y) {
    this.game = game;
    this.sprite = game.add.sprite(x, y, 'weasel');
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(4);

    // *** Weasel - Physics ***
    // 2nd arg is debug mode
    game.physics.p2.enable(this.sprite, true);
    this.sprite.body.fixedRotation = true;
    this.sprite.body.setRectangle(this.sprite.width - 3, this.sprite.height, 0, 0);
  }
}

export { Weasel };
