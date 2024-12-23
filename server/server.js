//Test 4 ok
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get local IP address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

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

/*wss.on('connection', socket => {
  console.log('Client connected');

  socket.on('message', message => {
    console.log(`Received: ${message}`);
    socket.send(`Server received: ${message}`);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});*/

let users = []; // Array to track connected users

wss.on('connection', socket => {
    console.log('A user connected');
    //console.log(socket.upgradeReq.connection.remoteAddress);
    // Assign user ID based on odd/even index
    const userId = users.length % 2 === 0 ? 'A' : 'B';
    // Assign user ID (User A or User B)
    //const userId = users.length === 0 ? 'A' : 'B';
    socket.send(JSON.stringify({ userId })); // Send user ID to the connected user
    users.push(socket);

    socket.on('message', function incoming(message) {
        console.log(`Received message: ${message}`);

        // Ensure message is forwarded as a JSON string
        try {
            const parsedMessage = JSON.parse(message);

            // Broadcast the message to all other connected users
            users.forEach((user) => {
                if (user !== socket && user.readyState === WebSocket.OPEN) {
                    user.send(JSON.stringify(parsedMessage)); // Send back JSON
                }
            });
        } catch (err) {
            console.error("Error parsing message:", err);
        }
    });

    socket.on('close', () => {
        console.log('A user disconnected');
        users = users.filter(user => user !== wss); // Remove the disconnected user
    });
});

// Start the HTTP server
const PORT = process.env.PORT1 || 3000;
server.listen(PORT, () => {
  const localIp = getLocalIp();
  console.log(`Server is running on http://${localIp}:${PORT}`);
  console.log(`WebSocket server is running on ws://${localIp}:${PORT}`);
});


