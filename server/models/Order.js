const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    signal_id: { type: DataTypes.INTEGER },
    portfolio_id: { type: DataTypes.INTEGER, allowNull: false },
    asset_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('BUY', 'SELL'), allowNull: false },
    quantity: { type: DataTypes.FLOAT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    order_type: { type: DataTypes.ENUM('MARKET', 'LIMIT'), defaultValue: 'MARKET' },
    status: { type: DataTypes.ENUM('PENDING', 'FILLED', 'CANCELLED', 'REJECTED'), defaultValue: 'PENDING' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'orders',
    timestamps: false
});

module.exports = Order;
