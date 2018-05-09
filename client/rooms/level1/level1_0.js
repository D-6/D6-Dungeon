import easystarjs from 'easystarjs';
const easystar = new easystarjs.js();
import socket from '../../socket';
import { createWallCollision } from '../../wallCollision';
import { createDoorCollision } from '../../doorCollision';
import { createDoorSensors } from '../../doorSensors';
import { enemyGenerator } from '../../enemyGenerator';
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

    console.log(D6Dungeon.game.state);

    const [
      wallsCollisionGroup,
      doorsCollisionGroup,
      doorSensorsCollisionGroup,
      playersCollisionGroup,
      enemiesCollisionGroup,
      bulletsCollisionGroup,
      itemsCollisionGroup
    ] = createCollisionGroups(game);

    currentState = game.state.current;
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
    const floorMap = floor.layer.data.map(row => row.map(col => col.index));
    easystar.setGrid(floorMap);
    easystar.setAcceptableTiles([3, 4]);
    easystar.enableDiagonals();

    enemies = enemyGenerator(game, enemiesCollisionGroup, [
      bulletsCollisionGroup,
      enemiesCollisionGroup,
      playersCollisionGroup,
      wallsCollisionGroup,
      doorsCollisionGroup
    ]);
  },

  update() {
    enemies.forEach(enemy => {
      if (enemy.sprite._exists) enemyPathing(easystar, enemy, player1);
    });
    socket.on('movePlayer2', data => {
      player2.sprite.body.x = data.x;
      player2.sprite.body.y = data.y;
    });
    player1.addMovement();
    player1.addShooting(game);

    if (!game.state.rooms[currentState].enemiesLeft) {
      game.physics.p2.clearTilemapLayerBodies(map, doors);
      doors.destroy();
    }
  }
};
