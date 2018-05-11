const { findClosestPlayer } = require('./enemyGenerator');
const path = require('path');
const readFilePromise = require('fs-readfile-promise');
const { Map } = require('../map_generator/mapGen');
const url = require('url');
const { createEnemies } = require('../socket/enemyGenerator');

const players = {};
const maps = {};
let enemies = {};
let currentRoom = {};
let enemyPathingInterval = {};

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
const enemyPathing = (io, gameId) => {
  if (enemies[gameId]) {
    const currentGameEnemies = enemies[gameId][currentRoom[gameId]];

    if (!currentGameEnemies) {
      console.log('enemy was already killed');
    } else {
      Object.keys(currentGameEnemies).forEach(enemyName => {
        const enemy = currentGameEnemies[enemyName];
        const currentGamePlayers = players[gameId];
        const closestPlayer = findClosestPlayer(currentGamePlayers, enemy);
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
          easystar.findPath(enemyX, enemyY, targetX, targetY, bestPath => {
            if (bestPath === null) {
              console.log('Path not found');
            }

            if (bestPath && bestPath.length) {
              newPos.nextX = bestPath[1].x;
              newPos.nextY = bestPath[1].y;
              // const distance = 1;
              // enemy.x += newPos.nextX - enemy.x > 0 ? distance : -distance;
              // enemy.y += newPos.nextY - enemy.y > 0 ? distance : -distance;
              enemy.nextXTile = newPos.nextX;
              enemy.nextYTile = newPos.nextY;
              enemy.x = newPos.nextX * 64;
              enemy.y = newPos.nextY * 64;
              io.to(gameId).emit('updateEnemy', {
                currentRoom: currentRoom[gameId],
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
    }
  }
};

const runIntervals = (io, gameId) => {
  enemyPathingInterval[gameId] = setInterval(
    () => enemyPathing(io, gameId),
    300
  );
  // console.log(enemyPathingInterval);
};

const makeNewPlayer = (socket, gameId) => {
  players[gameId] = players[gameId] || {};
  players[gameId][socket.id] = {
    health: 10,
    speed: 200,
    damage: 2,
    fireRate: 400,
    bulletSpeed: 400,
    socketId: socket.id,
    x: 608,
    y: 416,
    items: ['Duck Bullets'],
    nextRoom: null,
    gameId
  };

  socket.emit('createPlayer', players[gameId][socket.id]);

  const otherPlayer = Object.keys(players[gameId]).filter(
    id => id !== socket.id
  )[0];

  if (Object.keys(players[gameId]).length === 2) {
    if (otherPlayer) {
      // Send 2nd player to person who just joined
      socket.emit('setPlayer2', players[gameId][otherPlayer]);
      // Send 2nd player to the other person already in the game
      socket
        .to(gameId)
        .broadcast.emit('setPlayer2', players[gameId][socket.id]);
    }
  }
};

const placeClientInRoom = (io, socket) => {
  const parsedUrl = url.parse(socket.request.headers.referer);
  const host = parsedUrl.protocol + '//' + parsedUrl.host;
  const urlPath = parsedUrl.pathname.slice(1);
  let gameId = null;

  if (urlPath.length === 0) {
    const message = `Game URL:\n${host}/${socket.id}`;
    gameId = socket.id;
    socket.emit('sendUrl', message);
  } else if (players[urlPath]) {
    const playersInRoom = io.sockets.adapter.rooms[urlPath].length;
    if (playersInRoom === 1) {
      gameId = urlPath;
      socket.join(urlPath);
      socket.emit('setRooms', maps[urlPath]);
      socket.emit('setEnemies', enemies[urlPath]);
      console.log(`Client successfully joined friend in room: ${urlPath}`);
    } else {
      console.log(`${urlPath} already has 2 players!  Cannot join!`);
    }
  } else {
    console.log(`Client attempted to join an invalid room: ${urlPath}`);
  }
  return gameId;
};

const mapAndEnemyGenerator = async (socket, level) => {
  try {
    const newMap = new Map(7, 8, true);

    const promiseArray = newMap.rooms.map(room => {
      const pathToFile = path.join(
        __dirname,
        '..',
        'map_generator',
        'layouts',
        room.filename
      );
      return readFilePromise(pathToFile, 'utf8');
    });

    const rooms = await Promise.all(promiseArray);

    // Assign map for socket.id
    maps[socket.id] = rooms.map((room, i) => {
      const JSONroom = JSON.parse(room);
      JSONroom.position = newMap.rooms[i].position;
      return JSONroom;
    });

    // Assign enemies for socket.id
    enemies[socket.id] = createEnemies(newMap, level);

    socket.emit('setRooms', maps[socket.id]);
    socket.emit('setEnemies', enemies[socket.id]);
  } catch (err) {
    console.error(err);
  }
};

module.exports = io => {
  io.on('connection', async socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    // Puts client in room alone if joining '/'
    // Puts client in room with friend if joining '/socket.id'
    const newGameId = placeClientInRoom(io, socket);

    // Makes the player and assigns their friend's socket.id to friend
    if (newGameId) {
      makeNewPlayer(socket, newGameId);

      if (Object.keys(players[newGameId]).length === 1) {
        await mapAndEnemyGenerator(socket, 1);
      }
    }

    const playerFire = ({ fireDirection, gameId }) => {
      socket.to(gameId).broadcast.emit('player2Fire', { fireDirection });
    };

    const playerMove = ({ x, y, socketId, gameId }) => {
      if (players[gameId]) {
        players[gameId][socketId] = { ...players[gameId][socketId], x, y }; // Updates current player position
        socket.to(gameId).broadcast.emit('movePlayer2', { x, y });
      }
    };

    const setRoom = ({ gameId, gameRoom }) => {
      currentRoom[gameId] = gameRoom;
    };

    const nextRoomReady = ({ gameId, socketId, nextRoom, direction }) => {
      if (players[gameId]) {
        players[gameId][socketId].nextRoom = nextRoom;
        const allReady = Object.keys(players[gameId]).every(player => {
          console.log(players[gameId][player].nextRoom);
          return players[gameId][player].nextRoom === nextRoom;
        });
        const enemiesDead =
          Object.keys(enemies[gameId][currentRoom[gameId]]).length === 0;

        if (enemiesDead) console.log('ALL ENEMIES DEAD!');

        if (allReady) console.log('EVERYONE IS READY!');

        if (
          allReady &&
          enemiesDead &&
          Object.keys(players[gameId]).length === 2
        ) {
          console.log('ALL READY FOR ', nextRoom);
          const position = {};
          switch (direction) {
            case 'east':
              position.x = 160;
              position.y = 416;
              break;
            case 'west':
              position.x = 1056;
              position.y = 416;
              break;
            case 'north':
              position.x = 608;
              position.y = 672;
              break;
            case 'south':
              position.x = 608;
              position.y = 160;
              break;
            default:
              position.x = 608;
              position.y = 416;
          }
          setRoom({ gameId, gameRoom: nextRoom });
          Object.keys(players[gameId]).forEach(player => {
            players[gameId][player].nextRoom = null;
          });
          io
            .to(gameId)
            .emit('newRoom', { nextRoom, x: position.x, y: position.y });
        }
      }
    };

    const clearRoomReady = ({ gameId, socketId }) => {
      players[gameId][socketId].nextRoom = null;
      console.log(players[gameId][socketId].nextRoom);
    };

    socket.on('intervalTest', gameId => {
      runIntervals(io, gameId);
    });
    socket.on('setRoom', setRoom);
    socket.on('playerFire', playerFire);
    socket.on('playerMove', playerMove);
    socket.on('nextRoomReady', nextRoomReady);
    socket.on('clearRoomReady', clearRoomReady);

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);

      const isHost = Object.keys(players).includes(socket.id);
      let gameId;

      if (isHost) {
        gameId = socket.id;
        socket.to(gameId).broadcast.emit('removePlayer2');
      } else {
        gameId = Object.keys(players).find(gameId => {
          return Object.keys(players[gameId]).find(player => {
            return player === socket.id;
          });
        });
      }

      if (players[gameId]) {
        delete players[gameId][socket.id];
        socket.to(gameId).broadcast.emit('removePlayer2');
      }

      const leftInRoom = io.sockets.adapter.rooms[gameId];
      if (!leftInRoom) {
        clearInterval(enemyPathingInterval[gameId]);
        delete players[gameId];
        delete maps[gameId];
        delete enemies[gameId];
        delete currentRoom[gameId];
      }
    });

    socket.on('enemyKill', ({ gameId, gameRoom, name }) => {
      if (enemies[gameId]) {
        delete enemies[gameId][gameRoom][name];
        io.to(gameId).emit('setEnemies', enemies[gameId]);
      }
    });
  });
};
