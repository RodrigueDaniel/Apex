// app/(root)/page.tsx

import Link from 'next/link'; // 1. Import Link

const STOCK_NAMES : {[key: string]: string} = {
    'GOOG': 'Google', 'TSLA': 'Tesla', 'AMZN': 'Amazon', 
    'META': 'Meta Platforms', 'NVDA': 'Nvidia'
};
const userSubscriptions = Object.keys(STOCK_NAMES); // Use all supported stocks

const Home = () => {
    return (
        <div className="p-8" style={{ backgroundColor: '#111827', minHeight: '100vh' }}>
            <h1 className="text-3xl font-bold text-white mb-6">Apex Trading</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userSubscriptions.map((symbol) => (
                    // 2. Wrap the card in <Link> pointing to the dynamic route
                    <Link href={`/${symbol}`} key={symbol} className="block group">
                        <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 
                                        transition-transform duration-200 hover:scale-[1.03] cursor-pointer">
                            <h2 className="text-xl font-semibold text-white">{symbol}</h2>
                            <p className="text-sm text-gray-400">{STOCK_NAMES[symbol]}</p>
                            <p className="text-sm text-blue-400 mt-2">Click to view Live Chart</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;