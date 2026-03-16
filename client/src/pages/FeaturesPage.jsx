import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Cpu, Globe, BarChart2, Server, Lock, Clock, GitBranch } from 'lucide-react';

const FeaturesPage = () => {
    return (
        <div className="min-h-screen bg-background text-text font-sans pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-100 mb-6">
                        Engineered for <span className="text-primary">Alpha</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Explore the technological breakthroughs that make Signalist the preferred choice for quantitative traders.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    <FeatureBlock
                        icon={Zap}
                        title="Zero Latency Execution"
                        desc="Our proprietary order routing engine bypasses traditional bottlenecks, ensuring your trades are executed in microseconds."
                    />
                    <FeatureBlock
                        icon={Server}
                        title="Dedicated Infrastructure"
                        desc="Each strategy runs in an isolated Docker container with dedicated CPU and RAM, preventing resource contention."
                    />
                    <FeatureBlock
                        icon={Cpu}
                        title="AI-Driven Optimization"
                        desc="Machine Learning models analyze your historical trade data to suggest real-time parameter adjustments for higher Sharpe ratios."
                    />
                    <FeatureBlock
                        icon={Globe}
                        title="Global Market Access"
                        desc="Connect to over 50 exchanges worldwide including NYSE, NASDAQ, LSE, and major crypto exchanges via a single API."
                    />
                    <FeatureBlock
                        icon={Shield}
                        title="Institutional Security"
                        desc="AES-256 encryption at rest and in transit. SOC 2 Type II compliant infrastructure ensures your intellectual property is safe."
                    />
                    <FeatureBlock
                        icon={BarChart2}
                        title="Advanced Analytics"
                        desc="Beyond simple P&L. Visualize drawdowns, Monte Carlo simulations, and sector exposure in real-time."
                    />
                    <FeatureBlock
                        icon={GitBranch}
                        title="Version Control Integration"
                        desc="Seamlessly sync with GitHub/GitLab. Rollback strategy versions instantly with our built-in versioning system."
                    />
                    <FeatureBlock
                        icon={Clock}
                        title="Tick-Level Backtesting"
                        desc="Test against years of historical tick data, not just OHLC candles, for the most accurate simulation possible."
                    />
                    <FeatureBlock
                        icon={Lock}
                        title="Risk Management Engine"
                        desc="Pre-trade risk checks prevent fat-fingered errors and unauthorized exposure limits before orders hit the market."
                    />
                </div>

                <div className="bg-surface border border-white/5 rounded-2xl p-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-100 mb-6">Ready to upgrade your trading stack?</h2>
                    <div className="flex justify-center gap-6">
                        <Link to="/register" className="px-8 py-4 bg-primary text-background font-bold rounded hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                            Start Building Now
                        </Link>
                        <Link to="/" className="px-8 py-4 bg-transparent border border-white/10 text-gray-300 font-medium rounded hover:bg-white/5 transition-all">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureBlock = ({ icon: Icon, title, desc }) => (
    <div className="p-8 bg-surface/50 border border-white/5 rounded-xl hover:border-primary/50 transition-all group hover:-translate-y-1">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
);

export default FeaturesPage;
