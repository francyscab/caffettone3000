document.addEventListener('DOMContentLoaded', () => {
    const viewSchoolButtons = document.querySelectorAll('.view-schools');
    const schoolsModal = new bootstrap.Modal(document.getElementById('schoolsModal'));
    const schoolsList = document.getElementById('schoolsList');

    viewSchoolButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const city = button.dataset.city;
            try {
                const response = await fetch(`/api/schools/${city}`);
                const schools = await response.json();

                // Generate schools list HTML
                const schoolsHtml = schools.map(school => `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${school.nome}</h5>
                            <p class="card-text">${school.indirizzo}</p>
                            <button class="btn btn-sm btn-primary view-machines" 
                                    data-school-id="${school.id}">
                                Visualizza Macchinette
                            </button>
                        </div>
                    </div>
                `).join('');

                schoolsList.innerHTML = schoolsHtml;
                schoolsModal.show();
            } catch (error) {
                console.error('Error fetching schools:', error);
                alert('Errore nel caricamento delle scuole');
            }
        });
    });
});