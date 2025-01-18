const axios = require('axios');

function createAuthenticatedAxiosInstance(req) {
    const instance = axios.create({
        baseURL: process.env.API_URL
    });

    instance.interceptors.request.use((config) => {
        if (req.kauth?.grant?.access_token?.token) {
            config.headers.Authorization = `Bearer ${req.kauth.grant.access_token.token}`;
        }
        console.log(req.kauth.grant.access_token.token);
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    

    return instance;
}

module.exports = createAuthenticatedAxiosInstance;