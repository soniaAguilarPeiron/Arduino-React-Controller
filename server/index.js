const WebSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.write('<html>');
    response.write('<body>');
    response.write('<h1>Hello, from server!</h1>');
    response.write('</body>');
    response.write('</html>');
    response.end();
});

const led = {isOn: false};
server.listen(8090, function () {
    console.log((new Date()) + ' Server is listening on port 8090');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    return true;
}

wsServer.on('request', function (request) {

    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    const connection = request.accept('echo-protocol', request.origin);

    console.log((new Date()) + ' Connection accepted.');

    connection.connected && connection.send(JSON.stringify({
        msgCode: "turnedOnLed",
        from: connection.remoteAddress
    }));

    connection
        .on('message', function (message) {
            const msg = JSON.parse(message.utf8Data);
            console.log('connections: ' + wsServer.connections
                .filter(
                    (client) => client.connected)
                .length);


            if (message.type === 'utf8') {
                if (msg.msgCode === 'TurnOnMessage') {
                    turnOnArduino();
                    led.isOn = true;
                    console.log('Received Message: ' + message.utf8Data);
                    wsServer.connections && wsServer.connections.forEach(function (client) {
                        client.connected && client.send(JSON.stringify({
                            msgCode: "turnedOnLed",
                            from: connection.remoteAddress
                        }));
                    });
                } else if (msg.msgCode === 'TurnOffMessage') {
                    turnOffArduino();
                    console.log('Received Message: ' + message.utf8Data);
                    wsServer.connections && wsServer.connections.forEach(function (client) {
                        client.connected && client.send(JSON.stringify({
                            msgCode: "turnedOffLed",
                            from: connection.remoteAddress
                        }));
                    });
                }
            }
        });

    connection
        .on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
});

const turnOnArduino = function() {
    http.get('http://192.168.1.166:8083/LED=ON', (resp) => {

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
};

const turnOffArduino = function() {
    http.get('http://192.168.1.166:8083/LED=OFF', (resp) => {

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
};