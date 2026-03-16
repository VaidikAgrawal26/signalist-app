const express = require('express');
const router = express.Router();
const { Asset } = require('../models');

// GET all assets
router.get('/', async (req, res) => {
    try {
        const assets = await Asset.findAll();
        res.json(assets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create asset
router.post('/', async (req, res) => {
    try {
        const newAsset = await Asset.create({
            symbol: req.body.symbol,
            type: req.body.type,
            name: req.body.name
        });
        res.status(201).json(newAsset);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
