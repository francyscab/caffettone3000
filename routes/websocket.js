const express = require('express');
const router = express.Router();
const expressWs = require('express-ws');
const WebSocket = require('ws');

expressWs(router);

const wsLogger = (ws, req, next) => {
    console.log('WebSocket connection attempt:', {
        path: req.path,
        query: req.query,
        timestamp: new Date().toISOString()
    });
    next();
};

router.ws('/consumables', wsLogger, (ws, req) => {
    const { machineId, instituteId } = req.query;
    
    console.log(`Nuova connessione WebSocket per machineId: ${machineId}, instituteId: ${instituteId}`);

    const sparkWs = new WebSocket(`wss://localhost:4567/ws/consumables?machineId=${machineId}&instituteId=${instituteId}`, {
        rejectUnauthorized: false
    });

    sparkWs.binaryType = 'nodebuffer';

    ws.on('message', (data) => {
        if (sparkWs.readyState === WebSocket.OPEN) {
            const message = data instanceof Buffer ? data.toString() : data;
            console.log('Messaggio dal client:', message);
            sparkWs.send(message);
        }
    });

    sparkWs.on('message', (data) => {
        if (ws.readyState === WebSocket.OPEN) {
            const message = data instanceof Buffer ? data.toString() : data;
            console.log('Messaggio da Spark:', message);
            
            try {
                // Verifica che sia un JSON valido
                JSON.parse(message);
                // Invia come stringa
                ws.send(message.toString());
            } catch (error) {
                console.error('Errore nel parsing del messaggio:', error);
                ws.send(JSON.stringify({ error: 'Errore nel formato dei dati' }));
            }
        }
    });

    ws.on('close', () => {
        console.log('Client WebSocket chiuso');
        if (sparkWs.readyState === WebSocket.OPEN) {
            sparkWs.close();
        }
    });

    sparkWs.on('close', () => {
        console.log('Spark WebSocket chiuso');
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
    });

    ws.on('error', (error) => {
        console.error('Errore WebSocket client:', error);
    });

    sparkWs.on('error', (error) => {
        console.error('Errore WebSocket Spark:', error);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ error: 'Errore nella comunicazione con il server' }));
        }
    });
});

module.exports = router;