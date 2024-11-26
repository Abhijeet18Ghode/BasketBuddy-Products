import { Server } from 'ws';
import mongoose from 'mongoose';

let wss;

const handler = (req, res) => {
  if (req.method === 'GET') {
    if (!wss) {
      const server = new Server({ noServer: true });

      server.on('connection', (socket) => {
        socket.on('message', (message) => {
          console.log('Received:', message);
        });
      });

      res.socket.server.on('upgrade', (request, socket, head) => {
        server.handleUpgrade(request, socket, head, (socket) => {
          server.emit('connection', socket, request);
        });
      });

      wss = server;

      // MongoDB connection
      mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

      const db = mongoose.connection;
      db.once('open', () => {
        const changeStream = db.collection('products').watch();
        changeStream.on('change', (change) => {
          wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
              client.send(JSON.stringify(change));
            }
          });
        });
      });
    }
    res.end();
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
