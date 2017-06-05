import React, { Component } from 'react';
import { Col, Button, Jumbotron } from 'react-bootstrap';

const STATES = Object.freeze({
    DEFAULT : 0,
    JOINING : 1,
    HOSTING : 2
});

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            view : STATES.DEFAULT
        };
    }
    
    render() {

            return(
                <div className="row">
                    <Jumbotron>
                        <h1 className="heading">Photo Telephone</h1>
                    </Jumbotron>
                    { this.state.view !== STATES.DEFAULT &&
                        <form>
                            <div className="form-group">
                                <label htmlFor="username">
                                    Name
                                </label>
                                <input id="username" autoComplete="off" type="text" className="form-control" ref="nameTextInput"
                                       placeholder="Name"/>
                            </div>


                            {this.state.view === STATES.JOINING &&
                            <div className="form-group">
                                <label htmlFor="room-id">
                                    Room Code
                                </label>
                                <input id="room-id" autoComplete="off" type="text" className="form-control" ref="roomTextInput"
                                       placeholder="Room"/>
                            </div>
                            }


                            <div className="form-group">
                                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => this.props.connect(this.refs.nameTextInput.value, this.state.view === STATES.HOSTING ? undefined : this.refs.roomTextInput.value)}>
                                    Play
                                </button>
                                <button type="button" className="btn btn-default btn-lg btn-block" onClick={() => this.setState({view : STATES.DEFAULT})}>
                                    Back
                                </button>
                            </div>
                        </form>
                    }

                    { this.state.view === STATES.DEFAULT &&
                        <div>
                            <Col xs={12} md={6}>
                                <Button className="btn btn-default btn-lg btn-block" onClick={() => this.setState({view : STATES.JOINING})}>
                                    Join Game
                                </Button>
                            </Col>
                            <Col xs={12} md={6}>
                                <Button className="btn btn-default btn-lg btn-block" onClick={() => this.setState({view : STATES.HOSTING})}>
                                    Create Game
                                </Button>
                            </Col>
                        </div>
                    }
                </div>
            );
    }
}

export default Login;
