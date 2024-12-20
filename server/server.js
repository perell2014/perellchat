//test 2
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const portUU = process.env.PORT1 || 3000;

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Serve the HTML file
    const htmlFilePath = path.join(__dirname, 'index.html');
    fs.readFile(htmlFilePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', socket => {
  console.log('Client connected');

  socket.on('message', message => {
    console.log(`Received: ${message}`);
    socket.send(`Server received: ${message}`);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the HTTP server
const PORT = process.env.PORT1 || 3000;
server.listen(PORT, () => {
  const localIp = getLocalIp();
  console.log(`Server is running on http://${localIp}:${PORT}`);
  console.log(`WebSocket server is running on ws://${localIp}:${PORT}`);
});

/*
//test
const express = require('express')
const app = express()
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})*/

// server.js
/*
const portUU = process.env.PORT1 || 3000;

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: portUU });

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
*/
console.log(`Example server listening on port ${portUU}`)
//console.log('WebSocket server started on ws://localhost:8080');

