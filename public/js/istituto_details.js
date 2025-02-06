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

// Inizializzazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    // Recupera l'ID dell'istituto dal data attribute
    const idIstituto = document.getElementById('istitutoContainer').dataset.idIstituto;
    fetchRicaviTotali(idIstituto);
}); 