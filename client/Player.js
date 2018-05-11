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
  }

  addPlayerToRoom(
    game,
    playersCollisionGroup,
    collidesWithPlayerArr,
    enemiesCollisionGroup
  ) {
    this.sprite = game.add.sprite(this.x, this.y, 'player');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.set(4);

    // *** Player - Physics ***
    // 2nd arg is debug mode
    game.physics.p2.enable(this.sprite, true);
    this.sprite.body.fixedRotation = true;
    this.sprite.body.setRectangle(
      this.sprite.width - 10,
      this.sprite.height - 10,
      0,
      6
    );
    //remove this after testing 2player
    // this.sprite.body.kinematic = true;

    this.sprite.body.setCollisionGroup(playersCollisionGroup);
    this.sprite.body.collides(collidesWithPlayerArr);
    this.sprite.body.collides(enemiesCollisionGroup, playerHitByEnemy);

    // *** Player - Animation ***
    this.sprite.animations.add('walk', null, 10, true);

    this.addKeybinds(game);
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
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

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
      if (this.sprite.scale.x < 0) {
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
      if (this.sprite.scale.x > 0) {
        this.sprite.scale.x *= -1;
      }
    }

    if (
      this.sprite.body.velocity.x === 0 &&
      this.sprite.body.velocity.y === 0
    ) {
      this.sprite.animations.stop('walk', true);
    } else {
      this.sprite.animations.play('walk');
    }
  }

  addBullets(
    game,
    bulletsCollisionGroup,
    collidesWithBulletsArr,
    enemiesCollisionGroup
  ) {
    this.bullets = game.add.physicsGroup(Phaser.Physics.P2JS);
    this.bullets.createMultiple(10, 'bullet', 0, false, bullet => {
      bullet.anchor.set(0.5);
      bullet.damage = 1;
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

      let bullet = this.bullets.getFirstExists(false);

      if (
        (this.keybinds.arrows.up.isDown && !fireDirection) ||
        fireDirection === 'up'
      ) {
        bullet.reset(this.sprite.x, this.sprite.y - 50);
        bullet.body.moveUp(this.bulletSpeed);

        if (!fireDirection) {
          socket.emit('playerFire', { fireDirection: 'up', gameId });
        }
      } else if (
        (this.keybinds.arrows.down.isDown && !fireDirection) ||
        fireDirection === 'down'
      ) {
        bullet.reset(this.sprite.x, this.sprite.y + 70);
        bullet.body.moveDown(this.bulletSpeed);

        if (!fireDirection) {
          socket.emit('playerFire', { fireDirection: 'down', gameId });
        }
      } else if (
        (this.keybinds.arrows.left.isDown && !fireDirection) ||
        fireDirection === 'left'
      ) {
        // Flips player to face left
        if (this.sprite.scale.x < 0) {
          this.sprite.scale.x *= -1;
        }

        bullet.reset(this.sprite.x - 60, this.sprite.y);
        bullet.body.moveLeft(this.bulletSpeed);

        if (!fireDirection) {
          socket.emit('playerFire', { fireDirection: 'left', gameId });
        }
      } else if (
        (this.keybinds.arrows.right.isDown && !fireDirection) ||
        fireDirection === 'right'
      ) {
        // Flips player to face right
        if (this.sprite.scale.x > 0) {
          this.sprite.scale.x *= -1;
        }

        bullet.reset(this.sprite.x + 60, this.sprite.y);
        bullet.body.moveRight(this.bulletSpeed);

        if (!fireDirection) {
          socket.emit('playerFire', { fireDirection: 'right', gameId });
        }
      }
    }
  }
}

const playerHitByEnemy = (playerBody, enemyBody) => {
  // console.log('playerHitByEnemy');
};
