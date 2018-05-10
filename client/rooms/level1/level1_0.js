import easystarjs from 'easystarjs';
const easystar = new easystarjs.js();
import socket from '../../socket';
import { createWallCollision } from '../../wallCollision';
import { createDoorCollision } from '../../doorCollision';
import { createDoorSensors } from '../../doorSensors';
import { enemyRenderer } from '../../enemyRenderer';
import { enemyPathing } from '../../enemyPathing';
import { createCollisionGroups } from '../../collisionGroups';
import { Potion } from '../../Items';

/* global D6Dungeon */

let player1;
let player2;
let enemies;
let game;
let currentState;
let doors;
let map;

export default {
  create() {
    game = D6Dungeon.game;
    player1 = game.state.player1;
    // player2 = game.state.player2;
    currentState = game.state.current;
    socket.emit('setRoom', currentState);

    const [
      wallsCollisionGroup,
      doorsCollisionGroup,
      doorSensorsCollisionGroup,
      playersCollisionGroup,
      enemiesCollisionGroup,
      bulletsCollisionGroup,
      itemsCollisionGroup
    ] = createCollisionGroups(game);

    map = game.add.tilemap(currentState);
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
    createDoorSensors(game, currentState).forEach(doorSensor => {
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
    // player2.addPlayerToRoom(
    //   game,
    //   playersCollisionGroup,
    //   [
    //     bulletsCollisionGroup,
    //     doorSensorsCollisionGroup,
    //     playersCollisionGroup,
    //     wallsCollisionGroup,
    //     itemsCollisionGroup,
    //     doorsCollisionGroup
    //   ],
    //   enemiesCollisionGroup
    // );
    // *** Bullets ***
    player1.addBullets(
      game,
      bulletsCollisionGroup,
      [playersCollisionGroup, wallsCollisionGroup, doorsCollisionGroup],
      enemiesCollisionGroup
    );

    // *** Enemy pathfinding ***
    // const floorMap = floor.layer.data.map(row => row.map(col => col.index));
    // easystar.setGrid(floorMap);
    // easystar.setAcceptableTiles([3, 4]);
    // easystar.enableDiagonals();

    // console.log(floorMap);

    enemies = enemyRenderer(game, enemiesCollisionGroup, [
      bulletsCollisionGroup,
      enemiesCollisionGroup,
      playersCollisionGroup,
      wallsCollisionGroup,
      doorsCollisionGroup
    ]);
    socket.emit('intervalTest');
  },

  update() {
    //probably getting rid of this, as the enemyPathing was moved to the server and the movement has been moved to the socket.js file 5/9
    enemies.forEach(enemy => {
      if (enemy.sprite._exists) {
        const { nextXTile, nextYTile } = D6Dungeon.game.state.enemies[
          currentState
        ][enemy.name];
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
        // enemy.sprite.body.x = D6Dungeon.game.state.enemies[currentState][enemy.name].x;
        // enemy.sprite.body.y = D6Dungeon.game.state.enemies[currentState][enemy.name].y;
      }
      // enemyPathing(easystar, enemy, player1);
    });

    socket.on('movePlayer2', data => {
      player2.sprite.body.x = data.x;
      player2.sprite.body.y = data.y;
    });
    player1.addMovement();
    player1.addShooting(game);

    if (!game.state.enemies[currentState].length) {
      game.physics.p2.clearTilemapLayerBodies(map, doors);
      doors.destroy();
    }
  }
};
