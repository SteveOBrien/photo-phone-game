import React, {Component} from 'react';
import DrawableCanvas from './DrawableCanvas';

class Drawing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitted: false
        };

    }

    submit(){
        this.props.submit(this.drawable.getValue());
        this.setState({submitted:true});
    }

    render() {

        if (!this.state.submitted) {

            return (

                <div>
                    <p>{this.props.text}</p>
                    <DrawableCanvas
                    ref={(drawable) => {this.drawable = drawable;}}>
                    </DrawableCanvas>
                    <div className="row">
                        <div className="col-xs-6">
                            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => this.drawable.clear()}>
                                Clear
                            </button>
                        </div>
                        <div className="col-xs-6">
                            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => this.submit()}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>

            );
        }
        else {
            return (
                <p>
                    Drawing submitted. Waiting for others...
                </p>
            );
        }

    }

}

export default Drawing;