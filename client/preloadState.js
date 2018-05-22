import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
import {
  preloadAudio,
  preloadSprites,
  preloadTilemaps
} from './preload_assets';

/* global D6Dungeon */

export default () => ({
  preload() {
    D6Dungeon.game.stage.disableVisibilityChange = true;
    D6Dungeon.game.physics.startSystem(Phaser.Physics.P2JS);
    D6Dungeon.game.physics.p2.setImpactEvents(true);

    preloadAudio();
    preloadTilemaps();
    preloadSprites();
  }
});
