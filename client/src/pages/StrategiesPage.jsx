import React, { useEffect, useState } from 'react';
import { getStrategies } from '../utils/api';
import { Zap, Activity, Clock, PlayCircle } from 'lucide-react';

const StrategiesPage = () => {
    const [strategies, setStrategies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStrategies = async () => {
            try {
                const data = await getStrategies();
                setStrategies(data);
            } catch (err) {
                console.error("Failed to fetch strategies", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStrategies();
    }, []);

    if (loading) return <div className="p-6 text-gray-400">Loading Strategies...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                    <Zap size={24} className="text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Strategy Library</h1>
                    <p className="text-gray-400 text-sm">Manage algos, bots, and signal generators</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategies.map((strategy) => (
                    <div key={strategy._id} className="bg-surface border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-white/5 p-2 rounded-lg text-primary">
                                <Activity size={20} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${strategy.active ? 'bg-success/10 text-success border-success/20' : 'bg-gray-700/30 text-gray-500 border-white/5'}`}>
                                {strategy.active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{strategy.name}</h3>
                        <p className="text-sm text-gray-400 mb-4 h-10 line-clamp-2">{strategy.description || "No description provided."}</p>

                        <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs text-gray-500">
                            <span className="font-mono bg-white/5 px-2 py-1 rounded">{strategy.type || 'Custom'}</span>
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(strategy.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <div className="border border-white/10 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all cursor-pointer min-h-[200px]">
                    <PlayCircle size={32} className="mb-2 opacity-50" />
                    <span className="font-medium">New Strategy</span>
                </div>
            </div>

            {strategies.length === 0 && (
                <div className="p-8 text-center text-gray-500">No strategies found. Click New Strategy to create one.</div>
            )}
        </div>
    );
};

export default StrategiesPage;
