import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Guessing from './Guessing';
import WaitingRoom from './WaitingRoom';
import SocketController from './SocketController';
import Drawing from './Drawing';
import Results from './Results';
import { Grid } from 'react-bootstrap';
import PHASES from './shared/Phases';

class Game extends Component {

    constructor(props){
        super(props);
        this.state = {
            isConnected : true,
            phase : PHASES.DISCONNECTED,
            guess : null,
            drawing : null,
            results : null,
            players : null,
            playerSettings : null
        };

        let generateUpdateStateCallback = (key) => {
          return (data) =>{
              let stateParam = {};
              stateParam[key] = data;
              this.setState(stateParam)
          };
        };

        this.controller = new SocketController(
            generateUpdateStateCallback('phase'),
            generateUpdateStateCallback('drawing'),
            generateUpdateStateCallback('guess'),
            generateUpdateStateCallback('playerSettings'),
            generateUpdateStateCallback('players'),
            generateUpdateStateCallback('results')
        );
    }

      render() {
    
        return (
          <Grid className="Game">
              {this.state.phase === PHASES.DISCONNECTED &&
                <Login connect={(name, room) => this.controller.connect(name, room)} />
              }
              {(this.state.phase === PHASES.WAITING && this.state.playerSettings != null && this.state.players) &&
                <WaitingRoom room={this.state.playerSettings.room} players={this.state.players} startGame={this.controller.startGame}/>
              }
              {(this.state.phase === PHASES.GUESSING || this.state.phase === PHASES.START) &&
                <Guessing drawing={this.state.drawing} submit={this.controller.submitText} />
              }
              {this.state.phase === PHASES.DRAWING &&
                <Drawing text={this.state.guess} submit={this.controller.submitDrawing}/>
              }
              {this.state.phase === PHASES.END &&
                <Results results={this.state.results}/>
              }
          </Grid>
        );
      }
}

export default Game;
