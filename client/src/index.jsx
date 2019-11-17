import Connection from './connection';
import React from "react";
import ReactDOM from "react-dom";

class ArduinoController extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false; // needed
        this.handleChange = this.handleChange.bind(this);
        this.state =
            {currentState: false,
             ws:null};
    }

    componentDidMount() {
        this.connect();
        this._isMounted = true;
    }

    connect() {
        const ws = new Connection(this.props.ipServer);
        ws.addMsgListener('turnedOffLed', this.turnOff.bind(this));
        ws.addMsgListener('turnedOnLed', this.turnOn.bind(this));
        this.setState({ws:ws});
    };

    componentWillUnmount() {
        this._isMounted = false;
        console.log('unmounting...');
    }

    turnOn(from) {
        this._isMounted && this.setState(state => ({
            currentState: true
        }));
        console.log('Turned on from ' + from)
    }

    turnOff(from) {
        this._isMounted && this.setState(state => ({
            currentState: false
        }));
        console.log('Turned off from ' + from);
    }

    render() {
        return (
            <button onClick={this.handleChange.bind(this)} value={this.state.currentState}>
                {this.state.currentState ? 'Turn ON' : 'Turn OFF'}
            </button>
        );
    }

    handleChange(e) {
        console.log('estat' + this.state.currentState)
        this._isMounted && this.setState(state => ({
            currentState: !state.currentState

        }));
        !this.state.currentState && this.state.ws.sendON();
        this.state.currentState && this.state.ws.sendOFF();
    }

}

ReactDOM.render(
    <ArduinoController ipServer = "ws://192.168.1.29:8090/"/>,
    document.getElementById('app')
);
