/* global D6Dungeon, Phaser */

let player;
let keybinds = {};

export default {
  create() {
    D6Dungeon.game.physics.startSystem(Phaser.Physics.P2JS);

    player = D6Dungeon.game.add.sprite(500, 450, 'player');
    player.anchor.setTo(0.5, 0.5);
    D6Dungeon.game.physics.enable(player, Phaser.Physics.P2JS);

    player.scale.set(4);

    player.animations.add('walk', null, 10, true);

    keybinds.up = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.W);
    keybinds.down = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.S);
    keybinds.left = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.A);
    keybinds.right = D6Dungeon.game.input.keyboard.addKey(Phaser.Keyboard.D);
    keybinds.arrows = D6Dungeon.game.input.keyboard.createCursorKeys();
  },

  update(){
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

      // Flips player to face left
      if (player.scale.x < 0) {
        player.scale.x *= -1;
      }
    }
    else if (keybinds.right.isDown) {
      player.body.velocity.x = 150;

      // Flips player to face right
      if (player.scale.x > 0) {
        player.scale.x *= -1;
      }
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
