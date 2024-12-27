// src/lib/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const authService = {
    async login(username, password) {
        try {
            const response = await axios.post(`${API_URL}/login/`, {
                username,
                password
            });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    async signup(userData) {
        try {
            const response = await axios.post(`${API_URL}/signup/`, userData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    logout() {
        localStorage.removeItem('token');
    },

    getToken() {
        return localStorage.getItem('token');
    }
};

// Configurer axios pour inclure le token dans les headers
axios.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);