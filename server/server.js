// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

let users = []; // Array to track connected users

wss.on('connection', function connection(ws) {
    console.log('A user connected');
    console.log(ws.upgradeReq.connection.remoteAddress);
    // Assign user ID (User A or User B)
    const userId = users.length === 0 ? 'A' : 'B';
    ws.send(JSON.stringify({ userId })); // Send user ID to the connected user
    users.push(ws);

    ws.on('message', function incoming(message) {
        console.log(`Received message: ${message}`);

        // Ensure message is forwarded as a JSON string
        try {
            const parsedMessage = JSON.parse(message);

            // Broadcast the message to all other connected users
            users.forEach((user) => {
                if (user !== ws && user.readyState === WebSocket.OPEN) {
                    user.send(JSON.stringify(parsedMessage)); // Send back JSON
                }
            });
        } catch (err) {
            console.error("Error parsing message:", err);
        }
    });

    ws.on('close', () => {
        console.log('A user disconnected');
        users = users.filter(user => user !== ws); // Remove the disconnected user
    });
});
console.log('Altered: 3000');
console.log('WebSocket server started on ws://localhost:8080');
