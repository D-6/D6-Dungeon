import socket from './socket';

const createSensor = (game, x, y) => {
  const sensor = game.add.sprite(x, y, 'wizard');
  sensor.scale.set(0.1);

  // 2nd arg is debug mode
  game.physics.p2.enable(sensor, true);
  sensor.body.static = true;
  sensor.body.addCircle(120).sensor = true;

  return sensor;
};

export const createDoorSensors = (game, currentState) => {
  const { gameId, player1 } = game.state;
  const { socketId } = player1;
  const sensorWest = createSensor(game, 32, 416);
  const sensorEast = createSensor(game, 1184, 416);
  const sensorNorth = createSensor(game, 608, 32);
  const sensorSouth = createSensor(game, 608, 800);

  const level = currentState.slice(0, 7);
  const x = +currentState.slice(7, 8);
  const y = +currentState.slice(9, 10);
  let nextRoom;

  sensorWest.body.onBeginContact.add(other => {
    if (other.sprite.key === 'player') {
      nextRoom = level + (x - 1) + '-' + y;
      socket.emit('nextRoomReady', {
        gameId,
        socketId,
        nextRoom,
        direction: 'east'
      });
    }
  });

  sensorWest.body.onEndContact.add(other => {
    if (other.sprite) {
      if (other.sprite.key === 'player') {
        socket.emit('clearRoomReady', { gameId, socketId });
      }
    }
  });

  sensorEast.body.onBeginContact.add(other => {
    if (other.sprite.key === 'player') {
      nextRoom = level + (x + 1) + '-' + y;
      socket.emit('nextRoomReady', {
        gameId,
        socketId,
        nextRoom,
        direction: 'west'
      });
    }
  });

  sensorEast.body.onEndContact.add(other => {
    if (other.sprite) {
      if (other.sprite.key === 'player') {
        socket.emit('clearRoomReady', { gameId, socketId });
      }
    }
  });

  sensorNorth.body.onBeginContact.add(other => {
    if (other.sprite.key === 'player') {
      nextRoom = level + x + '-' + (y + 1);
      socket.emit('nextRoomReady', {
        gameId,
        socketId,
        nextRoom,
        direction: 'north'
      });
    }
  });

  sensorNorth.body.onEndContact.add(other => {
    if (other.sprite) {
      if (other.sprite.key === 'player') {
        socket.emit('clearRoomReady', { gameId, socketId });
      }
    }
  });

  sensorSouth.body.onBeginContact.add(other => {
    if (other.sprite.key === 'player') {
      nextRoom = level + x + '-' + (y - 1);
      socket.emit('nextRoomReady', {
        gameId,
        socketId,
        nextRoom,
        direction: 'south'
      });
    }
  });

  sensorSouth.body.onEndContact.add(other => {
    if (other.sprite) {
      if (other.sprite.key === 'player') {
        socket.emit('clearRoomReady', { gameId, socketId });
      }
    }
  });

  return [sensorWest, sensorEast, sensorNorth, sensorSouth];
};
