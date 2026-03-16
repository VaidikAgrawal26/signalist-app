CREATE DATABASE IF NOT EXISTS signalist_db;
USE signalist_db;

-- Disable foreign key checks before dropping tables
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS market_data;
DROP TABLE IF EXISTS fills;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS trade_signals;
DROP TABLE IF EXISTS strategies;
DROP TABLE IF EXISTS assets;
DROP TABLE IF EXISTS portfolios;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Create Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'TRADER') DEFAULT 'TRADER',
    manager_id INT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 2. Create Portfolios Table
CREATE TABLE portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    cash_balance FLOAT DEFAULT 0,
    total_value FLOAT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Create Assets Table
CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(255) NOT NULL UNIQUE,
    type ENUM('STOCK', 'CRYPTO') NOT NULL,
    name VARCHAR(255) NULL,
    details JSON NULL
);

-- 4. Create Strategies Table
CREATE TABLE strategies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- 5. Create Trade Signals Table
CREATE TABLE trade_signals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    strategy_id INT NOT NULL,
    asset_id INT NOT NULL,
    signal_type ENUM('BUY', 'SELL') NOT NULL,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (strategy_id) REFERENCES strategies(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- 6. Create Orders Table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    signal_id INT NULL,
    portfolio_id INT NOT NULL,
    asset_id INT NOT NULL,
    type ENUM('BUY', 'SELL') NOT NULL,
    quantity FLOAT NOT NULL,
    price FLOAT NOT NULL,
    order_type ENUM('MARKET', 'LIMIT') DEFAULT 'MARKET',
    status ENUM('PENDING', 'FILLED', 'CANCELLED', 'REJECTED') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (signal_id) REFERENCES trade_signals(id) ON DELETE SET NULL,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- 7. Create Fills Table
CREATE TABLE fills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    fill_price FLOAT NOT NULL,
    fill_qty FLOAT NOT NULL,
    filled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 8. Create Market Data Table
CREATE TABLE market_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    price FLOAT NOT NULL,
    volume FLOAT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- INSERT SEED DATA
-- --------------------------------------------------------

-- 1. Insert Users
INSERT INTO users (username, password_hash, email, role, created_at) VALUES 
('trader_joe', 'hashed_password_123', 'joe@example.com', 'TRADER', NOW()),
('admin_dave', 'hashed_password_456', 'dave@example.com', 'ADMIN', NOW());

-- 2. Insert Portfolios (Assume trader_joe got id 1)
INSERT INTO portfolios (user_id, cash_balance, total_value, created_at) VALUES 
(1, 50000, 50000, NOW());

-- 3. Insert Assets
INSERT INTO assets (symbol, type, name) VALUES 
('AAPL', 'STOCK', 'Apple Inc.'),
('BTC', 'CRYPTO', 'Bitcoin');

-- 4. Insert Strategies (Assume portfolio_id 1)
INSERT INTO strategies (portfolio_id, name, risk_level, created_at) VALUES 
(1, 'Aggressive Growth', 'HIGH', NOW()),
(1, 'Safe Haven', 'LOW', NOW());

-- 5. Insert Trade Signals
INSERT INTO trade_signals (strategy_id, asset_id, signal_type, generated_at) VALUES 
(1, 1, 'BUY', NOW()),
(2, 2, 'SELL', NOW());

-- 6. Insert Orders
INSERT INTO orders (signal_id, portfolio_id, asset_id, type, quantity, price, order_type, status, created_at) VALUES 
(1, 1, 1, 'BUY', 10, 150.00, 'MARKET', 'FILLED', NOW()),
(2, 1, 2, 'SELL', 1, 50000.00, 'LIMIT', 'PENDING', NOW());

-- 7. Insert Fills
INSERT INTO fills (order_id, fill_price, fill_qty, filled_at) VALUES 
(1, 150.00, 10, NOW());

-- 8. Insert Market Data
INSERT INTO market_data (asset_id, price, volume, timestamp) VALUES 
(1, 150.50, 1000000, NOW()),
(2, 50500.00, 5000, NOW());

