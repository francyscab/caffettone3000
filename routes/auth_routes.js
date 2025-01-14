const express = require('express');
const router = express.Router();
const { keycloak } = require('../config/keycloak_config');

router.get('/login', keycloak.protect(), (req, res) => {
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect(keycloak.logoutUrl());
    });
});

module.exports = router;