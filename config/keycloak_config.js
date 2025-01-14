const session = require('express-session');
const Keycloak = require('keycloak-connect');

const keycloakConfig = {
    "realm": "amministrazione-realm",
    "auth-server-url": "http://127.0.0.1:8080/auth",
    "ssl-required": "external",
    "resource": "my-amministrativo",
    "credentials": {
        "secret": "663f85c2-6a8a-40bb-9ef8-9d5a1117091a"
    },
    "confidential-port": 0,
    "verify-token-audience": false,
};

const memoryStore = new session.MemoryStore();

const keycloakInstance = new Keycloak({
    store: memoryStore,
    secret: 'keyboard-cat',
    resave: false,
    saveUninitialized: true
}, keycloakConfig);

keycloakInstance.accessDenied = (req, res) => {
    console.log('Access Denied. Token:', req.kauth?.grant?.access_token?.content);
    res.status(403).json({ error: 'Access denied' });
};

module.exports = {
    keycloak: keycloakInstance,
    memoryStore: memoryStore
};