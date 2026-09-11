import axios from 'axios';

const API_URL = 'https://stepout-events.onrender.com';


export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem(
                'accessToken',
            ) ||
            sessionStorage.getItem(
                'accessToken',
            );

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
);