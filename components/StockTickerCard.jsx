"use client";
import React, { useEffect, useState, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// 1. IMPORT THE SINGLETON (Make sure lib/socket.js exists!)
import socket from '../lib/socket'; 

const MAX_DATA_POINTS = 30; 

const STOCK_NAMES = {
    'GOOG': 'Google',
    'TSLA': 'Tesla',
    'AMZN': 'Amazon',
    'META': 'Meta Platforms',
    'NVDA': 'Nvidia'
};

function StockTickerCard({ symbol }) { 
    const [chartData, setChartData] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!symbol) return; 
        
        // 2. CONNECTION CHECK: Ensure the singleton is active
        if (!socket.connected) {
            console.log('[FE] Socket singleton disconnected, connecting...');
            socket.connect();
        }

        // 3. SUBSCRIPTION LOGIC
        const subscribeToTicker = () => {
             console.log(`[FE] Subscribing to ${symbol}...`);
             socket.emit('subscribe', symbol);
        };
        
        // Trigger immediately
        subscribeToTicker();
        
        // Re-subscribe if the connection drops and comes back
        socket.on('connect', subscribeToTicker);

        // 4. DATA LISTENER
        const handlePriceUpdate = (data) => {
            if (data.symbol === symbol) {
                setCurrentPrice(data.price); 
                setLoading(false); // <--- Hides the "Loading..." text

                setChartData(prevData => {
                    const newEntry = {
                        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                        price: data.price
                    };
                    const updatedData = [...prevData, newEntry];
                    if (updatedData.length > MAX_DATA_POINTS) {
                        updatedData.shift(); 
                    }
                    return updatedData;
                });
            }
        };

        socket.on('price-update', handlePriceUpdate);

        // 5. CLEANUP
        return () => {
            // Remove listeners so we don't update state on unmounted component
            socket.off('price-update', handlePriceUpdate);
            socket.off('connect', subscribeToTicker);
            
            // NOTE: We do NOT emit 'unsubscribe' here to avoid the flash-disconnect issue.
            // The server room logic handles standard disconnects.
        };
    }, [symbol]); 

    // Formatters
    const formatPrice = (price) => price ? `$${price.toFixed(2)}` : 'Loading...';
    const formatTooltip = (value) => [`$${value.toFixed(2)}`, 'Price'];

    return (
        <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-white">{symbol}</h2>
                    <p className="text-sm text-gray-400">{STOCK_NAMES[symbol]}</p>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-bold" style={{ color: '#2DFF34' }}>
                        {formatPrice(currentPrice)}
                    </p>
                </div>
            </div>

            <div style={{ height: '400px', width: '100%' }}>
                {loading || chartData.length < 2 ? (
                    <div className="text-center text-gray-400 pt-20">
                        {loading ? 'Connecting to live stream...' : 'Awaiting first data points...'}
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 2, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis 
                                dataKey="time" stroke="#999" 
                                interval="preserveStartEnd" tickLine={false} axisLine={false} minTickGap={50}
                                tickFormatter={(time) => time.slice(0, 5)}
                            />
                            <YAxis 
                                stroke="#999" domain={['dataMin - 1', 'dataMax + 1']}
                                tickFormatter={(value) => `$${value.toFixed(0)}`}
                                axisLine={false} tickLine={false}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #444', color: 'white' }} 
                                formatter={formatTooltip} 
                            />
                            <Line 
                                type="monotone" dataKey="price" stroke="#00B7FF" 
                                strokeWidth={2} dot={false} isAnimationActive={false} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

export default memo(StockTickerCard);