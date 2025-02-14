async function fetchRicaviTotali(idIstituto) {
    try {
        const response = await fetch(`/istituti/${idIstituto}/ricavi`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const totale = data || 0;
        
        document.getElementById('totaleRicavi').textContent = `${totale.toFixed(2)}`;
    } catch (error) {
        console.error('Errore nel recupero dei ricavi:', error);
        document.getElementById('totaleRicavi').textContent = '0.00';
    }
}

async function deleteIstituto(idIstituto) {
    try {
        const response = await fetch(`/istituti/${idIstituto}/delete`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Errore durante l\'eliminazione');
        }

        window.location.href = '/istituti';
    } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
        
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteIstitutoModal'));
        deleteModal.hide();
        
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        document.getElementById('errorModalBody').textContent = error.message;
        errorModal.show();
    }
}

document.getElementById('nuovaMacchinaForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const idIstituto = document.getElementById('istitutoContainer').dataset.idIstituto;
    const formData = new FormData(event.target);
    
    try {
        const response = await fetch(`/istituti/${idIstituto}/macchinette`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_macchinetta: formData.get('id_macchinetta'),
                piano: formData.get('piano')
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Errore durante l\'aggiunta della macchinetta');
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('nuovaMacchinaModal'));
        modal.hide();

        window.location.reload();

    } catch (error) {
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${error.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        const modalBody = document.querySelector('#nuovaMacchinaModal .modal-body');
        modalBody.insertAdjacentHTML('afterbegin', alertHtml);
    }
});

function handleFiltroGuasti() {
    const filtro = document.getElementById('filtroGuasti').value;
    const cards = document.querySelectorAll('.macchinetta-card');
    
    cards.forEach(card => {
        const isGuasto = card.dataset.guasto === 'true';
        
        switch(filtro) {
            case 'guaste':
                card.style.display = isGuasto ? '' : 'none';
                break;
            case 'funzionanti':
                card.style.display = !isGuasto ? '' : 'none';
                break;
            default: 
                card.style.display = '';
        }
    });

    document.querySelectorAll('.piano-section').forEach(section => {
        const hasVisibleMachines = Array.from(section.querySelectorAll('.macchinetta-card'))
            .some(card => card.style.display !== 'none');
        section.style.display = hasVisibleMachines ? '' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const idIstituto = document.getElementById('istitutoContainer').dataset.idIstituto;
    fetchRicaviTotali(idIstituto);

    document.getElementById('filtroGuasti').addEventListener('change', handleFiltroGuasti);
}); 