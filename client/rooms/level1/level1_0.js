import easystarjs from 'easystarjs';
const easystar = new easystarjs.js();

import { createWallCollision } from '../../wallCollision';
import { createDoorSensors } from '../../doorSensors';
import { enemyGenerator } from '../../enemyGenerator';
import { enemyPathing } from '../../enemyPathing';
import { addPlayerToRoom } from '../../Player';
import { Potion, createPotionSprite } from '../../Items';

/* global D6Dungeon */

let player1;
let enemies;

export default {
  create() {
    player1 = D6Dungeon.game.state.player1;

    const wallsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
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

    const wallBodies = createWallCollision(map, walls, D6Dungeon.game);
    wallBodies.forEach(wallBody => {
      wallBody.setCollisionGroup(wallsCollisionGroup);
      wallBody.collides([
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
    const healthPotion = new Potion('health');
    healthPotion.createPotionSprite(D6Dungeon.game, itemsCollisionGroup, [
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
        itemsCollisionGroup
      ],
      enemiesCollisionGroup
    );

    // *** Bullets ***
    player1.addBullets(
      D6Dungeon.game,
      bulletsCollisionGroup,
      [playersCollisionGroup, wallsCollisionGroup],
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
      wallsCollisionGroup
    ]);
  },

  update() {
    enemies.forEach(enemy => {
      enemyPathing(easystar, enemy, player1);
    });

    player1.addMovement();
    player1.addShooting(D6Dungeon.game);
  }
};
