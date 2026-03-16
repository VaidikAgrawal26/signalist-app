import React from 'react';
import { Play, Pause, Activity } from 'lucide-react';

const ActiveStrategies = () => {
    const strategies = [
        { id: 1, name: 'Mean Reversion v2', asset: 'AAPL', status: 'Running', pnl: '+12.5%' },
        { id: 2, name: 'Bollinger Breakout', asset: 'BTC', status: 'Running', pnl: '-2.1%' },
        { id: 3, name: 'Golden Cross', asset: 'ETH', status: 'Paused', pnl: '+5.4%' },
    ];

    return (
        <div className="bg-surface border border-white/5 rounded-xl p-5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-100 font-semibold flex items-center gap-2">
                    <Activity size={18} className="text-primary" />
                    Active Strategies
                </h3>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">2 Running</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {strategies.map(strat => (
                    <div key={strat.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-white/5 hover:border-primary/30 transition-all group">
                        <div>
                            <div className="font-medium text-sm text-gray-200">{strat.name}</div>
                            <div className="text-xs text-gray-500 font-mono mt-1">{strat.asset} • {strat.status}</div>
                        </div>
                        <div className="text-right">
                            <div className={`font-mono text-sm font-bold ${strat.pnl.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                                {strat.pnl}
                            </div>
                            <div className="mt-1">
                                {strat.status === 'Running' ? (
                                    <Pause size={14} className="text-gray-500 hover:text-warning cursor-pointer" />
                                ) : (
                                    <Play size={14} className="text-gray-500 hover:text-success cursor-pointer" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveStrategies;
