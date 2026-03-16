const yahooFinance = require('yahoo-finance2').default;

async function test() {
    try {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        const hist = await yahooFinance.historical('AAPL', { period1: d });
        console.log("Historical row 0:", hist[0]);

        const search = await yahooFinance.search('Tesla');
        console.log("Search result 0:", search.quotes[0]);
    } catch (e) {
        console.error(e);
    }
}
test();
