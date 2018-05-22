import socket from './socket';

const northDoorCoords = { x: 608, y: 32 };
const eastDoorCoords = { x: 1184, y: 416 };
const southDoorCoords = { x: 608, y: 800 };
const westDoorCoords = { x: 32, y: 416 };

/* global D6Dungeon */

const createSensor = ({ x, y }, direction) => {
  const doorSensor = D6Dungeon.game.add.sprite(x, y, 'wizard');
  doorSensor.scale.set(0.1);
  doorSensor.visible = false;

  D6Dungeon.game.physics.p2.enable(doorSensor, false);
  doorSensor.body.static = true;
  doorSensor.body.addCircle(90).sensor = true;
  doorSensor.direction = direction;

  const { collisionGroups } = D6Dungeon.game.physics.p2;
  const doorSensorsCollisionGroup = collisionGroups.find(
    group => group.name === 'doorSensors'
  );
  const playersCollisionGroup = collisionGroups.find(
    group => group.name === 'players'
  );

  doorSensor.body.setCollisionGroup(doorSensorsCollisionGroup);
  doorSensor.body.collides(playersCollisionGroup);

  return doorSensor;
};

export const createDoorSensors = () => {
  const { state } = D6Dungeon.game;
  const { gameId, player1 } = state;
  const { socketId } = player1;
  const gameRoom = state.current;

  const doorSensors = [
    createSensor(northDoorCoords, 'north'),
    createSensor(eastDoorCoords, 'east'),
    createSensor(southDoorCoords, 'south'),
    createSensor(westDoorCoords, 'west')
  ];

  doorSensors.forEach(doorSensor => {
    const level = gameRoom.slice(0, 7);
    const x = +gameRoom.slice(7, 8);
    const y = +gameRoom.slice(9, 10);
    const { direction } = doorSensor;

    let nextRoom;
    if (direction === 'north') nextRoom = level + x + '-' + (y + 1);
    else if (direction === 'east') nextRoom = level + (x + 1) + '-' + y;
    else if (direction === 'south') nextRoom = level + x + '-' + (y - 1);
    else if (direction === 'west') nextRoom = level + (x - 1) + '-' + y;

    doorSensor.body.onBeginContact.add(other => {
      if (other.sprite.key === 'player1') {
        socket.emit('nextRoomReady', {
          gameId,
          socketId,
          nextRoom,
          direction
        });
      }
    });

    doorSensor.body.onEndContact.add(other => {
      if (other.sprite && other.sprite.key === 'player1') {
        socket.emit('clearRoomReady', { gameId, socketId });
      }
    });
  });
};
