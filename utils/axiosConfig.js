const axios = require('axios');
const https = require('https');

function createAuthenticatedAxiosInstance(req) {
    const instance = axios.create({
        baseURL: process.env.API_URL,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    instance.interceptors.request.use((config) => {
        if (req.kauth?.grant?.access_token?.token) {
            config.headers.Authorization = `Bearer ${req.kauth.grant.access_token.token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    

    return instance;
}

module.exports = createAuthenticatedAxiosInstance;