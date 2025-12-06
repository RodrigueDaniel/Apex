"use client";
import React, { useEffect, useState, memo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area 
} from 'recharts';
import { Socket } from 'socket.io-client';
import socket from '../lib/socket'; 

const MAX_DATA_POINTS = 50; 
const typedSocket = socket as Socket;

interface ChartData {
    time: string;
    price: number;
}

const StockChart = ({ symbol }: { symbol: string }) => { 
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!symbol) return; 

        if (!typedSocket.connected) {
            typedSocket.connect();
        }

        const subscribeToTicker = () => {
             typedSocket.emit('subscribe', symbol);
        };
        
        subscribeToTicker();
        typedSocket.on('connect', subscribeToTicker);

        const handlePriceUpdate = (data: any) => {
            if (data.symbol === symbol) {
                setLoading(false); 

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

        typedSocket.on('price-update', handlePriceUpdate);

        return () => {
            typedSocket.off('price-update', handlePriceUpdate);
            typedSocket.off('connect', subscribeToTicker);
        };
    }, [symbol]); 

    // Custom Tooltip for the Dark Theme
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0B0E14] border border-white/10 p-3 rounded-lg shadow-xl">
                    <p className="text-gray-400 text-xs mb-1">{label}</p>
                    <p className="text-purple-400 font-bold font-mono text-lg">
                        ${payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <div className="h-[400px] w-full flex items-center justify-center text-purple-400 animate-pulse">
            Connecting to live feed...
        </div>
    );

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    {/* Dark/Subtle Grid */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    
                    {/* Axes */}
                    <XAxis 
                        dataKey="time" 
                        stroke="#6b7280" 
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis 
                        domain={['auto', 'auto']}
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickFormatter={(val) => `$${val.toFixed(0)}`}
                        tickLine={false}
                        axisLine={false}
                        width={60}
                    />
                    
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20' }} />
                    
                    {/* The Purple Line */}
                    <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#A855F7" // Purple-500
                        strokeWidth={3} 
                        dot={false} 
                        activeDot={{ r: 6, fill: '#A855F7', stroke: '#fff' }}
                        isAnimationActive={false} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default memo(StockChart);