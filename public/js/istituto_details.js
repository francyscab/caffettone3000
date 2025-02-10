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
        
        // Chiudi il modal di conferma
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteIstitutoModal'));
        deleteModal.hide();
        
        // Mostra il modal di errore
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

        // Ricarica la pagina per mostrare la nuova macchinetta
        window.location.reload();

    } catch (error) {
        // Crea e mostra l'alert di errore
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${error.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        // Inserisci l'alert all'inizio del form
        const modalBody = document.querySelector('#nuovaMacchinaModal .modal-body');
        modalBody.insertAdjacentHTML('afterbegin', alertHtml);
    }
});

// Inizializzazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    // Recupera l'ID dell'istituto dal data attribute
    const idIstituto = document.getElementById('istitutoContainer').dataset.idIstituto;
    fetchRicaviTotali(idIstituto);
}); 