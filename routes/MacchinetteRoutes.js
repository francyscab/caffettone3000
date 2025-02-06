const express = require('express');
const router = express.Router();
const createAuthenticatedAxiosInstance = require('../utils/axiosConfig');

router.get('/:idIstituto/macchinetta/:idMacchinetta', async (req, res) => {
    const { idIstituto, idMacchinetta } = req.params;
    const istitutoUrl = `${process.env.API_URL}/istituti/${idIstituto}`;
    const macchinettaUrl = `${process.env.API_URL}/macchinette/dettaglio/${idIstituto}/${idMacchinetta}`;
    const userRoles = req.user.roles;
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    try {
        const [istitutoRes, macchinettaRes] = await Promise.all([
            axiosInstance.get(istitutoUrl),
            axiosInstance.get(macchinettaUrl)
        ]);

        res.render('macchinetta_details', {
            istituto: istitutoRes.data,
            macchinetta: macchinettaRes.data,
            user: req.user,
            keycloakToken: req.kauth.grant.access_token.token
        });
    } catch (error) {
        console.error('Errore:', error);
        res.render('error', {
            error: {
                message: 'Errore nel caricamento dei dettagli della macchinetta'
            }
        });
    }
});

router.get('/macchinetta/:idMacchinetta/svuota-cassa/:idIstituto', async (req, res) => {
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    const username = req.user.username;
    try {
        const response = await axiosInstance.get(
            `${process.env.API_URL}/ricavi/svuota/${req.params.idIstituto}/${req.params.idMacchinetta}`,
            { data: { username } }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Errore nello svuotamento della cassa:', error);
        res.status(500).json({ error: 'Errore nello svuotamento della cassa' });
    }
});

router.get('/istituto/:idIstituto/macchinetta/ricavi/:idMacchinetta', async (req, res) => {
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    const url = `${process.env.API_URL}/ricavi/totale/macchinetta/${req.params.idIstituto}/${req.params.idMacchinetta}`;
    try {
        const response = await axiosInstance.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Errore nel recupero dei ricavi:', error);
        res.status(500).json({ error: 'Errore nel recupero dei ricavi' });
    }
});

router.get('/istituto/:idIstituto/macchinetta/storico-ricavi/:idMacchinetta', async (req, res) => {
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    const url = `${process.env.API_URL}/ricavi/macchinetta/${req.params.idIstituto}/${req.params.idMacchinetta}`;
    try {
        const response = await axiosInstance.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Errore nel recupero dello storico ricavi:', error);
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: error.response.data.error || 'Nessun dato disponibile' });
        } else {
            res.status(500).json({ error: 'Errore nel recupero dello storico ricavi' });
        }
    }
});

router.post('/:idIstituto/macchinette/:idMacchinetta/delete', async (req, res) => {
    try {
        const axiosInstance = createAuthenticatedAxiosInstance(req);
        const url = `${process.env.API_URL}/macchinette/dettaglio/${req.params.idIstituto}/${req.params.idMacchinetta}`;
        await axiosInstance.delete(url);
        res.redirect(`/istituti/${req.params.idIstituto}/macchinette`);
    } catch (error) {
        console.error('Errore nell\'eliminazione della macchinetta:', error);
        if (error.response) {

            res.render('error', { 
                error: { 
                    message: error.response.data.error 
                }
            });
        } else {
            res.render('error', { 
                error: { 
                    message: 'Errore di connessione al server' 
                }
            });
        }
    }
});

router.get('/transazioni/istituto/:idIstituto/macchinetta/:idMacchinetta', async (req, res) => {
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    const url = `${process.env.API_URL}/transazioni/istituto/${req.params.idIstituto}/macchinetta/${req.params.idMacchinetta}`;
    
    try {
        const response = await axiosInstance.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Errore nel recupero delle transazioni:', error);
        res.status(500).json({ error: 'Errore nel recupero delle transazioni' });
    }
});

router.get('/faults/:idIstituto/:idMacchinetta', async (req, res) => {
    const axiosInstance = createAuthenticatedAxiosInstance(req);
    const url = `${process.env.API_URL}/faults/macchinetta/${req.params.idIstituto}/${req.params.idMacchinetta}`;
    
    try {
        const response = await axiosInstance.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Errore nel recupero dei guasti:', error);
        res.status(500).json({ error: 'Errore nel recupero dei guasti' });
    }
});

module.exports = router;