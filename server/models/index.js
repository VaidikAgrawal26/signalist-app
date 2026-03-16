const sequelize = require('../config/database');
const User = require('./User');
const Asset = require('./Asset');
const Portfolio = require('./Portfolio');
const Strategy = require('./Strategy');
const TradeSignal = require('./TradeSignal');
const Order = require('./Order');
const Fill = require('./Fill');
const MarketData = require('./MarketData');

// Define associations
User.hasMany(User, { as: 'Subordinates', foreignKey: 'manager_id' });
User.belongsTo(User, { as: 'Manager', foreignKey: 'manager_id' });

User.hasOne(Portfolio, { foreignKey: 'user_id' });
Portfolio.belongsTo(User, { foreignKey: 'user_id' });

Portfolio.hasMany(Strategy, { foreignKey: 'portfolio_id' });
Strategy.belongsTo(Portfolio, { foreignKey: 'portfolio_id' });

Portfolio.hasMany(Order, { foreignKey: 'portfolio_id' });
Order.belongsTo(Portfolio, { foreignKey: 'portfolio_id' });

Strategy.hasMany(TradeSignal, { foreignKey: 'strategy_id' });
TradeSignal.belongsTo(Strategy, { foreignKey: 'strategy_id' });

Asset.hasMany(TradeSignal, { foreignKey: 'asset_id' });
TradeSignal.belongsTo(Asset, { foreignKey: 'asset_id' });

TradeSignal.hasMany(Order, { foreignKey: 'signal_id' });
Order.belongsTo(TradeSignal, { foreignKey: 'signal_id' });

Asset.hasMany(Order, { foreignKey: 'asset_id' });
Order.belongsTo(Asset, { foreignKey: 'asset_id' });

Order.hasMany(Fill, { foreignKey: 'order_id' });
Fill.belongsTo(Order, { foreignKey: 'order_id' });

Asset.hasMany(MarketData, { foreignKey: 'asset_id' });
MarketData.belongsTo(Asset, { foreignKey: 'asset_id' });

module.exports = {
    sequelize,
    User,
    Asset,
    Portfolio,
    Strategy,
    TradeSignal,
    Order,
    Fill,
    MarketData
};
