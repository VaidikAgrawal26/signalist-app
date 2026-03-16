import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const KPICard = ({ title, value, change, icon: Icon, trend }) => {
    return (
        <div className="bg-surface border border-white/10 rounded-xl p-6 shadow-xl backdrop-blur-sm hover:border-primary/50 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="text-primary" size={24} />
                </div>
                {change && (
                    <div className={clsx(
                        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded",
                        trend === 'up' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                        {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{change}</span>
                    </div>
                )}
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    );
};

const KPIGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
                title="Total Portfolio Value"
                value="$1,245,392.00"
                change="+2.5%"
                trend="up"
                icon={Wallet}
            />
            <KPICard
                title="24h P&L"
                value="+$12,450.00"
                change="+1.2%"
                trend="up"
                icon={TrendingUp}
            />
            <KPICard
                title="Buying Power"
                value="$54,000.00"
                icon={DollarSign}
            />
            <KPICard
                title="Active Positions"
                value="8"
                change="-1"
                trend="down"
                icon={TrendingDown}
            />
        </div>
    );
};

export default KPIGrid;
