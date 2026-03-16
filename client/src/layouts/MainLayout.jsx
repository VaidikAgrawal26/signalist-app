import React, { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Database, Settings, LogOut, Briefcase, FileText, Code, PieChart, Users, Zap, Gem, ClipboardList, LineChart } from 'lucide-react';

import AuthContext from '../context/AuthContext';

const MainLayout = () => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const mainNavItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/dashboard/stock', label: 'Stock Analysis', icon: LineChart },
        { path: '/dashboard/strategy-lab', label: 'Strategy Lab', icon: Code },
        { path: '/dashboard/trade-simulation', label: 'Trade Simulation', icon: Zap },
        { path: '/dashboard/backtest-results', label: 'Results', icon: PieChart },
        { path: '/dashboard/query-engine', label: 'Query Engine', icon: Database },
    ];

    const portfolioItems = [
        { path: '/dashboard/users', label: 'Users', icon: Users },
        { path: '/dashboard/portfolios', label: 'Portfolios', icon: Briefcase },
        { path: '/dashboard/strategies', label: 'Strategies', icon: Zap },
        { path: '/dashboard/assets', label: 'Assets', icon: Gem },
        { path: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
    ];

    const NavGroup = ({ title, items }) => (
        <div className="mb-4">
            {title && <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>}
            <div className="space-y-1">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${isActive
                                ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon size={18} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-background text-text overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-white/10 flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Signalist
                    </h1>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    <NavGroup items={mainNavItems} />
                    <NavGroup title="My Portfolio" items={portfolioItems} />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.username || 'Trader'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-surface/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-10">
                    <h2 className="text-lg font-semibold text-white">
                        {[...mainNavItems, ...portfolioItems].find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
