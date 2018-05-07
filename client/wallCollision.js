export const createWallCollision = (map, walls, game) => {
  // IDs need to be Tile ID + 1
  map.setCollisionBetween(35, 37, true, walls); // Walls
  map.setCollisionBetween(99, 101, true, walls); // Walls
  map.setCollisionBetween(105, 107, true, walls); // Walls
  map.setCollisionBetween(120, 122, true, walls); // Walls
  map.setCollision(
    [
      50,
      54,
      66,
      70,
      82,
      86,
      89, // Walls
      130,
      133,
      134,
      138,
      145,
      147,
      148,
      151,
      161,
      163,
      165,
      166,
      178 // Door frames
    ],
    true,
    walls
  );

  // *** Walls - Physics ***
  game.physics.p2.convertTilemap(map, walls);
  walls.debug = true;
};
