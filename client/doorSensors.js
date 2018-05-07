const createSensor = (game, x, y) => {
  const sensor = game.add.sprite(x, y, 'wizard');
  sensor.scale.set(0.1);

  // 2nd arg is debug mode
  game.physics.p2.enable(sensor, true);
  sensor.body.static = true;
  sensor.body.addCircle(85).sensor = true;

  return sensor;
};

export const createDoorSensors = game => {
  const sensorWest = createSensor(game, 32, 416);
  const sensorEast = createSensor(game, 1184, 416);
  const sensorNorth = createSensor(game, 608, 32);
  const sensorSouth = createSensor(game, 608, 800);

  sensorWest.body.onBeginContact.add(other => {
    console.log('West door entered by:', other.sprite.key);
  });
  sensorEast.body.onBeginContact.add(other => {
    console.log('East door entered by:', other.sprite.key);
  });
  sensorNorth.body.onBeginContact.add(other => {
    console.log('North door entered by:', other.sprite.key);
  });
  sensorSouth.body.onBeginContact.add(other => {
    console.log('South door entered by:', other.sprite.key);
  });

  // try to create collision group here

  return [sensorWest, sensorEast, sensorNorth, sensorSouth];
};
