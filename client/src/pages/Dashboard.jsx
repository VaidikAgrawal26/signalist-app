import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PriceChart from '../components/dashboard/PriceChart';
import AssetAllocation from '../components/dashboard/AssetAllocation';
import RecentActivity from '../components/dashboard/RecentActivity';
import {
    Activity, TrendingUp, DollarSign, BarChart2, Shield, Zap, Target,
    PieChart as PieChartIcon, Layers, Cpu, Compass, Globe, Clock, Radio
} from 'lucide-react';

const Dashboard = () => {
    const [marketData, setMarketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [portfolioData, setPortfolioData] = useState(() => {
        let base = 50000;
        return Array.from({ length: 40 }, (_, i) => {
            base = base + (Math.random() * 400 - 180); // Upward bias
            return { time: `-${40 - i}s`, value: base };
        });
    });

    const [executionStream, setExecutionStream] = useState(() => {
        return Array.from({ length: 8 }, (_, i) => ({
            time: new Date(Date.now() - i * 3000).toLocaleTimeString(),
            message: `Signal ${Math.random() > 0.5 ? 'BUY' : 'SELL'} processed ... OK`,
            action: Math.random() > 0.5 ? 'ENTRY' : 'EXIT'
        }));
    });

    // New: Advanced Trader Metrics Data (10 features)
    const [traderMetrics, setTraderMetrics] = useState({
        vix: 18.5,
        marginUsed: 45,
        rsi: 55,
        sentiment: 62,
        slippage: 0.02,
        latency: 12,
        orderBook: { bid: 150.10, ask: 150.15 },
        greeks: { delta: 0.65, gamma: 0.05, theta: -1.2, vega: 0.15 },
        winRate: 68.2,
        topMovers: [{ sym: 'NVDA', chg: '+4.20%' }, { sym: 'AMD', chg: '-2.10%' }],
        heatmap: Array.from({ length: 8 }, () => Math.random() > 0.4) // true = green, false = red
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await axios.get('/api/market-data/latest');
                setMarketData(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching market data:", err);
                // Use fallback data for simulation if API fails
                setMarketData({
                    'AAPL': { price: 150.00, change: 1.2, volume: 1000000, currency: 'USD' },
                    'BTC-USD': { price: 42000.00, change: -0.5, volume: 5000, currency: 'USD' },
                    'ETH-USD': { price: 2300.00, change: 2.1, volume: 20000, currency: 'USD' },
                    'GOOGL': { price: 2800.00, change: 0.8, volume: 800000, currency: 'USD' }
                });
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        // High-frequency UI simulation updates
        const interval = setInterval(() => {
            const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // 1. Update Portfolio Chart Data Smoothly
            setPortfolioData(prev => {
                const lastVal = prev[prev.length - 1].value;
                const newVal = lastVal + (Math.random() * 500 - 220); // Continue upward drift
                return [...prev.slice(1), { time: nowTime, value: newVal }];
            });

            // 2. Add organic noise to market tickers
            setMarketData(prev => {
                if (!prev) return prev;
                const updated = { ...prev };
                Object.keys(updated).forEach(key => {
                    const price = updated[key].price;
                    const volatility = key.includes('BTC') ? price * 0.003 : price * 0.001;
                    const change = (Math.random() * volatility * 2) - volatility;
                    updated[key].price = Math.max(0.01, price + change);
                    updated[key].change = updated[key].change + (change / price * 100);
                });
                return updated;
            });

            // 3. Occasionally Push Event to Execution Stream
            if (Math.random() > 0.7) {
                setExecutionStream(prev => {
                    const newLog = {
                        time: nowTime,
                        message: `Signal ${Math.random() > 0.5 ? 'BUY' : 'SELL'} processed ... OK`,
                        action: Math.random() > 0.5 ? 'ENTRY' : 'EXIT'
                    };
                    return [newLog, ...prev.slice(0, 15)];
                });
            }

            // 4. Update Trader Metrics for 10 new Live Features
            setTraderMetrics(prev => {
                const bid = prev.orderBook.bid + (Math.random() - 0.5) * 0.1;
                const ask = bid + 0.02 + Math.random() * 0.05;
                const rsi = Math.max(20, Math.min(80, prev.rsi + (Math.random() - 0.5) * 3));
                return {
                    vix: Math.max(10, prev.vix + (Math.random() - 0.5) * 0.8),
                    marginUsed: Math.max(10, Math.min(95, prev.marginUsed + (Math.random() - 0.5) * 2)),
                    rsi: rsi,
                    sentiment: Math.max(10, Math.min(90, prev.sentiment + (Math.random() - 0.5) * 2)),
                    slippage: Math.max(0.01, prev.slippage + (Math.random() - 0.5) * 0.005),
                    latency: Math.max(2, prev.latency + (Math.random() - 0.5) * 3),
                    orderBook: { bid, ask },
                    greeks: {
                        delta: Math.max(0, Math.min(1, prev.greeks.delta + (Math.random() - 0.5) * 0.02)),
                        gamma: Math.max(0, prev.greeks.gamma + (Math.random() - 0.5) * 0.01),
                        theta: Math.min(0, prev.greeks.theta - (Math.random() - 0.5) * 0.05),
                        vega: Math.max(0, prev.greeks.vega + (Math.random() - 0.5) * 0.02)
                    },
                    winRate: Math.max(40, Math.min(90, prev.winRate + (Math.random() - 0.5) * 0.3)),
                    topMovers: [
                        { sym: 'NVDA', chg: `+${(Math.random() * 5 + 2).toFixed(2)}%` },
                        { sym: prev.topMovers[1].sym === 'AMD' ? 'TSLA' : 'AMD', chg: `${(Math.random() * 8 - 4).toFixed(2)}%` }
                    ],
                    heatmap: [...prev.heatmap.slice(1), Math.random() > 0.4] // shift array
                };
            });

        }, 1200);

        return () => clearInterval(interval);
    }, []);

    const currentPortfolioValue = portfolioData[portfolioData.length - 1].value;
    const initialPortfolioValue = portfolioData[0].value;
    const portfolioChange = ((currentPortfolioValue - initialPortfolioValue) / initialPortfolioValue) * 100;

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Intelligence Dashboard</h2>
                    <p className="text-gray-400 mt-1">Real-time telemetry and algorithmic execution overview</p>
                </div>
                <div className="flex items-center gap-3 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                    <span className="text-sm font-bold tracking-wider uppercase">Live Simulation Active</span>
                </div>
            </div>

            {/* Top Market Cards - Grid View */}
            {loading ? (
                <div className="text-indigo-400 animate-pulse flex gap-3 items-center p-4 bg-surface/50 rounded-xl w-fit">
                    <Activity className="w-5 h-5 animate-spin" /> Authenticating data stream...
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {marketData && Object.entries(marketData).map(([symbol, data]) => {
                        const isPositive = data.change >= 0;
                        return (
                            <div key={symbol} className="bg-gradient-to-br from-surface to-surface/40 border border-white/5 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                                    <BarChart2 className="w-20 h-20 text-indigo-400" />
                                </div>
                                <div className="flex justify-between items-start mb-3 relative z-10">
                                    <h3 className="text-gray-300 text-lg font-bold tracking-wide">{symbol}</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded border transition-colors duration-300 ${isPositive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {isPositive ? '+' : ''}{data.change.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="font-mono text-3xl font-bold text-white tracking-tight relative z-10 transition-all duration-300">
                                    {data.currency === 'USD' ? '$' : ''}{data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="mt-3 text-xs text-gray-500 flex items-center gap-1.5 relative z-10">
                                    <Activity className={`w-3 h-3 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`} />
                                    Vol: {data.volume.toLocaleString()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Main Charts & Panels) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Simulated Portfolio Performance */}
                    <div className="bg-gradient-to-b from-surface/80 to-surface/40 border border-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative group">
                        <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5">Total Liquid Value</h3>
                                    <div className="flex items-baseline gap-3">
                                        <p className="font-mono text-4xl sm:text-5xl font-bold text-white transition-all duration-300 drop-shadow-md">
                                            ${currentPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                        <span className={`text-sm sm:text-base font-bold px-2 py-0.5 rounded-full ${portfolioChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <PriceChart data={portfolioData} dataKey="time" valueKey="value" title="" heightClass="h-[300px]" />
                            </div>
                        </div>
                    </div>

                    {/* Sub Row: Allocation & Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="transform transition-transform hover:-translate-y-1 duration-300">
                            <AssetAllocation />
                        </div>
                        <div className="transform transition-transform hover:-translate-y-1 duration-300 h-80 overflow-y-auto">
                            <RecentActivity />
                        </div>
                    </div>
                </div>

                {/* Right Column (Side Panels) */}
                <div className="space-y-6">
                    {/* AI Insights Card */}
                    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/5 border border-indigo-500/20 rounded-2xl p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                            Alpha Signals
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed mb-6 font-medium">
                            Synthesized intelligence indicates a <span className="text-indigo-400 font-bold px-1 bg-indigo-500/20 rounded">84% probability</span> of high volatility breakout in Crypto pairs within the next 2 hours.
                        </p>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Confidence</span>
                                <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded">High</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Target Area</span>
                                <span className="text-gray-200 font-mono">BTC-USD</span>
                            </div>
                        </div>
                        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold tracking-wide py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transform hover:-translate-y-0.5">
                            Authorize Strategy
                        </button>
                    </div>

                    {/* Real-time Execution Stream */}
                    <div className="bg-surface/60 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col h-[380px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Execution Log</h3>
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>

                        <div className="space-y-3 font-mono text-xs overflow-y-auto flex-1 pr-2 custom-scrollbar">
                            {executionStream.map((log, i) => (
                                <div key={i} className={`flex flex-col gap-1 p-2 rounded-lg border ${log.action === 'ENTRY' ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-rose-500/5 border-rose-500/10'} hover:bg-white/5 transition-colors`}>
                                    <div className="flex justify-between items-center opacity-70">
                                        <span className="text-gray-400 text-[10px]">{log.time}</span>
                                        <span className={`text-[10px] px-1.5 rounded ${log.action === 'ENTRY' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-rose-500/20 text-rose-300'}`}>{log.action}</span>
                                    </div>
                                    <span className="text-gray-200">
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* NEW EXTENSION: 10 Advanced Trader Performance Metrics */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <Target className="text-indigo-400" /> Advanced Trader Performance & Risk Modeling
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

                    {/* 1. Live Order Book Depth */}
                    <div className="bg-gradient-to-br from-surface to-surface/40 border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-md group hover:border-indigo-500/30 transition-all duration-300">
                        <h4 className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2"><Layers size={14} className="text-indigo-400" /> Order Book Depth</h4>
                        <div className="space-y-1.5 font-mono text-sm">
                            <div className="flex justify-between text-red-400"><span>Ask</span><span className="font-bold">${traderMetrics.orderBook.ask.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-500 text-xs py-1 border-y border-white/5"><span>Spread</span><span>${Math.abs(traderMetrics.orderBook.ask - traderMetrics.orderBook.bid).toFixed(2)}</span></div>
                            <div className="flex justify-between text-emerald-400"><span>Bid</span><span className="font-bold">${traderMetrics.orderBook.bid.toFixed(2)}</span></div>
                        </div>
                    </div>

                    {/* 2. Options Greeks */}
                    <div className="bg-gradient-to-br from-surface to-surface/40 border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-md group hover:border-indigo-500/30 transition-all duration-300">
                        <h4 className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2"><Activity size={14} className="text-indigo-400" /> Live Greeks (Sim.)</h4>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 font-mono text-xs">
                            <div className="flex flex-col"><span className="text-gray-500">Δ Delta</span> <span className="text-white text-sm mt-0.5">{traderMetrics.greeks.delta.toFixed(3)}</span></div>
                            <div className="flex flex-col"><span className="text-gray-500">Γ Gamma</span> <span className="text-white text-sm mt-0.5">{traderMetrics.greeks.gamma.toFixed(3)}</span></div>
                            <div className="flex flex-col"><span className="text-gray-500">θ Theta</span> <span className="text-red-400 text-sm mt-0.5">{traderMetrics.greeks.theta.toFixed(3)}</span></div>
                            <div className="flex flex-col"><span className="text-gray-500">ν Vega</span> <span className="text-white text-sm mt-0.5">{traderMetrics.greeks.vega.toFixed(3)}</span></div>
                        </div>
                    </div>

                    {/* 3. Volatility Gauge */}
                    <div className="bg-gradient-to-br from-surface to-surface/40 border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-md group hover:border-indigo-500/30 transition-all duration-300">
                        <h4 className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2"><Zap size={14} className="text-indigo-400" /> Volatility (VIX)</h4>
                        <div className="flex items-end gap-2 my-2">
                            <span className="text-3xl font-bold font-mono text-amber-400">{traderMetrics.vix.toFixed(2)}</span>
                            <span className="text-gray-500 text-sm mb-1">pts</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 mt-4 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min((traderMetrics.vix / 40) * 100, 100)}%` }}></div>
                        </div>
                    </div>

                    {/* 4. Margin Utilization */}
                    <div className="bg-gradient-to-br from-surface to-surface/40 border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-md group hover:border-indigo-500/30 transition-all duration-300">
                        <h4 className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2"><Shield size={14} className="text-indigo-400" /> Margin Used</h4>
                        <div className="flex items-end gap-2 my-2">
                            <span className={`text-3xl font-bold font-mono ${traderMetrics.marginUsed > 80 ? 'text-red-400' : 'text-indigo-400'}`}>{traderMetrics.marginUsed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 mt-4 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-300 ${traderMetrics.marginUsed > 80 ? 'bg-red-400' : 'bg-indigo-500'}`} style={{ width: `${traderMetrics.marginUsed}%` }}></div>
                        </div>
                    </div>

                    {/* 5. Sector/Block Heatmap */}
                    <div className="bg-gradient-to-br from-surface to-surface/40 border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-md group hover:border-indigo-500/30 transition-all duration-300">
                        <h4 className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2"><Globe size={14} className="text-indigo-400" /> Sector Heatmap</h4>
                        <div className="grid grid-cols-4 gap-1.5 h-[60px]">
                            {traderMetrics.heatmap.map((isGreen, i) => (
                                <div key={i} className={`rounded-sm transition-colors duration-500 ${isGreen ? 'bg-emerald-500/80 saturate-150 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-rose-500/80 saturate-150 shadow-[0_0_10px_rgba(244,63,94,0.3)]'}`}></div>
                            ))}
                        </div>
                    </div>

                    {/* 6. Win/Loss Ratio */}
                    <div className="bg-gradient-to-br from-surface to-surface/40 border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-md group hover:border-indigo-500/30 transition-all duration-300">
                        <h4 className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2"><PieChartIcon size={14} className="text-indigo-400" /> Win/Loss Protocol</h4>
                        <div className="flex justify-between items-center mt-3">
                            <div className="text-center">
                                <span className="block text-2xl font-bold font-mono text-emerald-400">{traderMetrics.winRate.toFixed(1)}%</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 block">Win</span>
                            </div>
                            <div className="h-8 w-px bg-white/10 mx-2"></div>
                            <div className="text-center">
                                <span className="block text-xl font-bold font-mono text-rose-400">{(100 - traderMetrics.winRate).toFixed(1)}%</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 block">Loss</span>
                            </div>
                        </div>
                    </div>

                    {/* 7. Live Technicals */}
                    <div className="bg-gradient-to-br from-surface to-surface/40 border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-md group hover:border-indigo-500/30 transition-all duration-300">
                        <h4 className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-indigo-400" /> Live Technicals</h4>
                        <div className="flex justify-between items-center text-sm font-mono mt-2 border-b border-white/5 pb-2">
                            <span className="text-gray-400">RSI 14</span>
                            <span className={`font-bold ${traderMetrics.rsi > 70 ? 'text-red-400' : traderMetrics.rsi < 30 ? 'text-green-400' : 'text-white'}`}>{traderMetrics.rsi.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-mono mt-2">
                            <span className="text-gray-400">MACD</span>
                            <span className={`font-bold ${traderMetrics.rsi > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>{traderMetrics.rsi > 50 ? '+' : '-'}{(Math.abs(traderMetrics.rsi - 50) / 10).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* 8. Top Movers */}
                    <div className="bg-gradient-to-br from-surface to-surface/40 border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-md group hover:border-indigo-500/30 transition-all duration-300">
                        <h4 className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2"><Activity size={14} className="text-indigo-400" /> Top Movers</h4>
                        <div className="space-y-3 mt-3 font-mono text-sm">
                            {traderMetrics.topMovers.map((mover, i) => (
                                <div key={i} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
                                    <span className="text-gray-300 font-bold">{mover.sym}</span>
                                    <span className={mover.chg.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>{mover.chg}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 9. Social Sentiment */}
                    <div className="bg-gradient-to-br from-surface to-surface/40 border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-md group hover:border-indigo-500/30 transition-all duration-300">
                        <h4 className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2"><Compass size={14} className="text-indigo-400" /> AI Sentiment Index</h4>
                        <div className="flex items-center justify-between mt-2">
                            <span className={`text-3xl font-bold font-mono ${traderMetrics.sentiment > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>{traderMetrics.sentiment.toFixed(0)}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">{traderMetrics.sentiment > 50 ? 'Bullish' : 'Bearish'}</span>
                        </div>
                        <div className="w-full h-2 mt-4 rounded-full overflow-hidden flex bg-white/5">
                            <div className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${traderMetrics.sentiment}%` }}></div>
                            <div className="bg-rose-500 h-full transition-all duration-300 shadow-[0_0_8px_rgba(244,63,94,0.5)]" style={{ width: `${100 - traderMetrics.sentiment}%` }}></div>
                        </div>
                    </div>

                    {/* 10. System Latency Monitor */}
                    <div className="bg-gradient-to-br from-surface to-surface/40 border border-white/5 rounded-xl p-5 shadow-lg backdrop-blur-md group hover:border-indigo-500/30 transition-all duration-300">
                        <h4 className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2"><Clock size={14} className="text-indigo-400" /> Execution Telemetry</h4>
                        <div className="flex justify-between items-center text-sm font-mono mt-2 border-b border-white/5 pb-2">
                            <span className="text-gray-400">Ping</span>
                            <span className="text-indigo-400 font-bold">{traderMetrics.latency.toFixed(1)} ms</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-mono mt-2">
                            <span className="text-gray-400">Avg. Slippage</span>
                            <span className="text-amber-400 font-bold">{traderMetrics.slippage.toFixed(3)}%</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Global custom scrollbar style tag */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
