//import { createMenu } from "./templates/menu-template.js";
//import { createAreaPersonalePage,createAreaPersonaleDati,createAreaPersonaleCorsi} from "./templates/area-personale-template.js";
//import { createAggiungi,createEventiTable,createFiltri,createEventRow} from "./templates/eventi-template.js";
//import { createCorsiPage } from "./templates/corsi-template.js";
//import { getEvents,addEvent,getByCourse,getSubByID,getSubscribers} from "./api.js";
//import page from "//unpkg.com/page/page.mjs";
//import Evento from "./evento.js";
//import Subscriber from "./subscriber.js";
import { getMachineCialdeInfo,getMachineCassaInfo,getMachineGuastiInfo } from "./api.js";
import { loadCitiesAndSchools } from "./templates/citta-istituti-piani-macchinette.js";
import {createCialdeTable,renderMachineDetails,createGuastiTable} from "./templates/tabelle_templete.js"

class App{
    constructor(appContainer,menu){
        this.appContainer=appContainer;

        menu.innerHTML='';

        //appContainer.innerHTML='';
        this.init(menu);

        

        //this.getAllCitiesFun()
        /*page('/corsi',()=>{
            menu.innerHTML='';
            appContainer.innerHTML='';

            menu.insertAdjacentHTML("beforeend",createMenu())
            appContainer.insertAdjacentHTML("beforeend",createCorsiPage())
            
        })

        page('/areaPersonale','/areaPersonale/dati');

        page('/areaPersonale/dati',()=>{
            console.log("sono dentro")
            menu.innerHTML='';
            appContainer.innerHTML='';
            menu.insertAdjacentHTML("beforeend",createMenu())
            appContainer.insertAdjacentHTML("beforeend",createAreaPersonalePage())
            document.getElementById('menu_persona').insertAdjacentHTML('afterend',createAreaPersonaleDati())
            document.getElementById('dati_ap').classList.add("active")
            let form=document.getElementById('myForm');
            form.addEventListener('submit',this.onNameAdd)
            })*/

        /*
        page('/areaPersonale/corsi',()=>{
        menu.innerHTML='';
        appContainer.innerHTML='';
        menu.insertAdjacentHTML("beforeend",createMenu())
        appContainer.insertAdjacentHTML("beforeend",createAreaPersonalePage())
        document.getElementById('corsi_ap').classList.add("active")
        })

        page('/areaPersonale/posta',()=>{
            menu.innerHTML='';
            appContainer.innerHTML='';
            menu.insertAdjacentHTML("beforeend",createMenu())
            appContainer.insertAdjacentHTML("beforeend",createAreaPersonalePage())
            document.getElementById('posta_ap').classList.add("active")
            })*/

        /*page('/areaPersonale/logout','/corsi');

        page('/eventi',()=>{
            menu.innerHTML='';
            appContainer.innerHTML='';
            

            menu.insertAdjacentHTML("beforeend",createMenu())
            appContainer.insertAdjacentHTML("beforeend",createFiltri())
            let f=document.querySelector("#filtro")
            f.insertAdjacentHTML("beforeend",createAggiungi())
            f.insertAdjacentHTML("afterend",createEventiTable())
            this.showEvents("Tutti");
            this.appContainer.querySelectorAll(".filtri").forEach(link => {
                link.addEventListener('click', (event)=>{
                    // the HTML element that was clicked
                    const el = event.target;
                    // the 'data-id' property of that element
                    const elId = el.dataset.id;
                    // what happens to our table when I click on the link
                    this.showEvents(elId);
                });
            })
            const addForm = document.getElementById('add-form');
            this.initForm(addForm);
            
            
        })*/

       /* page('/', '/corsi');*/

        
        //page();
    }


