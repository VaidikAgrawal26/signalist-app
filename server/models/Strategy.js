const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Strategy = sequelize.define('Strategy', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    portfolio_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    risk_level: { type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'), defaultValue: 'MEDIUM' },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'strategies',
    timestamps: false
});

module.exports = Strategy;
