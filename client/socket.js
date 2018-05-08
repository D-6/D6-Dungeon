import io from 'socket.io-client';

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('Connected!');
  socket.on('moveUpMsg', (data) => {
    console.log(data);
  });
});

export default socket;
//comment
