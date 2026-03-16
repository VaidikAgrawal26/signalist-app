import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import QueryEngine from './pages/QueryEngine';
import StrategyLab from './pages/StrategyLab';
import BacktestResults from './pages/BacktestResults';
import UsersPage from './pages/UsersPage';
import PortfoliosPage from './pages/PortfoliosPage';
import StrategiesPage from './pages/StrategiesPage';
import AssetsPage from './pages/AssetsPage';
import OrdersPage from './pages/OrdersPage';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import StockPage from './pages/StockPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import TradeSimulation from './pages/TradeSimulation';

import FeaturesPage from './pages/FeaturesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import PerformancePage from './pages/PerformancePage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/performance" element={<PerformancePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/dashboard" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                        <Route index element={<Dashboard />} />
                        <Route path="stock" element={<StockPage />} />
                        <Route path="strategy-lab" element={<StrategyLab />} />
                        <Route path="backtest-results" element={<BacktestResults />} />
                        <Route path="query-engine" element={<QueryEngine />} />

                        <Route path="trade-simulation" element={<TradeSimulation />} />

                        {/* My Portfolio Section */}
                        <Route path="users" element={<UsersPage />} />
                        <Route path="portfolios" element={<PortfoliosPage />} />
                        <Route path="strategies" element={<StrategiesPage />} />
                        <Route path="assets" element={<AssetsPage />} />
                        <Route path="orders" element={<OrdersPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
