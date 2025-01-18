const express = require('express');
const router = express.Router();
const { keycloak } = require('../config/keycloak_config');

// Login route - reindirizza a /istituti dopo il login
router.get('/login', keycloak.protect(), (req, res) => {
    res.redirect('/istituti');
});

// Logout route
router.get('/logout', (req, res) => {
    
    const logoutUrl = `${keycloak.config.authServerUrl}/realms/${keycloak.config.realm}/protocol/openid-connect/logout`;

   
    const refreshToken = req.kauth?.grant?.refresh_token?.token;

    const params = new URLSearchParams({
        client_id: keycloak.config.clientId || keycloak.config.resource,
        refresh_token: refreshToken || '',
        redirect_uri: `${req.protocol}://${req.get('host')}/`
    });


    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        
        res.clearCookie('keycloak-token');
        res.clearCookie('connect.sid');
        
        res.redirect(`${logoutUrl}?${params.toString()}`);
    });
});

module.exports = router;