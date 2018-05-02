import React from 'react';
import D6DungeonGame from '../game'

/* global D6Dungeon */

D6Dungeon.game = new D6DungeonGame();

const Game = props => {
  return <div id="game-container" />;
};

export default Game;
