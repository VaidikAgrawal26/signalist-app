import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decoded.user);
                    axios.defaults.headers.common['x-auth-token'] = token;
                }
            } catch (err) {
                logout();
            }
        }
        setLoading(false);
    }, []); // Run only once on mount

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
    };

    const demoLogin = () => {
        const demoUser = { id: 'demo-123', username: 'Demo Trader', email: 'demo@signalist.com', role: 'TRADER' };
        const demoToken = 'demo-token-123';
        localStorage.setItem('token', demoToken);
        setToken(demoToken);
        setUser(demoUser);
        axios.defaults.headers.common['x-auth-token'] = demoToken;
    };

    const register = async (username, email, password) => {
        const res = await axios.post('/api/auth/register', { username, email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['x-auth-token'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, demoLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
