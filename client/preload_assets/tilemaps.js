/* global D6Dungeon, Phaser */

export const preloadTilemaps = () => {
  D6Dungeon.game.load.image('level1Image', 'assets/tilemaps/level_1.png');
  D6Dungeon.game.load.image('level2Image', 'assets/tilemaps/level_2.png');
  D6Dungeon.game.load.image('level3Image', 'assets/tilemaps/level_3.png');

  D6Dungeon.game.load.tilemap(
    'floorDoor',
    'assets/tilemaps/floor_door.json',
    null,
    Phaser.Tilemap.TILED_JSON
  );
};
