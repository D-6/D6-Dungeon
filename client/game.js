import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

import preloadState from './preloadState';
import level1State from './level1State';

/* global D6Dungeon */

class D6DungeonGame extends Phaser.Game {
  constructor() {
    const gameWidth = 1216;
    const gameHeight = 832;

    super(gameWidth, gameHeight, Phaser.AUTO, 'game-container');

    this.state.add('preloadState', preloadState);
    this.state.add('level1State', level1State);

    this.state.start('preloadState', true, false);
  }
}

export default D6DungeonGame;
