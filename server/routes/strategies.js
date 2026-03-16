const express = require('express');
const router = express.Router();
const { Strategy } = require('../models');
const auth = require('../middleware/auth');

// @route   GET /api/strategies
// @desc    Get user strategies
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Querying strategy by user id might require a join with Portfolio
        // Just fetching all for now or filtering if needed
        const strategies = await Strategy.findAll();
        res.json(strategies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/strategies
// @desc    Create a strategy
// @access  Private
router.post('/', auth, async (req, res) => {
    // ... (existing create logic if any, or placeholder)
    res.send('Create strategy route');
});

// @route   POST /api/strategies/backtest
// @desc    Run a backtest simulation
// @access  Public (for demo)
router.post('/backtest', async (req, res) => {
    const { code, timeframe, assets, parameters } = req.body;

    // Simulate processing delay and log generation
    const assetStr = assets ? assets.join(', ') : 'S&P 500';
    const logs = [];

    logs.push(`> Initializing Backtest Engine v2.4.1...`);
    logs.push(`> Loading historical data for [${assetStr}] on ${timeframe} timeframe...`);
    logs.push(`> Compiling strategy code...`);

    // Simulate some logic checks based on code content (very basic)
    if (code.includes('error') || code.includes('exception')) {
        logs.push(`! Syntax Error: Unexpected token in line 5.`);
        return res.status(400).json({ logs, success: false });
    }

    logs.push(`> Strategy compiled successfully.`);
    logs.push(`> Running simulation from 2023-01-01 to 2023-12-31...`);

    // Mock trade generation
    for (let i = 0; i < 5; i++) {
        const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
        const price = (100 + Math.random() * 50).toFixed(2);
        logs.push(`  [${2023}-0${i + 2}-1${i} 10:00:00] Signal: ${action} @ $${price}`);
    }

    logs.push(`> Backtest complete.`);
    logs.push(`> Calculating performance metrics...`);
    logs.push(`> Final P&L: +$12,450.00 (24.5%)`);
    logs.push(`> Max Drawdown: -8.4%`);
    logs.push(`> ready.`);

    // Generate random equity curve data
    const equityCurve = Array.from({ length: 30 }, (_, i) => ({
        day: `Day ${i + 1}`,
        value: 10000 + Math.random() * 2000 + (i * 100)
    }));

    // Generate OHLC Data for Candlestick Chart
    const ohlcData = Array.from({ length: 30 }, (_, i) => {
        const open = 150 + Math.random() * 10;
        const close = open + (Math.random() - 0.5) * 5;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;

        // Format date as YYYY-MM-DD
        const date = new Date(2023, 0, i + 1).toISOString().split('T')[0];

        return { time: date, open, high, low, close };
    });

    // Generate mock trades
    const trades = [];
    for (let i = 0; i < 5; i++) {
        const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
        const price = (100 + Math.random() * 50).toFixed(2);
        trades.push({
            time: `2023-01-${10 + i}`,
            symbol: assetStr.split(',')[0],
            type: action,
            price: price
        });
    }

    const metrics = {
        totalReturn: '+24.5%',
        sharpe: '1.85',
        drawdown: '-8.4%',
        winRate: '68%'
    };

    // AI Analysis Report
    const aiAnalysis = {
        sentiment: "Bullish",
        confidence: "85%",
        summary: "The strategy demonstrates strong mean-reversion properties with a high Sharpe ratio (1.85). The recent drawdown is within acceptable limits (-8.4%).",
        recommendation: "Increase position sizing by 10% and continue monitoring volatility. The asset shows signs of a breakout pattern forming on the 1H timeframe.",
        keyLevels: {
            support: "148.50",
            resistance: "162.00"
        }
    };

    // Simulate delay
    setTimeout(() => {
        res.json({
            success: true,
            logs,
            redirect: '/dashboard/backtest-results',
            results: { equityCurve, metrics, trades, ohlcData, aiAnalysis }
        });
    }, 2000);
});

module.exports = router;
