const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:idIstituto/macchinetta/:idMacchinetta', async (req, res) => {
    const { idIstituto, idMacchinetta } = req.params;
    const istitutoUrl = `${process.env.API_URL}/istituti/${idIstituto}`;
    const macchinettaUrl = `${process.env.API_URL}/macchinette/${idMacchinetta}`;
    const userRoles = req.user.roles;

    try {
        const [istitutoRes, macchinettaRes] = await Promise.all([
            axios.get(istitutoUrl),
            axios.get(macchinettaUrl)
        ]);

        res.render('macchinetta_details', {
            istituto: istitutoRes.data,
            macchinetta: macchinettaRes.data,
            user: req.user
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

router.get('/macchinetta/:id/ricavi', async (req, res) => {
    try {
        const response = await axios.get(
            `${process.env.API_URL}/ricavi/totale/macchinetta/${req.params.id}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Errore nel recupero dei ricavi:', error);
        res.status(500).json({ error: 'Errore nel recupero dei ricavi' });
    }
});

// Aggiungere questa rotta in IstitutiRoutes.js
router.get('/macchinetta/:id/storico-ricavi', async (req, res) => {
    try {
        const response = await axios.get(
            `${process.env.API_URL}/ricavi/macchinetta/${req.params.id}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Errore nel recupero dello storico ricavi:', error);
        res.status(500).json({ error: 'Errore nel recupero dello storico ricavi' });
    }
});

router.post('/:idIstituto/macchinette/:idMacchinetta/delete', async (req, res) => {
    try {
        await axios.delete(`${process.env.API_URL}/macchinette/${req.params.idMacchinetta}`);
        res.redirect(`/istituti/${req.params.idIstituto}/macchinette`);
    } catch (error) {
        console.error('Errore nell\'eliminazione della macchinetta:', error);
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    res.render('error', { error: { message: 'Macchinetta non trovata' } });
                    break;
                default:
                    res.render('error', { error: { message: 'Errore durante l\'eliminazione della macchinetta' } });
            }
        } else {
            res.render('error', { error: { message: 'Errore di connessione al server' } });
        }
    }
});


module.exports = router;