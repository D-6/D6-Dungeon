module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );
    // socket.on('moveUp', (data) => {
    //   socket.broadcast.emit('moveUpMsg', data);
    // });
    // socket.on('moveDown', (data) => {
    //   socket.broadcast.emit('moveUpMsg', data);
    // });
    // socket.on('moveLeft', (data) => {
    //   socket.broadcast.emit('moveUpMsg', data);
    // });
    // socket.on('moveRight', (data) => {
    //   socket.broadcast.emit('moveUpMsg', data);
    // });
    socket.on('playerMove', data => {
      socket.broadcast.emit('moveUpMsg', data);
    })
    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};
