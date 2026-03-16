const Asset = require('../models/Asset');
const Portfolio = require('../models/Portfolio');

const updateMarketData = async () => {
    try {
        const assets = await Asset.findAll();

        // Simulate Price Movements (Random Walk)
        const updates = assets.map(async (asset) => {
            // If asset has no details or price, init it
            let currentPrice = asset.details?.price || (Math.random() * 1000 + 50);

            // Random change between -2% and +2%
            const changePercent = (Math.random() * 0.04) - 0.02;
            const newPrice = currentPrice * (1 + changePercent);

            asset.details = {
                ...asset.details,
                price: newPrice,
                last_updated: new Date()
            };

            await asset.save();
        });

        await Promise.all(updates);
        // console.log(`[Simulation] Updated ${assets.length} asset prices.`);
    } catch (err) {
        console.error("Simulation Error:", err);
    }
};

const startSimulation = () => {
    console.log("🚀 Market Simulation Started...");
    // Update every 3 seconds
    setInterval(updateMarketData, 3000);
};

module.exports = { startSimulation };
