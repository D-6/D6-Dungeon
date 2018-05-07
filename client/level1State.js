import easystarjs from 'easystarjs';
const easystar = new easystarjs.js();

import { Weasel } from './components/enemies';
import { createWallCollision } from './wallCollision';
import { createDoorSensors } from './doorSensors';
import { enemyPathing } from './enemyPathing';

/* global D6Dungeon, Phaser */

let floorMap;
let enemySpeed = 90;

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
const movementSpeed = 400;

export default {
  create() {
    D6Dungeon.game.physics.startSystem(Phaser.Physics.P2JS);

    let map = D6Dungeon.game.add.tilemap('level1_3-3');
    map.addTilesetImage('level_1', 'level1Image');
    const floor = map.createLayer('Floor');
    const walls = map.createLayer('Walls');

    createWallCollision(map, walls, D6Dungeon.game);
    createDoorSensors(D6Dungeon.game);

    // *** Player - Sprite ***
    player = D6Dungeon.game.add.sprite(608, 416, 'player');
    player.anchor.setTo(0.5, 0.5);
    player.scale.set(4);

    // *** Player - Physics ***
    // 2nd arg is debug mode
    D6Dungeon.game.physics.p2.enable(player, true);
    player.body.fixedRotation = true;
    player.body.setRectangle(player.width - 10, player.height - 10, 0, 6);

    // *** Player - Animation ***
    player.animations.add('walk', null, 10, true);

    // *** Enemy pathfinding ***
    floorMap = floor.layer.data.map(row => row.map(col => col.index));
    easystar.setGrid(floorMap);
    easystar.setAcceptableTiles([3, 4]);
    easystar.enableDiagonals();

    // *** Enemies ***
    enemies = [];
    let ran = Math.floor(Math.random() * 2);
    enemyPos[`pos${ran}`].forEach(pos => {
      enemies.push(new Weasel(D6Dungeon.game, pos.x, pos.y));
    });

    // *** Player - Keybinds ***
    keybinds.up = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.W);
    keybinds.down = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.S);
    keybinds.left = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.A);
    keybinds.right = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.D);
    keybinds.arrows = D6Dungeon.game.input.keyboard.createCursorKeys();
  },

  update() {
    enemyPathing(easystar, enemies[0].weasel, player, enemySpeed);

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
    if (keybinds.arrows.left.isDown) {
      // Flips player to face left
      if (player.scale.x < 0) {
        player.scale.x *= -1;
      }
    } else if (keybinds.arrows.right.isDown) {
      // Flips player to face right
      if (player.scale.x > 0) {
        player.scale.x *= -1;
      }
    }
  }
};
