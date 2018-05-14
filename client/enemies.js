class Weasel {
  constructor(game, name, x, y, health) {
    this.game = game;
    this.name = name;
    this.x = x;
    this.y = y;
    this.health = health;
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
    this.sprite.damageAmount = this.damage;

    this.game.physics.p2.enable(this.sprite, false);
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
    this.minSpeed = 60;
    this.speedVariation = 60;
    this.damage = 1;

    this.createGolemSprite();
  }

  createGolemSprite() {
    this.sprite = this.game.add.sprite(this.x, this.y, 'golem');
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(7);
    this.sprite.setHealth(this.health);
    this.sprite.damageAmount = this.damage;

    this.game.physics.p2.enable(this.sprite, false);
    this.sprite.body.fixedRotation = true;
    this.sprite.body.setRectangle(
      this.sprite.width - 3,
      this.sprite.height,
      0,
      0
    );
  }
}

class RedHornedBee {
  constructor(game, name, x, y, health, damage) {
    this.game = game;
    this.name = name;
    this.x = x;
    this.y = y;
    this.health = health;
    this.damage = damage;
    this.minSpeed = 400;
    this.speedVariation = 0;
    this.animationSpeed = 160;
    this.interval = 500;
    this.intervalVariation = 1000;
    this.scale = 0.2;

    this.createRedHornedBee();
  }

  createRedHornedBee() {
    this.sprite = this.game.add.sprite(this.x, this.y, 'red-horned-bee');
    this.sprite.animations.add(
      'fly',
      Phaser.Animation.generateFrameNames('sprite', 1, 2, '.png', 1),
      this.animationSpeed,
      true,
      false
    );

    this.sprite.animations.play('fly');

    this.sprite.scale.setTo(this.scale, this.scale);
    this.sprite.setHealth(this.health);
    this.sprite.damageAmount = this.damage;
    console.log(this.damage);

    this.game.physics.p2.enable(this.sprite, false);
    this.sprite.body.fixedRotation = true;
    this.sprite.body.setRectangle(
      this.sprite.width - 6,
      this.sprite.height - 6,
      0,
      0
    );

    const interval =
      this.interval + Math.floor(Math.random() * this.intervalVariation);

    const beeFlight = setInterval(() => {
      const randomXVelocity = Math.floor(Math.random() * this.minSpeed);
      const randomXSign = Math.floor(Math.random() * 2);
      const randomYVelocity = Math.sqrt(
        this.minSpeed * this.minSpeed - randomXVelocity * randomXVelocity
      );
      const randomYSign = Math.floor(Math.random() * 2);

      if (this.sprite.body) {
        this.sprite.body.velocity.x = randomXSign
          ? randomXVelocity
          : -randomXVelocity;
        this.sprite.body.velocity.y = randomYSign
          ? randomYVelocity
          : -randomYVelocity;
        if (this.sprite.body.velocity.x > 0) {
          this.sprite.scale.x = this.scale;
        } else {
          this.sprite.scale.x = -this.scale;
        }
      } else {
        clearInterval(beeFlight);
      }
    }, interval);
  }
}
export { Weasel, Golem, RedHornedBee };
