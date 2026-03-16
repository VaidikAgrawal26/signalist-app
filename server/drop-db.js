const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize('', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log,
});

async function resetDb() {
    try {
        await sequelize.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME || 'signalist_db'};`);
        await sequelize.query(`CREATE DATABASE ${process.env.DB_NAME || 'signalist_db'};`);
        console.log("Database reset successfully.");
    } catch (err) {
        console.error("Error resetting database:", err);
    } finally {
        process.exit();
    }
}

resetDb();
