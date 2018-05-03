/* global D6Dungeon */

export default {
  preload() {
    D6Dungeon.game.load.spritesheet(
      'player',
      'assets/character_sprites/DuckB.png',
      16,
      16
    );
    D6Dungeon.game.load.spritesheet(
      'weasel',
      'assets/character_sprites/WeaselA.png',
      16,
      16
    );
  },

  create() {
    this.state.start('level1State', true, false);
  }
};
