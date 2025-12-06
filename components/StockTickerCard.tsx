"use client";
import React, { useEffect, useState, memo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps 
} from 'recharts';
// Assuming 'socket' is an instance of Socket from 'socket.io-client'
import socket from '../lib/socket'; 

// --- Types & Interfaces ---

interface StockTickerCardProps {
  symbol: string;
}

interface PriceUpdatePayload {
  symbol: string;
  price: number;
}

interface ChartDataPoint {
  time: string;
  price: number;
}

// Type for the static constant map
const STOCK_NAMES: Record<string, string> = {
    'GOOG': 'Google Inc.',
    'TSLA': 'Tesla Inc.',
    'AMZN': 'Amazon.com',
    'META': 'Meta Platforms',
    'NVDA': 'NVIDIA Corp.',
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corp.',
    'AMD': 'Advance Micro Devices',
    'NFLX': 'Netflix Inc.',
    'INTC': 'Intel Corp.'
};

const MAX_DATA_POINTS = 30; 

function StockTickerCard({ symbol }: StockTickerCardProps) { 
    // Explicitly type the state
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        if (!symbol) return; 
        
        // 1. Connection Check
        if (!socket.connected) {
            console.log('[FE] Socket singleton disconnected, connecting...');
            socket.connect();
        }

        // 2. Subscription Logic
        const subscribeToTicker = () => {
             console.log(`[FE] Subscribing to ${symbol}...`);
             socket.emit('subscribe', symbol);
        };
        
        // Trigger immediately
        subscribeToTicker();
        
        // Re-subscribe if the connection drops and comes back
        socket.on('connect', subscribeToTicker);

        // 3. Data Listener with typed payload
        const handlePriceUpdate = (data: PriceUpdatePayload) => {
            if (data.symbol === symbol) {
                setCurrentPrice(data.price); 
                setLoading(false); 

                setChartData(prevData => {
                    const newEntry: ChartDataPoint = {
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

        // 4. Cleanup
        return () => {
            socket.off('price-update', handlePriceUpdate);
            socket.off('connect', subscribeToTicker);
        };
    }, [symbol]); 

    // --- Formatters with Types ---
    
    const formatPrice = (price: number | null): string => 
        price ? `$${price.toFixed(2)}` : 'Loading...';
    
    // Recharts tooltip formatter type signature
    const formatTooltip = (value: number): [string, string] => 
        [`$${value.toFixed(2)}`, 'Price'];

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
                                dataKey="time" 
                                stroke="#999" 
                                interval="preserveStartEnd" 
                                tickLine={false} 
                                axisLine={false} 
                                minTickGap={50}
                                tickFormatter={(time: string) => time.slice(0, 5)}
                            />
                            <YAxis 
                                stroke="#999" 
                                domain={['dataMin - 1', 'dataMax + 1']}
                                tickFormatter={(value: number) => `$${value.toFixed(0)}`}
                                axisLine={false} 
                                tickLine={false}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #444', color: 'white' }} 
                                formatter={formatTooltip as any} // Cast to any often required due to strict Recharts types vs simple function
                            />
                            <Line 
                                type="monotone" 
                                dataKey="price" 
                                stroke="#00B7FF" 
                                strokeWidth={2} 
                                dot={false} 
                                isAnimationActive={false} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

export default memo(StockTickerCard);