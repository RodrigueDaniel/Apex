// import { io, Socket } from 'socket.io-client';

// // 1. Extend the global interface so TypeScript knows about our custom 'socket' property
// declare global {
//   // eslint-disable-next-line no-var
//   var socket: Socket | undefined;
// }

// // 2. Variable to hold the singleton instance
// let socket: Socket;

// // 3. Singleton Logic
// if (process.env.NODE_ENV === 'production') {
//   socket = io('http://127.0.0.1:4000', {
//     transports: ['websocket'],
//     reconnection: true,
//   });
// } else {
//   // FIX: Use globalThis instead of global
//   if (!globalThis.socket) {
//     globalThis.socket = io('http://127.0.0.1:4000', {
//       transports: ['websocket'],
//       reconnection: true,
//     });
//   }
//   socket = globalThis.socket;
// }

// export default socket;

// lib/socket.ts
import { io } from "socket.io-client";

// Ensure this matches the port in your server.js (4000)
const URL = "http://localhost:4000";

const socket = io(URL, { 
    autoConnect: false, // We connect manually in the useEffect
    transports: ["websocket"] // Improves performance
});

export default socket;