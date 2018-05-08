import easystarjs from 'easystarjs';
const easystar = new easystarjs.js();
import socket from '../../socket';
import { createWallCollision } from '../../wallCollision';
import { createDoorCollision } from '../../doorCollision';
import { createDoorSensors } from '../../doorSensors';
import { enemyGenerator } from '../../enemyGenerator';
import { enemyPathing } from '../../enemyPathing';
import { addPlayerToRoom } from '../../Player';
import { Potion } from '../../Items';

/* global D6Dungeon */

let player1;
let player2;
let enemies;

export default {
  create() {
    player1 = D6Dungeon.game.state.player1;
    player2 = D6Dungeon.game.state.player2;

    const wallsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    const doorsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    const doorSensorsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    const playersCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    const enemiesCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    const bulletsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    const itemsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();

    const currentState = D6Dungeon.game.state.current;
    const map = D6Dungeon.game.add.tilemap(currentState);
    map.addTilesetImage('level_1', 'level1Image');
    const floor = map.createLayer('Floor');
    const walls = map.createLayer('Walls');
    const doors = map.createLayer('Doors');

    const wallBodies = createWallCollision(map, walls, D6Dungeon.game);
    wallBodies.forEach(wallBody => {
      wallBody.setCollisionGroup(wallsCollisionGroup);
      wallBody.collides([
        bulletsCollisionGroup,
        enemiesCollisionGroup,
        playersCollisionGroup
      ]);
    });

    const doorBodies = createDoorCollision(map, doors, D6Dungeon.game);
    doorBodies.forEach(doorBody => {
      doorBody.setCollisionGroup(doorsCollisionGroup);
      doorBody.collides([
        bulletsCollisionGroup,
        enemiesCollisionGroup,
        playersCollisionGroup
      ]);
    });

    // *** Door Sensors ***
    createDoorSensors(D6Dungeon.game, currentState).forEach(doorSensor => {
      doorSensor.body.setCollisionGroup(doorSensorsCollisionGroup);
      doorSensor.body.collides(playersCollisionGroup);
    });

    // *** Potions ***
    const healthPotion = new Potion('health', 400, 400);
    healthPotion.createPotionSprite(D6Dungeon.game, itemsCollisionGroup, [
      playersCollisionGroup
    ]);
    const healthPotion2 = new Potion('health', 800, 600);
    healthPotion2.createPotionSprite(D6Dungeon.game, itemsCollisionGroup, [
      playersCollisionGroup
    ]);

    // *** Player - Sprite ***
    player1.addPlayerToRoom(
      D6Dungeon.game,
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
      D6Dungeon.game,
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
      D6Dungeon.game,
      bulletsCollisionGroup,
      [playersCollisionGroup, wallsCollisionGroup, doorsCollisionGroup],
      enemiesCollisionGroup
    );

    // *** Enemy pathfinding ***
    const floorMap = floor.layer.data.map(row => row.map(col => col.index));
    easystar.setGrid(floorMap);
    easystar.setAcceptableTiles([3, 4]);
    easystar.enableDiagonals();

    enemies = enemyGenerator(D6Dungeon.game, enemiesCollisionGroup, [
      bulletsCollisionGroup,
      enemiesCollisionGroup,
      playersCollisionGroup,
      wallsCollisionGroup,
      doorsCollisionGroup
    ]);
  },

  update() {
    enemies.forEach(enemy => {
      enemyPathing(easystar, enemy, player1);
    });
    socket.on('moveP2', (data) => {
      player2.sprite.body.x = data.x;
      player2.sprite.body.y = data.y;
    });
    player1.addMovement();
    player1.addShooting(D6Dungeon.game);
  }
};
