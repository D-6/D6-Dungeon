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
     url: '',
     map: [
       ['O', 'O', 'O', 'O', 'O', 'O', 'O'],
       ['O', 'O', 'O', 'O', 'O', 'O', 'O'],
       ['O', 'O', 'O', 'O', 'O', 'O', 'O'],
       ['O', 'O', 'O', 'O', 'O', 'O', 'O'],
       ['O', 'O', 'O', 'O', 'O', 'O', 'O'],
       ['O', 'O', 'O', 'O', 'O', 'O', 'O'],
       ['O', 'O', 'O', 'O', 'O', 'O', 'O']
     ]
   };
 }
 componentDidMount = () => {
   D6Dungeon.game = new D6DungeonGame();
   socket.on('sendUrl', url => {
     this.setState({
       send: 'Send this link to Player2: ',
       url: `${url}`
     });
   });
   socket.on('updateMap', roomCoord => {
     let newMap = this.state.map;
     newMap[roomCoord.y][roomCoord.x] = 'X';
     console.log(newMap);
     this.setState({
       map: newMap
     });
   });
 };
 handleclick = link => {
   link.preventDefault();
 };
 render() {
   return (
     <div className="sideways">
       <div>
         <div id="game-container" />
         <p>
           {this.state.send}
           <Link to={this.state.url} onClick={this.handleclick}>
             {this.state.url}
           </Link>
         </p>
       </div>
       <div className="overlap">
         <p className="minimap">{this.state.map[0].join(' ')}</p>
         <p className="minimap">{this.state.map[1].join(' ')}</p>
         <p className="minimap">{this.state.map[2].join(' ')}</p>
         <p className="minimap">{this.state.map[3].join(' ')}</p>
         <p className="minimap">{this.state.map[4].join(' ')}</p>
         <p className="minimap">{this.state.map[5].join(' ')}</p>
         <p className="minimap">{this.state.map[6].join(' ')}</p>
       </div>
     </div>
   );
 }
}

export default Game;
