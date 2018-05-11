import React, { Component } from 'react';
import D6DungeonGame from '../game';

/* global D6Dungeon */

class Game extends Component {
  componentDidMount = async () => {
    D6Dungeon.game = new D6DungeonGame();
  };

  render() {
    return <div id="game-container" />;
  }
}

export default Game;
