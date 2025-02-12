const express = require('express');
const router = express.Router();
const createAuthenticatedAxiosInstance = require('../utils/axiosConfig');

router.get('/dashboard', async (req, res) => {
    try {
        const axiosInstance = createAuthenticatedAxiosInstance(req);
        
        const [ricaviResponse, macchinette, transazioni] = await Promise.allSettled([
            axiosInstance.get(`${process.env.API_URL}/ricavi`),
            axiosInstance.get(`${process.env.API_URL}/macchinette`),
            axiosInstance.get(`${process.env.API_URL}/transazioni`)
        ]);

        const ricavi = ricaviResponse.status === 'fulfilled' ? ricaviResponse.value.data : [];
        const macchinetteData = macchinette.status === 'fulfilled' ? macchinette.value.data : [];
        const transazioniData = transazioni.status === 'fulfilled' ? transazioni.value.data : [];

        const ricaviTotali = ricavi.reduce((acc, ricavo) => 
            acc + parseFloat(ricavo.somma_ricavo || 0), 0);

        res.render('dashboard', {
            user: req.user,
            ricaviTotali: ricaviTotali,
            ricavi: ricavi,
            macchinette: macchinetteData,
            transazioni: transazioniData
        });
    } catch (error) {
        console.error('Errore nel caricamento della dashboard:', error);
        res.status(500).render('error', { 
            message: 'Errore nel caricamento della dashboard',
            error: error
        });
    }
});

module.exports = router; 