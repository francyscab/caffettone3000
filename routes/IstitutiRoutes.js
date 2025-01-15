const express = require('express');
const router = express.Router();
const { keycloak } = require('../config/keycloak_config');
const axios = require('axios');
require('dotenv').config();


router.get('/', (req, res) => {

    const url = `${process.env.API_URL}/istituti`;
    axios.get(url)
        .then(response => {
            let istituti = response.data;
        
            const user = {
                name: req.kauth.grant.access_token.content.preferred_username || 'User',
                email: req.kauth.grant.access_token.content.email
            };

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

    try {
        // Prima otteniamo i dati dell'istituto
        const istitutoRes = await axios.get(istitutoUrl);
        
        try {
            // Se abbiamo l'istituto, otteniamo le macchinette
            const macchinetteRes = await axios.get(url);
            
            res.render('istituto_details', { 
                istituto: istitutoRes.data, 
                macchinette: macchinetteRes.data,
                apiUrl: process.env.API_URL
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
    

    const url = new URL(baseUrl);
    url.searchParams.append('id_macchinetta', req.body.id_macchinetta);
    url.searchParams.append('piano', req.body.piano);

    axios.post(url.toString())
        .then(() => {
            res.redirect(`/istituti/${req.params.id}/macchinette`);
        })
        .catch(error => {
            // Gestione degli errori specifici
            console.log(error);
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        res.redirect(`/istituti/${req.params.id}/macchinette?error=Parametri non validi`);
                        break;
                    case 500:
                        res.redirect(`/istituti/${req.params.id}/macchinette?error=Errore del server`);
                        break;
                    default:
                        res.redirect(`/istituti/${req.params.id}/macchinette?error=Errore sconosciuto`);
                }
            } else {
                res.redirect(`/istituti/${req.params.id}/macchinette?error=Errore di connessione`);
            }
        });
});

router.get('/:id/ricavi', async (req, res) => {
    try {
        const ricaviRes = await axios.get(
            `${process.env.API_URL}/ricavi/totale/istituto/${req.params.id}`
        );
        res.json(ricaviRes.data);
    } catch (error) {
        console.error('Errore nel recupero dei ricavi:', error);
        res.status(500).json({ error: 'Errore nel recupero dei ricavi' });
    }
});

module.exports = router;
