import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

const NewsFeed = () => {
    const news = [
        { id: 1, title: 'Fed Signals Potential Rate Cuts Later This Year', source: 'Bloomberg', time: '10m ago' },
        { id: 2, title: 'Tech Stocks Rally on strong AI Earnings Reports', source: 'CNBC', time: '45m ago' },
        { id: 3, title: 'Oil Prices Dip Amid Global Demand Concerns', source: 'Reuters', time: '2h ago' },
        { id: 4, title: 'Crypto Market Cap Reclaims $2 Trillion Mark', source: 'CoinDesk', time: '3h ago' },
    ];

    return (
        <div className="bg-surface border border-white/5 rounded-xl p-5 h-full flex flex-col">
            <h3 className="text-gray-100 font-semibold mb-4 flex items-center gap-2">
                <Newspaper size={18} className="text-primary" />
                Market News
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
                {news.map(item => (
                    <div key={item.id} className="group cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-medium text-gray-200 group-hover:text-primary transition-colors line-clamp-2">
                                {item.title}
                            </h4>
                            <ExternalLink size={12} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{item.source}</span>
                            <span>{item.time}</span>
                        </div>
                        <div className="h-px w-full bg-white/5 mt-3 group-last:hidden"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
