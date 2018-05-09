class Weasel {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;

    this.minSpeed = 60;
    this.speedVariation = 60;
    this.health = 2;
    this.damage = 1;

    this.createWeaselSprite();
  }

  createWeaselSprite() {
    this.sprite = this.game.add.sprite(this.x, this.y, 'weasel');
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(4);
    this.sprite.setHealth(this.health);

    this.game.physics.p2.enable(this.sprite, true);
    this.sprite.body.fixedRotation = true;
    this.sprite.body.setRectangle(
      this.sprite.width - 3,
      this.sprite.height,
      0,
      0
    );
  }
}

export { Weasel };
