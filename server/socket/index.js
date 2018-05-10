const { findClosestPlayer } = require('./enemyGenerator');
const players = {};
let enemies = {};
let currentRoom = '';
let enemyPathingInterval;

//importing easystar to server
const easystarjs = require('easystarjs');
const easystar = new easystarjs.js();
const floorMap = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -1, -1],
  [-1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -1, -1],
  [-1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -1, -1],
  [-1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -1, -1],
  [-1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -1, -1],
  [-1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -1, -1],
  [-1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -1, -1],
  [-1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -1, -1],
  [-1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
];
easystar.setGrid(floorMap);
easystar.setAcceptableTiles([3]);
easystar.enableDiagonals();
const enemyPathing = io => {
  Object.keys(enemies[currentRoom]).forEach(enemyName => {
    const enemy = enemies[currentRoom][enemyName];
    const closestPlayer = findClosestPlayer(players, enemy);
    // console.log(closestPlayer);
    //most of this logic was taken from enemyPathing.js in client
    // console.log(enemy);
    let enemyX = Math.floor(enemy.x / 64);
    let enemyY = Math.floor(enemy.y / 64);
    //currently setting nextX and nextY to null
    let newPos = {
      nextX: null,
      nextY: null
    };
    if (closestPlayer) {
      let targetX = Math.floor(closestPlayer.x / 64);
      let targetY = Math.floor(closestPlayer.y / 64);
      easystar.findPath(enemyX, enemyY, targetX, targetY, path => {
        if (path === null) {
          console.log('Path not found');
        }

        if (path && path.length) {
          newPos.nextX = path[1].x;
          newPos.nextY = path[1].y;
          // const distance = 1;
          // enemy.x += newPos.nextX - enemy.x > 0 ? distance : -distance;
          // enemy.y += newPos.nextY - enemy.y > 0 ? distance : -distance;
          enemy.nextXTile = newPos.nextX;
          enemy.nextYTile = newPos.nextY;
          enemy.x = newPos.nextX * 64;
          enemy.y = newPos.nextY * 64;
          io.sockets.emit('updateEnemy', {
            currentRoom,
            enemy
          });
        }

        // enemy.nextXTile = newPos.nextX;
        // enemy.nextYTile = newPos.nextY;

        // enemy.x = newPos.nextX * 64;
        // enemy.y = newPos.nextY * 64;

        // console.log(enemy);

        // io.sockets.emit('updateEnemy', {
        //   currentRoom,
        //   enemy
        // });
      });
      easystar.calculate();
    }
  });
};

const runIntervals = io => {
  enemyPathingInterval = setInterval(() => enemyPathing(io), 50);
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
      x: 608,
      y: 416,
      items: ['Duck Bullets']
    };

    socket.emit('createPlayer', players[socket.id]);

    const movePlayer2 = data => {
      const { x, y, socketId } = data;
      players[socketId] = { ...players[socketId], x, y }; // Updates current player position
      // socket.broadcast.emit('movePlayer2', data);
      //players[socketId] now includes the x and y data. might have to refactor this function
      // console.log(players[socketId]);
    };

    const setEnemies = data => {
      enemies = data;
    };
    const setRoom = room => {
      currentRoom = room;
      // console.log(currentRoom);
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
      if (!Object.keys(players).length) {
        clearInterval(enemyPathingInterval);
        enemies = {};
        currentRoom = '';
      }
    });

    socket.on('enemyKill', name => {
      delete enemies[currentRoom][name];
      socket.emit('getEnemies', enemies);
    });
  });
};
