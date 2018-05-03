/* global D6Dungeon */

let player;
let cursors;
let facing = 'left';

export default {
  create() {
    player = D6Dungeon.game.add.sprite(500, 450, 'player');
    player.anchor.setTo(0.5, 0.5);
    D6Dungeon.game.physics.enable(player, Phaser.Physics.ARCADE);

    player.scale.set(4);

    player.animations.add('walk', null, 10, true);

    cursors = D6Dungeon.game.input.keyboard.createCursorKeys();
  },

  update(){
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
    }
    else if (cursors.right.isDown) {
      player.body.velocity.x = 150;

      if (facing != 'right') {
        player.animations.play('walk');
        facing = 'right';
      }

      // Flips player to face left
      if (player.scale.x > 0) {
        player.scale.x *= -1;
      }
    }
    else {
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
