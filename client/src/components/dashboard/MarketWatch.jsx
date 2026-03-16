import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MarketWatch = ({ marketData }) => {
    // Fallback if no real data yet
    const assets = marketData ? Object.entries(marketData).map(([symbol, data]) => ({
        symbol,
        price: data.price,
        change: data.change
    })) : [
        { symbol: 'AAPL', price: 150.20, change: 1.25 },
        { symbol: 'BTC', price: 45000.00, change: -2.30 },
        { symbol: 'ETH', price: 3200.50, change: 0.50 },
        { symbol: 'TSLA', price: 750.00, change: -1.20 },
    ];

    return (
        <div className="bg-surface border border-white/10 rounded-xl p-6 shadow-xl backdrop-blur-sm h-full overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Market Watch</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {assets.map((asset) => (
                    <div key={asset.symbol} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <div>
                            <p className="font-bold text-white group-hover:text-primary transition-colors">{asset.symbol}</p>
                            <p className="text-xs text-gray-500">Asset Name</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-white">${asset.price.toLocaleString()}</p>
                            <div className={`flex items-center justify-end gap-1 text-xs font-bold ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {asset.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {Math.abs(asset.change).toFixed(2)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketWatch;
