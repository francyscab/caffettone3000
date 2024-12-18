import Evento from './evento.js';
import Subscriber from './subscriber.js';

/**
 * Get the list of events
 */
/*
async function getEvents() {
    let response = await fetch('/api/eventi');
    const eventiJson = await response.json();
    if (response.ok) {
        return eventiJson;
    } else {
        throw eventiJson;  // an object with the error coming from the server
    }
}*/

async function addSchool(event) {
    console.log("add school")
    let response = await fetch('/api/new/school', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(event),
    })
    if(response.ok) {
        
        return ;
    }
    else {
        const respJson = await response.json();
            throw respJson;
    }
}

async function addMachine(event) {
    console.log("add machine")
    let response = await fetch('/api/new/machine', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(event),
    })
    if(response.ok) {
        
        return ;
    }
    else {
        const respJson = await response.json();
            throw respJson;
    }
}

   /**
     * Return a filtered array, with only the event of a specific course
     * @param {*} course 
     *//*
   async function getByCourse(course){
    console.log("ricerca"+course);
    let events = await getEvents();
    console.log(events.filter(e => e.corse.includes(course)))
    return events.filter(e => e.corse.includes(course));
}


async function getSubscribers() {
    let response = await fetch('/api/iscritti');
    const iscrittiJson = await response.json();
    if (response.ok) {
        return iscrittiJson;
    } else {
        throw iscrittiJson;  // an object with the error coming from the server
    }
}

async function getSubByID(id){
    let trovato=null;
    console.log("ricerca"+id);
    let subs = await getSubscribers();
    for(let e of subs){
        if(e.id==id){
            trovato=e;
        }
    }
    return trovato;
}
*/

//codice nuovo
// Funzione per ottenere tutte le città in cui ci sono scuole
async function getAllCities() {
    let response = await fetch('/api/scuole/citta');
    const citiesJson = await response.json();
    if (response.ok) {
        return citiesJson;
    } else {
        throw citiesJson;
    }
}

// Funzione per ottenere tutte le scuole in una città specifica
async function getSchoolsByCity(city) {
    let response = await fetch(`/api/scuole/${city}`);
    const schoolsJson = await response.json();
    if (response.ok) {
        console.log(response)
        return schoolsJson;
    } else {
        throw schoolsJson;
    }
}

// Funzione per ottenere il piano massimo di una scuola per ID
async function getMaxFloorBySchoolId(schoolId) {
    let response = await fetch(`/api/scuole/maxfloor/${schoolId}`);
    const maxFloorJson = await response.json();
    if (response.ok) {
        return maxFloorJson;
    } else {
        throw maxFloorJson;
    }
}

// Funzione per ottenere le macchinette in base a ID scuola e piano
async function getMachineIdsBySchoolIdAndFloor(schoolId, floor) {
    let response = await fetch(`/api/macchinette/info/${schoolId}/${floor}`);
    const machineIdsJson = await response.json();
    if (response.ok) {
        return machineIdsJson;
    } else {
        throw machineIdsJson;
    }
}

//mqtt
async function getMachineCialdeInfo(machineId) {
    console.log('Requesting cialde info for machine:', machineId);
    
    try {
        let response = await fetch(`/api/macchinette/cialde/${machineId}`);
        console.log(machineId)
        
        console.log('Response status:', response.status);
        
        const text = await response.text();
        //console.log('Raw response:', text);
        
        if (!response.ok) {
            console.log("errore api ")
        }
        
        const machineInfoJson = JSON.parse(text);
        console.log('Parsed machine info:', machineInfoJson);
        return machineInfoJson;
    } catch (error) {
        console.error('Error in getMachineCialdeInfo:', error);
        throw error;
    }
}


async function getMachineGuastiInfo(machineId) {
    console.log('Requesting guasti info for machine:', machineId);
    
    try {
        let response = await fetch(`/api/macchinette/guasti/${machineId}`);
        console.log(machineId)
        
        console.log('Response status:', response.status);
        
        const text = await response.text();
        //console.log('Raw response:', text);
        
        if (!response.ok) {
            console.log("errore api ")
        }
        
        const machineInfoJson = JSON.parse(text);
        console.log('Parsed machine info:', machineInfoJson);
        return machineInfoJson;
    } catch (error) {
        console.error('Error in getMachineGuastiInfo:', error);
        throw error;
    }
}

async function getMachineCassaInfo(machineId) {
    console.log('Requesting cassa info for machine:', machineId);
    
    try {
        let response = await fetch(`/api/macchinette/cassa/${machineId}`);
        console.log(machineId)
        
        console.log('Response status:', response.status);
        
        const text = await response.text();
        //console.log('Raw response:', text);
        
        if (!response.ok) {
            console.log("errore api ")
        }
        
        const machineInfoJson = JSON.parse(text);
        console.log('Parsed machine info:', machineInfoJson);
        return machineInfoJson;
    } catch (error) {
        console.error('Error in getMachineCassaInfo:', error);
        throw error;
    }
}


async function getMachineDetails(machineId) {
    console.log("getmachinedetalis")
    // Esegui la richiesta all'endpoint API
    const response = await fetch(`/api/macchinetta/dettagli/${machineId}`);
    
    // Converti la risposta in JSON
    const machineDetails = await response.json();

    // Controlla se la risposta è andata a buon fine
    if (response.ok) {
        return machineDetails;
    } else {
        throw new Error(machineDetails.message || "Errore durante il recupero dei dettagli della macchinetta.");
    }
}

//export {getEvents,addEvent,getByCourse,getSubscribers,getSubByID};
export{getAllCities,getSchoolsByCity,getMaxFloorBySchoolId,getMachineIdsBySchoolIdAndFloor,getMachineCialdeInfo,getMachineDetails,getMachineGuastiInfo,getMachineCassaInfo,addSchool,addMachine}