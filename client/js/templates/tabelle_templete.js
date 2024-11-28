"use strict";

import { getMachineDetails } from "../api.js";

// Funzione che genera il markup HTML per la tabella delle cialde
async function createCialdeTable(cialdeData) {
    let tableHTML = `
        <h2>1. Cialde Disponibili</h2>
        <table id="cialdeTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome Cialda</th>
                    <th>Disponibili</th>
                    <th>Massimo</th>
                </tr>
            </thead>
            <tbody>
    `;

    try {
        // Verifica che l'input sia un array di oggetti validi
        if (!Array.isArray(cialdeData)) {
            throw new Error("L'input deve essere un array di oggetti JSON.");
        }

        // Aggiunge il markup per ogni cialda
        tableHTML += cialdeData.map(cialda => {
            if (
                cialda.id === undefined || 
                cialda.nome === undefined || 
                cialda.n_disponibili === undefined || 
                cialda.n_max === undefined
            ) {
                console.error("Oggetto cialda non valido:", cialda);
                return `<tr><td colspan="4">Dati mancanti per una cialda</td></tr>`;
            }
            return `
                <tr>
                    <td>${cialda.id}</td>
                    <td>${cialda.nome}</td>
                    <td>${cialda.n_disponibili}</td>
                    <td>${cialda.n_max}</td>
                </tr>
            `;
        }).join('');

        // Chiude la tabella
        tableHTML += `
            </tbody>
        </table>
        `;
    } catch (error) {
        console.error("Errore durante la creazione della tabella delle cialde:", error);
        tableHTML = `<p>Errore: ${error.message}</p>`;
    }

    return tableHTML;
}


async function createGuastiTable(guastiData) {
    let tableHTML = `
        <h2>1. Stato Macchinetta</h2>
        <table id="guastiTable">
            <thead>
                <tr>
                    <th>Tipologia</th>
                    <th>Stato</th>
                </tr>
            </thead>
            <tbody>
    `;

    try {
        // Verifica che l'input sia un array di oggetti validi
        if (!Array.isArray(guastiData)) {
            throw new Error("L'input deve essere un array di oggetti JSON.");
        }

        // Aggiunge il markup per ogni guasto
        tableHTML += guastiData.map(guasto => {
            if (guasto.tipo === undefined || 
                guasto.stato === undefined
            ) {
                console.error("Oggetto guasto non valido:", guasto);
                return `<tr><td colspan="4">Dati mancanti per un guasto</td></tr>`;
            }
            return `
                <tr>
                    <td>${guasto.tipo}</td>
                    <td>${fuasto.stato}</td>
                </tr>
            `;
        }).join('');

        // Chiude la tabella
        tableHTML += `
            </tbody>
        </table>
        `;
    } catch (error) {
        console.error("Errore durante la creazione della tabella dei guasti:", error);
        tableHTML = `<p>Errore: ${error.message}</p>`;
    }

    return tableHTML;
}

async function renderMachineDetails(machineId) {
    try {
        // Recupera i dettagli della macchinetta
        const details = await getMachineDetails(machineId);

        // Genera il markup HTML
                
        const machineHTML = `
            <h3>Dettagli Macchinetta</h3>
            <ul>
                <li><strong>Città:</strong> ${details.city}</li>
                <li><strong>Nome Istituto:</strong> ${details.schoolName}</li>
                <li><strong>Piano:</strong> ${details.floor}</li>
                <li><strong>ID Macchinetta:</strong> ${details.machineId}</li>
            </ul>
        `;

        // Seleziona il contenitore dove aggiungere i dettagli
        const container = document.getElementById('machineDetailsContainer');
        if (container) {
            container.innerHTML = machineHTML;
        } else {
            console.error("Contenitore per i dettagli della macchinetta non trovato.");
        }
    } catch (error) {
        console.error("Errore durante il rendering dei dettagli della macchinetta:", error.message);
    }
}

export { createCialdeTable,renderMachineDetails,createGuastiTable };
