/* global D6Dungeon */

const startingRoom = 'level1_3-3';

export const preloadSprites = () => {
  // Upgrades
  D6Dungeon.game.load.image('fist', 'assets/items/fist.png');
  D6Dungeon.game.load.image('potion', 'assets/items/Potion_42.png');
  D6Dungeon.game.load.image('blood', 'assets/items/Misc_08.png');

  // Bullets
  D6Dungeon.game.load.image('bullet', 'assets/items/Food_01.png');
  D6Dungeon.game.load.image('dummyBullet', 'assets/items/Food_01.png');

  // Door sensor sprite
  D6Dungeon.game.load.image(
    'wizard',
    'assets/character_sprites/wizard_idle_1.png'
  );

  // UI hearts
  D6Dungeon.game.load.spritesheet(
    'hearts',
    'assets/character_sprites/binding_hearts.png',
    130,
    136.25
  );

  // Enemies
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
    'red-horned-bee',
    'assets/monster_sprites/red-horned-bee.png',
    'assets/monster_sprites/red-horned-bee.json'
  );

  D6Dungeon.game.load.atlasJSONHash(
    'shadow-boy-boss',
    'assets/monster_sprites/shadow-boss.png',
    'assets/monster_sprites/shadow-boss.json'
  );

  // Patiently wait for the player images to load then start the first room
  // Called from waitForSockets
  const delayCreate = () => {
    const waitForPlayerSprites = setInterval(() => {
      const player1Loaded = D6Dungeon.game.cache._cache.image.player1;
      const player2Loaded = D6Dungeon.game.cache._cache.image.player2;
      if (player1Loaded && player2Loaded) {
        D6Dungeon.game.state.start(startingRoom, true, false);
        clearInterval(waitForPlayerSprites);
      }
    }, 50);
  };

  // Patiently wait for the server sockets to come back with player1 data
  const waitForSockets = setInterval(() => {
    const { gameId, player1 } = D6Dungeon.game.state;
    if (player1 && gameId) {
      let player1Key;
      let player2Key;

      if (player1.socketId === gameId) {
        player1Key = 'player1';
        player2Key = 'player2';
      } else {
        player1Key = 'player2';
        player2Key = 'player1';
      }

      D6Dungeon.game.load.atlasJSONHash(
        player1Key,
        'assets/character_sprites/nerd.png',
        'assets/character_sprites/nerd.json'
      );
      D6Dungeon.game.load.atlasJSONHash(
        player2Key,
        'assets/character_sprites/girl.png',
        'assets/character_sprites/girl.json'
      );

      delayCreate();
      clearInterval(waitForSockets);
    }
  }, 50);
};
