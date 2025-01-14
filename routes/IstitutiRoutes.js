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

router.get('/:id/macchinette', (req, res) => {
    const url = `${process.env.API_URL}/istituti/${req.params.id}/macchinette`;
    const istitutoUrl = `${process.env.API_URL}/istituti/${req.params.id}`;

    axios.get(istitutoUrl)
        .then(response => {
            const istituto = response.data;
            axios.get(url)
                .then(response => {
                    res.render('istituto_details', { 
                        istituto: istituto, 
                        macchinette: response.data 
                    });
                })
                .catch(error => {
                    // Se l'errore è 404, renderizza la pagina con un array vuoto di macchinette
                    if (error.response && error.response.status === 404) {
                        res.render('istituto_details', { 
                            istituto: istituto, 
                            macchinette: [] 
                        });
                    } else {
                        // Per altri errori, mostra l'errore
                        res.status(500).json({ error: error.message });
                    }
                });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
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

module.exports = router;
