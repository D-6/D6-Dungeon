export const createDoorCollision = (map, doors, game) => {
  map.setCollision([194, 196, 197, 210], true, doors);

  // *** Doors - Physics ***
  const doorBodies = game.physics.p2.convertTilemap(map, doors);
  doors.debug = true;

  return doorBodies;
};
