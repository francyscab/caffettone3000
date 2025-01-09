const session = require('express-session');
const Keycloak = require('keycloak-connect');

const keycloakConfig = {
    "realm": "master",
    "auth-server-url": "http://localhost:8080/auth", 
    "ssl-required": "external",
    "resource": "amministrativa",
    "public-client": true,        // importante per il redirect
    "confidential-port": 0,
    "enable-cors": true,          // abilita CORS
    "bearer-only": false          // importante per il redirect
};

const memoryStore = new session.MemoryStore();

// Configura le opzioni di keycloak
const keycloakInstance = new Keycloak({
    store: memoryStore,       
    logout: '/logout'             // gestisce il logout
}, keycloakConfig);

module.exports = {
    keycloak: keycloakInstance,
    memoryStore: memoryStore
};