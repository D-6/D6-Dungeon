import socket from './socket';

/* global Phaser */

export default class Player {
  constructor({
    health,
    speed,
    damage,
    fireRate,
    bulletSpeed,
    items,
    socketId,
    x,
    y
  }) {
    this.health = health;
    this.speed = speed;
    this.damage = damage;
    this.fireRate = fireRate;
    this.bulletSpeed = bulletSpeed;
    this.items = items;
    this.socketId = socketId;
    this.x = x;
    this.y = y;
    this.nextFire = 0;
    this.nextHit = 0;
    this.injured = false;
  }

  addPlayerToRoom(
    game,
    player,
    playersCollisionGroup,
    collidesWithPlayerArr,
    enemiesCollisionGroup
  ) {
    const { gameId } = game.state;
    const animationSpeed = 150;
    const attackAnimationSpeed = 100;

    this.sprite = game.add.sprite(
      this.x,
      this.y,
      player,
      'idle/unarmed/idleu_000.png'
    );

    this.sprite.animations.add(
      'idle',
      Phaser.Animation.generateFrameNames(
        'idle/unarmed/idleu_',
        0,
        61,
        '.png',
        3
      ),
      animationSpeed,
      true,
      false
    );

    this.sprite.animations.add(
      'run',
      Phaser.Animation.generateFrameNames(
        'run/unarmed/runu_',
        0,
        49,
        '.png',
        3
      ),
      animationSpeed,
      true,
      false
    );

    this.sprite.animations.add(
      'injured',
      Phaser.Animation.generateFrameNames(
        'injured/unarmed/hitu_',
        0,
        24,
        '.png',
        3
      ),
      animationSpeed,
      false,
      false
    );

    this.sprite.animations.add(
      'attack',
      Phaser.Animation.generateFrameNames(
        'attack/unarmed/attu_',
        0,
        24,
        '.png',
        3
      ),
      attackAnimationSpeed,
      true,
      false
    );

    this.sprite.animations.play('idle');

    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.setTo(1.2, 1.2);
    this.sprite.setHealth(this.health);

    // *** Player - Physics ***
    // 2nd arg is debug mode
    game.physics.p2.enable(this.sprite, false);
    this.sprite.body.fixedRotation = true;
    this.sprite.body.setRectangle(
      this.sprite.width - 10,
      this.sprite.height - 30,
      0,
      15
    );

    this.sprite.body.setCollisionGroup(playersCollisionGroup);
    this.sprite.body.collides(collidesWithPlayerArr);
    this.sprite.body.collides(
      enemiesCollisionGroup,
      (playerBody, enemyBody) => {
        if (player === 'player1' && game.time.now > this.nextHit) {
          this.nextHit = game.time.now + 500;
          playerBody.sprite.damage(enemyBody.sprite.damageAmount);
          this.sprite.animations.play('injured');

          socket.emit('playerHit', {
            health: playerBody.sprite.health,
            gameId,
            socketId: this.socketId,
            animation: 'injured'
          });
        }
      }
    );

    if (player === 'player1') {
      this.addKeybinds(game);
    }
  }

  addKeybinds(game) {
    this.keybinds = {};
    this.keybinds.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.keybinds.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.keybinds.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.keybinds.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.keybinds.arrows = game.input.keyboard.createCursorKeys();
  }

