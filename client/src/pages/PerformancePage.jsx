import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, TrendingUp, Download, RefreshCw, Server } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const data = Array.from({ length: 50 }, (_, i) => ({
    time: `10:${i < 10 ? '0' + i : i}`,
    latency: Math.floor(Math.random() * 5) + 8 // 8-13ms
}));

const PerformancePage = () => {
    return (
        <div className="min-h-screen bg-background text-text font-sans pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-in-up">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-100 mb-2">System Status & Performance</h1>
                        <p className="text-gray-400">Real-time transparency metrics for Signalist Cloud Infrastructure.</p>
                    </div>
                    <div className="flex items-center gap-4 mt-6 md:mt-0">
                        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full border border-success/20">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                            <span className="font-mono text-sm font-bold">ALL SYSTEMS OPERATIONAL</span>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatusCard label="API Uptime (30d)" value="99.99%" status="operational" />
                    <StatusCard label="Avg Execution Time" value="11.4 ms" status="operational" />
                    <StatusCard label="Total Trades Today" value="842,109" status="info" />
                    <StatusCard label="Active Websockets" value="12,405" status="info" />
                </div>

                {/* Latency Chart */}
                <div className="bg-surface border border-white/5 rounded-2xl p-8 mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            Global Latency Index (ms)
                        </h2>
                        <button className="text-gray-500 hover:text-white transition-colors">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <XAxis dataKey="time" hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#112240', border: '1px solid rgba(255,255,255,0.1)' }}
                                    itemStyle={{ color: '#64ffda' }}
                                />
                                <Line type="monotone" dataKey="latency" stroke="#64ffda" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Component Status */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-surface border border-white/5 rounded-2xl p-8">
                        <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
                            <Server size={18} />
                            Component Status
                        </h3>
                        <div className="space-y-4">
                            <ComponentStatus name="Data Ingestion Service" status="Operational" />
                            <ComponentStatus name="Order Routing Engine (SOR)" status="Operational" />
                            <ComponentStatus name="Risk Management Layer" status="Operational" />
                            <ComponentStatus name="Reporting & Analytics DB" status="Operational" />
                            <ComponentStatus name="Authentication Service" status="Operational" />
                        </div>
                    </div>
                    <div className="bg-surface border border-white/5 rounded-2xl p-8">
                        <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
                            <Download size={18} />
                            Incident History
                        </h3>
                        <div className="space-y-6">
                            <Incident date="Oct 24, 2024" title="Minor Latency Spike - US East" status="Resolved" />
                            <Incident date="Sep 12, 2024" title="Scheduled Maintenance" status="Completed" />
                            <div className="text-center pt-4">
                                <a href="#" className="text-primary hover:text-primary/80 text-sm font-medium">View Full History</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-gray-500 text-sm mb-4">Want to run this infrastructure on your own premise?</p>
                    <Link to="/register" className="text-primary hover:text-white transition-colors underline underline-offset-4">
                        Contact Enterprise Sales
                    </Link>
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ label, value, status }) => (
    <div className="bg-surface border border-white/5 p-6 rounded-xl text-center">
        <div className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2">{label}</div>
        <div className={`text-3xl font-bold ${status === 'operational' ? 'text-success' : 'text-primary'}`}>{value}</div>
    </div>
);

const ComponentStatus = ({ name, status }) => (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
        <span className="text-gray-300">{name}</span>
        <span className="flex items-center gap-2 text-success text-sm font-medium">
            <CheckCircle size={14} />
            {status}
        </span>
    </div>
);

const Incident = ({ date, title, status }) => (
    <div className="flex items-start gap-4">
        <div className="text-gray-500 text-xs font-mono w-20 shrink-0 pt-1">{date}</div>
        <div>
            <div className="text-gray-200 font-medium text-sm">{title}</div>
            <div className="text-xs text-success mt-1">{status}</div>
        </div>
    </div>
);

export default PerformancePage;
