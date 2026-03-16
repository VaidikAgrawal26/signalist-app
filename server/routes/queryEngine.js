const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

// Helper to execute raw queries


router.post('/execute', async (req, res) => {
    const { collection, pipeline, query } = req.body;

    if (pipeline) {
        return res.status(501).json({ message: 'MongoDB Aggregation Pipelines are no longer supported. Please use SQL queries.' });
    }

    if (!query) {
        return res.status(400).json({ message: 'SQL query is required' });
    }

    try {
        const [results, metadata] = await sequelize.query(query);
        res.json({ results, explained: query });
    } catch (err) {
        res.status(500).json({ message: err.message, error: err });
    }
});

router.get('/schema', async (req, res) => {
    try {
        const query = `
            SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE()
            ORDER BY TABLE_NAME, ORDINAL_POSITION;
        `;
        const [results] = await sequelize.query(query);

        const schema = {};
        for (const row of results) {
            if (!schema[row.TABLE_NAME]) {
                schema[row.TABLE_NAME] = [];
            }
            schema[row.TABLE_NAME].push({
                columnName: row.COLUMN_NAME,
                dataType: row.DATA_TYPE
            });
        }

        res.json({ schema });
    } catch (err) {
        res.status(500).json({ message: err.message, error: err });
    }
});

module.exports = router;
