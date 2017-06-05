import React, { Component } from 'react';

class Guessing extends Component {

    constructor(props){
        super(props);
        this.state = {
            submitted : false
        };

    }

    submit(){
        this.props.submit(this.refs.guessInput.value);
        this.setState({submitted : true});
    }

    render() {

        if(!this.state.submitted){

            return (
              <div>
                  {this.props.drawing && <img src={this.props.drawing} alt="Guess this!"/>}
                  <div className="form-group">
                      <label htmlFor="guess">
                          Enter something for others to draw:
                      </label>
                      <input id="guess" placeholder="Guess" ref="guessInput"/>
                  </div>
                  <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => this.submit()}>Submit</button>
              </div>
            );
        }
        else{
            return (
                <p>
                    Guess submitted! Now lets wait for the others...
                </p>
            );
        }

    }
}

export default Guessing;