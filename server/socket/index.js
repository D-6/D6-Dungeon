const { findClosestPlayer } = require('./enemyGenerator');
const path = require('path');
const readFilePromise = require('fs-readfile-promise');
const { Map } = require('../map_generator/mapGen');
const url = require('url');
const { createEnemies } = require('../socket/enemyGenerator');
const floorMap = require('./floorMap');
const players = {};
const maps = {};
let enemies = {};
let currentRoom = {};
let enemyPathingInterval = {};

//importing easystar to server
const easystarjs = require('easystarjs');
const easystar = new easystarjs.js();
easystar.setGrid(floorMap);
easystar.setAcceptableTiles([3]);
easystar.enableDiagonals();
const enemyPathing = (io, gameId) => {
  if (enemies[gameId]) {
    const currentGameEnemies = enemies[gameId][currentRoom[gameId]];

    if (!currentGameEnemies) {
      console.log('enemies all dead');
    } else {
      Object.keys(currentGameEnemies).forEach(enemyName => {
        const enemy = currentGameEnemies[enemyName];
        if (!enemy.ignorePathing) {
          const currentGamePlayers = players[gameId];
          const closestPlayer = findClosestPlayer(currentGamePlayers, enemy);

          let enemyX = Math.round(enemy.x / 64);
          let enemyY = Math.round(enemy.y / 64);
          let newPos = {
            nextX: null,
            nextY: null
          };

          if (closestPlayer) {
            let targetX = Math.round(closestPlayer.x / 64);
            let targetY = Math.round(closestPlayer.y / 64);
            easystar.findPath(enemyX, enemyY, targetX, targetY, bestPath => {
              if (bestPath === null) {
                console.log('Path not found');
              }

              if (bestPath && bestPath.length) {
                newPos.nextX = bestPath[1].x;
                newPos.nextY = bestPath[1].y;
                enemy.nextXTile = newPos.nextX;
                enemy.nextYTile = newPos.nextY;
                enemy.x = newPos.nextX * 64;
                enemy.y = newPos.nextY * 64;
                io.to(gameId).emit('updateEnemy', {
                  currentRoom: currentRoom[gameId],
                  enemy
                });
              }
            });
            easystar.calculate();
          }
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
};

const makeNewPlayer = (socket, gameId) => {
  players[gameId] = players[gameId] || {};
  players[gameId][socket.id] = {
    maxHealth: 6,
    health: 6,
    speed: 150,
    damage: 1,
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
    const message = `${host}/${socket.id}`;
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

const mapAndEnemyGenerator = async socket => {
  try {
    maps[socket.id] = [];
    enemies[socket.id] = {};
    const levels = 3;
    let newMap = {};

    for (let i = 1; i <= levels; i++) {
      if (i === 1) {
        newMap = new Map(7, 8, true, i);
      } else if (i === 2) {
        newMap = new Map(7, 12, true, i);
      } else if (i === 3) {
        newMap = new Map(7, 16, true, i);
      }

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

      const levelRooms = rooms.map((room, j) => {
        const JSONroom = JSON.parse(room);
        JSONroom.position = newMap.rooms[j].position;
        JSONroom.level = newMap.rooms[j].level;
        return JSONroom;
      });
      maps[socket.id] = [...maps[socket.id], ...levelRooms];

      const levelEnemies = createEnemies(newMap);
      enemies[socket.id] = { ...enemies[socket.id], ...levelEnemies };
    }

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
        await mapAndEnemyGenerator(socket);
      }
    }

    const enemyHit = ({ health, name, gameId }) => {
      const enemyObj = enemies[gameId][currentRoom[gameId]][name];
      if (enemyObj) {
        enemyObj.health = health;

        if (health > 0) {
          io.to(gameId).emit('updateEnemy', {
            currentRoom: currentRoom[gameId],
            enemy: enemyObj
          });
        } else {
          delete enemies[gameId][currentRoom[gameId]][name];
          io.to(gameId).emit('setEnemies', enemies[gameId]);
        }
      }
    };

    const ignoreEnemyPathing = ({ gameId, name, ignorePathing }) => {
      if (enemies[gameId] && enemies[gameId][currentRoom[gameId]]) {
        if (enemies[gameId][currentRoom[gameId]][name]) {
          enemies[gameId][currentRoom[gameId]][
            name
          ].ignorePathing = ignorePathing;
        }
      }
    };

    const setRoom = ({ gameId, gameRoom }) => {
      currentRoom[gameId] = gameRoom;

      const currentLevel = +gameRoom[5];
      const x = +gameRoom[7];
      const y = +gameRoom[9];
      socket.emit('updateMap', { x, y, currentLevel });
    };

    const nextRoomReady = ({ gameId, nextRoom, direction }) => {
      if (players[gameId]) {
        const enemiesDead =
          Object.keys(enemies[gameId][currentRoom[gameId]]).length === 0;

        if (enemiesDead && Object.keys(players[gameId]).length >= 1) {
          const position = {};
          switch (direction) {
            case 'north':
              position.x = 608;
              position.y = 662;
              break;
            case 'east':
              position.x = 160;
              position.y = 416;
              break;
            case 'south':
              position.x = 608;
              position.y = 160;
              break;
            case 'west':
              position.x = 1056;
              position.y = 416;
              break;
            default:
              position.x = 608;
              position.y = 416;
          }

          setRoom({ gameId, gameRoom: nextRoom });

          Object.keys(players[gameId]).forEach(player => {
            players[gameId][player].nextRoom = null;
            players[gameId][player].x = position.x;
            players[gameId][player].y = position.y;
          });
          io
            .to(gameId)
            .emit('newRoom', { nextRoom, x: position.x, y: position.y });
        }
      }
    };

    const playerFire = ({ fireDirection, gameId }) => {
      socket.to(gameId).broadcast.emit('player2Fire', { fireDirection });
    };

    const playerHit = ({ health, gameId, socketId, animation }) => {
      if (players[gameId]) {
        const playerObj = players[gameId][socketId];
        playerObj.health = health;
        socket.to(gameId).broadcast.emit('player2Hit', { health, animation });
      }
    };

    const playerMove = ({ x, y, socketId, gameId }) => {
      if (players[gameId]) {
        const playerObj = players[gameId][socketId];
        playerObj.x = x;
        playerObj.y = y;
        socket.to(gameId).broadcast.emit('player2Move', { x, y });
      }
    };

    const player2Animation = ({ gameId, animation }) => {
      socket.to(gameId).broadcast.emit('setPlayer2Animation', animation);
    };

    const playerPickup = ({
      bulletSpeed,
      damage,
      fireRate,
      speed,
      health,
      socketId,
      gameId
    }) => {
      if (players[gameId]) {
        const playerObj = players[gameId][socketId];
        playerObj.bulletSpeed = bulletSpeed;
        playerObj.damage = damage;
        playerObj.fireRate = fireRate;
        playerObj.speed = speed;
        playerObj.health = health;

        socket.to(gameId).broadcast.emit('player2Pickup', {
          bulletSpeed,
          damage,
          fireRate,
          speed,
          health
        });
      }
    };

    const disconnect = () => {
      console.log(`Connection ${socket.id} has left the building`);

      const isHost = Object.keys(players).includes(socket.id);
      let gameId;

      if (isHost) {
        gameId = socket.id;
        socket.to(gameId).broadcast.emit('removePlayer2');
      } else {
        gameId = Object.keys(players).find(playId => {
          return Object.keys(players[playId]).find(player => {
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
    };

    socket.on('intervalTest', gameId => {
      runIntervals(io, gameId);
    });
    socket.on('setRoom', setRoom);
    socket.on('enemyHit', enemyHit);
    socket.on('ignoreEnemyPathing', ignoreEnemyPathing);
    socket.on('playerFire', playerFire);
    socket.on('playerHit', playerHit);
    socket.on('playerMove', playerMove);
    socket.on('playerPickup', playerPickup);
    socket.on('nextRoomReady', nextRoomReady);
    socket.on('player2Animation', player2Animation);
    socket.on('disconnect', disconnect);
  });
};
