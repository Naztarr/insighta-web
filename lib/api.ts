import axios from 'axios';
import { config } from 'process';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
    'Content-Type': 'application/json',
}});

api.interceptors.request.use((config) => {
    config.headers['X-API-Version'] = '1';
    return config;
} );

export default api;