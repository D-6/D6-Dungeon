export const createCollisionGroups = game => {
  const wallsCollisionGroup = game.physics.p2.createCollisionGroup();
  wallsCollisionGroup.name = 'walls';
  const doorsCollisionGroup = game.physics.p2.createCollisionGroup();
  doorsCollisionGroup.name = 'doors';
  const doorSensorsCollisionGroup = game.physics.p2.createCollisionGroup();
  doorSensorsCollisionGroup.name = 'doorSensors';
  const playersCollisionGroup = game.physics.p2.createCollisionGroup();
  playersCollisionGroup.name = 'players';
  const enemiesCollisionGroup = game.physics.p2.createCollisionGroup();
  enemiesCollisionGroup.name = 'enemies';
  const bulletsCollisionGroup = game.physics.p2.createCollisionGroup();
  bulletsCollisionGroup.name = 'bullets';
  const itemsCollisionGroup = game.physics.p2.createCollisionGroup();
  itemsCollisionGroup.name = 'items';

  return [
    wallsCollisionGroup,
    doorsCollisionGroup,
    doorSensorsCollisionGroup,
    playersCollisionGroup,
    enemiesCollisionGroup,
    bulletsCollisionGroup,
    itemsCollisionGroup
  ];
};
