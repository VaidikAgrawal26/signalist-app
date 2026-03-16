import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, Save, Terminal, Settings, Layers, Code, PlayCircle } from 'lucide-react';

const StrategyLab = () => {
    const [code, setCode] = useState(`# Sample Moving Average Crossover Strategy
def on_tick(data):
    fast_ma = data['close'].rolling(window=10).mean()
    slow_ma = data['close'].rolling(window=50).mean()
    
    if fast_ma.iloc[-1] > slow_ma.iloc[-1]:
        return "BUY"
    elif fast_ma.iloc[-1] < slow_ma.iloc[-1]:
        return "SELL"
    else:
        return "HOLD"
`);
    const navigate = useNavigate();
    const [logs, setLogs] = useState([
        "> Initializing Python Runtime Environment...",
        "> Loading Historical Data for SPY...",
        "> Ready to backtest."
    ]);
    const [isRunning, setIsRunning] = useState(false);

    const runBacktest = async () => {
        setIsRunning(true);
        setLogs(["> Initializing request..."]);

        try {
            // Get token from auth context (stored in localStorage)
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };

            const body = {
                code,
                timeframe: '1 Hour', // Get from state in future
                assets: ['S&P 500'], // Get from state in future
                parameters: {}
            };

            // Using fetch directly or axios if imported. Assuming axios is available or we import it.
            // Let's use the fetch API for simplicity if axios isn't imported, but axios is better.
            // We should import axios at the top if not there.

            // Simulating the stream of logs by appending mock ones first if we want,
            // or just waiting for the response. 
            // For a "live" feel without websockets, we can just wait.

            // Since we are mocking the backend response, we will just set the logs from the response.
            const res = await fetch('/api/strategies/backtest', {
                method: 'POST',
                headers: config.headers,
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.logs) {
                setLogs(data.logs);
            }

            setIsRunning(false);

            if (data.redirect) {
                setTimeout(() => {
                    navigate(data.redirect, { state: { results: data.results } });
                }, 1000);
            }

        } catch (err) {
            console.error(err);
            setLogs(prev => [...prev, "! Error: Failed to connect to backtest engine."]);
            setIsRunning(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-80px)] -m-6 mt-0">
            {/* Sidebar / Config Panel */}
            <div className="w-80 bg-surface border-r border-white/5 flex flex-col">
                <div className="p-4 border-b border-white/5">
                    <h2 className="text-gray-100 font-bold flex items-center gap-2">
                        <Settings size={18} className="text-primary" />
                        Configuration
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {/* Timeframe */}
                    <div>
                        <label className="text-xs font-mono text-gray-400 block mb-2">TIMEFRAME</label>
                        <select className="w-full bg-background border border-white/10 rounded p-2 text-sm text-gray-200 outline-none focus:border-primary/50">
                            <option>1 Minute</option>
                            <option>5 Minutes</option>
                            <option>15 Minutes</option>
                            <option>1 Hour</option>
                            <option>4 Hours</option>
                            <option>1 Day</option>
                        </select>
                    </div>

                    {/* Assets */}
                    <div>
                        <label className="text-xs font-mono text-gray-400 block mb-2">ASSET UNIVERSE</label>
                        <div className="space-y-2">
                            {['S&P 500', 'NASDAQ 100', 'Crypto Large Cap', 'Forex Majors'].map(asset => (
                                <label key={asset} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                                    <input type="checkbox" className="rounded border-white/10 bg-background text-primary focus:ring-primary/50" defaultChecked={asset === 'S&P 500'} />
                                    {asset}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Indicators */}
                    <div>
                        <label className="text-xs font-mono text-gray-400 block mb-2">INDICATORS</label>
                        <div className="space-y-2">
                            {['RSI', 'MACD', 'Bollinger Bands', 'Volume Profile'].map(ind => (
                                <label key={ind} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                                    <input type="checkbox" className="rounded border-white/10 bg-background text-primary focus:ring-primary/50" />
                                    {ind}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Risk Management */}
                    <div>
                        <label className="text-xs font-mono text-gray-400 block mb-2">RISK SETTINGS</label>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Stop Loss</span>
                                    <span>2.0%</span>
                                </div>
                                <input type="range" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Max Drawdown</span>
                                    <span>15%</span>
                                </div>
                                <input type="range" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={runBacktest}
                        disabled={isRunning}
                        className={`w-full py-3 ${isRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} text-background font-bold rounded transition-all flex items-center justify-center gap-2`}
                    >
                        {isRunning ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent"></div> : <PlayCircle size={18} />}
                        {isRunning ? 'Running...' : 'Run Backtest'}
                    </button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                {/* Editor Toolbar */}
                <div className="h-10 bg-surface border-b border-white/5 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded text-gray-200">
                            <Code size={14} />
                            <span>strategy.py</span>
                        </div>
                        <span className="flex items-center gap-1 hover:text-white cursor-pointer"><Save size={14} /> Save</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">Python 3.10Environment</div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        value={code}
                        onChange={(val) => setCode(val)}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>

                {/* Console / Terminal */}
                <div className="h-48 bg-background border-t border-white/5 flex flex-col">
                    <div className="h-8 bg-surface/50 border-b border-white/5 flex items-center px-4 gap-2">
                        <Terminal size={14} className="text-gray-400" />
                        <span className="text-xs font-mono text-gray-400">TERMINAL OUTPUT</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-300 space-y-1 custom-scrollbar">
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="text-gray-600 select-none">$</span>
                                <span>{log}</span>
                            </div>
                        ))}
                        <div className="animate-pulse text-primary">_</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrategyLab;
