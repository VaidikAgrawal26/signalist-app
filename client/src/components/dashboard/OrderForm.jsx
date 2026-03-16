import React, { useState } from 'react';

const OrderForm = () => {
    const [orderType, setOrderType] = useState('BUY');

    return (
        <div className="bg-surface border border-white/10 rounded-xl p-6 shadow-xl backdrop-blur-sm h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Trade</h3>

            <div className="flex bg-white/5 p-1 rounded-lg mb-6">
                <button
                    onClick={() => setOrderType('BUY')}
                    className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${orderType === 'BUY' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    BUY
                </button>
                <button
                    onClick={() => setOrderType('SELL')}
                    className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${orderType === 'SELL' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    SELL
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Asset Symbol</label>
                    <input type="text" className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary" placeholder="e.g. AAPL" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                        <input type="number" className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary" placeholder="0.00" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Price (Limit)</label>
                        <input type="number" className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary" placeholder="Market" />
                    </div>
                </div>

                <div className="pt-2">
                    <button className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all ${orderType === 'BUY' ? 'bg-green-600 hover:bg-green-500 shadow-green-600/20' : 'bg-red-600 hover:bg-red-500 shadow-red-600/20'}`}>
                        {orderType} NOW
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
