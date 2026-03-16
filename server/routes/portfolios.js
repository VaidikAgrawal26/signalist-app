const express = require('express');
const router = express.Router();
const { Portfolio, User } = require('../models');

// GET all portfolios
router.get('/', async (req, res) => {
    try {
        const portfolios = await Portfolio.findAll({ include: User });
        res.json(portfolios);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create portfolio
router.post('/', async (req, res) => {
    try {
        const newPortfolio = await Portfolio.create({
            user_id: req.body.user_id,
            cash_balance: req.body.cash_balance
        });
        res.status(201).json(newPortfolio);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
