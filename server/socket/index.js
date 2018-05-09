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
      items: ['Duck Bullets']
    };

    socket.emit('createPlayer', players[socket.id]);

    const movePlayer2 = data => {
      socket.broadcast.emit('movePlayer2', data);
    };
    const setEnemies = data => {
      enemies = data;
    };
    socket.on('intervalTest', arg => {
      runIntervals(io, arg);
    });
    socket.on('setEnemies', setEnemies);
    socket.on('moveUp', movePlayer2);
    socket.on('moveDown', movePlayer2);
    socket.on('moveLeft', movePlayer2);
    socket.on('moveRight', movePlayer2);
    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
      delete players[socket.id];
    });

    socket.on('enemyKill', ({ name, room }) => {
      enemies[room] = enemies[room].filter(enemy => {
        return enemy.name !== name;
      });
      socket.emit('getEnemies', enemies);
      console.log(enemies);
    });
  });
};
