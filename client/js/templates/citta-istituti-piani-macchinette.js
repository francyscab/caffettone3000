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
                                    ${machineIds.map(id => `<li><button class="machine-button" id="machine-${id}">Macchinetta ID: ${id}</button></li>`).join('')}
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

    } catch (error) {
        console.error("Errore durante il caricamento delle città o delle scuole:", error);
    }
    return totalMarkup;
}

export{loadCitiesAndSchools}