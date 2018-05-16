// import D6DungeonGame from './game';
import socket from './socket';

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
    this.minSpeed = 200;
    this.speedVariation = 0;
    this.animationSpeed = 14;
    this.interval = 5000;
    this.intervalVariation = 0;
    this.scale = 1;
    this.ignorePathing = ignorePathing;

    // Makes the enemy run around more instead of going straight for the player
    // More than 140 makes the enemy not run for the player sometimes
    this.randomBehavior = 100;

    this.createShadowBoyBoss();
  }

  createShadowBoyBoss() {
    const music = D6Dungeon.game.add.audio('boss-battle');
    music.loopFull(0.2);

    const resumeAudio = () => {
      if (D6Dungeon.game.sound.context.state === 'suspended') {
        D6Dungeon.game.sound.context.resume();
        music.play();
      }
    };

    // Resumes the Web Audio API audio context so sounds can be played
    if (D6Dungeon.game.sound.usingWebAudio) {
      const { player1 } = D6Dungeon.game.state;
      player1.keybinds.up.onDown.addOnce(resumeAudio);
      player1.keybinds.down.onDown.addOnce(resumeAudio);
      player1.keybinds.left.onDown.addOnce(resumeAudio);
      player1.keybinds.right.onDown.addOnce(resumeAudio);
    }

    this.sprite = this.game.add.sprite(
      this.x,
      this.y,
      'shadow-boy-boss',
      'Idle/frame-1.png'
    );

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
    D6Dungeon.game.physics.p2.enable(explosion);
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
        const { gameId } = D6Dungeon.game.state;

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
        music.fadeOut(2000);
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

    D6Dungeon.game.physics.p2.enable(shot);
    shot.body.fixedRotation = true;

    const { collisionGroups } = D6Dungeon.game.physics.p2;
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

export { Weasel, Golem, RedHornedBee, ShadowBoyBoss };
