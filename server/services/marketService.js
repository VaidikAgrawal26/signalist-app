const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

/**
 * Fetches current price and volume for a list of symbols.
 * @param {string[]} symbols - Array of asset symbols (e.g., ['AAPL', 'BTC-USD']).
 * @returns {Promise<Object>} - Map of symbol to price data.
 */
const getLatestPrices = async (symbols) => {
    const results = {};

    // Yahoo Finance can accept an array, but sometimes it's safer to batch or handle errors individually
    // For now, we'll try the bulk fetch if supported or map over them.
    // yahoo-finance2 'quote' supports array.

    try {
        if (!symbols || symbols.length === 0) return {};

        const quotes = await yahooFinance.quote(symbols);

        // Normalize output
        quotes.forEach(quote => {
            results[quote.symbol] = {
                price: quote.regularMarketPrice,
                change: quote.regularMarketChangePercent,
                volume: quote.regularMarketVolume,
                currency: quote.currency,
                timestamp: new Date()
            };
        });

    } catch (error) {
        console.error("Error fetching market data from Yahoo Finance:", error.message);
        // Fallback or partial success handling could go here
    }

    return results;
};

module.exports = {
    getLatestPrices
};
