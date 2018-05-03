import { Weasel } from './components/enemies';

/* global D6Dungeon, Phaser */

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

let player;
let keybinds = {};
const movementSpeed = 150;

export default {
  create() {
    // P2JS not started by default
    D6Dungeon.game.physics.startSystem(Phaser.Physics.P2JS);

    // *** Player - Sprite ***
    player = D6Dungeon.game.add.sprite(500, 450, 'player');

    player.anchor.setTo(0.5, 0.5);
    player.scale.set(4);

    // *** Player - Physics ***
    D6Dungeon.game.physics.enable(player, Phaser.Physics.P2JS);
    player.body.fixedRotation = true;
    player.body.setRectangle(player.width - 10, player.height - 10, 0, 6);
    // player.body.debug = true // Use to see collision model

    // *** Player - Animation ***
    player.animations.add('walk', null, 10, true);

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
