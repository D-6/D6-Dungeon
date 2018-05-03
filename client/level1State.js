/* global D6Dungeon, Phaser */

let player;
let cursors;
let isMoving = false;

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
    player.body.velocity.y = 0;

    if (cursors.up.isDown) {
      player.body.velocity.y = -150;

      if (!isMoving) {
        player.animations.play('walk');
        isMoving = true;
      }
    }
    else if (cursors.down.isDown) {
      player.body.velocity.y = 150;

      if (!isMoving) {
        player.animations.play('walk');
        isMoving = true;
      }
    }
    else if (cursors.left.isDown) {
      player.body.velocity.x = -150;

      if (!isMoving) {
        player.animations.play('walk');
        isMoving = true;
      }

      // Flips player to face left
      if (player.scale.x < 0) {
        player.scale.x *= -1;
      }
    }
    else if (cursors.right.isDown) {
      player.body.velocity.x = 150;

      if (!isMoving) {
        player.animations.play('walk');
        isMoving = true;
      }

      // Flips player to face right
      if (player.scale.x > 0) {
        player.scale.x *= -1;
      }
    }
    else {
      if (isMoving) {
        player.animations.stop();
        isMoving = false;
        player.frame = 5;
      }
    }
  }
};
