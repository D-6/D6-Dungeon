/* global D6Dungeon */
import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

export default rooms => ({
  preload() {
    rooms.forEach(room => {
      const { x, y } = room.position;
      D6Dungeon.game.load.tilemap(
        `level1_${x}-${y}`,
        null,
        room,
        Phaser.Tilemap.TILED_JSON
      );
    });

    D6Dungeon.game.load.image('level1Image', 'assets/tilemaps/level_1.png');

    D6Dungeon.game.load.image('wizard', 'assets/character_sprites/wizard_idle_1.png');

    D6Dungeon.game.load.spritesheet(
      'weasel',
      'assets/character_sprites/WeaselA.png',
      16,
      16
    );

    D6Dungeon.game.load.spritesheet(
      'player',
      'assets/character_sprites/DuckB.png',
      16,
      16
    );
  },

  create() {
    this.state.start('level1State', true, false);
  }
});