    async init(menu) {
        const menuMarkup = await loadCitiesAndSchools();
        menu.insertAdjacentHTML("beforeend", menuMarkup);
        
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

        const machineButtons = document.querySelectorAll('.machine-button');
        machineButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                const buttonId = button.id; // Usa `button` al posto di `this`
                const machineId = parseInt(buttonId.split('-')[1], 10);
                console.log('Macchinetta cliccata:', machineId);
        
                /*try {
                    await this.updateView(machineId); // Ora `this` si riferisce correttamente all'istanza di `App`
                } catch (error) {
                    console.error('Errore nel recupero delle informazioni:', error);
                }*/

                try {
                // Richiama la funzione per ottenere le informazioni sulle cialde
                console.log('Informazioni cialde richieste per :', machineId);
                
                const cialdeInfo = await getMachineCialdeInfo(machineId);
                const guastiInfo =await getMachineGuastiInfo(machineId);
                //const cassaInfo=await getMachineCassaInfo(machineId);
                await this.updateView(machineId,cialdeInfo,guastiInfo);
                //console.log('Informazioni cialde ricevute:', machineInfo);
                // Qui puoi gestire l'output come preferisci, ad esempio aggiornando l'interfaccia utente
            } catch (error) {
                console.error('Errore nel recupero delle informazioni sulle cialde:', error);
            }

            });
        });
    }

    updateView=async(machineId,cialdeInfo,guastiInfo)=>{
        // Svuota il contenitore principale
        this.appContainer.innerHTML = `
            <div id="machineDetailsContainer"></div>
            <div id="cialdeTableContainer"></div>
            <div id="guastiTableContainer"></div>
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
            guastiContainer.innerHTML = guastiTableHTML;
        } else {
            console.error("Contenitore per la tabella dei guasti non trovato.");
        }
    }
    
   /* getAllCitiesFun=async()=>{
        let citta=await getAllCities();
        for(let c of citta){
            console.log(" trovata: " + JSON.stringify(c));

        }
    }
    */
    /*showEvents = async (course) => {
        let lista_eventi = [];

        const eventTable = document.querySelector('#event');

        if (course==="Tutti"){
            if(eventTable.innerHTML!==''){
                eventTable.innerHTML='';
            }
            lista_eventi = await getEvents();

        }else {
            if(eventTable.innerHTML!==''){
                eventTable.innerHTML='';
            }
            lista_eventi = await getByCourse(course);
        }

        for(let e of lista_eventi) {
            const eventRow = createEventRow(e);
            eventTable.insertAdjacentHTML("beforeend", eventRow);
        }
    }

    /**
     * Init the "add event" form and set up its callback
     * 
     * @param {*} form the HTML element representing the form
     */
    async initForm(form) {
        // set up form callback
        form.addEventListener('submit', this.onFormSubmitted);
    }

    onFormSubmitted = async (event) => {
        event.preventDefault();
        //document.getElementById("error-message").innerHTML = '';
        const form = event.target;
            
        if(form.checkValidity()) {
           
            const event = new Evento(form.id_form.value, form.titolo_form.value, form.corso_form.value, form.data_form.value, form.descrizione_form.value);

            try {
                
                await addEvent(event);
                
                // refresh the user interface
                this.showEvents("Tutti");
        } catch(error) {
        if (error) {
            const message = error.error;
            /*document.getElementById("error-message").innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`*/
        }
        } finally {
         //reset the form and close the modal
         form.reset();
            document.getElementById('close-modal').click();
             }
        } 
    }

    onNameAdd= async(event)=>{
        event.preventDefault();
        const nameValue = document.getElementById('textInput').value;
        let persona=await getSubByID(nameValue);
        console.log(persona);
        document.getElementById("nome").append(persona.nome);
        document.getElementById("cognome").append(persona.cognome);
        document.getElementById("anno_nascita").append(persona.anno_nascita);
        document.getElementById("citta_nascita").append(persona.citta_nascita);
        document.getElementById("indirizzo").append(persona.indirizzo);
        document.getElementById("anno_iscrizione").append(persona.anno_iscrizione);
        document.getElementById("cf").append(persona.cf);
        //nome.append(persona.nome);
    }


}

export default App;