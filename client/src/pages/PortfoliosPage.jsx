import React, { useEffect, useState } from 'react';
import { getPortfolios } from '../utils/api';
import { Briefcase, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const PortfoliosPage = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const data = await getPortfolios();
                setPortfolios(data);
            } catch (err) {
                console.error("Failed to fetch portfolios", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolios();
    }, []);

    if (loading) return <div className="p-6 text-gray-400">Loading Portfolios...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                    <Briefcase size={24} className="text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Portfolios</h1>
                    <p className="text-gray-400 text-sm">Overview of user capital and allocations</p>
                </div>
            </div>

            <div className="bg-surface border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-mono border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4">Portfolio ID</th>
                                <th className="px-6 py-4">Owner</th>
                                <th className="px-6 py-4">Cash Balance</th>
                                <th className="px-6 py-4">Total Value</th>
                                <th className="px-6 py-4">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {portfolios.map((portfolio) => (
                                <tr key={portfolio._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{portfolio._id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                                                {portfolio.user_id?.username?.charAt(0) || 'U'}
                                            </div>
                                            <span className="text-sm text-gray-300">{portfolio.user_id?.username || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-success font-bold">
                                        ${portfolio.cash_balance?.toLocaleString() || '0'}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-300">
                                        {/* Mock total value for now until assets are linked */}
                                        ${(portfolio.cash_balance * 1.05).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(portfolio.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {portfolios.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No portfolios found.</div>
                )}
            </div>
        </div>
    );
};

export default PortfoliosPage;
