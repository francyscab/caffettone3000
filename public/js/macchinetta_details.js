async function fetchRicaviMacchinetta(macchinaId, istitutoId) {
    try {
        const response = await fetch(
            `/macchinette/istituto/${istitutoId}/macchinetta/ricavi/${macchinaId}`
        );
        if (response.status === 404) {
            document.getElementById("totaleRicavi").textContent = "€ 0.00";
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        document.getElementById("totaleRicavi").textContent = `€ ${data.toFixed(2)}`;
    } catch (error) {
        console.error("Errore nel recupero dei ricavi:", error);
        document.getElementById("totaleRicavi").textContent = "€ 0.00";
    }
}

async function fetchStoricoRicavi(macchinaId, istitutoId) {
    try {
        const response = await fetch(
            `/macchinette/istituto/${istitutoId}/macchinetta/storico-ricavi/${macchinaId}`
        );
        let ricavi = [];

        if (response.status === 404) {
            ricavi = [];
        } else {
            ricavi = await response.json();
        }

        updateRicaviTable(ricavi);
        updateRicaviChart(ricavi);
    } catch (error) {
        console.error("Errore nel recupero dello storico ricavi:", error);
        handleRicaviError();
    }
}

function updateRicaviTable(ricavi) {
    const tableBody = document.getElementById("ricaviTableBody");
    if (ricavi.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Nessun ricavo registrato</td></tr>';
        return;
    }

    tableBody.innerHTML = ricavi
        .sort((a, b) => new Date(b.data_ricavo) - new Date(a.data_ricavo))
        .map(ricavo => `
            <tr>
                <td>${new Date(ricavo.data_ricavo).toLocaleDateString()}</td>
                <td>€ ${ricavo.somma_ricavo.toFixed(2)}</td>
                <td>${ricavo.raccolto_da}</td>
            </tr>
        `).join("");
}

function updateRicaviChart(ricavi) {
    const ctx = document.getElementById("ricaviChart").getContext("2d");

    if (ricavi.length === 0) {
        createEmptyChart(ctx);
        return;
    }

    const ricaviPerData = processRicaviData(ricavi);
    createRicaviChart(ctx, ricaviPerData);
}

function processRicaviData(ricavi) {
    return ricavi.reduce((acc, ricavo) => {
        const data = new Date(ricavo.data_ricavo).toLocaleDateString();
        if (!acc[data]) {
            acc[data] = 0;
        }
        acc[data] += parseFloat(ricavo.somma_ricavo);
        return acc;
    }, {});
}

function createEmptyChart(ctx) {
    new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Ricavi Giornalieri",
                data: [],
                borderColor: "#3f51b5",
                backgroundColor: "rgba(63, 81, 181, 0.1)",
                tension: 0.4,
                fill: true,
            }]
        },
        options: getChartOptions("Nessun ricavo registrato")
    });
}

function createRicaviChart(ctx, ricaviPerData) {
    const labels = Object.keys(ricaviPerData).sort((a, b) => new Date(a) - new Date(b));
    const values = labels.map(label => ricaviPerData[label]);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Ricavi Giornalieri",
                data: values,
                borderColor: "#3f51b5",
                backgroundColor: "rgba(63, 81, 181, 0.1)",
                tension: 0.4,
                fill: true,
            }]
        },
        options: getChartOptions("Andamento Ricavi")
    });
}

function getChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: {
                        family: "'Roboto', sans-serif",
                        size: 12
                    },
                    padding: 16
                }
            },
            title: {
                display: true,
                text: title,
                font: {
                    family: "'Roboto', sans-serif",
                    size: 16,
                    weight: 500
                },
                padding: 16
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.05)"
                },
                ticks: {
                    font: {
                        family: "'Roboto', sans-serif"
                    },
                    callback: function(value) {
                        return "€ " + value.toFixed(2);
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        family: "'Roboto', sans-serif"
                    }
                }
            }
        }
    };
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 3000);
}

async function svuotaCassa(macchinaId, istitutoId) {
    const btn = document.getElementById("svuotaCassaBtn");
    btn.disabled = true;

    try {
        const response = await fetch(
            `/macchinette/macchinetta/${macchinaId}/svuota-cassa/${istitutoId}`,
            { method: "GET" }
        );

        if (!response.ok) {
            throw new Error("Errore durante lo svuotamento della cassa");
        }

        await response.json();
        showAlert("Richiesta di svuotamento cassa inviata con successo");
        fetchRicaviMacchinetta(macchinaId, istitutoId);
    } catch (error) {
        console.error("Errore:", error);
        showAlert("Si è verificato un errore durante lo svuotamento della cassa", "danger");
    } finally {
        btn.disabled = false;
    }
}

