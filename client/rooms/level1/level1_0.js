import socket from '../../socket';
import { createWallCollision } from '../../wallCollision';
import { createDoorCollision } from '../../doorCollision';
import { createDoorSensors } from '../../doorSensors';
import { enemyRenderer } from '../../enemyRenderer';
import { createCollisionGroups } from '../../collisionGroups';
import { Potion } from '../../Items';
import HealthBar from '../../health';
/* global D6Dungeon */

let player1;
let player2;
let enemies;
let game;
let gameRoom;
let doors;
let map;

export default {
  create() {
    game = D6Dungeon.game;
    player1 = game.state.player1;
    player2 = game.state.player2;
    const { gameId } = game.state;
    gameRoom = game.state.current;
    console.log(gameRoom);

    const [
      wallsCollisionGroup,
      doorsCollisionGroup,
      doorSensorsCollisionGroup,
      playersCollisionGroup,
      enemiesCollisionGroup,
      bulletsCollisionGroup,
      itemsCollisionGroup
    ] = createCollisionGroups(game);

    socket.emit('setRoom', { gameId, gameRoom });

    map = game.add.tilemap(gameRoom);
    map.addTilesetImage('level_1', 'level1Image');
    const floor = map.createLayer('Floor');
    const walls = map.createLayer('Walls');
    doors = map.createLayer('Doors');

    // const p1Health = HealthBar(game, { x: player1.x, y: player1.y });
    // console.log(p1Health);

    const wallBodies = createWallCollision(map, walls, game);
    wallBodies.forEach(wallBody => {
      wallBody.setCollisionGroup(wallsCollisionGroup);
      wallBody.collides([
        bulletsCollisionGroup,
        enemiesCollisionGroup,
        playersCollisionGroup
      ]);
    });

    const doorBodies = createDoorCollision(map, doors, game);
    doorBodies.forEach(doorBody => {
      doorBody.setCollisionGroup(doorsCollisionGroup);
      doorBody.collides([
        bulletsCollisionGroup,
        enemiesCollisionGroup,
        playersCollisionGroup
      ]);
    });

    // *** Door Sensors ***
    createDoorSensors(game, gameRoom).forEach(doorSensor => {
      doorSensor.body.setCollisionGroup(doorSensorsCollisionGroup);
      doorSensor.body.collides(playersCollisionGroup);
    });

    // *** Player - Sprite ***
    player1.addPlayerToRoom(
      game,
      'player1',
      playersCollisionGroup,
      [
        bulletsCollisionGroup,
        doorSensorsCollisionGroup,
        playersCollisionGroup,
        wallsCollisionGroup,
        itemsCollisionGroup,
        doorsCollisionGroup
      ],
      enemiesCollisionGroup
    );
    player2.addPlayerToRoom(
      game,
      'player2',
      playersCollisionGroup,
      [
        bulletsCollisionGroup,
        doorSensorsCollisionGroup,
        playersCollisionGroup,
        wallsCollisionGroup,
        itemsCollisionGroup,
        doorsCollisionGroup
      ],
      enemiesCollisionGroup
    );

    // *** Bullets ***
    player1.addBullets(
      game,
      'bullet',
      player1.damage,
      bulletsCollisionGroup,
      [playersCollisionGroup, wallsCollisionGroup, doorsCollisionGroup],
      enemiesCollisionGroup
    );
    player2.addBullets(
      game,
      'dummyBullet',
      player2.damage,
      bulletsCollisionGroup,
      [playersCollisionGroup, wallsCollisionGroup, doorsCollisionGroup],
      enemiesCollisionGroup
    );

    // *** Player 1 - Hearts ***
    player1.addHearts(game);

    enemies = enemyRenderer(
      game,
      enemiesCollisionGroup,
      [
        bulletsCollisionGroup,
        enemiesCollisionGroup,
        playersCollisionGroup,
        wallsCollisionGroup,
        doorsCollisionGroup
      ]
    );

    socket.emit('intervalTest', gameId);
  },

  update() {
    enemies.forEach(enemy => {
      if (!D6Dungeon.game.state.enemies[gameRoom][enemy.name]) {
        enemy.sprite.kill();
      }

      if (enemy.sprite._exists) {
        const { nextXTile, nextYTile } = D6Dungeon.game.state.enemies[gameRoom][
          enemy.name
        ];

        const nextX = nextXTile * 64;
        const nextY = nextYTile * 64;
        const currentX = enemy.sprite.position.x;
        const currentY = enemy.sprite.position.y;

        const distanceFactor = Math.sqrt(
          Math.pow(Math.abs(currentX - nextX), 2) +
            Math.pow(Math.abs(currentY - nextY), 2)
        );

        if (distanceFactor > enemy.randomBehavior && !enemy.ignorePathing) {
          if (nextX > currentX) {
            enemy.sprite.body.velocity.x = enemy.speed;
            enemy.sprite.scale.x = enemy.scale;
          } else if (nextX < currentX) {
            enemy.sprite.body.velocity.x = -enemy.speed;
            enemy.sprite.scale.x = -enemy.scale;
          }

          if (nextY > currentY) {
            enemy.sprite.body.velocity.y = enemy.speed;
          } else if (nextY < currentY) {
            enemy.sprite.body.velocity.y = -enemy.speed;
          }
        }

        if (
          enemy.sprite.animations._anims.run &&
          !enemy.sprite.animations._anims.attack.isPlaying
        ) {
          if (!enemy.sprite.body.velocity.x && !enemy.sprite.body.velocity.y) {
            enemy.sprite.animations.play('idle');
          } else {
            enemy.sprite.animations.play('run');
          }
        }
      }
    });

    player1.addMovement(game);
    player1.addShooting(game);

    player2.sprite.body.setZeroVelocity();
    player2.sprite.body.mass = 2000;

    if (!Object.keys(game.state.enemies[gameRoom]).length) {
      game.physics.p2.clearTilemapLayerBodies(map, doors);
      doors.destroy();
    }

    if (
      player2.health !== 0 &&
      player2.socketId &&
      !player2.sprite.visible
    ) {
      player2.sprite.visible = true;
      player2.sprite.body.data.shapes[0].sensor = false;
    } else if (!player2.socketId && player2.sprite.visible) {
      player2.sprite.visible = false;
      player2.sprite.body.data.shapes[0].sensor = true;
    }
  }
};
