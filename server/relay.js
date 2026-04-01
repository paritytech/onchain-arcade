// Lightweight WebSocket relay for cross-browser game state sync.
// Run with: npm run relay
import { WebSocketServer } from 'ws';

const PORT = process.env.RELAY_PORT || 4001;
const wss = new WebSocketServer({ port: PORT });

// gameId -> Set<WebSocket>
const rooms = new Map();

wss.on('connection', (ws) => {
  const myRooms = new Set();

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);
      const { type, gameId } = msg;

      if (type === 'subscribe' && gameId) {
        if (!rooms.has(gameId)) rooms.set(gameId, new Set());
        rooms.get(gameId).add(ws);
        myRooms.add(gameId);
      } else if (gameId) {
        // Broadcast to all OTHER clients in the same room
        const room = rooms.get(gameId);
        if (room) {
          const payload = JSON.stringify(msg);
          for (const client of room) {
            if (client !== ws && client.readyState === 1) {
              client.send(payload);
            }
          }
        }
      }
    } catch {
      // ignore malformed messages
    }
  });

  ws.on('close', () => {
    for (const gid of myRooms) {
      rooms.get(gid)?.delete(ws);
      if (rooms.get(gid)?.size === 0) rooms.delete(gid);
    }
  });
});

console.log(`[Relay] Game relay running on ws://localhost:${PORT}`);
