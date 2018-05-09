import socket from './socket';

const createSensor = (game, x, y) => {
  const sensor = game.add.sprite(x, y, 'wizard');
  sensor.scale.set(0.1);

  // 2nd arg is debug mode
  game.physics.p2.enable(sensor, true);
  sensor.body.static = true;
  sensor.body.addCircle(85).sensor = true;

  return sensor;
};

export const createDoorSensors = (game, currentState) => {
  const sensorWest = createSensor(game, 32, 416);
  const sensorEast = createSensor(game, 1184, 416);
  const sensorNorth = createSensor(game, 608, 32);
  const sensorSouth = createSensor(game, 608, 800);

  const level = currentState.slice(0, 7);
  const x = +currentState.slice(7, 8);
  const y = +currentState.slice(9, 10);
  let nextRoom;

  console.log(currentState);
  sensorWest.body.onBeginContact.add(other => {
    if (other.sprite.key === 'player') {
      nextRoom = level + (x - 1) + '-' + y;
      game.state.start(nextRoom, true, false, 'east');
      socket.emit('intervalTest', 'test');
    }
  });
  sensorEast.body.onBeginContact.add(other => {
    if (other.sprite.key === 'player') {
      nextRoom = level + (x + 1) + '-' + y;
      game.state.start(nextRoom, true, false, 'west');
      socket.emit('intervalTest', 'test');
    }
  });
  sensorNorth.body.onBeginContact.add(other => {
    if (other.sprite.key === 'player') {
      nextRoom = level + x + '-' + (y + 1);
      game.state.start(nextRoom, true, false, 'south');
      socket.emit('intervalTest', 'test');
    }
  });
  sensorSouth.body.onBeginContact.add(other => {
    if (other.sprite.key === 'player') {
      nextRoom = level + x + '-' + (y - 1);
      game.state.start(nextRoom, true, false, 'north');
      socket.emit('intervalTest', 'test');
    }
  });

  // try to create collision group here

  return [sensorWest, sensorEast, sensorNorth, sensorSouth];
};
