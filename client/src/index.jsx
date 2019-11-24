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
        !this._isMounted && this.connect();
        this._isMounted = true;
    }

    connect() {
        const ws = new Connection(this.props.ipServer);
        this.setState({ws:ws});
        ws.addMsgListener('turnedOffLed', this.turnOff.bind(this));
        ws.addMsgListener('turnedOnLed', this.turnOn.bind(this));
    };

    componentWillUnmount() {
        this._isMounted = false;
        console.log('unmounting...');
    }

    turnOn(from) {
        this.setState({
            currentState: true
        });
        this.turnOnBackground();
        console.log('Turned on from ' + from)
    }

    turnOff(from) {
        this.setState({
            currentState: false
        });
        this.turnOffBackground();
        console.log('Turned off from ' + from);
    }

    render() {
        return (
            /*
            <button onClick={this.handleChange.bind(this)} value={this.state.currentState}>
                {this.state.currentState ? 'Turn ON' : 'Turn OFF'}
            </button>*/
            <div>
                <div className="button">
                    <a href="#" onClick={this.handleChange}>{this.state.currentState ? 'Turn OFF' : 'Turn ON'}</a>
                </div>
            </div>
        );
    }

    handleChange(e) {
        console.log('before State: ' + this.state.currentState);
            /*this.setState(state => ({
                currentState: !state.currentState

            }));*/

            if (!this.state.currentState) {
                this.state.ws.sendON();
            } else {
                this.state.ws.sendOFF();
            }
    }

    turnOnBackground() {
        document.body.classList.remove("off");
        document.body.classList.add("on");
    }
    turnOffBackground() {
        document.body.classList.remove("on");
        document.body.classList.add("off");
    }

}

ReactDOM.render(
    <ArduinoController ipServer = "ws://192.168.2.1:8090/"/>,
    document.getElementById('app')
);
