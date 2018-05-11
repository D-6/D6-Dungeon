import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
import socket from './socket';

import Player from './Player';

import preloadState from './preloadState';

class D6DungeonGame extends Phaser.Game {
  constructor() {
    const gameWidth = 1216;
    const gameHeight = 832;

    super(gameWidth, gameHeight, Phaser.AUTO, 'game-container');

    this.state.add('preloadState', preloadState());

    this.state.player2 = new Player({
      health: 10,
      speed: 200,
      damage: 2,
      fireRate: 400,
      bulletSpeed: 400,
      socketId: socket.id,
      x: 608,
      y: 416,
      items: ['Duck Bullets']
    });

    this.state.start('preloadState', true, false);
  }
}

export default D6DungeonGame;
