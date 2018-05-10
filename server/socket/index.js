const players = {};
let enemies = {};

const enemyPathing = (io, arg) => {
  io.emit('setIntervalTest', { msg: 'enemyPathing is running', a: arg });
};

const runIntervals = (io, arg) => {
  setInterval(() => enemyPathing(io, arg), 1000);
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
      items: ['Duck Bullets']
    };

    socket.emit('createPlayer', players[socket.id]);

    const playerFire = ({ fireDirection }) => {
      socket.broadcast.emit('player2Fire', { fireDirection });
    };

    const playerMove = ({ x, y, socketId }) => {
      players[socketId] = { ...players[socketId], x, y }; // Updates current player position
      socket.broadcast.emit('movePlayer2', { x, y });
    };

    const setEnemies = data => {
      enemies = data;
    };

    const enemyKill = ({ name, room }) => {
      enemies[room] = enemies[room].filter(enemy => {
        return enemy.name !== name;
      });
      socket.emit('getEnemies', enemies);
      console.log(enemies);
    };

    socket.on('intervalTest', arg => {
      runIntervals(io, arg);
    });
    socket.on('setEnemies', setEnemies);
    socket.on('playerFire', playerFire);
    socket.on('playerMove', playerMove);
    socket.on('enemyKill', enemyKill);

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
      delete players[socket.id];
    });
  });
};
