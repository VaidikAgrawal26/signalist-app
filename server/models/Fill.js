const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fill = sequelize.define('Fill', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    fill_price: { type: DataTypes.FLOAT, allowNull: false },
    fill_qty: { type: DataTypes.FLOAT, allowNull: false },
    filled_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'fills',
    timestamps: false
});

module.exports = Fill;
