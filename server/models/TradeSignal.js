const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TradeSignal = sequelize.define('TradeSignal', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    strategy_id: { type: DataTypes.INTEGER, allowNull: false },
    asset_id: { type: DataTypes.INTEGER, allowNull: false },
    signal_type: { type: DataTypes.ENUM('BUY', 'SELL'), allowNull: false },
    generated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'trade_signals',
    timestamps: false
});

module.exports = TradeSignal;
