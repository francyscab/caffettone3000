document.addEventListener('DOMContentLoaded', async () => {
    const charts = initializeCharts();
    updateCharts(charts, { transazioni, ricavi });
    
    initSearch();
    loadMachinesData();

    const chartTypeSelect = document.getElementById('chartType');
    if (chartTypeSelect) {
        chartTypeSelect.addEventListener('change', () => {
            updateCharts(charts, { transazioni, ricavi });
        });
    }
});

function initializeCharts() {
    const transCtx = document.getElementById('transactionsChart').getContext('2d');
    const transChart = new Chart(transCtx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
            datasets: [{
                label: 'Transazioni',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e7eb'
                    },
                    ticks: {
                        color: '#1a2b3c'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#1a2b3c'
                    }
                }
            }
        }
    });

    
    const revCtx = document.getElementById('revenueChart').getContext('2d');
    const revChart = new Chart(revCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Ricavi',
                data: [],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e7eb'
                    },
                    ticks: {
                        color: '#1a2b3c',
                        callback: value => `€${value}`
                    }
                },
                x: {
                    grid: {
                        color: '#e5e7eb'
                    },
                    ticks: {
                        color: '#1a2b3c'
                    }
                }
            }
        }
    });

    return { transChart, revChart };
}

function updateCharts(charts, data) {
    if (!data || !charts) return;

    const { transChart, revChart } = charts;

    if (data.transazioni && data.transazioni.length > 0) {
        const giorni = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
        const conteggioGiorni = new Array(7).fill(0);

        data.transazioni.forEach(trans => {
            const data = new Date(trans.timestamp);
            const giorno = data.getDay();
            conteggioGiorni[giorno]++;
        });

        const conteggioFinale = [...conteggioGiorni.slice(1), conteggioGiorni[0]];
        const giorniFinali = [...giorni.slice(1), giorni[0]];

        transChart.data.labels = giorniFinali;
        transChart.data.datasets[0].data = conteggioFinale;
        transChart.update();
    }
    console.log(data.ricavi);

    if (data.ricavi && data.ricavi.length > 0) {
        const ricaviPerData = data.ricavi.reduce((acc, ricavo) => {
            if (!ricavo.data_ricavo) {
                console.warn('data_ricavo mancante:', ricavo);
                return acc;
            }
            
            try {
                const data = new Date(ricavo.data_ricavo);
                const dataFormattata = data.toLocaleDateString('it-IT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                
                const somma = parseFloat(ricavo.somma_ricavo) || 0;
                acc[dataFormattata] = (acc[dataFormattata] || 0) + somma;
                
                return acc;
            } catch (err) {
                console.error('Errore nel processare il ricavo:', err, ricavo);
                return acc;
            }
        }, {});

        const ricaviOrdinati = Object.entries(ricaviPerData)
            .sort(([dataA], [dataB]) => {
                const [dayA, monthA, yearA] = dataA.split('/');
                const [dayB, monthB, yearB] = dataB.split('/');
                return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
            })
            .slice(-7);

        revChart.data.labels = ricaviOrdinati.map(([data]) => data);
        revChart.data.datasets[0].data = ricaviOrdinati.map(([, somma]) => 
            parseFloat(somma.toFixed(2))
        );
        revChart.update();
    }
}

function initSearch() {
    const searchInput = document.querySelector('.chart-select[type="text"]');
    const filtroStato = document.getElementById('filtroStatoMacchinette');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#machinesTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    if (filtroStato) {
        filtroStato.addEventListener('change', () => {
            loadMachinesData();
        });
    }
}

function loadMachinesData() {
    const tableBody = document.getElementById('machinesTableBody');
    if (!tableBody) return;

    const filtroStato = document.getElementById('filtroStatoMacchinette');
    const filtroValue = filtroStato ? filtroStato.value : 'tutti';
    
    const macchinetteFiltrate = macchinette.filter(machine => {
        switch(filtroValue) {
            case 'online':
                return machine.online === true;
            case 'offline':
                return machine.online === false;
            case 'guaste':
                return machine.guasto === true;
            default:
                return true;
        }
    });

    tableBody.innerHTML = macchinetteFiltrate.map(machine => `
        <tr>
            <td>${machine.id_macchinetta}</td>
            <td>${machine.id_istituto}</td>
            <td>${machine.piano}</td>
            <td>
                <span class="status-badge ${machine.online ? 'status-online' : 'status-offline'}">
                    <i class="material-icons">${machine.online ? 'check_circle' : 'error'}</i>
                    ${machine.online ? 'Online' : 'Offline'}
                </span>
            </td>
            <td>
                ${machine.guasto ? 
                    `<span class="status-badge status-guasto">
                        <i class="material-icons">warning</i>
                        Guasta
                    </span>` : 
                    `<span class="status-badge status-online">
                        <i class="material-icons">check_circle</i>
                        Funzionante
                    </span>`
                }
            </td>
        </tr>
    `).join('');
} 