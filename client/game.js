import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
import socket from './socket';

import Player from './Player';

import preloadState from './preloadState';

import level1_0 from './rooms/level1/level1_0';
import level1_1 from './rooms/level1/level1_1';
import level1_2 from './rooms/level1/level1_2';
import level1_3 from './rooms/level1/level1_3';
import level1_4 from './rooms/level1/level1_4';
import level1_5 from './rooms/level1/level1_5';
import level1_6 from './rooms/level1/level1_6';
import level1_7 from './rooms/level1/level1_7';
const level1Arr = [
  level1_0,
  level1_1,
  level1_2,
  level1_3,
  level1_4,
  level1_5,
  level1_6,
  level1_7
];

class D6DungeonGame extends Phaser.Game {
  constructor({ rooms, enemies }) {
    const gameWidth = 1216;
    const gameHeight = 832;

    super(gameWidth, gameHeight, Phaser.AUTO, 'game-container');

    this.state.rooms = {};

    this.state.add('preloadState', preloadState(rooms));
    rooms.forEach((room, i) => {
      const { x, y } = room.position;
      const roomName = `level1_${x}-${y}`;
      this.state.add(roomName, level1Arr[i]);
    });

    this.state.enemies = enemies;
    socket.emit('setEnemies', enemies);
    // socket.emit('getPlayer', {x: this.sprite.body.x, y: this.sprite.body.y});

    // this.state.player1 = new Player();
    // this.state.player2 = new Player();

    this.state.start('preloadState', true, false);
  }
}

export default D6DungeonGame;
