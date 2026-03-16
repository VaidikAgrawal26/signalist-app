import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const Notifications = () => {
    const alerts = [
        { id: 1, type: 'success', message: 'Order Filled: SOLD 10 AAPL @ $150.23', time: '2m ago' },
        { id: 2, type: 'warning', message: 'Stop Loss Hit: TSLA @ $182.45', time: '15m ago' },
        { id: 3, type: 'info', message: 'Market Open: NYSE Trading Session Started', time: '1h ago' },
        { id: 4, type: 'error', message: 'Margin Call Warning: 85% Utilization', time: '2h ago' },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} className="text-success" />;
            case 'warning': return <AlertTriangle size={16} className="text-warning" />;
            case 'error': return <AlertTriangle size={16} className="text-danger" />;
            default: return <Info size={16} className="text-accent" />;
        }
    };

    return (
        <div className="bg-surface border border-white/5 rounded-xl p-5 h-full flex flex-col">
            <h3 className="text-gray-100 font-semibold mb-4 flex items-center gap-2">
                <Bell size={18} className="text-accent" />
                Notifications
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {alerts.map(alert => (
                    <div key={alert.id} className="flex gap-3 items-start p-3 bg-background/50 rounded-lg border border-white/5 hover:bg-white/5 transition-colors">
                        <div className="mt-0.5">{getIcon(alert.type)}</div>
                        <div>
                            <p className="text-sm text-gray-200 leading-tight mb-1">{alert.message}</p>
                            <span className="text-xs text-gray-500">{alert.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
