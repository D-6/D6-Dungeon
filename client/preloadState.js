import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

/* global D6Dungeon */

export default () => ({
  preload() {
    // Won't pause on loss of focus
    const { gameId } = D6Dungeon.game.state;

    D6Dungeon.game.stage.disableVisibilityChange = true;

    D6Dungeon.game.physics.startSystem(Phaser.Physics.P2JS);
    D6Dungeon.game.physics.p2.setImpactEvents(true);

    D6Dungeon.game.load.audio('boss-battle', 'assets/audio/boss-battle-2.mp3');

    D6Dungeon.game.load.image('level1Image', 'assets/tilemaps/level_1.png');
    D6Dungeon.game.load.image('level2Image', 'assets/tilemaps/level_2.png');
    D6Dungeon.game.load.image('level3Image', 'assets/tilemaps/level_3.png');

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
      'spike-head',
      'assets/monster_sprites/spike-head.png',
      'assets/monster_sprites/spike-head.json'
    );

    D6Dungeon.game.load.atlasJSONHash(
      'cruncher',
      'assets/monster_sprites/cruncher.png',
      'assets/monster_sprites/cruncher.json'
    );

    D6Dungeon.game.load.atlasJSONHash(
      'skull-biter',
      'assets/monster_sprites/skull-biter.png',
      'assets/monster_sprites/skull-biter.json'
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

    D6Dungeon.game.load.spritesheet(
      'golem',
      'assets/monster_sprites/HulkA.png',
      16,
      16
    );

    // Patiently wait for the server sockets to come back with player1 data
    const waitForSockets = setInterval(() => {
      if (D6Dungeon.game.state.player1 && gameId) {
        if (D6Dungeon.game.state.player1.socketId === gameId) {
          D6Dungeon.game.load.atlasJSONHash(
            'player1',
            'assets/character_sprites/nerd.png',
            'assets/character_sprites/nerd.json'
          );
          D6Dungeon.game.load.atlasJSONHash(
            'player2',
            'assets/character_sprites/girl.png',
            'assets/character_sprites/girl.json'
          );
          this.delayCreate();
          clearInterval(waitForSockets);
        } else {
          D6Dungeon.game.load.atlasJSONHash(
            'player1',
            'assets/character_sprites/girl.png',
            'assets/character_sprites/girl.json'
          );
          D6Dungeon.game.load.atlasJSONHash(
            'player2',
            'assets/character_sprites/nerd.png',
            'assets/character_sprites/nerd.json'
          );
          this.delayCreate();
          clearInterval(waitForSockets);
        }
      }
    }, 20);
  },

  delayCreate() {
    const waitForSockets = setInterval(() => {
      if (D6Dungeon.game.state.player1.socketId) {
        D6Dungeon.game.state.start('level1_3-3', true, false);
        clearInterval(waitForSockets);
      }
    }, 1000);
  }
});
