import {addSchool, getMachineCialdeInfo,getMachineCassaInfo,getMachineGuastiInfo,addMachine,deleteMachine} from "./api.js";
import { loadCitiesAndSchools,createAddSchool,createAddMachineModal } from "./templates/citta-istituti-piani-macchinette.js";
import {createCialdeTable,renderMachineDetails,createGuastiTable,createCassaTable} from "./templates/tabelle_templete.js"

class App{
    constructor(appContainer,menu){
        this.appContainer=appContainer;

        menu.innerHTML='';
        this.init(menu);

    }


    async init(menu) {
        const menuMarkup = await loadCitiesAndSchools();
        const buttonHTML = createAddSchool();
        const modale=createAddMachineModal();
        menu.insertAdjacentHTML('beforeend', buttonHTML);
        menu.insertAdjacentHTML("beforeend", menuMarkup);
        menu.insertAdjacentHTML('beforeend',modale);

        document.getElementById('add-school-form').addEventListener('submit',this.addIstituto)
        const machineAdd = this.machineAdd.bind(this);
        const dropBtns = document.querySelectorAll('.dropbtn');
        dropBtns.forEach((btn) => {
            btn.addEventListener('click', function () {
                const dropdownContent = this.nextElementSibling;
                console.log('Bottone cliccato:', this); // Stampa il bottone cliccato
                console.log('Contenuto dropdown trovato:', dropdownContent);
                this.parentElement.classList.toggle('active');
                console.log('Classe "active" aggiunta a:', this.parentElement); // Stampa il contenitore a cui viene aggiunta la classe active
            });
        });

        // Aggiungi il listener per tutti i bottoni "addMachineButton"
        const machineButtons = document.querySelectorAll('#addMachineButton');
        machineButtons.forEach((button) => {
        button.addEventListener('click', function () {
            // Recupera i dati dal bottone cliccato
            const schoolName = button.getAttribute('data-scuola');

            console.log('Bottone cliccato - Scuola:', schoolName);

            // Memorizza i dati nel form per recupero durante il submit
            const form = document.getElementById('add-machine-form');
            form.dataset.scuola = schoolName;
            });
        });

        // Listener per il submit del form "add-machine-form"
        const addMachineForm = document.getElementById('add-machine-form');
        addMachineForm.addEventListener('submit', this.machineAdd.bind(this));
        // Gestione del click sugli elementi delle scuole
        const schoolHeaders = document.querySelectorAll('.school .school-name');
        schoolHeaders.forEach((school, index) => {
            console.log(`Scuola ${index}:`, school);
            
            school.addEventListener('click', function(event) {
                event.stopPropagation(); // Impedisce la propagazione del click
                const schoolContainer = this.closest('.school'); // Trova il contenitore della scuola
                const floorContent = schoolContainer.querySelector('.floors');
                console.log('Scuola cliccata:', this); // Stampa la scuola cliccata
                console.log('Contenuto piani trovato:', floorContent);
                
                schoolContainer.classList.toggle('active');
                console.log('Classe "active" aggiunta a:', schoolContainer); // Stampa il contenitore della scuola con la classe active
            });
        });

        // Aggiungi il listener per tutti i bottoni "deleteMachineButton"
        const deleteButtons = document.querySelectorAll('#deleteMachineButton');
        deleteButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const machine = button.getAttribute('data-machine');
                this.deleteById(machine);
            });
        });

        const SchoolButtons = document.querySelectorAll('.machine-button');
        SchoolButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                const buttonId = button.id; // Usa `button` al posto di `this`
                const machineId = parseInt(buttonId.split('-')[1], 10);
                console.log('Macchinetta cliccata:', machineId);
                try {
                // Richiama la funzione per ottenere le informazioni sulle cialde
                console.log('Informazioni cialde richieste per :', machineId);
                
                const cialdeInfo = await getMachineCialdeInfo(machineId);
                console.log('Informazioni cialde ricevute:', cialdeInfo);
                const guastiInfo =await getMachineGuastiInfo(machineId);
                console.log('Informazioni guasti ricevute:', guastiInfo);
                const cassaInfo=await getMachineCassaInfo(machineId);
                console.log('Informazioni cassa ricevute:', cassaInfo);
                await this.updateView(machineId,cialdeInfo,guastiInfo,cassaInfo);
                // Qui puoi gestire l'output come preferisci, ad esempio aggiornando l'interfaccia utente
            } catch (error) {
                console.error('Errore nel recupero delle informazioni sulle cialde:', error);
            }

            });
        });
    }

    deleteById=async(machine)=>{
        try {
            console.log("chiamo deletemachine da app")
            await deleteMachine(machine)
            location.reload()
        }catch (error) {
            // Gestione degli errori
            console.error("Errore nell'eliminazione della macchinetta:", error);
        }
    }


    machineAdd =async(event)=>{
        event.preventDefault();
         // Recupera i dati dal dataset del form
        const form = event.target;
        const schoolID = form.dataset.scuola;
        const piano = document.getElementById("piano_form").value;

        const machineData = {
            piano: piano,
            scuola: schoolID,
        };

        try {
            // Chiama la funzione addMachine con i dati del form
            console.log("sto chiamando add Machine in api con i dati "+ machineData.piano +" "+machineData.scuola)
            await addMachine(machineData);

            // Reset del form
        form.reset();

        // Chiudi il modal (opzionale)
        const modal = bootstrap.Modal.getInstance(document.getElementById("add-machine-modal"));
        modal.hide();

        // Ricarica la pagina
        location.reload();

        } catch (error) {
            // Gestione degli errori
            console.error("Errore nell'aggiunta della macchinetta:", error);
            alert("Errore nell'aggiunta della macchinetta. Riprova.");
        }
    }


    addIstituto = async (event) => {
        event.preventDefault(); // Evita il comportamento predefinito del form
        
        // Estrai i dati dal form
        const citta = document.getElementById("citta_form").value;
        const istituto = document.getElementById("istituto_form").value;
        const indirizzo = document.getElementById("indirizzo_form").value;

        // Crea l'oggetto da inviare
        const istitutoData = {
            citta: citta,
            nome: istituto,
            indirizzo: indirizzo,
        };
        
        try {
            // Chiama la funzione addMachine con i dati del form
            console.log("sto chiamando add Istituto in api con i dati "+ istitutoData)
            await addSchool(istitutoData);

            // Notifica il successo (opzionale)
            alert("Scuola aggiunta con successo!");

            // Reset del form
            form.reset();

            // Chiudi il modal (opzionale)
            const modal = bootstrap.Modal.getInstance(document.getElementById("add-modal"));
            modal.hide();
        } catch (error) {
            // Gestione degli errori
            console.error("Errore nell'aggiunta dell'istituto:", error);
            alert("Errore nell'aggiunta dell'istituto. Riprova.");
        }
    }


    updateView=async(machineId,cialdeInfo,guastiInfo,cassaInfo)=>{
        // Svuota il contenitore principale
        this.appContainer.innerHTML = `
            <div id="machineDetailsContainer"></div>
            <div id="cialdeTableContainer"></div>
            <div id="guastiTableContainer"></div>
            <div id="cassaTableContainer"></div>
    `   ;

        // Renderizza i dettagli della macchinetta
        await renderMachineDetails(machineId);

        // Genera una tabella vuota per le cialde
        const cialdeTableHTML = await createCialdeTable(cialdeInfo);

        // Inserisci la tabella vuota nel contenitore
        const cialdeTableContainer = document.getElementById('cialdeTableContainer');
        if (cialdeTableContainer) {
            cialdeTableContainer.innerHTML = cialdeTableHTML;
        } else {
            console.error("Contenitore per la tabella delle cialde non trovato.");
        }
        // Genera una tabella vuota per i guasti
        const guastiTableHTML = await createGuastiTable(guastiInfo);

        // Inserisci la tabella vuota nel contenitore
        const guastiTableContainer = document.getElementById('guastiTableContainer');
        if (guastiTableContainer) {
            guastiTableContainer.innerHTML = guastiTableHTML;
        } else {
            console.error("Contenitore per la tabella dei guasti non trovato.");
        }
        // Genera una tabella vuota per la cassa
        const cassaTableHTML = await createCassaTable(cassaInfo);

        // Inserisci la tabella vuota nel contenitore
        const cassaTableContainer = document.getElementById('cassaTableContainer');
        if (cassaTableContainer) {
            cassaTableContainer.innerHTML = cassaTableHTML;
        } else {
            console.error("Contenitore per la tabella della cassa non trovato.");
        }
    }
}

export default App;