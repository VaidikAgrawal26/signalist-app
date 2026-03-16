const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    symbol: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.ENUM('STOCK', 'CRYPTO', 'FUTURE', 'OPTION'), allowNull: false },
    name: { type: DataTypes.STRING },
    details: { type: DataTypes.JSON } // Flexible data
}, {
    tableName: 'assets',
    timestamps: false
});

module.exports = Asset;
