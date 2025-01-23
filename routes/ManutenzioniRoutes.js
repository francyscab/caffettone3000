const express = require('express');
const router = express.Router();
const { keycloak } = require('../config/keycloak_config');
const createAuthenticatedAxiosInstance = require('../utils/axiosConfig');
require('dotenv').config();

router.post('/richiesta/:idIstituto/:idMacchinetta', async (req, res) => {
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    const url = `${process.env.API_URL}/manutenzioni/richiesta/${req.params.idIstituto}/${req.params.idMacchinetta}`;

    try {
        await axiosInstance.post(url);
        res.status(200).json({ message: 'Richiesta di manutenzione inviata con successo' });
    } catch (error) {
        console.error('Errore nell\'invio della richiesta di manutenzione:', error);
        res.status(500).json({ 
            error: error.response?.data?.error || 'Errore nell\'invio della richiesta di manutenzione' 
        });
    }
});

module.exports = router;