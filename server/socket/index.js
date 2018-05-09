const { getEnemies } = require('../socket/enemyGenerator');
const { enemies } = require('../api/levels');

const players = {};

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

    // io.emit() // Everyone

    socket.emit('createPlayer', players[socket.id]);
    // const enemies = getEnemies();
    console.log(enemies);
    socket.emit('getEnemies', enemies);
    // socket.emit('sendEnemies', data);

    const movePlayer2 = data => {
      socket.broadcast.emit('movePlayer2', data);
    };

    socket.on('moveUp', movePlayer2);
    socket.on('moveDown', movePlayer2);
    socket.on('moveLeft', movePlayer2);
    socket.on('moveRight', movePlayer2);
    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
      delete players[socket.id];
    });
  });
};
