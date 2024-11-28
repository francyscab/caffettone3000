// imports
const express = require("express");
const morgan = require("morgan");
const path = require('path');


const {check, validationResult} = require('express-validator');

const dao = require("./dao.js");

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

// Endpoint per ottenere tutte le scuole in città (solo una volta)
app.get('/api/scuole/citta', (req, res) => {
    dao.getAllCitiesWithSchools()
        .then(cities => res.json(cities))
        .catch(error => res.status(500).json(error));
});

// Endpoint per ottenere le scuole in una città specifica
app.get('/api/scuole/:city', (req, res) => {
    const city = req.params.city;
    dao.getSchoolNamesAndIdsByCity(city)
        .then(schools => res.json(schools))
        .catch(error => res.status(500).json(error));
});

// Endpoint per ottenere il piano massimo di una scuola per ID
app.get('/api/scuole/maxfloor/:schoolId', (req, res) => {
    const schoolId = req.params.schoolId;
    console.log("idScuola:"+schoolId)
    dao.getMaxFloorBySchoolId(schoolId)
        .then(maxFloor => res.json(maxFloor))
        .catch(error => res.status(500).json(error));
});
app.use((req, res, next) => {
    console.log('Richiesta ricevuta:', req.method, req.url);
    next();
});

// Endpoint per ottenere le macchinette in base a ID scuola e piano
app.get('/api/macchinette/info/:schoolId/:floor', (req, res) => {
    const schoolId = req.params.schoolId;
    const floor = req.params.floor;
    console.log("Sono qua");
    dao.getMachineIdsBySchoolIdAndFloor(schoolId, floor)
        .then(machineIds => res.json(machineIds))
        .catch(error => res.status(500).json(error));
});


//info mqtt
app.get('/api/macchinette/cialde/:machineId', (req, res) => {
    
    const machineId = req.params.machineId;
    console.log("id:"+machineId)
    console.log('Informazioni cialde richieste (server):', machineId);
    dao.requestMachineInfoCialde(machineId)
        .then(machineInfo =>res.json(machineInfo))
        .catch(error => res.status(500).json({ error: error.message }));
});

app.get('/api/macchinette/guasti/:machineId', (req, res) => {
    
    const machineId = req.params.machineId;
    console.log("id:"+machineId)
    console.log('Informazioni guasti richieste (server):', machineId);
    dao.requestMachineInfoGuasti(machineId)
        .then(machineInfo =>res.json(machineInfo))
        .catch(error => res.status(500).json({ error: error.message }));
});

app.get('/api/macchinette/cassa/:machineId', (req, res) => {
    
    const machineId = req.params.machineId;
    console.log("id:"+machineId)
    console.log('Informazioni cassa richieste (server):', machineId);
    dao.requestMachineInfoCassa(machineId)
        .then(machineInfo =>res.json(machineInfo))
        .catch(error => res.status(500).json({ error: error.message }));
});

app.get('/api/macchinetta/dettagli/:machineId', (req, res) => {
    console.log("serverrrrrrrrr")
    const machineId = req.params.machineId;
    console.log(`Richiesta dettagli per la macchinetta con ID: ${machineId}`);

    // Chiamata alla funzione getMachineDetailsById per recuperare i dettagli della macchina
    dao.getMachineDetailsById(machineId)
        .then(machineDetails => {
            // Se la macchina è trovata, restituisci i dettagli in formato JSON
            res.json(machineDetails);
        })
        .catch(error => {
            // Se c'è un errore, restituisci un errore con stato 500
            res.status(500).json({ error: 'Errore nel recupero dei dettagli della macchinetta', details: error });
        });
});

app.listen(port, () => console.log(`server listening at http://localhost:${port}`));