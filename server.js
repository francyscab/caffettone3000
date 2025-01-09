const express = require("express");
const morgan = require("morgan");
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const { keycloak, memoryStore,keycloakConfig } = require("./middleware/keycloak");
const cors = require('cors');


// init 
const app = express();
const port = 3000;

// set up the middleware
app.use(morgan('tiny'));

// serving static request
app.use(express.static('client'));

// interpreting form-encoded parameters
app.use(express.urlencoded({ extended: true }));

// interpreting json-encoded parameters
app.use(express.json());

app.use(cors());

// Configura la sessione PRIMA di Keycloak
app.use(session({
    secret: 'keyboard-cat',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 ore
    }
}));
app.use((req, res, next) => {
    if (req.url.includes('auth_callback')) {
        console.log('Auth Callback Details:', {
            url: req.url,
            headers: req.headers,
            query: req.query,
            token: req.kauth?.grant?.access_token?.content
        });
    }
    next();
});

app.use(keycloak.middleware());
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Session:', req.session);
    next();
});

app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Session:', req.session);
    console.log('Keycloak Config:', keycloakConfig);
    next();
});
// Proteggi le tue routes
app.get("/test", [keycloak.protect('amministratore')], async (req, res) => {
    try {
        const userInfo = {
            username: req.kauth.grant.access_token.content.preferred_username,
            email: req.kauth.grant.access_token.content.email,
            name: req.kauth.grant.access_token.content.name,
            givenName: req.kauth.grant.access_token.content.given_name,
            familyName: req.kauth.grant.access_token.content.family_name,
            roles: {
                realm: req.kauth.grant.access_token.content.realm_access?.roles,
                resource: req.kauth.grant.access_token.content.resource_access
            }
        };

        console.log('User Info:', userInfo);

        return res.status(200).json({
            success: true,
            userInfo: userInfo
        });
    } catch (error) {
        console.error('Test route error:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint per ottenere tutte le scuole in città (solo una volta)
app.get('/api/scuole/citta', (req, res) => {
    axios.get('http://localhost:3001/api/scuole/citta')  // Chiamata al server Java
        .then(response => res.json(response.data))  // Risposta dal server Java
        .catch(error => res.status(500).json({ error: 'Errore nel recupero delle città delle scuole', details: error.message }));
});

// Endpoint per ottenere le scuole in una città specifica
app.get('/api/scuole/:city', (req, res) => {
    const city = req.params.city;
    axios.get(`http://localhost:3001/api/scuole/${city}`)  // Chiamata al server Java con parametro city
        .then(response => res.json(response.data))  // Risposta dal server Java
        .catch(error => res.status(500).json({ error: 'Errore nel recupero delle scuole per la città', details: error.message }));
});

// Endpoint per ottenere il piano massimo di una scuola per ID
app.get('/api/scuole/maxfloor/:schoolId', (req, res) => {
    const schoolId = req.params.schoolId;
    axios.get(`http://localhost:3001/api/scuole/maxfloor/${schoolId}`)  // Chiamata al server Java con ID scuola
        .then(response => res.json(response.data))  // Risposta dal server Java
        .catch(error => res.status(500).json({ error: 'Errore nel recupero del piano massimo per la scuola', details: error.message }));
});

// Endpoint per ottenere le macchinette in base a ID scuola e piano
app.get('/api/macchinette/info/:schoolId/:floor', (req, res) => {
    const schoolId = req.params.schoolId;
    const floor = req.params.floor;
    axios.get(`http://localhost:3001/api/macchinette/info/${schoolId}/${floor}`)  // Chiamata al server Java
        .then(response => res.json(response.data))  // Risposta dal server Java
        .catch(error => res.status(500).json({ error: 'Errore nel recupero delle macchinette per scuola e piano', details: error.message }));
});

// Info cialde tramite MQTT
app.get('/api/macchinette/cialde/:machineId', (req, res) => {
    const machineId = req.params.machineId;
    axios.get(`http://localhost:3001/api/macchinette/cialde/${machineId}`)  // Chiamata al server Java
        .then(response => res.json(response.data))  // Risposta dal server Java
        .catch(error => res.status(500).json({ error: 'Errore nel recupero delle informazioni cialde', details: error.message }));
});

// Info guasti tramite MQTT
app.get('/api/macchinette/guasti/:machineId', (req, res) => {
    const machineId = req.params.machineId;
    axios.get(`http://localhost:3001/api/macchinette/guasti/${machineId}`)  // Chiamata al server Java
        .then(response => res.json(response.data))  // Risposta dal server Java
        .catch(error => res.status(500).json({ error: 'Errore nel recupero delle informazioni guasti', details: error.message }));
});

// Info cassa tramite MQTT
app.get('/api/macchinette/cassa/:machineId', (req, res) => {
    const machineId = req.params.machineId;
    axios.get(`http://localhost:3001/api/macchinette/cassa/${machineId}`)  // Chiamata al server Java
        .then(response => res.json(response.data))  // Risposta dal server Java
        .catch(error => res.status(500).json({ error: 'Errore nel recupero delle informazioni cassa', details: error.message }));
});

// Dettagli macchinetta
app.get('/api/macchinetta/dettagli/:machineId', (req, res) => {
    const machineId = req.params.machineId;
    axios.get(`http://localhost:3001/api/macchinetta/dettagli/${machineId}`)  // Chiamata al server Java
        .then(response => res.json(response.data))  // Risposta dal server Java
        .catch(error => res.status(500).json({ error: 'Errore nel recupero dei dettagli della macchinetta', details: error.message }));
});

app.post('/api/new/school', (req, res) => {
    const schoolData = req.body; // Dati inviati dal client
    console.log("body:"+ req.body)
    axios.post('http://localhost:3001/api/new/school', schoolData) // Chiamata al server Java
        .then(response => res.json(response.data)) // Risposta dal server Java
        .catch(error => 
            res.status(500).json({ 
                error: 'Errore nell\'invio dei dettagli della scuola', 
                details: error.message 
            })
        );
});

app.post('/api/new/machine', (req, res) => {
    const machineData = req.body; // Dati inviati dal client
    console.log("Body in server:", JSON.stringify(req.body, null, 2));
    axios.post('http://localhost:3001/api/new/machine', machineData) // Chiamata al server Java
        .then(response => res.json(response.data)) // Risposta dal server Java
        .catch(error => 
            res.status(500).json({ 
                error: 'Errore nell\'invio dei dettagli della macchinetta', 
                details: error.message 
            })
        );
});

app.delete('/api/delete/:machineId', (req, res) => {
    console.log("server js")
    const machineId = req.params.machineId;
    axios.delete(`http://localhost:3001/api/delete/${machineId}`) // Chiamata al server Java
        .then(response => res.json(response.data)) // Risposta dal server Java
        .catch(error => 
            res.status(500).json({ 
                error: 'Errore nell\'invio dei dettagli della macchinetta', 
                details: error.message 
            })
        );
});

// Start server
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
