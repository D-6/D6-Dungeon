/* global Phaser */

class Weasel {
  constructor(game, x, y) {
    this.game = game;
    this.weasel = game.add.sprite(x, y, 'weasel');
    this.weasel.anchor.set(0.5);
    this.weasel.scale.set(4);

    // *** Weasel - Physics ***
    game.physics.enable(this.weasel, Phaser.Physics.P2JS);
    this.weasel.body.fixedRotation = true;
    this.weasel.body.setRectangle(this.weasel.width - 3, this.weasel.height, 0, 0);
    this.weasel.body.debug = true; // Use to see collision model
  }
}

export { Weasel };
