import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Activity, Shield, Zap, ChevronRight, BarChart2, Cpu, Globe, Database, Server, Code, Users, Star } from 'lucide-react';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    return (
        <div className="min-h-screen bg-background text-text font-sans selection:bg-primary selection:text-background">

            {/* Particles Background */}
            <div className="absolute inset-0 z-0">
                <Particles
                    id="tsparticles"
                    init={particlesInit}
                    options={{
                        background: { color: { value: "transparent" } },
                        fpsLimit: 120,
                        interactivity: {
                            events: {
                                onClick: { enable: true, mode: "push" },
                                onHover: { enable: true, mode: "repulse" },
                                resize: true,
                            },
                            modes: {
                                push: { quantity: 4 },
                                repulse: { distance: 200, duration: 0.4 },
                            },
                        },
                        particles: {
                            color: { value: "#64ffda" },
                            links: { color: "#233554", distance: 150, enable: true, opacity: 0.5, width: 1 },
                            move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
                            number: { density: { enable: true, area: 800 }, value: 80 },
                            opacity: { value: 0.5 },
                            shape: { type: "circle" },
                            size: { value: { min: 1, max: 3 } },
                        },
                        detectRetina: true,
                    }}
                    className="h-full w-full"
                />
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                            <Activity size={20} className="text-background font-bold" />
                        </div>
                        <span className="text-2xl font-bold text-gray-100 tracking-tight">Signalist<span className="text-primary">.</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link to="/features" className="text-gray-400 hover:text-primary transition-colors">Features</Link>
                        <Link to="/how-it-works" className="text-gray-400 hover:text-primary transition-colors">How It Works</Link>
                        <Link to="/performance" className="text-gray-400 hover:text-primary transition-colors">Performance</Link>
                        <Link to="/login" className="text-gray-100 hover:text-primary transition-colors">Log In</Link>
                        <Link to="/register" className="px-5 py-2.5 border border-primary text-primary hover:bg-primary/10 rounded font-medium transition-all">
                            Launch Terminal
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Ticker Tape */}
            <div className="fixed top-[80px] w-full z-40 bg-surface/80 backdrop-blur-sm border-y border-white/5 h-10 flex items-center overflow-hidden">
                <div className="animate-marquee whitespace-nowrap flex gap-8 items-center text-xs font-mono text-gray-400">
                    <span className="flex items-center gap-1"><span className="text-success">AAPL ▲ 150.23</span></span>
                    <span className="flex items-center gap-1"><span className="text-danger">TSLA ▼ 182.45</span></span>
                    <span className="flex items-center gap-1"><span className="text-success">BTC ▲ 42,100.00</span></span>
                    <span className="flex items-center gap-1"><span className="text-success">ETH ▲ 2,250.50</span></span>
                    <span className="flex items-center gap-1"><span className="text-danger">GOOGL ▼ 132.10</span></span>
                    <span className="flex items-center gap-1"><span className="text-success">NVDA ▲ 450.30</span></span>
                    <span className="flex items-center gap-1"><span className="text-success">AMZN ▲ 145.20</span></span>
                    <span className="flex items-center gap-1"><span className="text-danger">MSFT ▼ 320.10</span></span>
                    {/* Duplicate for infinite scroll effect */}
                    <span className="flex items-center gap-1"><span className="text-success">AAPL ▲ 150.23</span></span>
                    <span className="flex items-center gap-1"><span className="text-danger">TSLA ▼ 182.45</span></span>
                    <span className="flex items-center gap-1"><span className="text-success">BTC ▲ 42,100.00</span></span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 flex items-center justify-center min-h-screen">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in-up">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-mono text-primary tracking-wider uppercase">v2.0 Now Live</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-100 mb-8 leading-tight tracking-tight">
                        Institutional-Grade <br />
                        <span className="text-primary">Backtesting Engine</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Design, test, and deploy high-frequency trading algorithms with zero latency.
                        Powered by Python, Docker, and institutional data feeds.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Link to="/register" className="px-8 py-4 bg-primary text-background text-lg font-bold rounded hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(100,255,218,0.3)] flex items-center gap-2 group">
                            Start Building
                            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#how-it-works" className="px-8 py-4 bg-transparent border border-gray-600 text-gray-300 text-lg font-medium rounded hover:border-gray-400 transition-all">
                            View Documentation
                        </a>
                    </div>
                </div>
            </section>

            {/* Performance Metrics */}
            <section id="metrics" className="py-20 border-y border-white/5 bg-surface/30">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <MetricCounter value="1M+" label="Trades Simulated" />
                        <MetricCounter value="99.9%" label="System Uptime" />
                        <MetricCounter value="<12ms" label="Execution Latency" />
                        <MetricCounter value="$50B+" label="Volume Processed" />
                    </div>
                </div>
            </section>

            {/* Value Props & How It Works */}
            <section id="features" className="py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">Engineered for Alpha</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Built for quants who demand precision and speed.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        <FeatureCard
                            icon={Zap}
                            title="Zero Latency"
                            desc="Optimized execution pathways ensuring your strategy reacts to market movements instantly."
                        />
                        <FeatureCard
                            icon={Server}
                            title="Dedicates Infrastructure"
                            desc="Isolated Docker containers for each strategy ensure consistent resource availability."
                        />
                        <FeatureCard
                            icon={Brain}
                            title="AI-Powered Insights"
                            desc="Machine learning models analyze your trade history to suggest parameter optimizations."
                        />
                    </div>

                    {/* Interactive Flow Chart (Visual Representation) */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Activity size={200} />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-4">Architecture Overview</h3>
                                <p className="text-gray-400 mb-8">
                                    A streamlined pipeline from data ingestion to trade execution.
                                </p>
                            </div>
                            <div className="flex-2 flex items-center gap-4 text-xs font-mono">
                                <FlowStep icon={Database} label="Data Ingestion" />
                                <div className="h-px w-8 bg-primary/50"></div>
                                <FlowStep icon={Cpu} label="Strategy Processing" />
                                <div className="h-px w-8 bg-primary/50"></div>
                                <FlowStep icon={Globe} label="Market Execution" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-20 border-y border-white/5 bg-surface/20">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-sm font-mono text-primary mb-10 uppercase tracking-widest">Powered By Best-in-Class Tech</h3>
                    <div className="flex flex-wrap justify-center gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos, using text for now */}
                        <TechLogo name="React" />
                        <TechLogo name="Node.js" />
                        <TechLogo name="Python" />
                        <TechLogo name="MongoDB" />
                        <TechLogo name="Docker" />
                        <TechLogo name="Tailwind" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-background border-t border-white/5 text-sm">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-gray-500">
                        &copy; 2026 Signalist Inc. All rights reserved.
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-gray-400 hover:text-primary">GitHub</a>
                        <a href="#" className="text-gray-400 hover:text-primary">LinkedIn</a>
                        <a href="#" className="text-gray-400 hover:text-primary">API Docs</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const MetricCounter = ({ value, label }) => (
    <div>
        <div className="text-4xl md:text-5xl font-bold text-gray-100 mb-2">{value}</div>
        <div className="text-primary font-mono text-sm">{label}</div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="p-8 bg-surface border border-white/5 rounded hover:border-primary/30 transition-all group">
        <Icon className="text-primary mb-6 group-hover:scale-110 transition-transform" size={32} />
        <h3 className="text-xl font-bold text-gray-100 mb-4">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
);

const FlowStep = ({ icon: Icon, label }) => (
    <div className="flex flex-col items-center gap-3 p-4 bg-background border border-white/10 rounded-lg w-32">
        <Icon className="text-primary" size={24} />
        <span className="text-gray-300">{label}</span>
    </div>
);

const TechLogo = ({ name }) => (
    <div className="text-xl font-bold text-gray-400 font-mono hover:text-white cursor-default">
        {name}
    </div>
);

// Missing icon import stub (Brain is not in lucide-react default set generally, using Cpu instead if Brain fails, but let's import generic)
const Brain = ({ className, size }) => <Cpu className={className} size={size} />;


export default LandingPage;

