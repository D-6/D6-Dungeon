export const createCollisionGroups = game => {
  const wallsCollisionGroup = game.physics.p2.createCollisionGroup();
  const doorsCollisionGroup = game.physics.p2.createCollisionGroup();
  const doorSensorsCollisionGroup = game.physics.p2.createCollisionGroup();
  const playersCollisionGroup = game.physics.p2.createCollisionGroup();
  const enemiesCollisionGroup = game.physics.p2.createCollisionGroup();
  const bulletsCollisionGroup = game.physics.p2.createCollisionGroup();
  const itemsCollisionGroup = game.physics.p2.createCollisionGroup();

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
