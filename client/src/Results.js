import React, {Component} from 'react';

class Results extends Component {

    constructor(props) {
        super(props);
        this.keys = Object.keys(props.results);
        this.state = {
            resultIndex : 0
        };
    }

    switchViewedResult(change) {
        let newIndex = this.state.resultIndex + change;
        if (newIndex >= this.keys.length) {
            newIndex = 0;
        }
        else if (newIndex < 0) {
            newIndex = this.keys.length - 1;
        }
        this.setState({resultIndex: newIndex})
    }

    getResults() {

        return this.props.results[this.keys[this.state.resultIndex]].map(function(result, index){
            return (
                <div key={index}>
                    {index !== 0 &&
                    <p>Round {index}</p>
                    }
                    {index % 2 === 0 &&
                    <p className={result.data}>{result.data} <sub>Submitted by: {result.user}</sub></p>
                    }
                    {index % 2 !== 0 &&
                    <div><img src={result.data} alt={index}/><sub>Submitted by:{result.user}</sub></div>
                    }
                </div>
            );
        });
    }

    render() {

        return (

            <div>
                <div className="printable">
                    <h2 className="heading">Game Results</h2>
                    {this.getResults()}
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <button type="button" className="btn btn-default btn-lg btn-block" onClick={() => this.switchViewedResult(-1)}>
                            Previous
                        </button>
                    </div>
                    <div className="col-xs-6">
                        <button type="button" className="btn btn-default btn-lg btn-block" onClick={() => this.switchViewedResult(1)}>
                            Next
                        </button>
                    </div>
                </div>
            </div>


        );
    }

}

export default Results;