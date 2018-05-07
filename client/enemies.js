/* global Phaser */

class Weasel {
  constructor(game, x, y) {
    this.game = game;
    this.weasel = game.add.sprite(x, y, 'weasel');
    this.weasel.anchor.set(0.5);
    this.weasel.scale.set(4);

    // *** Weasel - Physics ***
    // 2nd arg is debug mode
    game.physics.p2.enable(this.weasel, true);
    this.weasel.body.fixedRotation = true;
    this.weasel.body.setRectangle(this.weasel.width - 3, this.weasel.height, 0, 0);
  }
}

export { Weasel };
