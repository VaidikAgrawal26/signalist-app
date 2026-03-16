import React from 'react';
import { LayoutGrid } from 'lucide-react';

const SectorHeatmap = () => {
    const sectors = [
        { name: 'Technology', change: '+2.4%', color: 'bg-success' },
        { name: 'Finance', change: '-1.1%', color: 'bg-danger' },
        { name: 'Energy', change: '+0.5%', color: 'bg-success/60' },
        { name: 'Healthcare', change: '-0.3%', color: 'bg-danger/40' },
        { name: 'Utilities', change: '+1.2%', color: 'bg-success' },
        { name: 'Retail', change: '-2.5%', color: 'bg-danger' },
    ];

    return (
        <div className="bg-surface border border-white/5 rounded-xl p-5 h-full flex flex-col">
            <h3 className="text-gray-100 font-semibold mb-4 flex items-center gap-2">
                <LayoutGrid size={18} className="text-accent" />
                Sector Performance
            </h3>
            <div className="flex-1 grid grid-cols-2 gap-2">
                {sectors.map((sector, idx) => (
                    <div key={idx} className={`${sector.color} bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 flex flex-col justify-center items-center transition-all cursor-pointer border border-white/5`}>
                        <span className="text-xs font-medium text-gray-200 text-center mb-1">{sector.name}</span>
                        <span className={`text-sm font-bold ${sector.color.includes('success') ? 'text-success' : 'text-danger'}`}>
                            {sector.change}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectorHeatmap;
