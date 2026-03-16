const { sequelize, User, Portfolio, Asset, Strategy, Order, TradeSignal } = require('./models');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Sample Data
const assetsData = [
    { symbol: 'AAPL', type: 'STOCK', name: 'Apple Inc.' },
    { symbol: 'TSLA', type: 'STOCK', name: 'Tesla, Inc.' },
    { symbol: 'GOOGL', type: 'STOCK', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', type: 'STOCK', name: 'Amazon.com, Inc.' },
    { symbol: 'MSFT', type: 'STOCK', name: 'Microsoft Corporation' },
    { symbol: 'BTC', type: 'CRYPTO', name: 'Bitcoin' },
    { symbol: 'ETH', type: 'CRYPTO', name: 'Ethereum' },
    { symbol: 'SOL', type: 'CRYPTO', name: 'Solana' },
    { symbol: 'XRP', type: 'CRYPTO', name: 'Ripple' },
    { symbol: 'NVDA', type: 'STOCK', name: 'NVIDIA Corporation' }
];

const usersData = [
    { username: 'fund_manager', email: 'manager@hedge.fund', role: 'ADMIN', password_hash: 'hashed_secret' },
    { username: 'quant_dev', email: 'quant@hedge.fund', role: 'TRADER', password_hash: 'hashed_secret' },
    { username: 'risk_officer', email: 'risk@hedge.fund', role: 'TRADER', password_hash: 'hashed_secret' },
    { username: 'algo_bot_01', email: 'bot01@hedge.fund', role: 'TRADER', password_hash: 'hashed_secret' }
];

const strategiesData = [
    { name: 'Mean Reversion Alpha', description: 'Exploits short-term price deviations from the moving average.', risk_level: 'MEDIUM', is_active: true },
    { name: 'Crypto Momentum', description: 'Follows strong trends in high-cap cryptocurrencies (BTC, ETH, SOL).', risk_level: 'HIGH', is_active: true },
    { name: 'Dividend Yield Harvester', description: 'Focuses on high-dividend blue-chip stocks for steady income.', risk_level: 'LOW', is_active: true },
    { name: 'Volatility Breakout', description: 'Enters trades when price breaks out of established consolidation ranges.', risk_level: 'HIGH', is_active: false }
];

// Connection & Seeding Logic
const seedDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('🔌 Connected to MySQL...');

        // Clear existing data
        console.log('🧹 Clearing existing data (sync with force: true)...');
        await sequelize.sync({ force: true });

        // 1. Create Assets
        console.log('💎 Seeding Assets...');
        const createdAssets = await Asset.bulkCreate(assetsData, { returning: true });
        const assetMap = {}; // symbol -> id
        createdAssets.forEach(a => assetMap[a.symbol] = a.id);

        // 2. Create Users
        console.log('busts_in_silhouette Seeding Users...');
        const createdUsers = await User.bulkCreate(usersData, { returning: true });

        // 3. Create Portfolios (One per user)
        console.log('💼 Seeding Portfolios...');
        const portfolios = [];
        for (const user of createdUsers) {
            const cash = Math.floor(Math.random() * 900000) + 100000; // 100k - 1M
            const portfolio = await Portfolio.create({
                user_id: user.id,
                cash_balance: cash,
                total_value: cash // Initial value = cash
            });
            portfolios.push(portfolio);
        }

        // 4. Create Strategies (Link to random portfolios)
        console.log('♟️ Seeding Strategies...');
        const createdStrategies = [];
        for (const strategy of strategiesData) {
            const randomPortfolio = portfolios[Math.floor(Math.random() * portfolios.length)];
            const newStrategy = await Strategy.create({
                ...strategy,
                portfolio_id: randomPortfolio.id
            });
            createdStrategies.push(newStrategy);
        }

        // 5. Create Orders (Random transactions)
        console.log('📝 Seeding Orders...');
        const orders = [];
        const orderTypes = ['MARKET', 'LIMIT'];
        const statuses = ['FILLED', 'FILLED', 'FILLED', 'PENDING', 'CANCELLED']; // Weighted towards filled

        for (let i = 0; i < 50; i++) {
            const randomPortfolio = portfolios[Math.floor(Math.random() * portfolios.length)];
            const randomAsset = createdAssets[Math.floor(Math.random() * createdAssets.length)];
            const type = Math.random() > 0.5 ? 'BUY' : 'SELL';
            const quantity = Math.floor(Math.random() * 100) + 1;
            const price = Math.floor(Math.random() * 1000) + 50;

            orders.push({
                portfolio_id: randomPortfolio.id,
                asset_id: randomAsset.id,
                type: type,
                quantity: quantity,
                price: price,
                order_type: orderTypes[Math.floor(Math.random() * orderTypes.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                created_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random time in past
            });
        }
        await Order.bulkCreate(orders);

        console.log('✅ Database Seeded Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding Error:', err);
        process.exit(1);
    }
};

seedDB();
