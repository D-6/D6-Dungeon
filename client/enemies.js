import socket from './socket';

/* global Phaser */

class Weasel {
  constructor(game, name, x, y, health, damage) {
    this.game = game;
    this.name = name;
    this.x = x;
    this.y = y;
    this.health = health;
    this.minSpeed = 60;
    this.speedVariation = 60;
    this.damage = damage;
    this.scale = 4;
    this.randomBehavior = 0;

    this.createWeaselSprite();
  }

  createWeaselSprite() {
    this.sprite = this.game.add.sprite(this.x, this.y, 'weasel');
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(this.scale);
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

class SpikeHead {
  constructor(game, name, x, y, health, damage) {
    this.game = game;
    this.name = name;
    this.x = x;
    this.y = y;
    this.health = health;
    this.minSpeed = 100;
    this.speedVariation = 50;
    this.damage = damage;
    this.scale = 1;
    this.randomBehavior = 0;
    this.animationSpeed = 80;

    this.createSpikeHeadSprite();
  }

  createSpikeHeadSprite() {
    this.sprite = this.game.add.sprite(this.x, this.y, 'spike-head');

    this.sprite.animations.add(
      'run',
      Phaser.Animation.generateFrameNames('a_', 0, 42, '.png', 3),
      this.animationSpeed,
      true,
      false
    );

    this.sprite.animations.play('run');

    this.sprite.anchor.set(0.5);
    this.sprite.scale.setTo(this.scale);

    this.sprite.setHealth(this.health);
    this.sprite.damageAmount = this.damage;

    this.game.physics.p2.enable(this.sprite, false);
    this.sprite.body.fixedRotation = true;
    this.sprite.body.setRectangle(
      this.sprite.width - 25,
      this.sprite.height - 25,
      0,
      0
    );
  }
}

class Cruncher {
  constructor(game, name, x, y, health, damage) {
    this.game = game;
    this.name = name;
    this.x = x;
    this.y = y;
    this.health = health;
    this.minSpeed = 50;
    this.speedVariation = 50;
    this.damage = damage;
    this.scale = 1;
    this.randomBehavior = 0;
    this.animationSpeed = 60;

    this.createSpikeHeadSprite();
  }

  createSpikeHeadSprite() {
    this.sprite = this.game.add.sprite(this.x, this.y, 'spike-head');

    this.sprite.animations.add(
      'run',
      Phaser.Animation.generateFrameNames('', 1, 14, '.png', 1),
      this.animationSpeed,
      true,
      false
    );

    this.sprite.animations.play('run');

    this.sprite.anchor.set(0.5);
    this.sprite.scale.setTo(this.scale);

    this.sprite.setHealth(this.health);
    this.sprite.damageAmount = this.damage;

    this.game.physics.p2.enable(this.sprite, false);
    this.sprite.body.fixedRotation = true;
    this.sprite.body.setRectangle(
      this.sprite.width - 25,
      this.sprite.height - 25,
      0,
      0
    );
  }
}

class Golem {
  constructor(game, name, x, y, health, damage) {
    this.game = game;
    this.name = name;
    this.x = x;
    this.y = y;
    this.health = health;
    this.minSpeed = 60;
    this.speedVariation = 60;
    this.damage = damage;

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
  constructor(game, name, x, y, health, damage, ignorePathing) {
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
          this.sprite.scale.x = -this.scale;
        } else {
          this.sprite.scale.x = this.scale;
        }
      } else {
        clearInterval(beeFlight);
      }
    }, interval);
  }
}

class ShadowBoyBoss {
  constructor(game, name, x, y, health, damage, ignorePathing) {
    this.game = game;
    this.name = name;
    this.x = x;
    this.y = y;
    this.health = health;
    this.damage = damage;
    this.minSpeed = 240;
    this.speedVariation = 0;
    this.animationSpeed = 14;
    this.interval = 5000;
    this.intervalVariation = 0;
    this.scale = 1;
    this.ignorePathing = ignorePathing;

    // Makes the enemy run around more instead of going straight for the player
    // More than 140 makes the enemy not run for the player sometimes
    this.randomBehavior = 60;

    this.createShadowBoyBoss();
  }

