document.addEventListener('DOMContentLoaded', () => {
    // Gestione hover sulle card degli istituti
    const instituteCards = document.querySelectorAll('.institute-card');
    instituteCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Gestione del form di filtro
    const filterForm = document.querySelector('form[action="/istituti"]');
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            const citySelect = filterForm.querySelector('select[name="citta"]');
            if (!citySelect.value) {
                e.preventDefault();
                window.location.href = '/istituti';
            }
        });
    }

    // Gestione del modal per nuovo istituto
    const newInstituteModal = document.getElementById('newInstituteModal');
    if (newInstituteModal) {
        const form = newInstituteModal.querySelector('form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('/istituti/addistituto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    const error = await response.json();
                    alert('Errore durante la creazione dell\'istituto: ' + error.message);
                }
            } catch (error) {
                console.error('Errore:', error);
                alert('Si è verificato un errore durante la creazione dell\'istituto');
            }
        });
    }
}); 