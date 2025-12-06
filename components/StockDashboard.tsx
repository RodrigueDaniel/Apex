"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StockChart from '@/components/StockChart';
import { ArrowLeft, Activity, DollarSign, BarChart3, TrendingUp } from 'lucide-react';
import { Socket } from 'socket.io-client';
import socket from '@/lib/socket'; 

const typedSocket = socket as Socket;
const MAX_DATA_POINTS = 50;

// --- STATIC DATA CONFIG ---
const STOCK_STATS: Record<string, { label: string; value: string; icon: any }[]> = {
    'GOOG': [
        { label: 'Market Cap', value: '1.82T', icon: DollarSign },
        { label: 'Volume', value: '24.5M', icon: BarChart3 },
        { label: 'P/E Ratio', value: '28.4', icon: Activity },
        { label: '52W High', value: '$176.4', icon: TrendingUp },
    ],
    'TSLA': [
        { label: 'Market Cap', value: '580.3B', icon: DollarSign },
        { label: 'Volume', value: '98.2M', icon: BarChart3 },
        { label: 'P/E Ratio', value: '42.1', icon: Activity },
        { label: '52W High', value: '$299.2', icon: TrendingUp },
    ],
    'AMZN': [
        { label: 'Market Cap', value: '1.85T', icon: DollarSign },
        { label: 'Volume', value: '32.1M', icon: BarChart3 },
        { label: 'P/E Ratio', value: '61.2', icon: Activity },
        { label: '52W High', value: '$180.1', icon: TrendingUp },
    ],
    'META': [
        { label: 'Market Cap', value: '1.25T', icon: DollarSign },
        { label: 'Volume', value: '18.4M', icon: BarChart3 },
        { label: 'P/E Ratio', value: '34.8', icon: Activity },
        { label: '52W High', value: '$531.4', icon: TrendingUp },
    ],
    'NVDA': [
        { label: 'Market Cap', value: '2.21T', icon: DollarSign },
        { label: 'Volume', value: '45.6M', icon: BarChart3 },
        { label: 'P/E Ratio', value: '74.5', icon: Activity },
        { label: '52W High', value: '$974.0', icon: TrendingUp },
    ],
    'AAPL': [
        { label: 'Market Cap', value: '2.65T', icon: DollarSign },
        { label: 'Volume', value: '52.3M', icon: BarChart3 },
        { label: 'P/E Ratio', value: '26.8', icon: Activity },
        { label: '52W High', value: '$198.5', icon: TrendingUp },
    ],
    'MSFT': [
        { label: 'Market Cap', value: '3.12T', icon: DollarSign },
        { label: 'Volume', value: '21.8M', icon: BarChart3 },
        { label: 'P/E Ratio', value: '36.2', icon: Activity },
        { label: '52W High', value: '$430.8', icon: TrendingUp },
    ],
    'AMD': [
        { label: 'Market Cap', value: '285.4B', icon: DollarSign },
        { label: 'Volume', value: '65.4M', icon: BarChart3 },
        { label: 'P/E Ratio', value: '320.5', icon: Activity },
        { label: '52W High', value: '$227.3', icon: TrendingUp },
    ],
    'NFLX': [
        { label: 'Market Cap', value: '260.1B', icon: DollarSign },
        { label: 'Volume', value: '4.2M', icon: BarChart3 },
        { label: 'P/E Ratio', value: '48.9', icon: Activity },
        { label: '52W High', value: '$638.5', icon: TrendingUp },
    ],
    'INTC': [
        { label: 'Market Cap', value: '182.5B', icon: DollarSign },
        { label: 'Volume', value: '38.9M', icon: BarChart3 },
        { label: 'P/E Ratio', value: '98.2', icon: Activity },
        { label: '52W High', value: '$51.2', icon: TrendingUp },
    ]
};

const DEFAULT_STATS = [
    { label: 'Market Cap', value: '---', icon: DollarSign },
    { label: 'Volume', value: '---', icon: BarChart3 },
    { label: 'P/E Ratio', value: '---', icon: Activity },
    { label: '52W High', value: '---', icon: TrendingUp },
];

interface StockDashboardProps {
    ticker: string;
    fullName: string;
}

export default function StockDashboard({ ticker, fullName }: StockDashboardProps) {
    // 1. STATE FOR BOTH PRICE AND CHART
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });

    const currentStats = STOCK_STATS[ticker] || DEFAULT_STATS;

    useEffect(() => {
        if (!typedSocket.connected) typedSocket.connect();

        // Join room
        typedSocket.emit('subscribe', ticker);

        const handleUpdate = (data: any) => {
            if (data.symbol === ticker) {
                setLoading(false);
                const newPrice = data.price;

                // Update Chart Data
                setChartData(prev => {
                    const newEntry = {
                        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                        price: newPrice
                    };
                    const updated = [...prev, newEntry];
                    if (updated.length > MAX_DATA_POINTS) updated.shift();
                    
                    // Calculate quick simulated change based on the first data point received in this session
                    if (prev.length > 0) {
                         const startPrice = prev[0].price;
                         const diff = newPrice - startPrice;
                         const percent = (diff / startPrice) * 100;
                         setPriceChange({ value: diff, percent: percent });
                    }
                    
                    return updated;
                });

                // Update Header Price
                setCurrentPrice(newPrice);
            }
        };

        typedSocket.on('price-update', handleUpdate);

        return () => {
            typedSocket.off('price-update', handleUpdate);
            typedSocket.emit('unsubscribe', ticker);
        };
    }, [ticker]);

    return (
        <div className="min-h-screen p-8 bg-[#0B0E14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* DYNAMIC HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-2xl font-bold text-purple-400 border border-white/10 shadow-lg shadow-purple-500/10">
                            {ticker[0]}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white tracking-tight">{ticker}</h1>
                            <p className="text-gray-400 text-lg font-medium">{fullName}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-3">
                            {/* DYNAMIC PRICE DISPLAY */}
                            <span className="text-4xl font-bold text-white">
                                {loading ? "---" : `$${currentPrice.toFixed(2)}`}
                            </span>
                            {!loading && (
                                <span className={`px-2.5 py-1 rounded-lg border text-sm font-bold ${priceChange.percent >= 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    {priceChange.percent >= 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                             <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Live Feed</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CHART SECTION */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-8 bg-[#13131F] rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                            
                            {/* We pass the live data down to the chart */}
                            <div className="relative z-10 pt-0">
                                <StockChart data={chartData} />
                            </div>
                        </div>
                    </div>

                    {/* STATS SIDEBAR */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-400" />
                            Market Stats
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {currentStats.map((stat) => (
                                <div key={stat.label} className="group p-5 bg-[#13131F] rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                                            <p className="text-2xl font-bold text-white group-hover:text-purple-100 transition-colors">{stat.value}</p>
                                        </div>
                                        <div className="p-2 rounded-xl bg-white/5 text-gray-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                                            {/* Render Icon */}
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* <button className="w-full mt-4 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                            Trade {ticker}
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}