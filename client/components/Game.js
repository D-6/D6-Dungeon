import React, { Component } from 'react';
import axios from 'axios';
import D6DungeonGame from '../game';

/* global D6Dungeon */

class Game extends Component {
  componentDidMount = async () => {
    const { data } = await axios.get('api/levels/1');
    D6Dungeon.game = new D6DungeonGame(data);
  };

  render() {
    return <div id="game-container" />;
  }
}

export default Game;
