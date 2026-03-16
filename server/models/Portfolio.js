const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Portfolio = sequelize.define('Portfolio', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    cash_balance: { type: DataTypes.FLOAT, defaultValue: 0 },
    total_value: { type: DataTypes.FLOAT, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'portfolios',
    timestamps: false
});

module.exports = Portfolio;
