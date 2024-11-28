
"use strict";

// DAO (Data Access Object) module for accessing course and exams

const mysql = require('mysql2');
const mqtt=require('mqtt');
const { resolve } = require('path');

// Crea la connessione a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Calzino99!',
    database: 'amministrativodb'
});




let client = null;

function getClient() {
    if (!client) {
        client = mqtt.connect('tcp://broker.emqx.io:1883');
        client.on('error', (error) => {
            console.error('Errore di connessione:', error);
        });
    }
    return client;
}

exports.requestMachineInfoCialde = function(machineId) {    
    return new Promise((resolve, reject) => {
        const mqttClient = getClient();
        console.log("Inizializzazione richiesta MQTT");

        const responseTopicCialda = `/info/risposta/cialde/${machineId}`;
        
        
        mqttClient.on('connect', () => {
            console.log('Connesso al broker MQTT');
            
            const message = JSON.stringify({ id: machineId, richiesta: 'cialde' });
                mqttClient.publish('/info', message, (error) => {
                    if (error) {
                        console.error('Errore nella pubblicazione:', error);
                        reject(error);
                        return;
                    }
                    console.log('Messaggio pubblicato:', message);
                });
            
            mqttClient.subscribe(responseTopicCialda, (err) => {
                if (err) {
                    console.error('Errore nella sottoscrizione:', err);
                    reject(err);
                    return;
                }
            });

            
        });

        mqttClient.on('message', (topic, message) => {
            console.log('Messaggio ricevuto sul topic:', topic);
            console.log('Contenuto del messaggio:', message.toString());
            
            try {
                const cialdeInfo = JSON.parse(message.toString());
                console.log('Informazioni cialde ricevute:', cialdeInfo);
                resolve(cialdeInfo);
            } catch (err) {
                console.error('Errore nel parsing del messaggio:', err);
                reject(err);
            }
        });

        setTimeout(() => {
            reject(new Error('Timeout - Nessuna risposta ricevuta'));
        }, 1000000);
    });
};


exports.requestMachineInfoGuasti = function(machineId) {    
    return new Promise((resolve, reject) => {
        const mqttClient = getClient();
        console.log("Inizializzazione richiesta MQTT");

        const responseTopicGuasti = `/info/risposta/guasti/${machineId}`;
        
        
        mqttClient.on('connect', () => {
            console.log('Connesso al broker MQTT');
            
            const message = JSON.stringify({ id: machineId, richiesta: 'cialde' });
                mqttClient.publish('/info', message, (error) => {
                    if (error) {
                        console.error('Errore nella pubblicazione:', error);
                        reject(error);
                        return;
                    }
                    console.log('Messaggio pubblicato:', message);
                });

            mqttClient.subscribe(responseTopicGuasti, (err) => {
                if (err) {
                    console.error('Errore nella sottoscrizione:', err);
                    reject(err);
                    return;
                }
            });
        });

        mqttClient.on('message', (topic, message) => {
            console.log('Messaggio ricevuto sul topic:', topic);
            console.log('Contenuto del messaggio:', message.toString());
            
            try {
                const cialdeInfo = JSON.parse(message.toString());
                console.log('Informazioni cialde ricevute:', cialdeInfo);
                resolve(cialdeInfo);
            } catch (err) {
                console.error('Errore nel parsing del messaggio:', err);
                reject(err);
            }
        });

        setTimeout(() => {
            reject(new Error('Timeout - Nessuna risposta ricevuta'));
        }, 1000000);
    });
};


exports.requestMachineInfoCassa = function(machineId) {    
    return new Promise((resolve, reject) => {
        const mqttClient = getClient();
        console.log("Inizializzazione richiesta MQTT");

        const responseTopicCassa = `/info/risposta/cassa/${machineId}`;
        
        
        mqttClient.on('connect', () => {
            console.log('Connesso al broker MQTT');
            
            const message = JSON.stringify({ id: machineId, richiesta: 'cialde' });
                mqttClient.publish('/info', message, (error) => {
                    if (error) {
                        console.error('Errore nella pubblicazione:', error);
                        reject(error);
                        return;
                    }
                    console.log('Messaggio pubblicato:', message);
                });
            
            mqttClient.subscribe(responseTopicCassa, (err) => {
                if (err) {
                    console.error('Errore nella sottoscrizione:', err);
                    reject(err);
                    return;
                }
            });
        });

        mqttClient.on('message', (topic, message) => {
            console.log('Messaggio ricevuto sul topic:', topic);
            console.log('Contenuto del messaggio:', message.toString());
            
            try {
                const cialdeInfo = JSON.parse(message.toString());
                console.log('Informazioni cialde ricevute:', cialdeInfo);
                resolve(cialdeInfo);
            } catch (err) {
                console.error('Errore nel parsing del messaggio:', err);
                reject(err);
            }
        });

        setTimeout(() => {
            reject(new Error('Timeout - Nessuna risposta ricevuta'));
        }, 1000000);
    });
};



exports.getAllSubscribers= function(){
    return new Promise((resolve, reject) => {
        // read from db all the event
        const sql = "SELECT * FROM iscritti";
        db.all(sql, (err,rows)=> {
            if (err) {
                reject(err);
                return;
            }
            // transform 'rows' (query results) into an array of objects
            const subscriber = rows.map( row => ({
                id:row.id,
                nome:row.nome, 
                cognome:row.cognome,
                anno_nascita:row.anno_nascita, 
                indirizzo:row.indirizzo, 
                citta_nascita:row.citta_nascita,
                anno_iscrizione:row.anno_iscrizione,
                cf:row.cf
            }));
            resolve(subscriber);
        });
    });
}
//parte nuova

