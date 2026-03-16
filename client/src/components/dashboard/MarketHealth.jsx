import React from 'react';
import { Gauge } from 'lucide-react'; // Using Lucide icon as simple representation or could be a chart

const MarketHealth = () => {
    // Mock health data
    const health = 75; // 0-100 (Bearish -> Bullish)
    const status = "Bullish";

    return (
        <div className="bg-surface border border-white/5 rounded-xl p-5 h-full flex flex-col items-center justify-center relative">
            <h3 className="text-gray-100 font-semibold mb-4 w-full text-left flex items-center gap-2">
                <Gauge size={18} className="text-accent" />
                Market Health
            </h3>

            <div className="relative w-32 h-16 overflow-hidden mb-2">
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-white/10"></div>
                <div
                    className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-transparent border-t-success border-r-success"
                    style={{ transform: `rotate(${45 + (health / 100) * 180}deg)`, transition: 'transform 1s ease-out' }}
                ></div>
            </div>

            <div className="text-2xl font-bold text-gray-100">{status}</div>
            <div className="text-xs text-gray-500">Volatility Index: <span className="text-white">14.2 (Low)</span></div>
        </div>
    );
};

export default MarketHealth;
