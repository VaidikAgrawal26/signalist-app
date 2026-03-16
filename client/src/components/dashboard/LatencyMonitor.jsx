import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const data = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    latency: Math.floor(Math.random() * 5) + 8 // 8-13ms
}));

const LatencyMonitor = () => {
    return (
        <div className="bg-surface border border-white/5 rounded-xl p-5 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 font-bold text-6xl text-primary">MS</div>
            <h3 className="text-gray-100 font-semibold mb-1 z-10 relative">System Latency</h3>
            <div className="text-3xl font-mono font-bold text-primary mb-4 z-10 relative">12<span className="text-sm text-gray-500 ml-1">ms</span></div>

            <div className="flex-1 min-h-[60px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line type="monotone" dataKey="latency" stroke="#64ffda" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">Execution Speed</div>
        </div>
    );
};

export default LatencyMonitor;
