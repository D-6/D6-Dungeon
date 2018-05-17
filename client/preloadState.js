import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

/* global D6Dungeon */

export default () => ({
  preload() {
    // Won't pause on loss of focus
    D6Dungeon.game.stage.disableVisibilityChange = true;

    D6Dungeon.game.physics.startSystem(Phaser.Physics.P2JS);
    D6Dungeon.game.physics.p2.setImpactEvents(true);

    D6Dungeon.game.load.audio('boss-battle', 'assets/audio/boss-battle-2.mp3');

    // Load all sprites / enemies for the level

    D6Dungeon.game.load.image('level1Image', 'assets/tilemaps/level_1.png');
    D6Dungeon.game.load.image('level2Image', 'assets/tilemaps/level_2.png');
    D6Dungeon.game.load.image('level3Image', 'assets/tilemaps/level_3.png');
    // D6Dungeon.game.load.image('floor-door', 'assets/tilemaps/level_1.png');
    D6Dungeon.game.load.tilemap(
      'floorDoor',
      'assets/tilemaps/floor_door.json',
      null,
      Phaser.Tilemap.TILED_JSON
    );

    D6Dungeon.game.load.image('potion', 'assets/items/Potion_42.png');
    D6Dungeon.game.load.image('bullet', 'assets/items/Potion_42.png');
    D6Dungeon.game.load.image('dummyBullet', 'assets/items/Potion_42.png');

    D6Dungeon.game.load.image(
      'wizard',
      'assets/character_sprites/wizard_idle_1.png'
    );

    D6Dungeon.game.load.spritesheet(
      'hearts',
      'assets/character_sprites/binding_hearts.png',
      130,
      136.25
    );

    D6Dungeon.game.load.spritesheet(
      'weasel',
      'assets/character_sprites/WeaselA.png',
      16,
      16
    );

    D6Dungeon.game.load.atlasJSONHash(
      'shadow-boy-boss',
      'assets/monster_sprites/shadow-boss.png',
      'assets/monster_sprites/shadow-boss.json'
    );

    D6Dungeon.game.load.atlasJSONHash(
      'red-horned-bee',
      'assets/monster_sprites/red-horned-bee.png',
      'assets/monster_sprites/red-horned-bee.json'
    );

    // Player 1
    D6Dungeon.game.load.atlasJSONHash(
      'player1',
      'assets/character_sprites/nerd.png',
      'assets/character_sprites/nerd.json'
    );

    // Player 2
    D6Dungeon.game.load.atlasJSONHash(
      'player2',
      'assets/character_sprites/girl.png',
      'assets/character_sprites/girl.json'
    );

    D6Dungeon.game.load.spritesheet(
      'golem',
      'assets/monster_sprites/HulkA.png',
      16,
      16
    );
  },

  create() {
    this.state.start('level1_3-3', true, false);
  }
});
