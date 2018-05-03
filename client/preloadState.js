/* global D6Dungeon */
import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

export default rooms => ({
  preload() {
    D6Dungeon.game.load.spritesheet(
      'player',
      'assets/character_sprites/DuckB.png',
      16,
      16
    );

    console.log(rooms);

    D6Dungeon.game.load.tilemap(
      'level1map',
      null,
      rooms,
      Phaser.Tilemap.TILED_JSON
    );

    D6Dungeon.game.load.image('level1image', 'assets/tilemaps/level_1.png');
  },

  create() {
    this.state.start('level1State', true, false);
  }
});
