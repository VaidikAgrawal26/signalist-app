import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, Activity, DollarSign, ArrowRightCircle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { getAssets, getPortfolios, createOrder } from '../utils/api';
import AuthContext from '../context/AuthContext';

const TradeSimulation = () => {
    const { user } = useContext(AuthContext);
    const [assets, setAssets] = useState([]);
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [form, setForm] = useState({
        asset_id: '',
        type: 'BUY',
        quantity: 1,
        order_type: 'MARKET',
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [assetsData, portfoliosData] = await Promise.all([
                getAssets(),
                getPortfolios()
            ]);
            setAssets(assetsData);

            // Find current user's portfolio
            const userPortfolio = portfoliosData.find(p => p.user_id === user?.id);
            setPortfolio(userPortfolio || null);

            if (assetsData.length > 0 && !form.asset_id) {
                setForm(prev => ({ ...prev, asset_id: assetsData[0].id.toString() }));
            }

            setError(null);
        } catch (err) {
            setError('Failed to fetch data for trading.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
        // Auto-refresh asset prices periodically (optional)
        const intervalId = setInterval(() => {
            getAssets().then(setAssets).catch(() => { });
        }, 3000);
        return () => clearInterval(intervalId);
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const selectedAsset = assets.find(a => a.id.toString() === form.asset_id);
    const currentPrice = selectedAsset?.details?.price || 100; // fallback if no price

    const totalCost = currentPrice * form.quantity;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!portfolio) {
            setError("No portfolio found for current user.");
            return;
        }

        setSubmitting(true);
        try {
            await createOrder({
                portfolio_id: portfolio.id,
                asset_id: parseInt(form.asset_id),
                type: form.type,
                quantity: parseFloat(form.quantity),
                price: currentPrice,
                order_type: form.order_type
            });
            setSuccess(`Successfully placed ${form.type} order for ${form.quantity} ${selectedAsset?.symbol}!`);

            // Refresh portfolio to get new balance
            const ports = await getPortfolios();
            const updated = ports.find(p => p.id === portfolio.id);
            if (updated) setPortfolio(updated);

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-accent" />
                    Trade Simulation Engine
                </h1>
                <button
                    onClick={fetchData}
                    className="p-2 bg-surface hover:bg-white/10 rounded-lg text-gray-400 transition-colors border border-white/10"
                    title="Refresh Data"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="col-span-1 border border-white/10 rounded-xl bg-surface p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign size={64} className="text-accent" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Available Cash Power</p>
                    <div className="text-4xl font-extrabold text-white mb-1">
                        ${portfolio ? portfolio.cash_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </div>
                    <p className="text-sm text-green-400 font-medium">Ready for simulated execution.</p>
                </div>

                {/* Trading Form */}
                <div className="col-span-1 md:col-span-2 border border-white/10 rounded-xl bg-surface p-6 shadow-xl backdrop-blur-sm relative">
                    {loading && (
                        <div className="absolute inset-0 z-10 bg-surface/80 flex items-center justify-center rounded-xl">
                            <RefreshCw className="animate-spin text-accent" size={32} />
                        </div>
                    )}
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <ShoppingCart size={20} className="text-primary" />
                        Execute Simulated Order
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Asset</label>
                                <select
                                    name="asset_id"
                                    value={form.asset_id}
                                    onChange={handleChange}
                                    className="w-full bg-[#0d1117] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                >
                                    {assets.map(a => (
                                        <option key={a.id} value={a.id}>{a.symbol} ({a.type})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Current Price</label>
                                <div className="w-full bg-[#0d1117]/50 border border-white/5 rounded-lg p-2.5 text-white flex items-center justify-between pointer-events-none">
                                    <span className="font-mono">${currentPrice.toFixed(2)}</span>
                                    {/* Mock indicator for price movement */}
                                    {Math.random() > 0.5 ? <TrendingUp size={16} className="text-green-500" /> : <TrendingDown size={16} className="text-red-500" />}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Side</label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0d1117] border rounded-lg p-2.5 text-white focus:outline-none transition-colors ${form.type === 'BUY' ? 'border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500' : 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'}`}
                                >
                                    <option value="BUY">BUY</option>
                                    <option value="SELL">SELL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="0.1"
                                    step="0.1"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    className="w-full bg-[#0d1117] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Order Type</label>
                                <select
                                    name="order_type"
                                    value={form.order_type}
                                    onChange={handleChange}
                                    className="w-full bg-[#0d1117] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                >
                                    <option value="MARKET">MARKET</option>
                                    <option value="LIMIT">LIMIT</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Estimated Total: <span className="text-white font-bold ml-1">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting || !portfolio}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg text-white ${submitting || !portfolio
                                        ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                                        : form.type === 'BUY'
                                            ? 'bg-green-600 hover:bg-green-500 shadow-green-600/20'
                                            : 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                                    }`}
                            >
                                {submitting ? 'Processing...' : (
                                    <>
                                        Submit {form.type} Order
                                        <ArrowRightCircle size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Asset Market Data Section underneath (optional nice-to-have) */}
            <div className="border border-white/10 rounded-xl bg-surface p-6 shadow-xl flex-1 backdrop-blur-sm overflow-hidden flex flex-col">
                <h3 className="text-md font-semibold text-white mb-4 border-b border-white/10 pb-3">Live Asset Feed</h3>
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-surface z-10">
                            <tr className="text-gray-400">
                                <th className="pb-3 pt-1">Symbol</th>
                                <th className="pb-3 pt-1">Type</th>
                                <th className="pb-3 pt-1 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {assets.map(a => (
                                <tr key={a.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setForm(prev => ({ ...prev, asset_id: a.id.toString() }))}>
                                    <td className="py-3 font-semibold text-white">{a.symbol}</td>
                                    <td className="py-3 text-gray-500 text-xs">
                                        <span className="bg-white/10 px-2 py-0.5 rounded">{a.type}</span>
                                    </td>
                                    <td className="py-3 text-right font-mono text-green-400">
                                        ${a.details?.price ? a.details.price.toFixed(2) : '100.00'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default TradeSimulation;
