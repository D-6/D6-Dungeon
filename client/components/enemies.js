class Weasel {
  constructor(game, x, y) {
    this.game = game;
    this.weasel = game.add.sprite(x, y, 'weasel');
    this.weasel.anchor.set(0.5);
    this.weasel.scale.set(4);
  }
}

export { Weasel };
