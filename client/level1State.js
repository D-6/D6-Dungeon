import { Weasel } from './enemies';
import { createWallCollision } from './wallCollision';
import { createDoorSensors } from './doorSensors';

/* global D6Dungeon, Phaser */

let enemies;
let enemyPos = {
  pos0: [
    { x: 300, y: 300 },
    { x: 300, y: 608 },
    { x: 608, y: 300 },
    { x: 608, y: 608 }
  ],
  pos1: [
    { x: 200, y: 200 },
    { x: 200, y: 350 },
    { x: 200, y: 500 },
    { x: 200, y: 650 }
  ]
};

let player;
let keybinds = {};
const movementSpeed = 200; // should be player stat
let bullets;
let nextFire = 0;
let fireRate = 400; // should be player stat
let bulletSpeed = 400; // should be player stat

export default {
  create() {
    D6Dungeon.game.physics.startSystem(Phaser.Physics.P2JS);
    D6Dungeon.game.physics.p2.setImpactEvents(true);

    let wallsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    let doorSensorsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    let playersCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    let enemiesCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    let bulletsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();

    let map = D6Dungeon.game.add.tilemap('level1_3-3');
    map.addTilesetImage('level_1', 'level1Image');
    const floor = map.createLayer('Floor');
    const walls = map.createLayer('Walls');

    const wallBodies = createWallCollision(map, walls, D6Dungeon.game);
    wallBodies.forEach(wallBody => {
      wallBody.setCollisionGroup(wallsCollisionGroup);
      wallBody.collides([
        bulletsCollisionGroup,
        enemiesCollisionGroup,
        playersCollisionGroup
      ]);
    });

    createDoorSensors(D6Dungeon.game).forEach(doorSensor => {
      doorSensor.body.setCollisionGroup(doorSensorsCollisionGroup);
      doorSensor.body.collides(playersCollisionGroup);
    });

    // *** Player - Sprite ***
    player = D6Dungeon.game.add.sprite(608, 416, 'player');
    player.anchor.setTo(0.5, 0.5);
    player.scale.set(4);

    // *** Player - Physics ***
    // 2nd arg is debug mode
    D6Dungeon.game.physics.p2.enable(player, true);
    player.body.fixedRotation = true;
    player.body.setRectangle(player.width - 10, player.height - 10, 0, 6);
    player.body.setCollisionGroup(playersCollisionGroup);
    player.body.collides([
      bulletsCollisionGroup,
      doorSensorsCollisionGroup,
      playersCollisionGroup,
      wallsCollisionGroup
    ]);
    player.body.collides(enemiesCollisionGroup, playerHitByEnemy);

    // *** Player - Animation ***
    player.animations.add('walk', null, 10, true);

    // *** Bullets ***
    bullets = D6Dungeon.game.add.physicsGroup(Phaser.Physics.P2JS);
    bullets.createMultiple(10, 'bullets', 0, false, bullet => {
      bullet.anchor.set(0.5);
      bullet.damage = 1;
      bullet.body.setCollisionGroup(bulletsCollisionGroup);
      bullet.body.collides(
        [playersCollisionGroup, wallsCollisionGroup],
        bulletBody => {
          bulletBody.sprite.kill();
        }
      );
      bullet.body.collides(enemiesCollisionGroup, bulletHitEnemy);
    });

    // *** Enemies ***
    enemies = [];
    let ran = Math.floor(Math.random() * 2);
    enemyPos[`pos${ran}`].forEach(pos => {
      const weasel = new Weasel(D6Dungeon.game, pos.x, pos.y);
      weasel.sprite.body.setCollisionGroup(enemiesCollisionGroup);
      weasel.sprite.body.collides([
        bulletsCollisionGroup,
        enemiesCollisionGroup,
        playersCollisionGroup,
        wallsCollisionGroup
      ]);
      enemies.push(weasel);
    });

    // *** Player - Keybinds ***
    keybinds.up = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.W);
    keybinds.down = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.S);
    keybinds.left = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.A);
    keybinds.right = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.D);
    keybinds.arrows = D6Dungeon.game.input.keyboard.createCursorKeys();
  },

  update() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (keybinds.up.isDown) {
      player.body.moveUp(movementSpeed);
    } else if (keybinds.down.isDown) {
      player.body.moveDown(movementSpeed);
    }

    if (keybinds.left.isDown) {
      player.body.moveLeft(movementSpeed);

      // Flips player to face left
      if (player.scale.x < 0) {
        player.scale.x *= -1;
      }
    } else if (keybinds.right.isDown) {
      player.body.moveRight(movementSpeed);

      // Flips player to face right
      if (player.scale.x > 0) {
        player.scale.x *= -1;
      }
    }

    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
      player.animations.stop('walk', true);
    } else {
      player.animations.play('walk');
    }

    // Arrow keys used for firing
    if (
      keybinds.arrows.up.isDown ||
      keybinds.arrows.down.isDown ||
      keybinds.arrows.left.isDown ||
      keybinds.arrows.right.isDown
    ) {
      fire();
    }
  }
};

const fire = () => {
  if (D6Dungeon.game.time.now > nextFire && bullets.countDead() > 0) {
    nextFire = D6Dungeon.game.time.now + fireRate;

    let bullet = bullets.getFirstExists(false);

    if (keybinds.arrows.up.isDown) {
      bullet.reset(player.x, player.y - 50);
      bullet.body.moveUp(bulletSpeed);
    } else if (keybinds.arrows.down.isDown) {
      bullet.reset(player.x, player.y + 70);
      bullet.body.moveDown(bulletSpeed);
    } else if (keybinds.arrows.left.isDown) {
      // Flips player to face left
      if (player.scale.x < 0) {
        player.scale.x *= -1;
      }

      bullet.reset(player.x - 60, player.y);
      bullet.body.moveLeft(bulletSpeed);
    } else if (keybinds.arrows.right.isDown) {
      // Flips player to face right
      if (player.scale.x > 0) {
        player.scale.x *= -1;
      }

      bullet.reset(player.x + 60, player.y);
      bullet.body.moveRight(bulletSpeed);
    }
  }
};

const playerHitByEnemy = (playerBody, enemyBody) => {
  console.log('playerHitByEnemy');
};

const bulletHitEnemy = (bulletBody, enemyBody) => {
  console.log('bulletHitEnemy');
  bulletBody.sprite.kill();
};
