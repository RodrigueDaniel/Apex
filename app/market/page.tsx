import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db"; 
import MarketCard from '@/components/MarketCard';

const ALL_STOCKS = [
    'GOOG', 'TSLA', 'AMZN', 'META', 'NVDA', 
    'AAPL', 'MSFT', 'AMD', 'NFLX', 'INTC'
];

export default async function MarketPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect('/sign-in');

    // Fetch existing subscriptions to show correct Star state
    const subscriptions = await db.watchlist.findMany({
        where: { userId: session.user.id },
        select: { symbol: true }
    });
    
    const subscribedSymbols = subscriptions.map(sub => sub.symbol);

    return (
        // Added the matching background gradient here
        <div className="min-h-screen w-full p-6 bg-[#0B0E14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-white">
            <div className="max-w-7xl mx-auto">
                
                {/* Page Title */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Market Place</h1>
                        <p className="text-gray-400 mt-1">Discover and subscribe to stocks.</p>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ALL_STOCKS.map((symbol) => (
                        <MarketCard 
                            key={symbol} 
                            symbol={symbol} 
                            initialStarred={subscribedSymbols.includes(symbol)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}