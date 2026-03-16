import React from 'react';

const RecentActivity = () => {
    return (
        <div className="bg-surface border border-white/10 rounded-xl p-6 shadow-xl backdrop-blur-sm h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i % 2 === 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {i % 2 === 0 ? 'B' : 'S'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{i % 2 === 0 ? 'Bought AAPL' : 'Sold BTC'}</p>
                                <p className="text-xs text-gray-500">Today, 10:4{i} AM</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">$1,240.00</p>
                            <span className="text-xs text-gray-500">Filled</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
