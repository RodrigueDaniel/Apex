"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client'; 
import socket from '../lib/socket';

const STOCK_NAMES: { [key: string]: string } = {
    'GOOG': 'Alphabet Inc.', 'TSLA': 'Tesla Inc.', 'AMZN': 'Amazon.com',
    'META': 'Meta Platforms', 'NVDA': 'NVIDIA Corp.', 'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corp.', 'AMD': 'Adv. Micro Devices',
    'NFLX': 'Netflix Inc.', 'INTC': 'Intel Corp.'
};

const typedSocket = socket as Socket;

const WatchlistCard = ({ symbol }: { symbol: string }) => {
    const router = useRouter();
    const [price, setPrice] = useState<number | null>(null);
    const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');

    useEffect(() => {
        if (!symbol) return;
        if (!typedSocket.connected) typedSocket.connect();
        
        const subscribeToTicker = () => {
             if (typedSocket.connected) typedSocket.emit('subscribe', symbol);
        };

        const handlePriceUpdate = (data: any) => {
            if (data.symbol === symbol) {
                setPrice((current) => {
                    if (current && data.price > current) setTrend('up');
                    else if (current && data.price < current) setTrend('down');
                    return data.price;
                });
            }
        };

        typedSocket.on('connect', subscribeToTicker);
        if (typedSocket.connected) subscribeToTicker();
        typedSocket.on('price-update', handlePriceUpdate);

        return () => {
            typedSocket.off('price-update', handlePriceUpdate);
            typedSocket.off('connect', subscribeToTicker);
        };
    }, [symbol]);

    const formatPrice = (p: number | null) => p ? `$${p.toFixed(2)}` : '---';

    return (
        <div 
            onClick={() => router.push(`/${symbol}`)} 
            className="group relative p-6 bg-[#13131F] rounded-2xl border border-white/5 
                       hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] 
                       transition-all duration-300 cursor-pointer overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-600/20 transition-all duration-500"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-purple-300">
                            {symbol[0]}
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-wide">{symbol}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 pl-10">{STOCK_NAMES[symbol]}</p>
                </div>
                
                <div className={`px-2 py-1 rounded-md text-xs font-medium border ${
                    trend === 'up' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : trend === 'down' 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}>
                    {trend === 'up' ? '+2.4%' : trend === 'down' ? '-1.2%' : '0.0%'}
                </div>
            </div>

            <div className="mt-6 relative z-10">
                <p className="text-xs text-gray-400 mb-1">Current Price</p>
                <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-mono font-bold tracking-tight transition-colors duration-300
                        ${trend === 'up' ? 'text-white' : trend === 'down' ? 'text-white' : 'text-white'}
                    `}>
                        {formatPrice(price)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default WatchlistCard;