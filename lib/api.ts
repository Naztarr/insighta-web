import axios from 'axios';
import { config } from 'process';
import Cookies from 'js-cookie';

// const api = axios.create({
//     baseURL: '/api',
//     withCredentials: true,
//     headers: {
//     'Content-Type': 'application/json',
// }});

// api.interceptors.request.use((config) => {
//     config.headers['X-API-Version'] = '1';
//     return config;
// } );

// export default api;

const api = axios.create({
    // Use the full URL for Railway (e.g., https://your-backend.up.railway.app)
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    // 1. Add your custom version header
    config.headers['X-API-Version'] = '1';

    // 2. Grab the token from cookies (ensure 'accessToken' matches your cookie name)
    const token = Cookies.get('accessToken'); 
    
    if (token) {
        // 3. Inject the Bearer token for Spring Security's JwtAuthFilter
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;