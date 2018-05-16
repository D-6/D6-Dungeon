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

/* global D6Dungeon, Phaser */

const socket = io(window.location.origin);
const player2Scale = 1.2;

const socketFunctions = socket => {
  socket.on('createPlayer', createPlayer);
  socket.on('setPlayer2', setPlayer2);
  socket.on('removePlayer2', removePlayer2);
  socket.on('setRooms', setRooms);
  socket.on('setEnemies', setEnemies);
  socket.on('sendUrl', sendUrl);
  socket.on('updateEnemy', updateEnemy);
  socket.on('newRoom', newRoom);
  socket.on('player2Fire', player2Fire);
  socket.on('player2Hit', player2Hit);
  socket.on('player2Move', player2Move);
  socket.on('player2Pickup', player2Pickup);
  socket.on('setPlayer2Animation', setPlayer2Animation);
};

const setPlayer2Animation = animation => {
  const { player2 } = D6Dungeon.game.state;
  if (player2.sprite) {
    player2.sprite.animations.play(animation);
  }
};

const player2Fire = ({ fireDirection }) => {
  const { player2 } = D6Dungeon.game.state;
  player2.fire(D6Dungeon.game, fireDirection);
};

const player2Hit = ({ health, animation }) => {
  const { player2 } = D6Dungeon.game.state;
  if (player2.sprite) {
    player2.sprite.health = health;
    player2.sprite.animations.play(animation);

    if (player2.sprite.health === 0) {
      player2.sprite.kill();
    }
  }
};

const player2Move = ({ x, y }) => {
  const { player2 } = D6Dungeon.game.state;
  if (player2.sprite) {
    if (player2.sprite.body.x < x) {
      player2.sprite.scale.x = player2Scale;
    } else if (player2.sprite.body.x > x) {
      player2.sprite.scale.x = -player2Scale;
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
  player2.sprite.health = health;
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

const setPlayer2 = data => {
  D6Dungeon.game.state.player2 = Object.assign(
    D6Dungeon.game.state.player2,
    new Player(data)
  );
};

const removePlayer2 = () => {
  D6Dungeon.game.state.player2.socketId = null;
};

const updateEnemy = ({ currentRoom, enemy }) => {
  D6Dungeon.game.state.enemies[currentRoom][enemy.name] = enemy;
};

const sendUrl = message => {
  console.log(message);
};

const setRooms = rooms => {
  rooms.forEach((room, i) => {
    const { x, y } = room.position;
    const roomName = `level1_${x}-${y}`;
    D6Dungeon.game.state.add(roomName, level1Arr[i]);
  });

  rooms.forEach(room => {
    const { x, y } = room.position;
    D6Dungeon.game.load.tilemap(
      `level1_${x}-${y}`,
      null,
      room,
      Phaser.Tilemap.TILED_JSON
    );
  });
};

const setEnemies = enemies => {
  D6Dungeon.game.state.enemies = enemies;
};

const spawnItem = name => {
  console.log(D6Dungeon.game.state);
  // console.log(D6Dungeon.game.state.enemies[name.currentRoom][name.name]);
  // console.log(name.currentRoom);
};

socket.on('connect', () => {
  console.log('Connected!');
});

socket.on('setIntervalTest', arg => {
  console.log(arg);
});

socketFunctions(socket);

export default socket;
