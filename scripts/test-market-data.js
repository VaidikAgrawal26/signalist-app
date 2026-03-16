const marketService = require('../server/services/marketService');

const test = async () => {
    console.log("Testing Market Data Service...");
    const symbols = ['AAPL', 'BTC-USD', 'ETH-USD', 'GOOGL'];

    try {
        const data = await marketService.getLatestPrices(symbols);
        console.log("Returned Data:");
        console.log(JSON.stringify(data, null, 2));

        if (data['AAPL'] && data['BTC-USD']) {
            console.log("SUCCESS: Fetched both Stock and Crypto data.");
        } else {
            console.log("FAILURE: Missing data.");
        }
    } catch (error) {
        console.error("Test Failed:", error);
    }
};

test();
