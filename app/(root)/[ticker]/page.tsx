// app/(root)/[ticker]/page.tsx

"use client"; // CRITICAL: This MUST be the first line to bypass the server crash

import StockTickerCard from '@/components/StockTickerCard';
import { useParams } from 'next/navigation'; // Hook to safely read dynamic route params
import { Suspense } from 'react';

const StockDetailPage = () => {
    // 1. Use the useParams hook to safely read the dynamic ticker from the client.
    const params = useParams();
    
    // 2. Safely read the 'ticker' property
    const symbol = typeof params.ticker === 'string' 
                   ? params.ticker.toUpperCase() 
                   : null;

    if (!symbol) {
        // Fallback for initial unresolvable render
        return (
            <div className="min-h-screen p-8 text-center" style={{ backgroundColor: '#111827' }}>
                <div className="text-white pt-20">Invalid stock ticker in URL.</div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen p-8" style={{ backgroundColor: '#111827' }}>
            <h1 className="text-3xl font-bold text-white mb-8">
                {symbol} Live Trading View
            </h1>
            
            {/* The StockTickerCard, containing the line graph, loads here */}
            <Suspense fallback={<div className="text-white">Connecting to live chart...</div>}>
                <StockTickerCard symbol={symbol} />
            </Suspense>
        </div>
    );
};

export default StockDetailPage;