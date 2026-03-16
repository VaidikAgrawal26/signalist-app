const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
require('./models'); // Ensure all models are loaded before sync
sequelize.authenticate()
    .then(() => {
        console.log('MySQL Connected');
        return sequelize.sync({ alter: true }); // Using alter to apply ENUM changes
    })
    .then(() => console.log('All models synchronized successfully.'))
    .catch(err => console.error('Unable to connect or sync to the database:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('Signalist API Running');
});

// Import Routes
// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const portfolioRoutes = require('./routes/portfolios');
const strategyRoutes = require('./routes/strategies');
const assetRoutes = require('./routes/assets');
const orderRoutes = require('./routes/orders');
const queryEngineRoutes = require('./routes/queryEngine');
const marketDataRoutes = require('./routes/marketData');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/strategies', strategyRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/query-engine', queryEngineRoutes);
app.use('/api/market-data', marketDataRoutes);

// Start Simulation
const { startSimulation } = require('./services/simulationService');
if (process.env.NODE_ENV !== 'test') {
    startSimulation();
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
