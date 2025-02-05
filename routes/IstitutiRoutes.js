const express = require('express');
const router = express.Router();
const { keycloak } = require('../config/keycloak_config');
const createAuthenticatedAxiosInstance = require('../utils/axiosConfig');
require('dotenv').config();


router.get('/', (req, res) => {

    const url = `${process.env.API_URL}/istituti`;
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    axiosInstance.get(url)
        .then(response => {
            let istituti = response.data;
            const user = req.user;

            const citta = req.query.citta;
            if (citta) {
                istituti = istituti.filter(istituto => istituto.citta === citta);
            }

            istituti.map(istituto => {
                istituto.detailLink = `/istituti/${istituto.id_istituto}/macchinette`;
            });

            res.render('istituti', { istituti, user });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });



});

router.get('/:id/macchinette', async (req, res) => {
    const url = `${process.env.API_URL}/istituti/${req.params.id}/macchinette`;
    const istitutoUrl = `${process.env.API_URL}/istituti/${req.params.id}`;
    const axiosInstance = createAuthenticatedAxiosInstance(req);

    try {
        // Prima otteniamo i dati dell'istituto
        const istitutoRes = await axiosInstance.get(istitutoUrl);

        console.log(req.user);

        try {
            // Se abbiamo l'istituto, otteniamo le macchinette
            const macchinetteRes = await axiosInstance.get(url);



            res.render('istituto_details', {
                istituto: istitutoRes.data,
                macchinette: macchinetteRes.data,
                apiUrl: process.env.API_URL,
                user: req.user
            });

        } catch (error) {
            // Errore nel caricamento delle macchinette
            res.render('istituto_details', {
                istituto: istitutoRes.data,
                macchinette: [],
                apiUrl: process.env.API_URL,
                error: 'Errore nel caricamento delle macchinette'
            });
        }
    } catch (error) {
        // Errore nel caricamento dell'istituto
        console.error('Errore:', error);
        res.render('istituto_details', {
            istituto: {},
            macchinette: [],
            apiUrl: process.env.API_URL,
            error: 'Errore nel caricamento dei dati dell\'istituto'
        });
    }
});
router.post('/:id/macchinette', (req, res) => {
    const baseUrl = `${process.env.API_URL}/istituti/${req.params.id}/macchinette`;
    const axiosInstance = createAuthenticatedAxiosInstance(req);

    const url = new URL(baseUrl);
    url.searchParams.append('id_macchinetta', req.body.id_macchinetta);
    url.searchParams.append('piano', req.body.piano);

    axiosInstance.post(url.toString())
        .then(() => {
            res.redirect(`/istituti/${req.params.id}/macchinette`);
        })
        .catch(error => {
        
            if (error.response) {
                const messaggioErrore = error.response.data.error;
                res.render('error', { error: { message: messaggioErrore } });
            } else {
                res.redirect(`/istituti/${req.params.id}/macchinette?error=Errore di connessione`);
            }
        });
});

router.get('/:id/ricavi', async (req, res) => {
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    try {
        const ricaviRes = await axiosInstance.get(
            `${process.env.API_URL}/ricavi/totale/istituto/${req.params.id}`
        );
        res.json(ricaviRes.data);
    } catch (error) {
        console.error('Errore nel recupero dei ricavi:', error);
        res.status(500).json({ error: 'Errore nel recupero dei ricavi' });
    }
});

router.post('/addistituto', (req, res) => {
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    const url = `${process.env.API_URL}/istituti`;

    axiosInstance.post(url, req.body)
        .then(() => {
            res.redirect('/istituti');
        })
        .catch(error => {
            res.status(500).json({ error: 'Errore nel salvataggio dell\'istituto' });
        });

});

router.delete('/:id/delete', async (req, res) => {
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    const url = `${process.env.API_URL}/istituti/${req.params.id}`;

    try {
      
        await axiosInstance.delete(url);
        res.status(200).json({ message: 'Istituto eliminato con successo' });
    } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'istituto:', error);
        
        if (error.response) {
            return res.status(error.response.status).json({ 
                error: error.response.data.error || 'Errore durante l\'eliminazione dell\'istituto' 
            });
        }
        
        res.status(500).json({ error: 'Errore di connessione al server' });
    }
});

router.get('/ricavi/totale', async (req, res) => {
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    try {
        const response = await axiosInstance.get(`${process.env.API_URL}/ricavi/totale`);
        res.json(response.data);
    } catch (error) {
        console.error('Errore nel recupero dei ricavi:', error);
        res.status(500).json({ error: 'Errore nel recupero dei ricavi' });
    }

});

module.exports = router;
