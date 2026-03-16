import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = ({ data, dataKey = "name", valueKey = "value", title = "Portfolio Performance", heightClass = "h-80" }) => {
    return (
        <div className={`flex flex-col w-full ${heightClass}`}>
            {title && (
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <div className="flex gap-2">
                        {['1H', '1D', '1W', '1M', '1Y', 'LIVE'].map(time => (
                            <button key={time} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${time === 'LIVE' ? 'bg-indigo-500/20 text-indigo-300 outline outline-1 outline-indigo-500/50' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex-1 min-h-[250px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                        <XAxis dataKey={dataKey} stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={30} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value.toLocaleString()}`} domain={['auto', 'auto']} width={65} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                            itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Value']}
                            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey={valueKey} stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" isAnimationActive={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PriceChart;
