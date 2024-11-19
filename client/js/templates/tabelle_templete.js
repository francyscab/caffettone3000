"use strict";
function createCialdeTable(cialdeData) {
    // Iniziamo a costruire la tabella
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

    // Aggiungiamo i dati di ogni cialda
    tableHTML += cialdeData.map(cialda => `
        <tr>
            <td>${cialda.id}</td>
            <td>${cialda.nome}</td>
            <td>${cialda.n_disponibili}</td>
            <td>${cialda.n_max}</td>
        </tr>
    `).join('');

    // Chiudiamo la tabella
    tableHTML += `
            </tbody>
        </table>
    `;

    return tableHTML;
}