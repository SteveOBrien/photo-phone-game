import React, { Component } from 'react';

class WaitingRoom extends Component {

    render() {

        let playerList = this.props.players.map(function(name, index){
            return <li key={index}>{name}</li>;
        });

        return (
            <div className="row">
                <h1 className="heading">Room {this.props.room}</h1>
                <h2>Users</h2>
                <ul>
                    {playerList}
                </ul>
                <button type="button" disabled={this.props.players.length <= 1} onClick={() => this.props.startGame()} className="btn btn-primary btn-lg btn-block">
                    Start
                </button>
            </div>

        );

    }
}

export default WaitingRoom;