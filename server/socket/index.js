const { findClosestPlayer } = require('./enemyGenerator');
const players = {};
let enemies = {};
let currentRoom = '';

//importing easystar to server
const easystarjs = require('easystarjs');
const easystar = easystarjs.js();
//I need a floormap to setGrid 5/9
//Also need it to be in json format so that I can turn set the acceptable tiles
//easystar.setGrid(floorMap);
//easystar.setAcceptableTiles([3,4]);
//easystar.enableDiagonals();
const enemyPathing = io => {
  enemies[currentRoom].forEach(enemy => {
    console.log(enemy);
    const closestPlayer = findClosestPlayer(players, enemy);
    //most of this logic was taken from enemyPathing.js in client
    let enemyX = Math.floor(enemy.x / 64);
    let enemyY = Math.floor(enemy.y / 64);
    //currently setting nextX and nextY to null
    let newPos = {
      nextX: null,
      nextY: null
    }
    let targetX = Math.floor(closestPlayer.x / 64);
    let targetY = Math.floor(closestPlayer.y / 64);
    easystar.findPath(enemyX, enemyY, targetX, targetY, path => {
      if (path === null) {
        console.log('Path not found');
      }

      if (path && path.length) {
        newPos.nextX = path[1].x;
        newPos.nextEY = path[1].y;
      }
      io.sockets.emit('updateEnemy', newPos, enemy.name);
    });
    easystar.calculat();
  });
};

const runIntervals = io => {
  setInterval(() => enemyPathing(io), 10000);
};

module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    players[socket.id] = {
      health: 10,
      speed: 200,
      damage: 2,
      fireRate: 400,
      bulletSpeed: 400,
      socketId: socket.id,
      posX: 608,
      posY: 416,
      items: ['Duck Bullets']
    };

    socket.emit('createPlayer', players[socket.id]);

    const movePlayer2 = data => {
      const { x, y, socketId } = data;
      players[socketId] = { ...players[socketId], posX: x, posY: y }; // Updates current player position
      // socket.broadcast.emit('movePlayer2', data);
      //players[socketId] now includes the x and y data. might have to refactor this function
      // console.log(players[socketId]);
    };

    const setEnemies = data => {
      enemies = data;
    };
    const setRoom = room => {
      currentRoom = room;
      console.log(currentRoom);
    };
    socket.on('intervalTest', () => {
      runIntervals(io);
    });
    socket.on('setRoom', setRoom);
    socket.on('setEnemies', setEnemies);
    socket.on('playerMove', movePlayer2);
    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
      delete players[socket.id];
    });
    //get rid of room on server/client
    socket.on('enemyKill', ({ name, room }) => {
      enemies[room] = enemies[room].filter(enemy => {
        return enemy.name !== name;
      });
      socket.emit('getEnemies', enemies);
      // console.log(enemies);
    });
  });
};
