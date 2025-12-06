'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, RefreshCw } from 'lucide-react';

// A large pool of news to cycle through
const NEWS_DATABASE = [
    { source: "Bloomberg", headline: "Fed signals potential rate cuts coming in late Q3" },
    { source: "TechCrunch", headline: "AI Chip demand continues to outpace global supply chain" },
    { source: "Reuters", headline: "Oil prices stabilize amidst ongoing global uncertainty" },
    { source: "CNBC", headline: "Tech sector rallies as inflation data comes in lower than expected" },
    { source: "WSJ", headline: "Major banks tighten lending standards for commercial real estate" },
    { source: "Financial Times", headline: "European markets open higher following Asian trading session" },
    { source: "Coindesk", headline: "Bitcoin tests key resistance level as institutional volume surges" },
    { source: "MarketWatch", headline: "Retail spending shows unexpected resilience in latest report" },
    { source: "The Verge", headline: "New battery technology could revolutionize EV range anxiety" },
    { source: "Forbes", headline: "Startup funding hits 18-month low as VCs become cautious" },
    { source: "Barron's", headline: "Analysts upgrade semiconductor outlook for next fiscal year" },
    { source: "Yahoo Finance", headline: "Bond yields slip as investors seek safety in treasuries" },
    { source: "Business Insider", headline: "Remote work trends shifting as companies mandate office returns" },
    { source: "Politico", headline: "New regulatory framework for digital assets proposed by committee" },
    { source: "Fox Business", headline: "Housing market inventory remains at historic lows" }
];

export default function LiveNewsFeed() {
    const [news, setNews] = useState(NEWS_DATABASE.slice(0, 3));
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        // Function to shuffle and pick 5 new items
        const updateNews = () => {
            setIsUpdating(true);
            
            // Artificial delay to show the "refresh" animation
            setTimeout(() => {
                const shuffled = [...NEWS_DATABASE].sort(() => 0.5 - Math.random());
                setNews(shuffled.slice(0, 5));
                setIsUpdating(false);
            }, 500);
        };

        // Set the timer for 5 minutes (300,000 ms)
        const interval = setInterval(updateNews, 300000);

        // Cleanup timer when user leaves page
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-5 rounded-2xl border border-white/10 bg-[#13131F]/50 backdrop-blur-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Newspaper className="w-4 h-4" /> Market News
                </h4>
                {/* Visual indicator that it is "Live" */}
                <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
                     <span className="text-[10px] text-gray-500 font-mono">LIVE</span>
                </div>
            </div>

            <div className={`space-y-6 transition-opacity duration-500 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
                {news.map((item, i) => (
                    <div key={i} className="group cursor-pointer border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        <div className="mb-2">
                            <span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">
                                {item.source}
                            </span>
                        </div>
                        <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-relaxed font-medium">
                            {item.headline}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}