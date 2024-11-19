"use strict";

function createCorsiPage() {
    return`<div id="firt-row"class="row sport">
                <button id="ginnastica" class="col-6">
                    <h1>ginnastica artistica</h1>
                    <p>i corsi di ginnastica artistica sono suddivisi in 4 livelli, dai corsi di avviamento, fino ai corsi di agonistica....</p>
                </button>
                <button id="posturale" class="col-6 sport">
                    <h1>posturale</h1>
                    <p>corso per migliorare la propria postura....</p>
                </button>
            </div>

            <div id="second-row"class="row">
                <button id="TRX" class="col-6 sport">
                    <h1 >TRX</h1>
                    <p>trx, attrezzo completo per allenare forza, equilibrio e resistenza....</p>
                </button>
                <button id="pilates" class="col-6 sport">
                    <h1>pilates</h1>
                    <p>imaparare a respirare durante l'attività sportiva ......</p>
                </button>
            </div>`
        }
        export {createCorsiPage};