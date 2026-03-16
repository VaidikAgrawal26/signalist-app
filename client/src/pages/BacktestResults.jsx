import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Download, TrendingUp, TrendingDown, Activity, Award,
    Calendar, Percent, ShieldAlert, Cpu, Layers, BarChart2, Hash
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell, ComposedChart, Line
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CandlestickChart from '../components/dashboard/CandlestickChart';

const BacktestResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pdfRef = useRef();

    const [activeTab, setActiveTab] = useState('overview');
    const [backtestData, setBacktestData] = useState(null);

    // Dynamic Data Generator function
    const generateDynamicData = () => {
        // Core metrics
        const winProb = 0.5 + (Math.random() * 0.3); // 50-80%
        const totalTradeCount = Math.floor(Math.random() * 150) + 50;
        const initialCap = 10000;

        let currentCap = initialCap;
        const equityCurve = [];
        const monthlyReturns = [];
        const trades = [];
        const ohlcData = [];

        // Generate 6 months of data roughly
        let drawdownsList = [];
        let peakCap = initialCap;

        for (let i = 0; i < 180; i++) {
            const date = new Date(2023, 0, i + 1);
            const dateStr = date.toISOString().split('T')[0];
            const monthStr = date.toLocaleString('default', { month: 'short' });

            // Daily P&L calculation
            const isTradeDay = Math.random() > 0.6;
            let dailyPnl = 0;

            if (isTradeDay) {
                const isWin = Math.random() < winProb;
                const pnlPct = isWin ? (Math.random() * 0.03 + 0.005) : -(Math.random() * 0.02 + 0.005);
                dailyPnl = currentCap * pnlPct;
                currentCap += dailyPnl;

                // Track trades for ledger (keep subset to avoid massive lists)
                if (trades.length < 50 && Math.random() > 0.8) {
                    trades.push({
                        date: dateStr,
                        type: isWin ? (Math.random() > 0.5 ? 'LONG' : 'SHORT') : (Math.random() > 0.5 ? 'LONG' : 'SHORT'),
                        asset: ['AAPL', 'MSFT', 'BTC', 'ETH'][Math.floor(Math.random() * 4)],
                        entry: (100 + Math.random() * 100).toFixed(2),
                        exit: (100 + Math.random() * 100).toFixed(2),
                        pnl: dailyPnl,
                        pnlPct: (pnlPct * 100).toFixed(2)
                    });
                }
            }

            // High water mark / Drawdown
            if (currentCap > peakCap) peakCap = currentCap;
            const currentDrawdown = ((currentCap - peakCap) / peakCap) * 100;
            drawdownsList.push({ date: dateStr, drawdown: currentDrawdown });

            equityCurve.push({
                date: dateStr,
                value: currentCap,
                drawdown: currentDrawdown
            });

            // Simulate market OHLC for context chart
            const open = (i === 0 ? 150 : ohlcData[i - 1].close) + (Math.random() - 0.5) * 2;
            const close = open + (Math.random() - 0.5) * 3;
            const high = Math.max(open, close) + Math.random() * 1.5;
            const low = Math.min(open, close) - Math.random() * 1.5;
            ohlcData.push({ time: dateStr, open, high, low, close });

            // Monthly aggregation
            if (i % 30 === 0) {
                monthlyReturns.push({
                    month: monthStr,
                    return: ((currentCap - initialCap) / initialCap) * 100 // Cumulative
                });
            }
        }

        const maxDrawdown = Math.min(...drawdownsList.map(d => d.drawdown));
        const totalReturnPct = ((currentCap - initialCap) / initialCap) * 100;
        const sharpe = (totalReturnPct / (Math.abs(maxDrawdown) || 1)) * Math.sqrt(252 / 180); // Rough annualized

        // Win/Loss Pie Data
        const pieData = [
            { name: 'Winning Trades', value: Math.round(totalTradeCount * winProb), color: '#10b981' },
            { name: 'Losing Trades', value: Math.round(totalTradeCount * (1 - winProb)), color: '#ef4444' }
        ];

        return {
            equityCurve,
            monthlyReturns,
            drawdownData: drawdownsList,
            ohlcData,
            trades: trades.reverse(),
            pieData,
            metrics: {
                totalReturn: `+${totalReturnPct.toFixed(2)}%`,
                sharpe: sharpe.toFixed(2),
                drawdown: `${maxDrawdown.toFixed(2)}%`,
                winRate: `${(winProb * 100).toFixed(1)}%`,
                profitFactor: (Math.random() * 1.5 + 1.2).toFixed(2),
                tradesTaken: totalTradeCount
            },
            aiAnalysis: {
                sentiment: totalReturnPct > 0 ? "Bullish" : "Bearish",
                score: (Math.random() * 30 + 60).toFixed(0),
                summary: `The algorithm demonstrated robust performance, achieving a structural edge in trending regimes. The Sharpe ratio of ${sharpe.toFixed(2)} signifies excellent risk-adjusted returns. Notably, the maximum drawdown was contained at ${maxDrawdown.toFixed(2)}%, validating the strict stop-loss protocols.`,
                recommendation: "Deploy to live paper-trading environment. Consider optimizing position sizing to reduce peak-to-trough drawdowns during sideways consolidation phases.",
                keyLevels: { support: "142.50", resistance: "168.20" }
            }
        };
    };

    useEffect(() => {
        // If results exist in router state, we could use them (e.g., coming from Strategy Lab)
        // But the user requested dynamic/randomized changes specifically to see different charts.
        // We will generate fresh structured data every mount for demonstration.
        setBacktestData(generateDynamicData());
    }, [location.state]);

    const handleDownloadPDF = async () => {
        const element = pdfRef.current;
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#0b1120' });
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('signalist_backtest_report.pdf');
    };

    if (!backtestData) return <div className="p-10 text-white animate-pulse">Running Backtest Simulation...</div>;

    const { metrics, equityCurve, monthlyReturns, drawdownData, ohlcData, trades, aiAnalysis, pieData } = backtestData;

    const tabs = [
        { id: 'overview', label: 'Executive Overview', icon: Activity },
        { id: 'charts', label: 'Performance Charts', icon: BarChart2 },
        { id: 'ledger', label: 'Trade Ledger', icon: Hash },
        { id: 'ai', label: 'AI Risk Report', icon: Cpu }
    ];

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500" ref={pdfRef}>
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print bg-surface border border-white/5 p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard/strategy-lab')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            Strategy Simulation <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-sm tracking-widest font-mono">STRLAB-X9</span>
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">Tested across 6 months historical tick data</p>
                    </div>
                </div>
                <button onClick={handleDownloadPDF} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-background font-bold rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(100,255,218,0.3)] hover:shadow-[0_0_25px_rgba(100,255,218,0.5)]">
                    <Download size={18} />
                    Generate PDF Report
                </button>
            </div>

            {/* Custom Tab Navigation */}
            <div className="flex overflow-x-auto gap-2 p-1 bg-surface/50 border border-white/5 rounded-xl no-print custom-scrollbar">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                                    ? 'bg-primary/20 text-primary border border-primary/20 shadow-md'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Contents */}
            <div className="mt-6">

                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        {/* KPI Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <MetricCard label="Net Return" value={metrics.totalReturn} icon={TrendingUp} isPositive={true} />
                            <MetricCard label="Win Rate" value={metrics.winRate} icon={Award} isPositive={true} />
                            <MetricCard label="Max Drawdown" value={metrics.drawdown} icon={TrendingDown} isPositive={false} />
                            <MetricCard label="Sharpe Ratio" value={metrics.sharpe} icon={Activity} isNeutral={true} />
                            <MetricCard label="Profit Factor" value={metrics.profitFactor} icon={Percent} isNeutral={true} />
                            <MetricCard label="Total Trades" value={metrics.tradesTaken} icon={Hash} isNeutral={true} />
                        </div>

                        {/* Main Equity Curve View */}
                        <div className="bg-gradient-to-b from-surface to-surface/40 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><TrendingUp className="text-primary" /> Cumulative Equity Curve</h3>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={equityCurve} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#64ffda" stopOpacity={0.5} />
                                                <stop offset="95%" stopColor="#64ffda" stopOpacity={0.0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} minTickGap={30} />
                                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                            itemStyle={{ color: '#64ffda', fontWeight: 'bold' }}
                                            formatter={(val) => [`$${val.toFixed(2)}`, 'Portfolio Value']}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#64ffda" fill="url(#colorEquity)" strokeWidth={2.5} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. PERFORMANCE CHARTS TAB */}
                {activeTab === 'charts' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Monthly Returns Bar Chart */}
                            <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Calendar className="text-indigo-400" /> Monthly Cumulative Returns</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyReturns} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v.toFixed(0)}%`} />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                                formatter={(val) => [`${val.toFixed(2)}%`, 'Return']}
                                            />
                                            <Bar dataKey="return" radius={[4, 4, 0, 0]}>
                                                {monthlyReturns.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.return >= 0 ? '#10b981' : '#ef4444'} opacity={0.8} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Drawdown Depth Chart */}
                            <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><ShieldAlert className="text-rose-400" /> Drawdown Profile</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={drawdownData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorDd" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} minTickGap={30} />
                                            <YAxis domain={['auto', 0]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v.toFixed(1)}%`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                                itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                                                formatter={(val) => [`${val.toFixed(2)}%`, 'Drawdown']}
                                            />
                                            <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="url(#colorDd)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Split Context: Market Action vs Win Ratio */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-surface border border-white/5 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Layers className="text-amber-400" /> Market Context Layout</h3>
                                <CandlestickChart data={ohlcData} />
                            </div>

                            <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-center items-center relative">
                                <h3 className="absolute top-6 left-6 text-lg font-bold text-white flex items-center gap-2"><PieChart className="text-primary" /> Win Distribution</h3>
                                <div className="h-[250px] w-full mt-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%" cy="50%"
                                                innerRadius={60} outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. TRADE LEDGER TAB */}
                {activeTab === 'ledger' && (
                    <div className="bg-surface border border-white/5 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-6 p-4 bg-white/5 border-b border-white/5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <div className="col-span-1">Date</div>
                            <div className="col-span-1">Asset</div>
                            <div className="col-span-1">Type</div>
                            <div className="col-span-1">Entry Price</div>
                            <div className="col-span-1">Exit Price</div>
                            <div className="col-span-1 text-right">Net P&L</div>
                        </div>
                        <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {trades.map((trade, i) => {
                                const isProfit = trade.pnl > 0;
                                return (
                                    <div key={i} className="grid grid-cols-6 p-4 items-center hover:bg-white/5 transition-colors text-sm font-mono text-gray-300">
                                        <div className="col-span-1">{trade.date}</div>
                                        <div className="col-span-1 font-bold text-white">{trade.asset}</div>
                                        <div className="col-span-1">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${trade.type === 'LONG' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                                {trade.type}
                                            </span>
                                        </div>
                                        <div className="col-span-1">${trade.entry}</div>
                                        <div className="col-span-1">${trade.exit}</div>
                                        <div className={`col-span-1 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {isProfit ? '+' : ''}${Math.abs(trade.pnl).toFixed(2)} ({trade.pnlPct}%)
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 4. AI ANALYSIS TAB */}
                {activeTab === 'ai' && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900/30 via-purple-900/10 to-transparent border border-indigo-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mt-20 -mr-20"></div>
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <Cpu className="w-8 h-8 text-primary" />
                                <h3 className="text-2xl font-bold text-white">Project Gemini: Alpha Protocol</h3>
                            </div>

                            <div className="space-y-6 relative z-10 text-gray-300 leading-relaxed">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Executive Summary</h4>
                                    <p className="bg-surface/50 p-4 rounded-xl border border-white/5 text-sm">{aiAnalysis.summary}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-surface/50 p-4 rounded-xl border border-white/5">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Algorithm Score</h4>
                                        <div className="text-4xl font-bold text-white font-mono">{aiAnalysis.score}<span className="text-lg text-gray-500">/100</span></div>
                                    </div>
                                    <div className="bg-surface/50 p-4 rounded-xl border border-white/5">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Market Sentiment Override</h4>
                                        <div className={`text-xl font-bold ${aiAnalysis.sentiment === 'Bullish' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {aiAnalysis.sentiment}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Actionable Recommendation</h4>
                                    <div className="border-l-4 border-primary pl-4 py-2 italic font-serif opacity-90">
                                        "{aiAnalysis.recommendation}"
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-xl">
                                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Key Resistance Nodes</h4>
                                <div className="space-y-3 font-mono">
                                    <div className="flex justify-between items-center p-3 bg-rose-500/5 rounded border border-rose-500/10">
                                        <span className="text-xs text-rose-400 uppercase font-bold">R1 Zone</span>
                                        <span className="text-white">${aiAnalysis.keyLevels.resistance}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-emerald-500/5 rounded border border-emerald-500/10">
                                        <span className="text-xs text-emerald-400 uppercase font-bold">S1 Zone</span>
                                        <span className="text-white">${aiAnalysis.keyLevels.support}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-center items-center text-center">
                                <ShieldAlert className="text-amber-500 w-12 h-12 mb-3 opacity-50" />
                                <h4 className="text-sm font-bold text-white mb-2">Risk Warning</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Simulated backtest outputs do not reflect real-market slippage, liquidity gaps, or external black-swan anomalies.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px;}
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 20px; }
            `}</style>
        </div>
    );
};

// Extracted Metric Card for cleaner grid
const MetricCard = ({ label, value, icon: Icon, isPositive, isNeutral }) => {
    let colorClass = isNeutral ? 'text-primary' : (isPositive ? 'text-emerald-400' : 'text-rose-400');
    let bgClass = isNeutral ? 'bg-primary/10' : (isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10');

    return (
        <div className="bg-surface border border-white/5 rounded-2xl p-5 shadow-lg group hover:bg-white/5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${bgClass}`}>
                    <Icon className={colorClass} size={18} />
                </div>
            </div>
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono mb-1">{label}</p>
                <p className={`font-mono text-2xl font-bold ${colorClass}`}>{value}</p>
            </div>
        </div>
    );
};

export default BacktestResults;
