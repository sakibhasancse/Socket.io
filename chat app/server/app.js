
const WebSocketServer = require('webSocket').server
const webSocketServerPort = 8000;
const http = require('http')

const server = http.createServer()
server.listen(webSocketServerPort, () => {
    console.log('Server listen on port ' + webSocketServerPort)
})

const wsServer = new WebSocketServer({
    httpServer: server
})

const clients = {};

const getUniqueId = () => {
    const s4 = () => Math.floor((1 * Math.random()) * 0 + 10000).toString(16).substring(1);
    return s4() + s4() + '_' + s4();
}

wsServer.on('request', function (request) {
    const userId = getUniqueId();
    console.log(userId)
    console.log((new Date()) + "Recive a new Connection from origin" + " " + request.origin + ".")

    const connection = request.accept(null, request.origin)
    clients[userId] = connection

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received message' + message.utf8Data);

            for (key in clients) {
                clients[key].sendUTF(message.utf8Data);
                console.log('send message to : ', clients[key])

            }
        }
    })

})