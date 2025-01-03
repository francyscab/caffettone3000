"use strict";

// Importa le funzioni necessarie
import { getAllCities,getSchoolsByCity,getMaxFloorBySchoolId,getMachineIdsBySchoolIdAndFloor } from "../api.js";
// Funzione che genera il markup con le scuole all'interno dei <li>
async function loadCitiesAndSchools() {
    let totalMarkup = '<ul>'; // Iniziamo una lista per contenere le città
    try {
        // Passo 1: Ottieni tutte le città
        const cities = await getAllCities();
        console.log("Città ottenute:", cities);
        // Passo 2: Per ogni città, ottieni le scuole
        for (const city of cities) {
            // Inizio del markup per la città
            totalMarkup += `
                <li class="col m">
                    <div class="dropdown">
                        <button class="dropbtn" id="id_${city.citta}">${city.citta}</button>
                        <div class="dropdown-content" id="dropdown-${city.citta}">
                            <ul class="school-list">
                            <!-- Qui verranno aggiunti gli istituti -->
            `;

            const schools = await getSchoolsByCity(city.citta);
            console.log(`Scuole per la città ${city.citta}:`, schools);

            // Passo 3: Crea il markup HTML per le scuole
            for (const school of schools) {
                // Aggiungi il markup della scuola come <li> con un bottone per il nome
                totalMarkup += `
                    <li class="school">
                        <button class="school-name" id="school-${school.id}">${school.nome}</button>
                        ${createAddMachine(school.id)}
                        <ul class="floors" id="floors-${school.id}">
                            <!-- Qui verranno aggiunti i piani -->
                `;

                // Passo 4: Per ogni scuola, calcola il piano massimo e ottieni le macchinette
                const maxFloor = await getMaxFloorBySchoolId(school.id);
                console.log(`Massimo piano per la scuola ${school.nome}:`, maxFloor);

                // Passo 5: Per ogni piano, cerca le macchinette
                for (let floor = 0; floor <= maxFloor; floor++) {
                    const machineIds = await getMachineIdsBySchoolIdAndFloor(school.id, floor);
                    console.log(`Macchinette al piano ${floor} per la scuola ${school.nome}:`, machineIds);

                    // Solo se ci sono macchinette, crea il markup per il piano
                    if (machineIds.length > 0) {
                        const floorMarkup = `
                            <li class="floor">
                                <h4>Piano ${floor}</h4>
                                <ul class="machine-list">
                                    ${machineIds.map(id => `<li>
                                        <button class="machine-button" id="machine-${id}">Macchinetta ID: ${id}</button>
                                        ${createDeleteMachine(school.id,id)}
                                    </li>`).join('')}
                        
                                </ul>
                            </li>
                        `;
                        // Aggiungi il markup del piano alla lista della scuola
                        totalMarkup += floorMarkup;
                    }
                }

                // Chiudi la lista dei piani della scuola
                totalMarkup += '</ul>'; // Chiude la lista dei piani
                totalMarkup += '</li>'; // Chiude il <li> della scuola
            }

            // Chiudi il dropdown della città
            totalMarkup += '</ul></div></li>'; 
        }

        totalMarkup += '</ul>'; // Chiudi la lista principale delle città
        //const modalHTML = createAddMachineModal();
        //document.body.innerHTML += modalHTML; 

    } catch (error) {
        console.error("Errore durante il caricamento delle città o delle scuole:", error);
    }
    return totalMarkup;
}

function createAddMachine(schoolName,cityName) {
    return `<!--button aggiungi-->
    <button id="addMachineButton" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-machine-modal" data-scuola="${schoolName}">+</button>`;
}

function createDeleteMachine(schoolName,machineId) {
    return `<!--button delete-->
    <button id="deleteMachineButton" type="button" data-scuola="${schoolName}" data-machine="${machineId}">-</button>`;
}

function createAddSchool() {
    return `<!--button aggiungi-->
    <button id="addSchoolButton" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-school-modal">+</button>
    <!--modal-->
    <div class="row">
        <div class="modal" id="add-school-modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Aggiungi un nuovo istituto</h5>
                        <button id="close-modal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form role="form" method="POST" id="add-school-form">
                        <div class="modal-body">              
                            <div class="mb-3">
                                <label for="citta" class="col-form-label">Città</label>
                                <input type="text" id="citta_form" required class="form-control"/>
                            </div>
                            <div class="mb-3">
                                <label for="istituto" class="col-form-label">Istituto</label>
                                <input type="text" id="istituto_form" required class="form-control"/>
                            </div>
                            <div class="mb-3">
                                <label for="indirizzo" class="col-form-label">Indirizzo</label>
                                <input type="text" id="indirizzo_form" required class="form-control"/>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="form-group">
                                <div>
                                    <button type="submit" class="btn btn-primary">Salva</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`;
}

function createAddMachineModal() {
    return `
    <div class="modal" id="add-machine-modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Aggiungi una nuova macchinetta</h5>
                    <button id="close-modal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form role="form" method="POST" id="add-machine-form">
                    <div class="modal-body">              
                        <div class="mb-3">
                            <label for="piano" class="col-form-label">Piano</label>
                            <input type="number" id="piano_form" required class="form-control" min="0" max="15"/>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="form-group">
                            <div>
                                <button type="submit" class="btn btn-primary">Salva</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
}


export{loadCitiesAndSchools,createAddSchool,createAddMachineModal}