  addMovement(game) {
    const { gameId } = game.state;
    this.sprite.body.setZeroVelocity();
    this.sprite.body.mass = 1;

    if (this.keybinds.up.isDown) {
      this.sprite.body.moveUp(this.speed);
      socket.emit('playerMove', {
        x: this.sprite.body.x,
        y: this.sprite.body.y,
        socketId: this.socketId,
        gameId
      });
    } else if (this.keybinds.down.isDown) {
      socket.emit('playerMove', {
        x: this.sprite.body.x,
        y: this.sprite.body.y,
        socketId: this.socketId,
        gameId
      });
      this.sprite.body.moveDown(this.speed);
    }

    if (this.keybinds.left.isDown) {
      this.sprite.body.moveLeft(this.speed);
      socket.emit('playerMove', {
        x: this.sprite.body.x,
        y: this.sprite.body.y,
        socketId: this.socketId,
        gameId
      });
      // Flips player to face left
      if (this.sprite.scale.x > 0 && !this.keybinds.arrows.right.isDown) {
        this.sprite.scale.x *= -1;
      }
    } else if (this.keybinds.right.isDown) {
      this.sprite.body.moveRight(this.speed);
      socket.emit('playerMove', {
        x: this.sprite.body.x,
        y: this.sprite.body.y,
        socketId: this.socketId,
        gameId
      });
      // Flips player to face right
      if (this.sprite.scale.x < 0 && !this.keybinds.arrows.left.isDown) {
        this.sprite.scale.x *= -1;
      }
    }

    if (
      // Not shooting
      this.keybinds.arrows.left.isUp &&
      this.keybinds.arrows.right.isUp &&
      this.keybinds.arrows.up.isUp &&
      this.keybinds.arrows.down.isUp &&
      !this.sprite.animations._anims.injured.isPlaying
    ) {
      if (
        // Not moving
        this.sprite.body.velocity.x === 0 &&
        this.sprite.body.velocity.y === 0
      ) {
        this.sprite.body.mass = 2000;
        this.sprite.animations.play('idle');
        socket.emit('player2Animation', { gameId, animation: 'idle' });
      } else {
        // Running
        this.sprite.animations.play('run');
        socket.emit('player2Animation', { gameId, animation: 'run' });
      }
    }
  }

  addBullets(
    game,
    spriteKey,
    damage,
    bulletsCollisionGroup,
    collidesWithBulletsArr,
    enemiesCollisionGroup
  ) {
    this.bullets = game.add.physicsGroup(Phaser.Physics.P2JS);
    this.bullets.createMultiple(10, spriteKey, 0, false, bullet => {
      bullet.anchor.setTo(0, 0);
      bullet.damageAmount = damage;
      bullet.body.setCollisionGroup(bulletsCollisionGroup);
      bullet.body.collides(collidesWithBulletsArr, bulletBody => {
        bulletBody.sprite.kill();
      });
      bullet.body.collides(enemiesCollisionGroup);
    });
  }

  addShooting(game) {
    if (
      this.keybinds.arrows.up.isDown ||
      this.keybinds.arrows.down.isDown ||
      this.keybinds.arrows.left.isDown ||
      this.keybinds.arrows.right.isDown
    ) {
      this.fire(game);
    }
  }

  fire(game, fireDirection) {
    const { gameId } = game.state;
    if (game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      this.nextFire = game.time.now + this.fireRate;

      this.sprite.animations.play('attack');

      let bullet = this.bullets.getFirstExists(false);

      if (
        (this.keybinds && this.keybinds.arrows.up.isDown) ||
        fireDirection === 'up'
      ) {
        bullet.reset(this.sprite.x, this.sprite.y - 50);
        bullet.body.moveUp(this.bulletSpeed);

        if (!fireDirection) {
          socket.emit('playerFire', { fireDirection: 'up', gameId });
        }
      } else if (
        (this.keybinds && this.keybinds.arrows.down.isDown) ||
        fireDirection === 'down'
      ) {
        bullet.reset(this.sprite.x, this.sprite.y + 55);
        bullet.body.moveDown(this.bulletSpeed);

        if (!fireDirection) {
          socket.emit('playerFire', { fireDirection: 'down', gameId });
        }
      } else if (
        (this.keybinds && this.keybinds.arrows.left.isDown) ||
        fireDirection === 'left'
      ) {
        // Flips player to face left
        if (this.sprite.scale.x > 0) {
          this.sprite.scale.x *= -1;
        }

        bullet.reset(this.sprite.x - 40, this.sprite.y + 5);
        bullet.body.moveLeft(this.bulletSpeed);

        if (!fireDirection) {
          socket.emit('playerFire', { fireDirection: 'left', gameId });
        }
      } else if (
        (this.keybinds && this.keybinds.arrows.right.isDown) ||
        fireDirection === 'right'
      ) {
        // Flips player to face right
        if (this.sprite.scale.x < 0) {
          this.sprite.scale.x *= -1;
        }

        bullet.reset(this.sprite.x + 30, this.sprite.y + 5);
        bullet.body.moveRight(this.bulletSpeed);

        if (!fireDirection) {
          socket.emit('playerFire', { fireDirection: 'right', gameId });
        }
      }
    }
  }
}
