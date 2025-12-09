import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { db } from "@/lib/db"; 
import WatchlistCard from '@/components/WatchlistCard';
import Image from "next/image";
import MarketMarquee from "@/components/MarketMarquee";
import LiveNewsFeed from "@/components/LiveNewsFeed";
import { TrendingUp } from 'lucide-react'; 

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect('/sign-in');

    const subscriptions = await db.watchlist.findMany({
        where: { userId: session.user.id },
        select: { symbol: true }
    });
    
    const myStocks = subscriptions.map(sub => sub.symbol);

    return (
        <div className="min-h-screen w-full bg-[#0B0E14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
            
            {/* Ticker Tape */}
            <MarketMarquee />

            <div className="max-w-7xl mx-auto p-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">
                            Welcome back, <span className="text-purple-400">{session.user.name}</span>.
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    <div className="flex-1">
                        
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                                Your Watchlist
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs border border-white/10">
                                {myStocks.length} Assets
                            </span>
                        </div>

                        {myStocks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myStocks.map((symbol) => (
                                    <WatchlistCard key={symbol} symbol={symbol} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 border border-gray-800 rounded-2xl bg-white/5">
                                <div className="mb-6">
                                     <Image src="/assets/images/stock.png" alt="Empty" width={64} height={64} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">No stocks watched yet</h3>
                                <Link 
                                    href="/market"
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-sm"
                                >
                                    Browse Explore
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-80 flex flex-col">

                        <LiveNewsFeed />
                    </div>

                </div>

            </div>
        </div>
    );
}