async function fetchTransazioni(macchinaId, istitutoId) {
    try {
        const response = await fetch(
            `/macchinette/transazioni/istituto/${istitutoId}/macchinetta/${macchinaId}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const transazioni = await response.json();
        updateTransazioniTable(transazioni);
    } catch (error) {
        console.error("Errore nel recupero delle transazioni:", error);
        handleTransazioniError();
    }
}

function updateTransazioniTable(transazioni) {
    const tableBody = document.getElementById("transazioniTableBody");
    const tableContainer = tableBody.closest('.table-responsive');
    
    if (transazioni.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Nessuna transazione registrata</td></tr>';
        return;
    }

    // Ordina le transazioni per timestamp decrescente
    const transazioniOrdinate = transazioni.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Imposta altezza fissa se ci sono più di 5 transazioni
    if (transazioni.length > 5) {
        tableContainer.style.maxHeight = '400px';
        tableContainer.style.overflowY = 'auto';
    } else {
        tableContainer.style.maxHeight = 'none';
        tableContainer.style.overflowY = 'visible';
    }

    tableBody.innerHTML = transazioniOrdinate
        .map(transazione => `
            <tr>
                <td>${new Date(transazione.timestamp).toLocaleString()}</td>
                <td>${transazione.transactionId}</td>
                <td>${transazione.drinkCode}</td>
                <td>
                    <div class="d-flex align-items-center">
                        ${Array(5).fill().map((_, i) => `
                            <i class="material-icons me-1" style="color: ${i < transazione.sugarLevel ? "#17a2b8" : "#dee2e6"}">
                                circle
                            </i>
                        `).join("")}
                    </div>
                </td>
            </tr>
        `).join("");
}

async function richiediManutenzione(macchinaId, istitutoId) {
    try {
        const response = await fetch(
            `/manutenzioni/richiesta/${istitutoId}/${macchinaId}`,
            { method: "POST" }
        );

        if (!response.ok) {
            throw new Error("Errore nella richiesta di manutenzione");
        }

        showAlert("Richiesta di manutenzione inviata con successo");
    } catch (error) {
        console.error("Errore:", error.message);
        showAlert("Errore nell'invio della richiesta di manutenzione", "danger");
    }
}

function initWebSocket(machineId, instituteId, keycloakToken) {
    try {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/ws/consumables?machineId=${machineId}&instituteId=${instituteId}`;
        
        console.log('Tentativo di connessione a:', wsUrl);

        const ws = new WebSocket(wsUrl);
        setupWebSocketHandlers(ws, keycloakToken);

    } catch (error) {
        console.error("Errore nell'inizializzazione del WebSocket:", error);
        showWebSocketError("Errore nell'inizializzazione della connessione");
    }
}

function setupWebSocketHandlers(ws, keycloakToken) {
    const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
            console.log('Timeout della connessione WebSocket');
            ws.close();
            showWebSocketError("Timeout della connessione");
        }
    }, 10000);

    ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log("WebSocket connesso, invio token di autenticazione");
        
        ws.send(JSON.stringify({
            type: 'auth',
            token: keycloakToken
        }));

        showLoadingConsumables();
    };

    ws.onmessage = (event) => {
        console.log('Messaggio ricevuto:', event.data);
        try {
            const data = JSON.parse(event.data);
            if (data.message) {
                console.log('Messaggio dal server:', data.message);
            } else {
                updateConsumables(data);
            }
        } catch (error) {
            console.error("Errore nel parsing dei dati:", error);
            showWebSocketError("Errore nel processamento dei dati");
        }
    };

    ws.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error("Errore WebSocket:", error);
        showWebSocketError("Errore nella connessione al server");
    };

    ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket chiuso:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
        });

        setTimeout(() => {
            console.log('Tentativo di riconnessione...');
            initWebSocket(machineId, instituteId, keycloakToken);
        }, 5000);
    };
}

function showLoadingConsumables() {
    const container = document.getElementById("consumablesContainer");
    container.innerHTML = `
        <div class="col-12 text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Caricamento...</span>
            </div>
        </div>
    `;
}

function showWebSocketError(message) {
    const container = document.getElementById("consumablesContainer");
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <p>${message}</p>
                <button type="button" class="btn btn-primary mt-2" onclick="initWebSocket()">
                    Riprova connessione
                </button>
            </div>
        `;
    }
}

function updateConsumables(consumables) {
    const container = document.getElementById("consumablesContainer");
    container.innerHTML = consumables
        .map(consumable => {
            const percentage = (consumable.quantity / consumable.maxQuantity) * 100;
            let statusColor = getStatusColor(percentage);

            return createConsumableHTML(consumable, percentage, statusColor);
        })
        .join("");
}

function getStatusColor(percentage) {
    if (percentage <= 20) return "danger";
    if (percentage <= 50) return "warning";
    return "success";
}

function createConsumableHTML(consumable, percentage, statusColor) {
    return `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="consumable-item">
                <div class="d-flex align-items-center mb-2">
                    <div class="consumable-icon">
                        <i class="material-icons">${getConsumableIcon(consumable.name)}</i>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-0">${formatConsumableName(consumable.name)}</h6>
                        <small class="consumable-status">
                            ${consumable.quantity} / ${consumable.maxQuantity}
                        </small>
                    </div>
                </div>
                <div class="progress consumable-progress">
                    <div class="progress-bar bg-${statusColor}" 
                         role="progressbar" 
                         style="width: ${percentage}%" 
                         aria-valuenow="${percentage}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getConsumableIcon(name) {
    const icons = {
        SUGAR: "grain",
        MILK: "opacity",
        TEA: "emoji_food_beverage",
        CUP: "local_cafe",
        SPOON: "flatware",
        COFFEE: "coffee",
        CHOCOLATE: "cookie"
    };
    return icons[name] || "inventory_2";
}

