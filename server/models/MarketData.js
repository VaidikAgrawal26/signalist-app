const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MarketData = sequelize.define('MarketData', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    asset_id: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    volume: { type: DataTypes.FLOAT },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'market_data',
    timestamps: false
});

module.exports = MarketData;
