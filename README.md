# Signalist App

Signalist App is a comprehensive network intelligence and financial trading platform. It features a robust frontend built with React and Vite, and a powerful backend powered by Node.js, Express, and Sequelize (MySQL).

## Project Structure and File Details

Below is a detailed breakdown of all the primary files and directories in the project.

### Root Directory
- **`start-app.sh`**: Shell script to easily start both the frontend and backend servers.
- **`test-date.js`**: Utility script to test date parsing or handling.
- **`mongod.log`**: Legacy or alternative database log file for MongoDB.
- **`scripts/`**: Contains utility scripts.
  - **`test-market-data.js`**: Script to test fetching market data logic independent of the server.

---

### Frontend (`client/`)
The `client` directory contains the React frontend application.

- **`package.json`**: Defines frontend dependencies (React, Vite, Tailwind CSS, Recharts, Axios, etc.) and npm scripts.
- **`vite.config.js`**: Configuration file for the Vite bundler.
- **`tailwind.config.js`**: Configuration file for Tailwind CSS styling.
- **`postcss.config.js`**: Configuration for PostCSS, used alongside Tailwind.
- **`index.html`**: The main HTML entry point for the React application.
- **`src/`**: The main source code directory for the frontend.
  - **`main.jsx`**: The React application bootstrap file that renders the root component to the DOM.
  - **`App.jsx`**: The root React component that sets up routing (using React Router) and contexts.
  - **`index.css`**: Global CSS file containing Tailwind directives and custom styles.
  - **`components/`**: Reusable UI components.
    - **`ProtectedRoute.jsx`**: A wrapper component to protect routes that require user authentication.
    - **`dashboard/`**: Components specifically used within the dashboard views.
      - *`ActiveStrategies.jsx`*: Displays currently active trading strategies.
      - *`AssetAllocation.jsx`*: Visualizes portfolio asset distribution.
      - *`CandlestickChart.jsx`*: Implements a financial candlestick chart (via Lightweight Charts).
      - *`KPIGrid.jsx`*: Shows key performance indicators.
      - *`LatencyMonitor.jsx`*: Monitors and displays system latency.
      - *`MarketHealth.jsx`*: Shows an overview of overall market health.
      - *`MarketWatch.jsx`*: Lists watched assets and their current status.
      - *`NewsFeed.jsx`*: Displays relevant financial news.
      - *`Notifications.jsx`*: Shows user alerts and notifications.
      - *`OrderForm.jsx`*: Form to place buy/sell orders.
      - *`PriceChart.jsx`*: General price history chart.
      - *`RecentActivity.jsx`*: Lists recent trades or system events.
      - *`SectorHeatmap.jsx`*: Visualizes performance across different market sectors.
  - **`context/`**: React Context providers.
    - **`AuthContext.jsx`**: Manages and provides user authentication state throughout the app.
  - **`layouts/`**: Page layout components.
    - **`MainLayout.jsx`**: The primary layout wrapper, typically including a header, sidebar, and main content area.
  - **`pages/`**: Top-level page components corresponding to different routes.
    - **`auth/`**: Authentication pages.
      - *`LoginPage.jsx`*: User login page.
      - *`RegisterPage.jsx`*: New user registration page.
    - **`LandingPage.jsx`**: The public-facing home page.
    - **`Dashboard.jsx`**: Main user dashboard after login.
    - **`AssetsPage.jsx`**, **`StockPage.jsx`**: Pages detailing specific financial assets or stocks.
    - **`PortfoliosPage.jsx`**: Manages user investment portfolios.
    - **`OrdersPage.jsx`**: Displays user transaction history and pending orders.
    - **`StrategiesPage.jsx`**, **`StrategyLab.jsx`**: Interfaces for viewing, creating, and managing algorithmic trading strategies.
    - **`BacktestResults.jsx`**, **`TradeSimulation.jsx`**, **`PerformancePage.jsx`**: Pages for running over historical data and analyzing strategy performance.
    - **`QueryEngine.jsx`**: Interface for executing raw SQL queries and browsing schemas.
    - **`UsersPage.jsx`**: Admin or user management interface.
    - **`FeaturesPage.jsx`**, **`HowItWorksPage.jsx`**: Informational pages.
  - **`utils/`**: Helper functions and utilities.
    - **`api.js`**: Configured Axios instance and common API call methods.

---

### Backend (`server/`)
The `server` directory contains the Node.js/Express backend API.

- **`package.json`**: Defines backend dependencies (Express, Sequelize, MySQL2, JWT, bcryptjs, yahoo-finance2) and scripts.
- **`server.js`**: The main entry point for the Express application. It configures middleware, routes, and starts the server.
- **`.env`** (Environment variables): Stores sensitive configuration like database credentials and JWT secrets (not in source control).
- **`seedData.js`**, **`seed.sql`**: Scripts to populate the database with initial or test data.
- **`drop-db.js`**: Script to drop and reset the database schema.
- **`test-yf.js`**: A test script for ensuring `yahoo-finance2` integration works correctly.
- **`config/`**: Configuration files.
  - **`database.js`**: Sets up the Sequelize connection to the MySQL database.
- **`middleware/`**: Express middleware functions.
  - **`auth.js`**: Middleware to verify JWT tokens and secure API endpoints.
- **`models/`**: Sequelize ORM definitions mapping to database tables.
  - **`index.js`**: Initializes all models and defines their relationships (e.g., User has many Orders).
  - **`User.js`**: User account details.
  - **`Asset.js`**: Tradable assets (stocks, crypto, etc.).
  - **`Portfolio.js`**: User portfolios holding grouped assets.
  - **`Order.js`**: Trading orders placed by users.
  - **`Fill.js`**: Executed parts of an order.
  - **`Strategy.js`**: Trading strategies defined by users.
  - **`TradeSignal.js`**: Buy/sell signals generated by strategies.
  - **`MarketData.js`**: Historical or real-time market data points.
- **`routes/`**: Express route handlers defining the API endpoints.
  - **`auth.js`**: Endpoints for login (`/api/auth/login`) and registration.
  - **`users.js`**: User management endpoints.
  - **`assets.js`**: Endpoints for retrieving asset information.
  - **`portfolios.js`**: Endpoints for CRUD operations on portfolios.
  - **`orders.js`**: Endpoints for placing and managing orders.
  - **`strategies.js`**: Endpoints for managing trading strategies.
  - **`marketData.js`**: Endpoints for serving market data to charts.
  - **`queryEngine.js`**: Endpoints supporting the custom DBMS query execution feature.
- **`services/`**: Core business logic and integrations separated from route handlers.
  - **`marketService.js`**: Logic for fetching, formatting, and caching data from external providers like Yahoo Finance.
  - **`simulationService.js`**: Logic for executing backtests and trade simulations on historical data.
