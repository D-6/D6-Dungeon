/* global D6Dungeon, Phaser */

let player;
let keybinds = {};

export default {
  create() {
    let map = D6Dungeon.game.add.tilemap('level1map');
    map.addTilesetImage('level_1', 'level1image');
    const floor = map.createLayer('Floor');
    const walls = map.createLayer('Walls');

    player = D6Dungeon.game.add.sprite(500, 450, 'player');
    player.anchor.setTo(0.5, 0.5);
    D6Dungeon.game.physics.enable(player, Phaser.Physics.ARCADE);

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