  createShadowBoyBoss() {
    this.sprite = this.game.add.sprite(
      this.x,
      this.y,
      'shadow-boy-boss',
      'Idle/frame-1.png'
    );

    // *** ShadowBoyBoss - Health Text ***
    const style = { font: '15px Arial', fill: '#ffffff' };
    const healthText = this.game.add.text(0, -65, `HP: ${this.health}`, style);
    this.game.physics.p2.enable(healthText);
    healthText.body.static = true;
    this.sprite.addChild(healthText);

    this.sprite.animations.add(
      'idle',
      Phaser.Animation.generateFrameNames('Idle/frame-', 1, 4, '.png', 1),
      this.animationSpeed,
      true,
      false
    );

    this.sprite.animations.add(
      'run',
      Phaser.Animation.generateFrameNames('Running/frame-', 1, 4, '.png', 1),
      this.animationSpeed,
      true,
      false
    );

    this.sprite.animations.add(
      'attack',
      Phaser.Animation.generateFrameNames('Shooting/frame-', 1, 3, '.png', 1),
      this.animationSpeed,
      false,
      false
    );

    // Explosion child
    const explosion = this.game.add.sprite(
      0,
      0,
      'shadow-boy-boss',
      'Explode/a1.png'
    );
    this.game.physics.p2.enable(explosion);
    explosion.body.static = true;
    explosion.visible = false;
    this.sprite.addChild(explosion);

    explosion.animations.add(
      'explode',
      Phaser.Animation.generateFrameNames('Explode/a', 1, 5, '.png', 1),
      45,
      false,
      false
    );

    explosion.animations._anims.explode.onComplete.add(() => {
      explosion.visible = false;
    });

    this.sprite.animations.play('idle');

    this.sprite.scale.setTo(this.scale, this.scale);
    this.sprite.setHealth(this.health);
    this.sprite.damageAmount = this.damage;

    this.game.physics.p2.enable(this.sprite, false);
    this.sprite.body.fixedRotation = true;
    this.sprite.body.setRectangle(
      this.sprite.width - 10,
      this.sprite.height - 30,
      0,
      15
    );

    const interval =
      this.interval + Math.floor(Math.random() * this.intervalVariation);

    const fireballTimer = setInterval(() => {
      if (this.sprite._exists) {
        this.ignorePathing = !this.ignorePathing;
        const { gameId } = this.game.state;

        socket.emit('ignoreEnemyPathing', {
          gameId,
          name: this.name,
          ignorePathing: this.ignorePathing
        });

        if (this.ignorePathing) {
          const positions = [
            { x: 170, y: 170, scale: 1 },
            { x: 1046, y: 264, scale: -1 },
            { x: 170, y: 358, scale: 1 },
            { x: 1046, y: 452, scale: -1 },
            { x: 170, y: 546, scale: 1 },
            { x: 1046, y: 640, scale: -1 }
          ];

          let index = 0;

          const positionTimer = setInterval(() => {
            explosion.visible = true;
            explosion.animations.play('explode');
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            this.sprite.body.x = positions[index].x;
            this.sprite.body.y = positions[index].y;
            this.sprite.scale.x = positions[index].scale;
            this.sprite.children[0].scale.x = positions[index].scale;
            this.sprite.animations.play('attack');
            this.makeShot(positions[index]);
            index++;
          }, interval / 6 - 30);

          const timer = setTimeout(() => {
            clearInterval(positionTimer);
            clearTimeout(timer);
            index = 0;
          }, interval);
        }
      } else {
        clearInterval(fireballTimer);
      }
    }, interval);
  }

  makeShot(position) {
    const shotVelocity = 1000;
    const shot = this.game.add.sprite(
      position.x + 50 * position.scale,
      position.y + 15,
      'shadow-boy-boss',
      'Shooting effect/Big-Bullet-A.png'
    );

    shot.damageAmount = 1;

    this.game.physics.p2.enable(shot);
    shot.body.fixedRotation = true;

    const { collisionGroups } = this.game.physics.p2;
    const enemiesCollisionGroup = collisionGroups.find(
      group => group.name === 'enemies'
    );
    const collidesWithEnemiesArr = collisionGroups.filter(group => {
      return (
        group.name === 'doors' ||
        group.name === 'walls' ||
        group.name === 'players'
      );
    });

    shot.body.setCollisionGroup(enemiesCollisionGroup);
    shot.body.collides(collidesWithEnemiesArr, () => {
      shot.kill();
    });
    shot.scale.x = position.scale;
    shot.body.velocity.x = position.scale * shotVelocity;
  }
}

export { Weasel, Golem, RedHornedBee, ShadowBoyBoss, SpikeHead };
