export default class Connection {

    constructor(url) {
        console.log('Connecting, adding socket listeners ...');
        this.socket = new WebSocket(url, 'echo-protocol');
        this.events = {};
        this.addListeners();
    }

    addListeners() {
        this.socket.onopen = function () {
            console.log('Ws Connected, adding Message callback...');
            this.addOnMessageCallback();
        }.bind(this);

        this.socket.onclose = function () {
            console.log('Server socket Closed');
        };

        this.socket.onerror = function () {
            console.log('Connection Error');
        };
    }

    addOnMessageCallback() {
        this.socket.onmessage = function (e) {
            if (typeof e.data === 'string') {
                console.log("Received from server: '" + e.data + "'");
            }
            const msg = JSON.parse(e.data);
            if (msg.msgCode === 'turnedOnLed') {
                this.dispatch('turnedOnLed', msg.from);
            } else if (msg.msgCode === 'turnedOffLed') {
                this.dispatch('turnedOffLed', msg.from);
            }
        }.bind(this);
    }

    addMsgListener(msgCode, callback) {
        // Check if the callback is not a function
        if (typeof callback !== 'function') {
            console.error(`The listener callback must be a function, the given type is ${typeof callback}`);
            return false;
        }
        // Check if the event is not a string
        if (typeof msgCode !== 'string') {
            console.error(`The event name must be a string, the given type is ${typeof event}`);
            return false;
        }

        // Create the event if not exists
        if (this.events[msgCode] === undefined) {
            this.events[msgCode] = {
                listeners: []
            }
        }
        this.events[msgCode].listeners.push(callback);
    }

    removeMsgListener(msgCode, callback) {
        // Check if this event not exists
        if (this.events[msgCode] === undefined) {
            console.error(`This event: ${event} does not exist`);
            return false;
        }

        this.events[msgCode].listeners = this.events[msgCode].listeners.filter(listener => {
            return listener.toString() !== callback.toString();
        });
    }

    dispatch(msgCode, details) {
        // Check if this event not exists
        console.log('dispatching event:' + msgCode);
        if (this.events[msgCode] === undefined) {
            console.error(`This event: ${msgCode} does not exist`);
            return false;
        }
        this.events[msgCode].listeners.forEach((listenerCallback) => {
            listenerCallback(details);
        });
    }

    sendON() {
        console.log('sending ON');
        if (this.socket.readyState === this.socket.OPEN) {

            this.socket.send(JSON.stringify({
                msgCode: "TurnOnMessage",
                data: new Date().toLocaleDateString()
            }));
        }
    }

    sendOFF() {
        console.log('sending OFF');
        if (this.socket.readyState === this.socket.OPEN) {

            this.socket.send(JSON.stringify({
                msgCode: "TurnOffMessage",
                data: new Date().toLocaleDateString()
            }));
        }
    }
}


