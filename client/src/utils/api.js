import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Query Engine
export const executeQuery = async (query) => {
    try {
        const response = await api.post('/query-engine/execute', { query });
        return response.data;
    } catch (error) {
        console.error('Query Execution Error:', error);
        throw error;
    }
};

export const getSchema = async () => {
    try {
        const response = await api.get('/query-engine/schema');
        return response.data;
    } catch (error) {
        console.error('Fetch Schema Error:', error);
        throw error;
    }
};

// Portfolio Management
export const getUsers = async () => {
    const res = await api.get('/users');
    return res.data;
};

export const getPortfolios = async () => {
    const res = await api.get('/portfolios');
    return res.data;
};

export const getStrategies = async () => {
    const res = await api.get('/strategies');
    return res.data;
};

export const getAssets = async () => {
    const res = await api.get('/assets');
    return res.data;
};

export const getOrders = async () => {
    const res = await api.get('/orders');
    return res.data;
};

export const createOrder = async (orderData) => {
    const res = await api.post('/orders', orderData);
    return res.data;
};

export default api;
