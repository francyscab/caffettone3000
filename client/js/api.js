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
}*//*

async function addEvent(event) {
    console.log("add event")
    let response = await fetch('/api/eventi', {
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

//export {getEvents,addEvent,getByCourse,getSubscribers,getSubByID};
export{getAllCities,getSchoolsByCity,getMaxFloorBySchoolId,getMachineIdsBySchoolIdAndFloor,getMachineCialdeInfo}