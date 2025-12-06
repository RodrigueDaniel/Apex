"use client";
import React from 'react';
import { 
  TrendingUp, 
  Activity, 
  DollarSign, 
  BarChart3
} from 'lucide-react'; 

interface StatItem {
    label: string;
    value: string;
}

interface StockStatsHoverProps {
    children: React.ReactNode;
    stats: StatItem[];
}

export default function StockStatsHover({ children, stats }: StockStatsHoverProps) {
    
    // Helper to render icons based on label (since we can't pass icon functions from server)
    const getIcon = (label: string) => {
        if (label.includes('Market Cap')) return <DollarSign className="w-4 h-4 text-purple-400" />;
        if (label.includes('Volume')) return <BarChart3 className="w-4 h-4 text-blue-400" />;
        if (label.includes('P/E')) return <Activity className="w-4 h-4 text-orange-400" />;
        return <TrendingUp className="w-4 h-4 text-green-400" />;
    };

    return (
        <div className="relative group">
            {/* The Actual Market Card */}
            <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                {children}
            </div>

            {/* The Hover Popup */}
            <div className="absolute inset-x-0 bottom-full mb-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                <div className="bg-[#13131F]/95 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    
                    <div className="space-y-3">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex items-center justify-between gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    {getIcon(stat.label)}
                                    <span>{stat.label}</span>
                                </div>
                                <span className="font-bold text-white font-mono">{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Little Triangle Arrow at bottom */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#13131F] border-r border-b border-white/10 rotate-45 transform"></div>
                </div>
            </div>
        </div>
    );
}