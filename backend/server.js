const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// --- Core Data ---
const SUPPORTED_STOCKS = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA', 'AAPL', 'MSFT', 'AMD', 'NFLX', 'INTC'];
let stocks = {};

// Initialize prices
SUPPORTED_STOCKS.forEach(symbol => {
    stocks[symbol] = {
        currentPrice: parseFloat((Math.random() * 500 + 100).toFixed(2))
    };
});

// --- Real-Time Engine ---
setInterval(() => {
    SUPPORTED_STOCKS.forEach(symbol => {
        const volatility = 4.00;
        const change = (Math.random() * volatility) - (volatility / 2);
        let newPrice = stocks[symbol].currentPrice + change;
        if (newPrice < 1) newPrice = 1;
        
        stocks[symbol].currentPrice = parseFloat(newPrice.toFixed(2));

        const updateData = {
            symbol: symbol,
            price: stocks[symbol].currentPrice,
            timestamp: new Date().toISOString()
        };

        // Emit to the specific Room
        io.to(symbol).emit('price-update', updateData);
    });
}, 1000);

// --- Connection Logic ---
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // --- FIX 1: Restore the specific 'subscribe' handler for the React App ---
    socket.on('subscribe', (symbol) => {
        if (SUPPORTED_STOCKS.includes(symbol)) {
            socket.join(symbol);
            console.log(`[SUBSCRIPTION] ${socket.id} joined room: ${symbol}`);
            
            // Emit immediate data so chart doesn't wait 1 second
            socket.emit('price-update', {
                symbol: symbol,
                price: stocks[symbol].currentPrice,
                timestamp: new Date().toISOString()
            });
        } else {
            console.log(`[ERROR] Invalid stock subscription: ${symbol}`);
        }
    });

    // --- FIX 2: Keep the 'message' handler ONLY if you still want to use Postman ---
    socket.on('message', (message) => {
        try {
            let eventName, symbol;
            if (typeof message === 'string') {
                [eventName, symbol] = JSON.parse(message);
            } else if (Array.isArray(message)) {
                [eventName, symbol] = message;
            }
            
            if (eventName === 'subscribe' && SUPPORTED_STOCKS.includes(symbol)) {
                socket.join(symbol);
                console.log(`[POSTMAN SUB] ${socket.id} joined room: ${symbol}`);
            }
        } catch (e) { /* Ignore malformed messages */ }
    });

    socket.on('unsubscribe', (symbol) => {
        socket.leave(symbol);
        console.log(`[UNSUBSCRIBE] ${socket.id} left room: ${symbol}`);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Socket Server running on http://localhost:${PORT}`);
});