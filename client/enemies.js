class Weasel {
  constructor(game, name, x, y, health) {
    this.game = game;
    this.name = name;
    this.x = x;
    this.y = y;
    this.health = health;
    this.moveCD = 10;
    this.minSpeed = 60;
    this.speedVariation = 60;
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


class Golem {
  constructor(game, name, x, y, health) {
    this.game = game;
    this.name = name;
    this.x = x;
    this.y = y;
    this.health = health;
    this.moveCd = 500;
    this.minSpeed = 200;
    this.speedVariation = 20;
    this.damage = 1;

    this.createGolemSprite();
  }

  createGolemSprite() {
    this.sprite = this.game.add.sprite(this.x, this.y, 'golem');
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(7);
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
export { Weasel, Golem };
