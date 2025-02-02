const express = require('express');
const router = express.Router();
const createAuthenticatedAxiosInstance = require('../utils/axiosConfig');

router.get('/dashboard', async (req, res) => {
    try {
        const axiosInstance = createAuthenticatedAxiosInstance(req);
        
        const [ricaviTotali, macchinette, transazioni] = await Promise.all([
            axiosInstance.get(`${process.env.API_URL}/ricavi/totale`),
            axiosInstance.get(`${process.env.API_URL}/macchinette`),
            axiosInstance.get(`${process.env.API_URL}/transazioni`)
        ]);
        console.log(macchinette.data)
        res.render('dashboard', {
            user: req.user,
            ricaviTotali: ricaviTotali.data,
            macchinette: macchinette.data,
            transazioni: transazioni.data
        });
    } catch (error) {
        console.error('Errore nel caricamento della dashboard:', error);
        res.status(500).render('error', { 
            message: 'Si è verificato un errore durante il caricamento della dashboard. Riprova più tardi.'
        });
    }
});

module.exports = router; 