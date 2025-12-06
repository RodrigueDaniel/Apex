// import { auth } from "@/lib/auth"; 
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import Link from 'next/link';
// import { db } from "@/lib/db"; 
// import WatchlistCard from '@/components/WatchlistCard';
// import Image from "next/image";
// // Removed redundant NavBar import

// export default async function Dashboard() {
//     const session = await auth.api.getSession({
//         headers: await headers()
//     });

//     if (!session) redirect('/sign-in');

//     // 1. Fetch ONLY subscribed stocks
//     const subscriptions = await db.watchlist.findMany({
//         where: { userId: session.user.id },
//         select: { symbol: true }
//     });
    
//     const myStocks = subscriptions.map(sub => sub.symbol);

//     return (
//         <div className="min-h-screen w-full p-6 bg-[#0B0E14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
//             <div className="max-w-7xl mx-auto">
                
//                 {/* Header */}
//                 <div className="flex items-end justify-between mb-8">
//                     <div>
//                         <h1 className="text-gray-400 text-2xl">
//                             Welcome back, <span className="text-purple-400">{session.user.name}</span>.
//                         </h1>
//                     </div>
//                     {/* Live Indicator */}
//                     {/* <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
//                         <span className="relative flex h-2 w-2">
//                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
//                         </span>
//                         <span className="text-xs text-green-400 font-medium">Live Socket</span>
//                     </div> */}
//                 </div>


//                 {/* Content */}
//                 {myStocks.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {myStocks.map((symbol) => (
//                             <WatchlistCard 
//                                 key={symbol} 
//                                 symbol={symbol}
//                                 //initialStarred={true} 
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     // Empty State
//                     <div className="flex flex-col items-center justify-center py-20 border border border-gray-800 rounded-2xl bg-white/5">
//                         <div className="mb-6">
//                             <Image
//                                 src="/assets/images/stock.png" // Make sure this path is correct
//                                 alt="No stocks in dashboard"
//                                 width={80} // Adjust size as needed
//                                 height={80}
//                                 className="opacity-80" // Optional: makes it blend in a bit better
//                             />
//                         </div>
//                         <h3 className="text-xl font-bold text-white mb-2">Your Dashboard is Empty</h3>
//                         <p className="text-gray-400 mb-6">You haven't subscribed to any stocks yet.</p>
//                         <Link 
//                             href="/market"
//                             className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
//                         >
//                             Go to Market
//                         </Link>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { db } from "@/lib/db"; 
import WatchlistCard from '@/components/WatchlistCard';
import Image from "next/image";

// 1. Define your static details array
const MARKET_INSIGHTS = [
    {
        label: "💡 Investment Tip",
        text: "Time in the market beats timing the market. Consistency is the key to long-term growth.",
        color: "from-yellow-500/20 to-orange-500/20 border-orange-500/30 text-orange-200"
    },
    {
        label: "🧠 Did You Know?",
        text: "The S&P 500 has historically returned approximately 10% annually on average over the last century.",
        color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-200"
    },
    {
        label: "🐻 vs 🐂 Market Fact",
        text: "Bull markets (rising prices) tend to last significantly longer than Bear markets (falling prices).",
        color: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-200"
    },
    {
        label: "🛡️ Risk Management",
        text: "Diversification is the only free lunch in investing. Don't put all your eggs in one basket.",
        color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-200"
    }
];

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

    // 2. Randomly select an insight (Server-side logic)
    //const randomIndex = Math.floor(Math.random() * MARKET_INSIGHTS.length);
    //const insight = MARKET_INSIGHTS[randomIndex];

    return (
        <div className="min-h-screen w-full p-6 bg-[#0B0E14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h1 className="text-gray-400 text-2xl">
                            Welcome back, <span className="text-purple-400">{session.user.name}</span>.
                        </h1>
                    </div>
                </div>

                {/* 3. NEW: Random Insight Banner */}
                {/* <div className={`mb-10 p-4 rounded-xl border bg-gradient-to-r ${insight.color} backdrop-blur-sm`}>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <span className="text-xl">✨</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider opacity-80 mb-1">
                                {insight.label}
                            </h4>
                            <p className="text-lg font-medium opacity-95">
                                "{insight.text}"
                            </p>
                        </div>
                    </div>
                </div> */}

                {/* Content */}
                {myStocks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {myStocks.map((symbol) => (
                            <WatchlistCard 
                                key={symbol} 
                                symbol={symbol}
                            />
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-800 rounded-2xl bg-white/5">
                        <div className="mb-6">
                             <Image
                                src="/assets/images/stock.png" 
                                alt="No stocks in dashboard"
                                width={80} 
                                height={80}
                                className="opacity-80" 
                            />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Your Dashboard is Empty</h3>
                        <p className="text-gray-400 mb-6">You haven't subscribed to any stocks yet.</p>
                        <Link 
                            href="/market"
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Go to Market
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}