//restituisce tutte le città in oridne alfabetico
exports.getAllCitiesWithSchools = function() {
    console.log("dao")
    return new Promise((resolve, reject) => {
        // Query per selezionare le città (indirizzi delle scuole), rimuovendo i duplicati e ordinando
        const sql = "SELECT DISTINCT citta FROM Scuole ORDER BY citta ASC";
        db.query(sql, (err, rows) => {
            if (err) {
                reject(err);
                console.log("errore dao")
                return;
            }

            // Trasforma 'rows' in un array di oggetti contenenti gli indirizzi
            const cities = rows.map(row => ({
                citta: row.citta
            }));
            resolve(cities);
        });
    });
};

//restituisce tutte le scuole data la città
exports.getSchoolNamesAndIdsByCity = function(city) {
    return new Promise((resolve, reject) => {
        // Query per selezionare ID e nome delle scuole nella città specificata
        const sql = "SELECT id, nome FROM Scuole WHERE citta = ?";

        db.query(sql, [city], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            // Trasforma 'rows' in un array di oggetti contenenti ID e nome delle scuole
            const schools = rows.map(row => ({
                id: row.id,
                nome: row.nome
            }));
            resolve(schools);
        });
    });
};

//restituisce piano piu alto di una scuola( per ciclare sui piani)
exports.getMaxFloorBySchoolId = function(schoolId) {
    return new Promise((resolve, reject) => {
        // Query per selezionare il piano massimo della scuola specificata
        const sql = "SELECT MAX(piano) AS maxFloor FROM macchinette WHERE id_scuola = ?";

        db.query(sql, [schoolId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            // Restituisce il piano massimo trovato, o null se non ci sono macchinette
            const maxFloor = rows.length > 0 ? rows[0].maxFloor : null;
            resolve(maxFloor);
        });
    });
};


//restituisce id macchinette su specifico piano e di specifica scuola
exports.getMachineIdsBySchoolIdAndFloor = function(schoolId, floor) {
    return new Promise((resolve, reject) => {
        // Query per selezionare solo gli ID delle macchinette per la scuola e il piano specificati
        const sql = "SELECT id FROM macchinette WHERE id_scuola = ? AND piano = ?";

        db.query(sql, [schoolId, floor], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            // Trasforma 'rows' in un array contenente solo gli ID delle macchinette
            const machineIds = rows.map(row => row.id);

            resolve(machineIds);
        });
    });
};

//restituisce dettagli macchinetta dato id
exports.getMachineDetailsById = function(machineId) {
    console.log("Recupero dettagli macchinetta...");
    return new Promise((resolve, reject) => {
        // Query SQL per unire le tabelle macchinette e scuole
        const sql = `
            SELECT 
                macchinette.id AS machineId,
                macchinette.piano AS floor,
                scuole.nome AS schoolName,
                scuole.citta AS city
            FROM 
                macchinette
            JOIN 
                scuole ON macchinette.id_scuola = scuole.id
            WHERE 
                macchinette.id = ?`;

        // Esegui la query con il parametro machineId
        db.query(sql, [machineId], (err, rows) => {
            if (err) {
                reject(err);
                console.log("Errore durante il recupero dei dettagli della macchinetta:", err);
                return;
            }

            if (rows.length === 0) {
                reject(new Error(`Macchinetta con ID ${machineId} non trovata.`));
                return;
            }

            // Estrarre il primo risultato (le macchinette hanno ID univoco)
            const details = {
                machineId: rows[0].machineId,
                floor: rows[0].floor,
                schoolName: rows[0].schoolName,
                city: rows[0].city
            };
            resolve(details);
        });
    });
};


/*exports.requestMachineInfoCialde = function (machineId) {    
    console.log("00000000000000000000000000000")
    return new Promise((resolve, reject) => {
        // Gestisci gli errori di connessione
        client.on('error', (error) => {
            console.error('Errore di connessione:', error);
            reject(error);
            client.end();
        });

        client.on('connect', () => {
            console.log('Connesso al broker MQTT');
            
            // Sottoscrivi al topic di risposta prima di pubblicare la richiesta
            const responseTopic = '/info/risposta/${machineId}';
            client.subscribe(responseTopic, (err) => {
                if (err) {
                    console.error('Errore nella sottoscrizione:', err);
                    reject(err);
                    client.end();
                    return;
                }
                
                // Pubblica il messaggio di richiesta
                const message = JSON.stringify({ id: machineId, richiesta: 'cialde' });
                client.publish('/info', message, (error) => {
                    if (error) {
                        console.error('Errore nella pubblicazione:', error);
                        reject(error);
                        client.end();
                        return;
                    }
                    console.log('Messaggio pubblicato:', message);
                });
            });
        });

        // Gestione dei messaggi in arrivo
        client.on('message', (topic, message) => {
            console.log('Messaggio ricevuto sul topic:', topic);
            console.log('Contenuto del messaggio:', message.toString());
            
            if (topic === '/info/risposta/${machineId}') {
                try {
                    const cialdeInfo = JSON.parse(message.toString());
                    console.log('Informazioni cialde ricevute:', cialdeInfo);
                    resolve(cialdeInfo);
                } catch (err) {
                    console.error('Errore nel parsing del messaggio:', err);
                    reject(err);
                } finally {
                    client.end();
                }
            }
        });

        // Timeout dopo 10 secondi se non si riceve risposta
        setTimeout(() => {
            console.log('Timeout della richiesta');
            reject(new Error('Timeout - Nessuna risposta ricevuta'));
            client.end();
        }, 10000);
    });
};*/

