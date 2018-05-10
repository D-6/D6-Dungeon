import io from 'socket.io-client';
import Player from './Player';
import D6DungeonGame from './game';

const socket = io(window.location.origin);

const socketFunctions = socket => {
  socket.on('createPlayer', createPlayer);
  socket.on('getEnemies', getEnemies);
  // socket.on('currentEnemies', getPlayers);
  // socket.on('addPlayer', addPlayer);
  // socket.on('updatePlayer', updatePlayer);
  // socket.on('removePlayer', removePlayer);
  // socket.on('defeatPlayer', defeatPlayer);
  // socket.on('fireProjectile', fireProjectile);
  // socket.on('fireSpecial', fireSpecial);
  // socket.on('getEnemies', getEnemies);
  // socket.on('addEnemy', addEnemy);
  socket.on('updateEnemy', updateEnemy);
  // socket.on('hitEnemy', hitEnemy);
  // socket.on('removeEnemy', removeEnemy);
  // socket.on('getItems', getItems);
  // socket.on('addItem', addItem);
  // socket.on('removeItem', removeItem);
  // socket.on('updateStats', updateStats);
  // socket.on('updateLeaderBoard', updateLeaderBoard);
};

const createPlayer = data => {
  D6Dungeon.game.state.player1 = new Player(data);
};

const getEnemies = data => {
  D6Dungeon.game.state.enemies = data;
};
//find the enemy by the name? Idk how to do that right now 5/9
const updateEnemy = ({ currentRoom, enemy }) => {
  D6Dungeon.game.state.enemies[currentRoom] = {
    ...D6Dungeon.game.state.enemies[currentRoom],
    [enemy.name]: enemy
  };
  // console.log(D6Dungeon.game.state.enemies[currentRoom]);
};
socket.on('connect', () => {
  console.log('Connected!');
});
socket.on('setIntervalTest', arg => {
  console.log(arg);
});
socketFunctions(socket);

export default socket;
