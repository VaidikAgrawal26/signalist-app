import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Code, Play, BarChart, ArrowRight, CheckCircle } from 'lucide-react';

const HowItWorksPage = () => {
    return (
        <div className="min-h-screen bg-background text-text font-sans pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
                        <span className="text-xs font-mono text-accent uppercase">Workflow</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-100 mb-6">
                        From Concept to <span className="text-accent">Execution</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        A transparent look at how Signalist processes your strategies from a simple Python script to live market orders.
                    </p>
                </div>

                <div className="space-y-24 relative before:absolute before:inset-0 before:ml-6 md:before:ml-1/2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-accent before:to-transparent before:opacity-20">

                    <Step
                        number="01"
                        title="Data Ingestion"
                        icon={Database}
                        align="left"
                        desc="We aggregate real-time websockets from 50+ exchanges and normalize them into a unified schema. This clean data is pushed to your strategy container with <1ms latency."
                    />

                    <Step
                        number="02"
                        title="Strategy Logic"
                        icon={Code}
                        align="right"
                        desc="Your Python script runs in an isolated environment. It receives the `on_tick(data)` event, processes your indicators (e.g., RSI > 70), and decides whether to signal a trade."
                    />

                    <Step
                        number="03"
                        title="Risk Engine Check"
                        icon={CheckCircle}
                        align="left"
                        desc="Before any signal becomes an order, it passes through our Risk Engine. We check buying power, max position size, and drawdown limits to ensure safety."
                    />

                    <Step
                        number="04"
                        title="Smart Routing"
                        icon={Play}
                        align="right"
                        desc="Approved orders are routed via our Smart Order Router (SOR) to find the best liquidity and lowest slippage across multiple venues."
                    />

                    <Step
                        number="05"
                        title="Performance Feedback"
                        icon={BarChart}
                        align="left"
                        desc="Execution details are logged instantly. The dashboard updates your P&L, and the AI model analyzes the trade outcome to refine future predictions."
                    />

                </div>

                <div className="mt-32 text-center">
                    <Link to="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-primary to-accent text-background font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-2xl shadow-primary/20">
                        Start Your Workflow
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Step = ({ number, title, icon: Icon, desc, align }) => (
    <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${align === 'right' ? 'md:flex-row' : ''}`}>

        <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-surface text-gray-300 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-xl">
            {number}
        </div>

        <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-surface border border-white/5 p-8 rounded-2xl hover:border-accent/40 transition-all shadow-lg ${align === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`}>
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/5 rounded-lg text-accent">
                    <Icon size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-100">{title}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg">{desc}</p>
        </div>
    </div>
);

export default HowItWorksPage;
