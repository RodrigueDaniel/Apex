import React from 'react';
import StockDashboard from '@/components/StockDashboard'; // Import the new component
import { auth } from '@/lib/auth'; 
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

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
    // 1. Session Check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect('/sign-in');

    // 2. Data Resolution
    const resolvedParams = await params;
    const ticker = resolvedParams.ticker;
    const fullName = STOCK_NAMES[ticker] || ticker;

    // 3. Render the Dashboard (Client Component)
    return (
        <StockDashboard 
            ticker={ticker} 
            fullName={fullName} 
        />
    );
}