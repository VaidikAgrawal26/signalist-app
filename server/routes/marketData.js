const express = require('express');
const router = express.Router();
const marketService = require('../services/marketService');
const { Asset, MarketData } = require('../models');

// GET /api/market-data/latest
// Fetch latest prices for all assets tracked in the database
router.get('/latest', async (req, res) => {
    try {
        // 1. Get all unique symbols from the DB
        const assets = await Asset.findAll();
        const symbols = assets.map(asset => asset.symbol);

        if (symbols.length === 0) {
            return res.json({});
        }

        // 2. Fetch live data
        const marketData = await marketService.getLatestPrices(symbols);

        // 3. Save to Database (Async - don't block response too much)
        const savePromises = assets.map(asset => {
            const data = marketData[asset.symbol];
            if (data) {
                return MarketData.create({
                    asset_id: asset.id,
                    price: data.price,
                    volume: data.volume,
                    timestamp: data.timestamp
                });
            }
        });

        // We can await this or let it run in background. Awaiting for safety.
        await Promise.all(savePromises);

        res.json(marketData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error fetching market data' });
    }
});

module.exports = router;
