import React from 'react';
import StockChart from '@/components/StockChart';
import { auth } from '@/lib/auth'; 
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; // Make sure you have lucide-react installed

// Define params type for Next.js 15+ (Promise based) or older versions
interface PageProps {
    params: Promise<{ ticker: string }>;
}

const STOCK_NAMES: Record<string, string> = {
    'GOOG': 'Alphabet Inc.', 'TSLA': 'Tesla Inc.', 'AMZN': 'Amazon.com',
    'META': 'Meta Platforms', 'NVDA': 'NVIDIA Corp.', 'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corp.', 'AMD': 'Adv. Micro Devices',
    'NFLX': 'Netflix Inc.', 'INTC': 'Intel Corp.'
};

export default async function StockDetailPage({ params }: PageProps) {
    // 1. Verify User Session
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect('/sign-in');

    // 2. Resolve Params (Next.js 15 requirement)
    const resolvedParams = await params;
    const ticker = resolvedParams.ticker;
    const fullName = STOCK_NAMES[ticker] || ticker;

    return (
        <div className="min-h-screen p-8 bg-[#0B0E14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            
            {/* Back Button */}
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </Link>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-end gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-2xl font-bold text-purple-400 border border-white/10">
                        {ticker[0]}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">{ticker}</h1>
                        <p className="text-gray-400 text-lg">{fullName}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                         <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-green-400 font-mono text-sm">LIVE FEED</span>
                    </div>
                </div>

                {/* The Graph Card */}
                <div className="p-8 bg-[#13131F] rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <StockChart symbol={ticker} />
                    </div>
                </div>
            </div>
        </div>
    );
}