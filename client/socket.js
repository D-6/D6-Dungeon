import io from 'socket.io-client';
import Player from './Player';
import D6DungeonGame from './game';

import level1_0 from './rooms/level1/level1_0';
import level1_1 from './rooms/level1/level1_1';
import level1_2 from './rooms/level1/level1_2';
import level1_3 from './rooms/level1/level1_3';
import level1_4 from './rooms/level1/level1_4';
import level1_5 from './rooms/level1/level1_5';
import level1_6 from './rooms/level1/level1_6';
import level1_7 from './rooms/level1/level1_7';

import level2_0 from './rooms/level2/level2_0';
import level2_1 from './rooms/level2/level2_1';
import level2_2 from './rooms/level2/level2_2';
import level2_3 from './rooms/level2/level2_3';
import level2_4 from './rooms/level2/level2_4';
import level2_5 from './rooms/level2/level2_5';
import level2_6 from './rooms/level2/level2_6';
import level2_7 from './rooms/level2/level2_7';
import level2_8 from './rooms/level2/level2_8';
import level2_9 from './rooms/level2/level2_9';
import level2_10 from './rooms/level2/level2_10';
import level2_11 from './rooms/level2/level2_11';

import level3_0 from './rooms/level3/level3_0';
import level3_1 from './rooms/level3/level3_1';
import level3_2 from './rooms/level3/level3_2';
import level3_3 from './rooms/level3/level3_3';
import level3_4 from './rooms/level3/level3_4';
import level3_5 from './rooms/level3/level3_5';
import level3_6 from './rooms/level3/level3_6';
import level3_7 from './rooms/level3/level3_7';
import level3_8 from './rooms/level3/level3_8';
import level3_9 from './rooms/level3/level3_9';
import level3_10 from './rooms/level3/level3_10';
import level3_11 from './rooms/level3/level3_11';
import level3_12 from './rooms/level3/level3_12';
import level3_13 from './rooms/level3/level3_13';
import level3_14 from './rooms/level3/level3_14';
import level3_15 from './rooms/level3/level3_15';

const levelArr = [
  level1_0,
  level1_1,
  level1_2,
  level1_3,
  level1_4,
  level1_5,
  level1_6,
  level1_7,
  level2_0,
  level2_1,
  level2_2,
  level2_3,
  level2_4,
  level2_5,
  level2_6,
  level2_7,
  level2_8,
  level2_9,
  level2_10,
  level2_11,
  level3_0,
  level3_1,
  level3_2,
  level3_3,
  level3_4,
  level3_5,
  level3_6,
  level3_7,
  level3_8,
  level3_9,
  level3_10,
  level3_11,
  level3_12,
  level3_13,
  level3_14,
  level3_15
];

/* global D6Dungeon, Phaser */

const socket = io(window.location.origin);
const player2Scale = 1.2;

const socketFunctions = socket => {
  socket.on('createPlayer', createPlayer);
  socket.on('newRoom', newRoom);
  socket.on('player2Fire', player2Fire);
  socket.on('player2Hit', player2Hit);
  socket.on('player2Move', player2Move);
  socket.on('player2Pickup', player2Pickup);
  socket.on('removePlayer2', removePlayer2);
  socket.on('setEnemies', setEnemies);
  socket.on('setPlayer2', setPlayer2);
  socket.on('setPlayer2Animation', setPlayer2Animation);
  socket.on('setRooms', setRooms);
  socket.on('updateEnemy', updateEnemy);
};

const createPlayer = data => {
  D6Dungeon.game.state.player1 = new Player(data);
  D6Dungeon.game.state.gameId = data.gameId;
};

const newRoom = ({ nextRoom, x, y }) => {
  D6Dungeon.game.state.start(nextRoom, true, false);
  D6Dungeon.game.state.player1.x = x;
  D6Dungeon.game.state.player1.y = y;
  D6Dungeon.game.state.player2.x = x;
  D6Dungeon.game.state.player2.y = y;
  D6Dungeon.game.state.player2.sprite.body.x = x;
  D6Dungeon.game.state.player2.sprite.body.y = y;
};

const player2Fire = ({ fireDirection }) => {
  const { player2 } = D6Dungeon.game.state;

  if (fireDirection) {
    player2.fire(D6Dungeon.game, fireDirection);
    player2.isFiring = true;
  } else {
    player2.isFiring = false;
  }
};

const player2Hit = ({ health, animation }) => {
  const { player2 } = D6Dungeon.game.state;
  if (player2.sprite) {
    player2.health = health;
    player2.sprite.health = health;
    player2.sprite.animations.play(animation);
    player2.sprite.children[0].setText(`HP: ${health}`);

    if (player2.health === 0) {
      player2.sprite.kill();
    }
  }
};

const player2Move = ({ x, y }) => {
  const { player2 } = D6Dungeon.game.state;
  if (player2.sprite) {
    if (!player2.isFiring && player2.sprite.body.x < x) {
      player2.sprite.scale.x = player2Scale;
      player2.sprite.children[0].scale.x = 1;
    } else if (!player2.isFiring && player2.sprite.body.x > x) {
      player2.sprite.scale.x = -player2Scale;
      player2.sprite.children[0].scale.x = -1;
    }
    player2.sprite.body.x = x;
    player2.sprite.body.y = y;
  }
};

const player2Pickup = ({ bulletSpeed, damage, fireRate, speed, health }) => {
  const { player2 } = D6Dungeon.game.state;
  player2.bulletSpeed = bulletSpeed;
  player2.damage = damage;
  player2.fireRate = fireRate;
  player2.speed = speed;
  player2.health = health;
  player2.sprite.health = health;
  player2.sprite.children[0].setText(`HP: ${health}`);
};

const removePlayer2 = () => {
  D6Dungeon.game.state.player2.socketId = null;
};

const setEnemies = enemies => {
  D6Dungeon.game.state.enemies = enemies;
};

const setPlayer2 = data => {
  D6Dungeon.game.state.player2 = Object.assign(
    D6Dungeon.game.state.player2,
    new Player(data)
  );
};

const setPlayer2Animation = animation => {
  const { player2 } = D6Dungeon.game.state;
  if (player2.sprite) {
    if (animation !== 'die') {
      player2.sprite.animations.play(animation);
    } else {
      const xScale = D6Dungeon.game.state.player2.sprite.scale.x;
      player2.makeDeadPlayer(D6Dungeon.game, 'player2', xScale);
    }
  }
};

const setRooms = rooms => {
  rooms.forEach((room, i) => {
    const { x, y } = room.position;
    const { level } = room;
    const roomName = `level${level}_${x}-${y}`;
    D6Dungeon.game.state.add(roomName, levelArr[i]);
    D6Dungeon.game.load.tilemap(
      roomName,
      null,
      room,
      Phaser.Tilemap.TILED_JSON
    );
  });

  // rooms.forEach(((room, i) => {
  //   const { x, y } = room.position;
  //   D6Dungeon.game.load.tilemap(
  //     `level1_${x}-${y}`,
  //     null,
  //     room,
  //     Phaser.Tilemap.TILED_JSON
  //   );
  // });
};

const updateEnemy = ({ currentRoom, enemy }) => {
  D6Dungeon.game.state.enemies[currentRoom][enemy.name] = enemy;
};

socket.on('connect', () => {
  console.log('Connected!');
});

socket.on('setIntervalTest', arg => {
  console.log(arg);
});

socketFunctions(socket);

export default socket;
