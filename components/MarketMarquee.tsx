'use client';

import React from 'react';

const TICKER_DATA = [
  { symbol: 'SPY', price: '478.20', change: '+1.2%', up: true },
  { symbol: 'QQQ', price: '408.15', change: '+1.5%', up: true },
  { symbol: 'BTC', price: '64,230', change: '-0.8%', up: false },
  { symbol: 'ETH', price: '3,450', change: '-1.2%', up: false },
  { symbol: 'NVDA', price: '890.50', change: '+2.4%', up: true },
  { symbol: 'AAPL', price: '178.30', change: '+0.5%', up: true },
  { symbol: 'TSLA', price: '175.40', change: '-2.1%', up: false },
  { symbol: 'AMD', price: '180.20', change: '+3.1%', up: true },
];

export default function MarketMarquee() {
  return (
    <div className="w-full bg-white/5 border-y border-white/5 overflow-hidden py-2 relative">
      
      {/* The scrolling container */}
      <div className="flex animate-marquee whitespace-nowrap gap-12">
        {[...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-medium font-mono">
            <span className="text-gray-400">{item.symbol}</span>
            <span className="text-white">${item.price}</span>
            <span className={item.up ? 'text-green-400' : 'text-red-400'}>
              {item.change}
            </span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        /* Pause animation on hover so users can read */
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}