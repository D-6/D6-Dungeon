import React, { Component } from 'react';
import D6DungeonGame from '../game';
import socket from '../socket.js';
import { Link } from 'react-router-dom';
/* global D6Dungeon */

class Game extends Component {
  constructor() {
    super();
    this.state = {
      send: '',
      url: ''
    };
  }
  componentDidMount = async () => {
    D6Dungeon.game = new D6DungeonGame();
    socket.on('sendUrl', url => {
      this.setState({
        send: 'Send this link to Player2: ',
        url: `${url}`
      });
    });
  };
  render() {
    return (
      <div>
        <div id="game-container" />
        <p>
        {this.state.send}
        <Link to={this.state.url}>{this.state.url}</Link>
        </p>

      </div>
    );
  }
}

export default Game;
