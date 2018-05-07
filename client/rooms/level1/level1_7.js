import easystarjs from 'easystarjs';
const easystar = new easystarjs.js();

import { Weasel } from '../../enemies';
import { createWallCollision } from '../../wallCollision';
import { createDoorSensors } from '../../doorSensors';
import { enemyPathing } from '../../enemyPathing';

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

let player1;
let keybinds = {};

let player1Health;
let player1Speed;
let player1Items;

export default {
  create() {
    player1Health = D6Dungeon.game.state.player1.health;
    player1Speed = D6Dungeon.game.state.player1.speed;
    player1Items = D6Dungeon.game.state.player1.items;

    const currentState = D6Dungeon.game.state.current;
    let map = D6Dungeon.game.add.tilemap(currentState);
    map.addTilesetImage('level_1', 'level1Image');
    const floor = map.createLayer('Floor');
    const walls = map.createLayer('Walls');

    createWallCollision(map, walls, D6Dungeon.game);
    createDoorSensors(D6Dungeon.game, currentState);

    // *** Player - Sprite ***
    player1 = D6Dungeon.game.add.sprite(608, 416, 'player');
    player1.anchor.setTo(0.5, 0.5);
    player1.scale.set(4);

    // *** Player - Physics ***
    // 2nd arg is debug mode
    D6Dungeon.game.physics.p2.enable(player1, true);
    player1.body.fixedRotation = true;
    player1.body.setRectangle(player1.width - 10, player1.height - 10, 0, 6);

    // *** Player - Animation ***
    player1.animations.add('walk', null, 10, true);

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
    enemies.forEach(enemy => {
      enemyPathing(easystar, enemy.weasel, player1, enemySpeed);
    });

    player1.body.velocity.x = 0;
    player1.body.velocity.y = 0;

    if (keybinds.up.isDown) {
      player1.body.moveUp(player1Speed);
    } else if (keybinds.down.isDown) {
      player1.body.moveDown(player1Speed);
    }

    if (keybinds.left.isDown) {
      player1.body.moveLeft(player1Speed);

      // Flips player to face left
      if (player1.scale.x < 0) {
        player1.scale.x *= -1;
      }
    } else if (keybinds.right.isDown) {
      player1.body.moveRight(player1Speed);

      // Flips player to face right
      if (player1.scale.x > 0) {
        player1.scale.x *= -1;
      }
    }

    if (player1.body.velocity.x === 0 && player1.body.velocity.y === 0) {
      player1.animations.stop('walk', true);
    } else {
      player1.animations.play('walk');
    }

    // Arrow keys used for firing
    if (keybinds.arrows.left.isDown) {
      // Flips player to face left
      if (player1.scale.x < 0) {
        player1.scale.x *= -1;
      }
    } else if (keybinds.arrows.right.isDown) {
      // Flips player to face right
      if (player1.scale.x > 0) {
        player1.scale.x *= -1;
      }
    }
  }
};
