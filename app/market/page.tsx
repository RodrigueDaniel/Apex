import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db"; 
import MarketCard from '@/components/MarketCard';
import StockStatsHover from '@/components/StockStatsHover';

const ALL_STOCKS = [
    'GOOG', 'TSLA', 'AMZN', 'META', 'NVDA', 
    'AAPL', 'MSFT', 'AMD', 'NFLX', 'INTC'
];

const STOCK_STATS: Record<string, { label: string; value: string }[]> = {
    'GOOG': [
        { label: 'Market Cap', value: '1.82T' },
        { label: 'Volume', value: '24.5M' },
        { label: 'P/E Ratio', value: '28.4' },
        { label: '52W High', value: '$176.4' },
    ],
    'TSLA': [
        { label: 'Market Cap', value: '580.3B' },
        { label: 'Volume', value: '98.2M' },
        { label: 'P/E Ratio', value: '42.1' },
        { label: '52W High', value: '$299.2' },
    ],
    'AMZN': [
        { label: 'Market Cap', value: '1.85T' },
        { label: 'Volume', value: '32.1M' },
        { label: 'P/E Ratio', value: '61.2' },
        { label: '52W High', value: '$180.1' },
    ],
    'META': [
        { label: 'Market Cap', value: '1.25T' },
        { label: 'Volume', value: '18.4M' },
        { label: 'P/E Ratio', value: '34.8' },
        { label: '52W High', value: '$531.4' },
    ],
    'NVDA': [
        { label: 'Market Cap', value: '2.21T' },
        { label: 'Volume', value: '45.6M' },
        { label: 'P/E Ratio', value: '74.5' },
        { label: '52W High', value: '$974.0' },
    ],
    'AAPL': [
        { label: 'Market Cap', value: '2.65T' },
        { label: 'Volume', value: '52.3M' },
        { label: 'P/E Ratio', value: '26.8' },
        { label: '52W High', value: '$198.5' },
    ],
    'MSFT': [
        { label: 'Market Cap', value: '3.12T' },
        { label: 'Volume', value: '21.8M' },
        { label: 'P/E Ratio', value: '36.2' },
        { label: '52W High', value: '$430.8' },
    ],
    'AMD': [
        { label: 'Market Cap', value: '285.4B' },
        { label: 'Volume', value: '65.4M' },
        { label: 'P/E Ratio', value: '320.5' },
        { label: '52W High', value: '$227.3' },
    ],
    'NFLX': [
        { label: 'Market Cap', value: '260.1B' },
        { label: 'Volume', value: '4.2M' },
        { label: 'P/E Ratio', value: '48.9' },
        { label: '52W High', value: '$638.5' },
    ],
    'INTC': [
        { label: 'Market Cap', value: '182.5B' },
        { label: 'Volume', value: '38.9M' },
        { label: 'P/E Ratio', value: '98.2' },
        { label: '52W High', value: '$51.2' },
    ]
};

const DEFAULT_STATS = [
    { label: 'Market Cap', value: '---' },
    { label: 'Volume', value: '---' },
    { label: 'P/E Ratio', value: '---' },
    { label: '52W High', value: '---' },
];

export default async function MarketPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect('/sign-in');

    const subscriptions = await db.watchlist.findMany({
        where: { userId: session.user.id },
        select: { symbol: true }
    });
    
    const subscribedSymbols = subscriptions.map(sub => sub.symbol);

    return (
        <div className="min-h-screen w-full p-6 bg-[#0B0E14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-white">
            <div className="max-w-7xl mx-auto">
                
                {/* Page Title */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Explore</h1>
                        <p className="text-gray-400 mt-1">Discover and subscribe to stocks.</p>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ALL_STOCKS.map((symbol) => {
                        const stats = STOCK_STATS[symbol] || DEFAULT_STATS;

                        return (
                            <StockStatsHover key={symbol} stats={stats}>
                                <MarketCard 
                                    symbol={symbol} 
                                    initialStarred={subscribedSymbols.includes(symbol)}
                                />
                            </StockStatsHover>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}