import React, { useEffect, useState } from 'react';
import { getAssets } from '../utils/api';
import { Gem, TrendingUp, BarChart2 } from 'lucide-react';

const AssetsPage = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const data = await getAssets();
                setAssets(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch assets", err);
                setLoading(false);
            }
        };

        fetchAssets();
        // Poll every 3 seconds for live updates
        const interval = setInterval(fetchAssets, 3000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-6 text-gray-400">Loading Assets...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                    <Gem size={24} className="text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Assets & Watchlist</h1>
                    <p className="text-gray-400 text-sm">Tracked instruments and market data</p>
                </div>
            </div>

            <div className="bg-surface border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-mono border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-center w-16">#</th>
                                <th className="px-6 py-4">Symbol</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {assets.map((asset, index) => (
                                <tr key={asset._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 text-center text-gray-600 font-mono text-xs">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-blue-500/10 text-blue-400 p-1.5 rounded">
                                                <BarChart2 size={16} />
                                            </div>
                                            <span className="font-bold text-white tracking-wider">{asset.symbol}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 font-medium">{asset.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded text-xs font-bold bg-white/5 text-gray-400 border border-white/5">
                                            {asset.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-white">
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold">
                                                ${asset.details?.price?.toFixed(2) || '0.00'}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(asset.details?.last_updated || Date.now()).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {assets.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No assets found in watchlist.</div>
                )}
            </div>
        </div>
    );
};

export default AssetsPage;
