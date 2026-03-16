import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Activity, LineChart as LineChartIcon, TrendingUp, BarChart2, Hash, Layers, Cpu, Award, X } from 'lucide-react';
import {
    AreaChart, Area,
    LineChart, Line,
    BarChart, Bar,
    ComposedChart, Scatter,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';

// Custom Candlestick implementation adapted from BacktestResults
const CustomCandle = (props) => {
    const { x, y, width, height, payload } = props;
    const { open, close, high, low } = payload;
    const isUp = close > open;
    const color = isUp ? '#64ffda' : '#ef4444';

    return (
        <g>
            {/* Wick */}
            <line
                x1={x + width / 2} y1={y}
                x2={x + width / 2} y2={y + height}
                stroke={color} strokeWidth={1.5}
            />
            {/* Body */}
            {(() => {
                const pixelRange = Math.max(1, height);
                const valueRange = Math.max(0.001, high - low);
                const ratio = pixelRange / valueRange;

                const bodyTopValue = Math.max(open, close);
                const bodyBottomValue = Math.min(open, close);

                const topOffset = (high - bodyTopValue) * ratio;
                const bodyHeight = Math.max(2, (bodyTopValue - bodyBottomValue) * ratio);

                return (
                    <rect
                        x={x + width * 0.15}
                        y={y + topOffset}
                        width={width * 0.7}
                        height={bodyHeight}
                        fill={color}
                        stroke={color}
                        strokeWidth={1}
                        rx={1}
                    />
                );
            })()}
        </g>
    );
};

const StockPage = () => {
    const [searchQuery, setSearchQuery] = useState('AAPL');
    const [currentSymbol, setCurrentSymbol] = useState('AAPL');
    const [stockData, setStockData] = useState([]);
    const [volumeData, setVolumeData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock an AI insights system data output based on the symbol
    const [insights, setInsights] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState(null);

    const handleChartClick = (state) => {
        if (state && state.activePayload && state.activePayload.length > 0) {
            setSelectedPoint(state.activePayload[0].payload);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setCurrentSymbol(searchQuery.toUpperCase());
            fetchData(searchQuery.toUpperCase());
        }
    };

    const fetchData = (symbol) => {
        setLoading(true);
        setSelectedPoint(null);
        // Simulate fetching historical OHLCV data for 30 days
        setTimeout(() => {
            let basePrice = symbol === 'BTC' ? 42000 : symbol.includes('USD') ? 2000 : 150;
            const volatility = basePrice * 0.02;

            const newData = Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));

                const open = basePrice + (Math.random() - 0.5) * volatility;
                const close = open + (Math.random() - 0.5) * volatility;
                const high = Math.max(open, close) + Math.random() * (volatility / 2);
                const low = Math.min(open, close) - Math.random() * (volatility / 2);
                const volume = Math.floor(Math.random() * 5000000) + 1000000;

                // For Candlestick trick using Range Bar
                const range = [low, high];
                // For Scatter/Signals
                const isSignal = Math.random() > 0.85;
                const signalPrice = isSignal ? (Math.random() > 0.5 ? low : high) : null;
                const signalType = isSignal ? (signalPrice === low ? 'BUY' : 'SELL') : null;

                const macd = (Math.random() - 0.5) * 5;

                basePrice = close; // Trend step

                return {
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    fullDate: date.toISOString(),
                    open, high, low, close, volume, range,
                    signalPrice, signalType, macd,
                    ma10: (open + close) / 2 + Math.random() * 2 // Roughly simulated moving average
                };
            });

            setStockData(newData);
            setVolumeData(newData.map(d => ({ date: d.date, volume: d.volume, isUp: d.close > d.open, fullData: d })));

            generateInsights(symbol, newData[newData.length - 1], newData[0]);
            setLoading(false);
        }, 800); // Fake network delay
    };

    const generateInsights = (symbol, latest, oldest) => {
        const trend = latest.close > oldest.close ? 'Bullish' : 'Bearish';
        const perf = (((latest.close - oldest.close) / oldest.close) * 100).toFixed(2);

        const strategyNames = [
            "Mean Reversion Alpha",
            "Momentum Breakout",
            "Volatility Contraction",
            "VWAP Trend Following"
        ];
        const bestStrategy = strategyNames[symbol.length % strategyNames.length];

        setInsights({
            trend,
            performance: perf,
            bestStrategy,
            description: `Historical backtests over the last 30 days indicate that the ${symbol} asset responds best to the ${bestStrategy} model. The strategy successfully captured the ${trend.toLowerCase()} trend, yielding a simulated outperformance of +4.2% over a standard buy-and-hold approach due to precise entry signals on support bounces.`
        });
    };

    useEffect(() => {
        fetchData(currentSymbol);
    }, []);

    const ChartContainer = ({ title, icon: Icon, children }) => (
        <div className="bg-gradient-to-br from-surface to-surface/40 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col h-[350px] relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20">
                    <Icon size={18} />
                </div>
                <h3 className="text-lg font-bold text-gray-200 tracking-wide">{title}</h3>
            </div>
            <div className="flex-1 min-h-0 w-full relative z-10">
                {children}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <LineChartIcon className="text-primary" size={32} />
                        Advanced Stock Analysis
                    </h2>
                    <p className="text-gray-400 mt-1">Multi-dimensional charting and algorithmic insights engine.</p>
                </div>

                <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-mono shadow-xl relative z-10"
                        placeholder="Search Symbol (e.g., TSLA, BTC)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
                </form>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-indigo-400">
                    <Activity className="w-12 h-12 animate-spin mb-4" />
                    <p className="font-mono animate-pulse">Aggregating market data for {currentSymbol}...</p>
                </div>
            ) : (
                <>
                    {/* Insights Panel */}
                    <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

                        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Cpu className="text-primary" size={24} />
                                    Algorithmic Insights: <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 font-mono tracking-wider">{currentSymbol}</span>
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    {insights.description}
                                </p>
                            </div>

                            <div className="w-full md:w-auto grid grid-cols-2 gap-4 shrink-0">
                                <div className="bg-surface/60 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">30D Trend</span>
                                    <span className={`text-xl font-bold ${insights.trend === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>
                                        {insights.performance}%
                                    </span>
                                </div>
                                <div className="bg-surface/60 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Optimal Strategy</span>
                                    <span className="text-sm font-bold text-primary max-w-[120px] truncate" title={insights.bestStrategy}>
                                        {insights.bestStrategy}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selected Instance Data Panel */}
                    {selectedPoint && (
                        <div className="bg-gradient-to-r from-primary/10 to-surface border border-primary/30 rounded-xl p-5 shadow-lg flex justify-between items-center animate-in slide-in-from-top-4 my-2">
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 font-mono text-sm w-full">
                                <div><span className="text-primary text-xs uppercase tracking-wider block mb-1">Point Ref</span><span className="font-bold text-white text-lg">{selectedPoint.date}</span></div>
                                <div><span className="text-gray-400 text-xs block mb-1">OPEN</span><span className="text-gray-200">${selectedPoint.open ? selectedPoint.open.toFixed(2) : (selectedPoint.fullData?.open.toFixed(2))}</span></div>
                                <div><span className="text-gray-400 text-xs block mb-1">HIGH</span><span className="text-white">${selectedPoint.high ? selectedPoint.high.toFixed(2) : (selectedPoint.fullData?.high.toFixed(2))}</span></div>
                                <div><span className="text-gray-400 text-xs block mb-1">LOW</span><span className="text-white">${selectedPoint.low ? selectedPoint.low.toFixed(2) : (selectedPoint.fullData?.low.toFixed(2))}</span></div>
                                <div><span className="text-gray-400 text-xs block mb-1">CLOSE</span>
                                    <span className={`font-bold ${(selectedPoint.close || selectedPoint.fullData?.close) > (selectedPoint.open || selectedPoint.fullData?.open) ? 'text-green-400' : 'text-red-400'}`}>
                                        ${(selectedPoint.close || selectedPoint.fullData?.close).toFixed(2)}
                                    </span>
                                </div>
                                <div><span className="text-gray-400 text-xs block mb-1">VOLUME</span><span className="text-gray-200">{selectedPoint.volume.toLocaleString()}</span></div>
                                {(selectedPoint.signalType || selectedPoint.fullData?.signalType) && (
                                    <div>
                                        <span className="text-gray-400 text-xs block mb-1">AI SIGNAL</span>
                                        <span className={`font-bold px-2 py-0.5 rounded ${(selectedPoint.signalType || selectedPoint.fullData?.signalType) === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {selectedPoint.signalType || selectedPoint.fullData?.signalType}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setSelectedPoint(null)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors ml-4 shrink-0 bg-white/5">
                                <X size={20} />
                            </button>
                        </div>
                    )}
                    {!selectedPoint && (
                        <div className="text-center text-gray-500 text-sm mt-2 mb-2 italic">
                            💡 Tip: Click on any data point in the charts below to view full instantaneous metrics.
                        </div>
                    )}

                    {/* Chart Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* 1. Candlestick Chart (Price Action) */}
                        <ChartContainer title="Price Action (Candlestick)" icon={BarChart2}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} onClick={handleChartClick}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} minTickGap={20} />
                                    <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(0)}`} width={60} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const d = payload[0].payload;
                                                return (
                                                    <div className="bg-surface border border-white/10 p-3 rounded-lg shadow-2xl">
                                                        <p className="text-gray-400 text-xs mb-2 font-mono">{d.date}</p>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-sm">
                                                            <div><span className="text-gray-500 text-xs">O:</span> <span className="text-white">{d.open.toFixed(2)}</span></div>
                                                            <div><span className="text-gray-500 text-xs">H:</span> <span className="text-white">{d.high.toFixed(2)}</span></div>
                                                            <div><span className="text-gray-500 text-xs">L:</span> <span className="text-white">{d.low.toFixed(2)}</span></div>
                                                            <div><span className="text-gray-500 text-xs">C:</span> <span className={`font-bold ${d.close > d.open ? 'text-green-400' : 'text-red-400'}`}>{d.close.toFixed(2)}</span></div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="range" shape={<CustomCandle />} isAnimationActive={true} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>

                        {/* 2. Area Chart (Price Landscape) */}
                        <ChartContainer title="Price Landscape (Area)" icon={Layers}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} onClick={handleChartClick}>
                                    <defs>
                                        <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} minTickGap={20} />
                                    <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(0)}`} width={60} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                        itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                                        formatter={(val) => [`$${val.toFixed(2)}`, 'Close Price']}
                                    />
                                    <Area type="monotone" dataKey="close" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorClose)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>

                        {/* 3. Bar Chart (Volume Profile) */}
                        <ChartContainer title="Volume Profile (Bar)" icon={BarChart2}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={volumeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} onClick={handleChartClick}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                    <XAxis dataKey="date" stroke="#cbdf73ff" fontSize={11} tickLine={false} axisLine={false} minTickGap={20} />
                                    <YAxis stroke="#e2c8f3ff" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} width={60} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const d = payload[0].payload;
                                                return (
                                                    <div className="bg-[#0f172a] border border-[#1e293b] p-3 rounded-xl shadow-xl">
                                                        <p className="text-gray-400 text-xs mb-1 font-mono">{d.date}</p>
                                                        <p className="font-bold text-white">Vol: {d.volume.toLocaleString()}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                                        {volumeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.isUp ? '#10b981' : '#ef4444'} opacity={0.6} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>

                        {/* 4. Line Chart (SMA vs Price) */}
                        <ChartContainer title="Trend Alignment (Line)" icon={TrendingUp}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} onClick={handleChartClick}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} minTickGap={20} />
                                    <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(0)}`} width={60} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                    <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} name="Close Price" />
                                    <Line type="monotone" dataKey="ma10" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="10 SMA" />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>

                        {/* 5. Composed Scatter Chart (Algorithm Trade Signals) */}
                        <div className="lg:col-span-2">
                            <ChartContainer title="Algorithmic Trade Signals (Scatter + Area)" icon={Award}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={stockData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }} onClick={handleChartClick}>
                                        <defs>
                                            <linearGradient id="colorSig" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#1e293b" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#1e293b" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} minTickGap={30} />
                                        <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(0)}`} width={60} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const d = payload[0].payload;
                                                    return (
                                                        <div className="bg-[#0f172a] border border-[#1e293b] p-3 rounded-xl shadow-xl min-w-[150px]">
                                                            <p className="text-gray-400 text-xs mb-2 font-mono">{d.date}</p>
                                                            <p className="text-white font-medium mb-1">Price: ${d.close.toFixed(2)}</p>
                                                            {d.signalType && (
                                                                <div className={`mt-2 p-1.5 rounded flex items-center gap-2 ${d.signalType === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                    <Hash size={14} />
                                                                    <span className="font-bold text-xs">SIGNAL: {d.signalType}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area type="monotone" dataKey="close" fill="url(#colorSig)" stroke="#475569" strokeWidth={1} />

                                        {/* Custom scatter points for signals */}
                                        <Scatter dataKey="signalPrice" shape={(props) => {
                                            const { cx, cy, payload } = props;
                                            if (!payload.signalType) return null;
                                            const isBuy = payload.signalType === 'BUY';
                                            return (
                                                <g transform={`translate(${cx},${cy})`}>
                                                    <circle r={6} fill={isBuy ? '#10b981' : '#ef4444'} stroke="#fff" strokeWidth={1.5} />
                                                    {/* Triangle pointer */}
                                                    <polygon
                                                        points={isBuy ? "-4,8 4,8 0,2" : "-4,-8 4,-8 0,-2"}
                                                        fill={isBuy ? '#10b981' : '#ef4444'}
                                                    />
                                                </g>
                                            );
                                        }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>

                        {/* 6. MACD Chart */}
                        <div className="lg:col-span-2">
                            <ChartContainer title="MACD Oscillator (Bar)" icon={Activity}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} onClick={handleChartClick}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} minTickGap={20} />
                                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={60} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                                        />
                                        <Bar dataKey="macd" radius={[4, 4, 0, 0]}>
                                            {stockData.map((entry, index) => (
                                                <Cell key={`macd-${index}`} fill={entry.macd >= 0 ? '#10b981' : '#ef4444'} opacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StockPage;
