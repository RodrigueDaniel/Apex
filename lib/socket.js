// lib/socket.js
import { io } from 'socket.io-client';

// Use a global variable to store the socket instance during development
let socket;

if (!socket) {
  socket = io('http://127.0.0.1:4000', {
    transports: ['websocket'], // Force WebSocket to avoid polling issues
    reconnection: true,
  });
}

export default socket;