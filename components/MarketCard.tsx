"use client";
import { useState, useTransition } from 'react';
import { Star } from 'lucide-react';
import { toggleWatchlist } from '@/app/actions/watchlist';

const STOCK_NAMES: { [key: string]: string } = {
    'GOOG': 'Alphabet Inc.', 'TSLA': 'Tesla Inc.', 'AMZN': 'Amazon.com',
    'META': 'Meta Platforms', 'NVDA': 'NVIDIA Corp.', 'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corp.', 'AMD': 'Adv. Micro Devices',
    'NFLX': 'Netflix Inc.', 'INTC': 'Intel Corp.'
};

export default function MarketCard({ symbol, initialStarred }: { symbol: string, initialStarred: boolean }) {
    const [isStarred, setIsStarred] = useState(initialStarred);
    const [isPending, startTransition] = useTransition();

    const handleStarClick = () => {
        setIsStarred(!isStarred);
        
        startTransition(async () => {
            await toggleWatchlist(symbol);
        });
    };

    return (
        <div className="p-5 bg-[#13131F] rounded-xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold text-purple-300">
                    {symbol[0]}
                </div>
                <div>
                    <h3 className="font-bold text-white tracking-wide">{symbol}</h3>
                    <p className="text-xs text-gray-500">{STOCK_NAMES[symbol]}</p>
                </div>
            </div>

            <button 
                onClick={handleStarClick}
                disabled={isPending}
                className={`p-2 rounded-full transition-colors hover:bg-white/10 ${
                    isStarred ? 'text-yellow-400' : 'text-gray-600'
                }`}
            >
                <Star 
                    size={22} 
                    fill={isStarred ? "currentColor" : "none"} 
                    strokeWidth={isStarred ? 0 : 2}
                />
            </button>
        </div>
    );
}