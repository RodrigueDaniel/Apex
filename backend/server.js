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

const SUPPORTED_STOCKS = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA', 'AAPL', 'MSFT', 'AMD', 'NFLX', 'INTC'];
let stocks = {};

SUPPORTED_STOCKS.forEach(symbol => {
    stocks[symbol] = {
        currentPrice: parseFloat((Math.random() * 500 + 100).toFixed(2))
    };
});

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

        io.to(symbol).emit('price-update', updateData);
    });
}, 1000);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('subscribe', (symbol) => {
        if (SUPPORTED_STOCKS.includes(symbol)) {
            socket.join(symbol);
            console.log(`[SUBSCRIPTION] ${socket.id} joined room: ${symbol}`);
            
            
            socket.emit('price-update', {
                symbol: symbol,
                price: stocks[symbol].currentPrice,
                timestamp: new Date().toISOString()
            });
        } else {
            console.log(`[ERROR] Invalid stock subscription: ${symbol}`);
        }
    });

    
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