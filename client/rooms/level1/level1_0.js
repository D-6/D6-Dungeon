import easystarjs from 'easystarjs';
const easystar = new easystarjs.js();

import { createWallCollision } from '../../wallCollision';
import { createDoorSensors } from '../../doorSensors';
import { enemyGenerator } from '../../enemyGenerator';
import { enemyPathing } from '../../enemyPathing';
import { addPlayerToRoom } from '../../Player';

/* global D6Dungeon, Phaser */

let player1;
let enemies;
let floorMap;

export default {
  create() {
    player1 = D6Dungeon.game.state.player1;

    let wallsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    let doorSensorsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    let playersCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    let enemiesCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();
    let bulletsCollisionGroup = D6Dungeon.game.physics.p2.createCollisionGroup();

    const currentState = D6Dungeon.game.state.current;
    let map = D6Dungeon.game.add.tilemap(currentState);
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

    createDoorSensors(D6Dungeon.game, currentState).forEach(doorSensor => {
      doorSensor.body.setCollisionGroup(doorSensorsCollisionGroup);
      doorSensor.body.collides(playersCollisionGroup);
    });

    // *** Player - Sprite ***
    player1.sprite = addPlayerToRoom(
      D6Dungeon.game,
      playersCollisionGroup,
      [
        bulletsCollisionGroup,
        doorSensorsCollisionGroup,
        playersCollisionGroup,
        wallsCollisionGroup
      ],
      enemiesCollisionGroup
    );
    player1.addKeybinds(D6Dungeon.game);

    // *** Bullets ***
    player1.addBullets(
      D6Dungeon.game,
      bulletsCollisionGroup,
      [playersCollisionGroup, wallsCollisionGroup],
      enemiesCollisionGroup
    );

    // *** Enemy pathfinding ***
    floorMap = floor.layer.data.map(row => row.map(col => col.index));
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

    player1.movePlayer();
    player1.shoot(D6Dungeon.game);
  }
};
