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

/* global D6Dungeon */

const socket = io(window.location.origin);

const socketFunctions = socket => {
  socket.on('createPlayer', createPlayer);
  socket.on('setPlayer2', setPlayer2);
  socket.on('removePlayer2', removePlayer2);
  socket.on('setRooms', setRooms);
  socket.on('setEnemies', setEnemies);
  socket.on('sendUrl', sendUrl);
  socket.on('updateEnemy', updateEnemy);
  socket.on('newRoom', newRoom);
};

const createPlayer = data => {
  D6Dungeon.game.state.player1 = new Player(data);
  D6Dungeon.game.state.gameId = data.gameId;
};

const newRoom = ({ nextRoom, x, y }) => {
  D6Dungeon.game.state.player1.x = x;
  D6Dungeon.game.state.player1.y = y;
  D6Dungeon.game.state.player2.x = x;
  D6Dungeon.game.state.player2.y = y;
  D6Dungeon.game.state.start(nextRoom, true, false);
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

socket.on('connect', () => {
  console.log('Connected!');
});

socket.on('setIntervalTest', arg => {
  console.log(arg);
});

socketFunctions(socket);

export default socket;
