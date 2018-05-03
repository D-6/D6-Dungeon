
/* global D6Dungeon */
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
import { Weasel } from './components/enemies';
let cursors;
let enemies;
let enemyPos = {
  pos0: [
    { x: 300, y: 300 },
    { x: 300, y: 600 },
    { x: 600, y: 300 },
    { x: 600, y: 600 }
  ],
  pos1: [
    { x: 200, y: 800 },
    { x: 200, y: 200 },
    { x: 200, y: 400 },
    { x: 200, y: 600 }
  ]
};

/* global D6Dungeon, Phaser */

let player;
let keybinds = {};


export default {
  create() {
    player = D6Dungeon.game.add.sprite(500, 450, 'player');

    player.anchor.setTo(0.5, 0.5);
    D6Dungeon.game.physics.enable(player, Phaser.Physics.ARCADE);

    player.scale.set(4);

    player.animations.add('walk', null, 10, true);

    enemies = [];
    var ran = Math.floor(Math.random()*2);
    enemyPos[`pos${ran}`].forEach(pos => {
      enemies.push(new Weasel(D6Dungeon.game, pos.x, pos.y));
    });

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
      player.body.velocity.y = -150;
    }
    else if (keybinds.down.isDown) {
      player.body.velocity.y = 150;
    }

    if (keybinds.left.isDown) {
      player.body.velocity.x = -150;
    }
    else if (keybinds.right.isDown) {
      player.body.velocity.x = 150;
    }

    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
      player.animations.stop('walk', true);
    }
    else {
      player.animations.play('walk');
    }

    // Arrow keys used for firing
    if (keybinds.arrows.left.isDown) {
      // Flips player to face left
      if (player.scale.x < 0) {
        player.scale.x *= -1;
      }

    }
    else if (keybinds.arrows.right.isDown) {
      // Flips player to face right
      if (player.scale.x > 0) {
        player.scale.x *= -1;
      }
    }
  }
};
