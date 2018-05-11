import socket from '../../socket';
import { createWallCollision } from '../../wallCollision';
import { createDoorCollision } from '../../doorCollision';
import { createDoorSensors } from '../../doorSensors';
import { enemyRenderer } from '../../enemyRenderer';
import { createCollisionGroups } from '../../collisionGroups';
import { Potion } from '../../Items';
//importing enemies to use for enemy renderer

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

    socket.emit('setRoom', { gameId, gameRoom });

    const [
      wallsCollisionGroup,
      doorsCollisionGroup,
      doorSensorsCollisionGroup,
      playersCollisionGroup,
      enemiesCollisionGroup,
      bulletsCollisionGroup,
      itemsCollisionGroup
    ] = createCollisionGroups(game);

    map = game.add.tilemap(gameRoom);
    map.addTilesetImage('level_1', 'level1Image');
    const floor = map.createLayer('Floor');
    const walls = map.createLayer('Walls');
    doors = map.createLayer('Doors');

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

    // *** Potions ***
    const healthPotion = new Potion('health', 400, 400);
    healthPotion.createPotionSprite(game, itemsCollisionGroup, [
      playersCollisionGroup
    ]);
    const healthPotion2 = new Potion('health', 800, 600);
    healthPotion2.createPotionSprite(game, itemsCollisionGroup, [
      playersCollisionGroup
    ]);

    // *** Player - Sprite ***
    player1.addPlayerToRoom(
      game,
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
      bulletsCollisionGroup,
      [playersCollisionGroup, wallsCollisionGroup, doorsCollisionGroup],
      enemiesCollisionGroup
    );
    player2.addBullets(
      game,
      bulletsCollisionGroup,
      [playersCollisionGroup, wallsCollisionGroup, doorsCollisionGroup],
      enemiesCollisionGroup
    );

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
    //probably getting rid of this, as the enemyPathing was moved to the server and the movement has been moved to the socket.js file 5/9
    enemies.forEach(enemy => {
      if (!D6Dungeon.game.state.enemies[gameRoom][enemy.name]) {
        enemy.sprite.kill();
      }

      if (enemy.sprite._exists) {
        const { nextXTile, nextYTile } = D6Dungeon.game.state.enemies[gameRoom][
          enemy.name
        ];

        const currentXTile = enemy.sprite.position.x / 64;
        const currentYTile = enemy.sprite.position.y / 64;

        if (nextXTile > currentXTile) {
          enemy.sprite.body.velocity.x = enemy.speed;
        }
        if (nextXTile < currentXTile) {
          enemy.sprite.body.velocity.x = -enemy.speed;
        }
        if (nextYTile > currentYTile) {
          enemy.sprite.body.velocity.y = enemy.speed;
        }
        if (nextYTile < currentYTile) {
          enemy.sprite.body.velocity.y = -enemy.speed;
        }
      }
    });

    player1.addMovement(game);
    player1.addShooting(game);

    player2.sprite.body.velocity.x = 0;
    player2.sprite.body.velocity.y = 0;

    socket.on('player2Fire', ({ fireDirection }) => {
      player2.fire(game, fireDirection);
    });

    socket.on('movePlayer2', ({ x, y }) => {
      player2.sprite.body.x = x;
      player2.sprite.body.y = y;
    });

    if (!Object.keys(game.state.enemies[gameRoom]).length) {
      game.physics.p2.clearTilemapLayerBodies(map, doors);
      doors.destroy();
    }

    if (player2.socketId && !player2.sprite.visible) {
      player2.sprite.visible = true;
      player2.sprite.body.data.shapes[0].sensor = false;
    } else if (!player2.socketId && player2.sprite.visible) {
      player2.sprite.visible = false;
      player2.sprite.body.data.shapes[0].sensor = true;
    }
  }
};
