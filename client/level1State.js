/* global D6Dungeon */
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
import { Weasel } from './components/enemies';
let player;
let cursors;
let enemies;
let facing = 'left';
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

export default {
  create() {
    player = D6Dungeon.game.add.sprite(500, 450, 'player');

    player.anchor.setTo(0.5, 0.5);
    D6Dungeon.game.physics.enable(player, Phaser.Physics.ARCADE);

    player.scale.set(4);

    player.animations.add('walk', null, 10, true);

    cursors = D6Dungeon.game.input.keyboard.createCursorKeys();
    enemies = [];
    var ran = Math.floor(Math.random()*2);
    console.log(ran);
    enemyPos[`pos${ran}`].forEach(pos => {
      enemies.push(new Weasel(D6Dungeon.game, pos.x, pos.y));
    });
  },

  update() {
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
      player.body.velocity.x = -150;

      if (facing != 'left') {
        player.animations.play('walk');
        facing = 'left';
      }

      // Flips player to face left
      if (player.scale.x < 0) {
        player.scale.x *= -1;
      }
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150;

      if (facing != 'right') {
        player.animations.play('walk');
        facing = 'right';
      }

      // Flips player to face left
      if (player.scale.x > 0) {
        player.scale.x *= -1;
      }
    } else {
      if (facing != 'idle') {
        player.animations.stop();

        // if (facing == 'left') {
        //   player.frame = 0;
        // }
        // else {
        //   player.frame = FRAME_PLAYER_RIGHT;
        // }

        facing = 'idle';
      }
    }
  }
};
