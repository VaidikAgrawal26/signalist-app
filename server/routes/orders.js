const express = require('express');
const router = express.Router();
const { Order, Portfolio, Asset, TradeSignal } = require('../models');

// GET all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [Portfolio, Asset, TradeSignal]
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create order
router.post('/', async (req, res) => {
    try {
        const { portfolio_id, asset_id, type, quantity, price, order_type = 'MARKET' } = req.body;

        if (!type || !quantity || !price) {
            return res.status(400).json({ message: "Type, quantity, and price are required." });
        }

        const portfolio = await Portfolio.findByPk(portfolio_id);
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found." });
        }

        const totalCost = quantity * price;

        if (type === 'BUY') {
            if (portfolio.cash_balance < totalCost) {
                return res.status(400).json({ message: "Insufficient funds." });
            }
            portfolio.cash_balance -= totalCost;
        } else if (type === 'SELL') {
            portfolio.cash_balance += totalCost;
        }

        await portfolio.save();

        const newOrder = await Order.create({
            portfolio_id,
            asset_id,
            type,
            quantity,
            price,
            order_type,
            status: 'FILLED' // Auto-fill for simulation
        });

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