function formatConsumableName(name) {
    return name.charAt(0) + name.slice(1).toLowerCase();
}

// Funzioni di utility per la gestione degli errori
function handleRicaviError() {
    document.getElementById("ricaviTableBody").innerHTML = 
        '<tr><td colspan="3" class="text-center text-danger">Errore nel caricamento dei dati</td></tr>';
    
    const ctx = document.getElementById("ricaviChart").getContext("2d");
    createEmptyChart(ctx);
}

function handleTransazioniError() {
    document.getElementById("transazioniTableBody").innerHTML = 
        '<tr><td colspan="4" class="text-center text-danger">Errore nel caricamento delle transazioni</td></tr>';
}

async function fetchFaults(macchinaId, istitutoId) {
    try {
        const response = await fetch(`/macchinette/faults/${istitutoId}/${macchinaId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const faults = await response.json();
        updateButtonsVisibility(faults);
        updateFaultsTable(faults);
    } catch (error) {
        console.error("Errore nel recupero dei guasti:", error);
        showAlert("Errore nel recupero dei guasti", "danger");
        handleFaultsError();
    }
}

function updateButtonsVisibility(faults) {
    const svuotaCassaBtn = document.getElementById("svuotaCassaBtn");
    const richiediTecnicoBtn = document.getElementById("richiediTecnicoBtn");

    if (!svuotaCassaBtn || !richiediTecnicoBtn) return;

    // Nascondi inizialmente i pulsanti
    svuotaCassaBtn.style.display = "none";
    richiediTecnicoBtn.style.display = "none";

    // Verifica la presenza di guasti attivi (non risolti)
    const activeGuasti = faults.filter(fault => !fault.risolto);

    // Controlla i tipi di guasto
    const hasCassaPiena = activeGuasti.some(fault => fault.tipoGuasto === "CASSA_PIENA");
    const hasGuastoGenerico = activeGuasti.some(fault => fault.tipoGuasto === "GUASTO_GENERICO");
    const hasConsumabileTerminato = activeGuasti.some(fault => fault.tipoGuasto === "CONSUMABILE_TERMINATO");

    // Mostra il pulsante svuota cassa se c'è un guasto di tipo CASSA_PIENA
    if (hasCassaPiena) {
        svuotaCassaBtn.style.display = "inline-flex";
    }

    // Mostra il pulsante richiedi tecnico se c'è un guasto generico o consumabile terminato
    if (hasGuastoGenerico || hasConsumabileTerminato) {
        richiediTecnicoBtn.style.display = "inline-flex";
    }
}

function updateFaultsTable(faults) {
    console.log(faults);
    const tableBody = document.getElementById("faultsTableBody");
    if (!tableBody) return;

    if (faults.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nessun guasto registrato</td></tr>';
        return;
    }

    const sortedFaults = faults.sort((a, b) => new Date(b.dataSegnalazione) - new Date(a.dataSegnalazione));

    tableBody.innerHTML = sortedFaults.map(fault => `
        <tr class="${fault.risolto ? 'table-success' : 'table-warning'}">
            <td>${new Date(fault.dataSegnalazione).toLocaleString()}</td>
            <td>${getFaultTypeLabel(fault.tipoGuasto)}</td>
            <td>${fault.descrizione}</td>
            <td>
                <span class="badge ${fault.risolto ? 'bg-success' : 'bg-warning'}">
                    ${fault.risolto ? 'Risolto' : 'In corso'}
                </span>
            </td>
            <td>${fault.idFault}</td>
        </tr>
    `).join('');
}

function getFaultTypeLabel(tipoGuasto) {
    const labels = {
        'CASSA_PIENA': '<span class="badge bg-info">Cassa Piena</span>',
        'GUASTO_GENERICO': '<span class="badge bg-danger">Guasto Generico</span>',
        'CONSUMABILE_TERMINATO': '<span class="badge bg-warning text-dark">Consumabile Terminato</span>'
    };
    return labels[tipoGuasto] || `<span class="badge bg-secondary">${tipoGuasto}</span>`;
}

function handleFaultsError() {
    const tableBody = document.getElementById("faultsTableBody");
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Errore nel caricamento dei guasti</td></tr>';
    }
} 