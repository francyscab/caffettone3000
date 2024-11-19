"use strict";

function createEventiTable() {
    return`
    <div id ="scrolldiv" class="col-8">
    <table id="event" >
        <!--<tr>
            <h2 id="titolo"></h2>
            <h3 id="data"></h3>
            <p id="descrizione"></p>
        </tr>-->
    </table>
    </div>
    </div> 
    </div>   `
}

function createFiltri(){
    return `<div class="row">
    <aside class="col-3" id="filtro">
        <ul id="sidebar">
            <li class="d" ><button class="button2 filtri" data-id="Tutti">Tutti</button></li>
            <li class="d" ><button class="button2 filtri" data-id="Artistica">Artistica</button></li>
            <li class="d" ><button class="button2 filtri" data-id="TRX">TRX</button></li>
            <li class="d" ><button class="button2 filtri" data-id="Pilates">Pilates</button></li>
        </ul>
        </aside>`
}

function createAggiungi(){
    return `<!--button aggiungi-->
    <button id="aggiungi" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-modal">+</button>
    <!--modal-->
    <div class="row">
        <div class="modal" id="add-modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Aggiungi un nuovo evento</h5>
                    <button id="close-modal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </button>
                </div>
        <form role="form" method="POST" action="" id="add-form">
            <div class="modal-body">              
                <div class="mb-3">
                    <label for='id' class="col-form-label">id</label>
                    <input type='number' id='id_form' required class='form-control' />
                </div>

                <div class="mb-3">
                    <label for='titolo' class="col-form-label">titolo</label>
                    <input type='text' id='titolo_form' required class='form-control'/>
                </div>  

                <div class="mb-3">
                    <label for='corso' class="col-form-label">corso</label>
                    <input type='text' id='corso_form' required class='form-control' />
                </div>

                <div class="mb-3">
                    <label for='data' class="col-form-label">data</label>
                    <input type='date' id='data_form' required class='form-control'/>
                </div>

                <div class="mb-3">
                    <label for='descrizione' class="col-form-label">descrizione</label>
                    <input type='text' id='descrizione_form' required class='form-control'/>
                </div>
            </div>
            <div class="modal-footer">
                <div class="form-group">
                    <div>
                        <button type="submit" class="btn btn-primary">Salva</button>
                    </div>
                </div>
            </div>
        </form>
    </div>`
}

function createEventRow(e) {
    console.log(e);
    return `<tr class="evento">
        <h3>${e.titolo}</h3>
        <h4>${e.corse}</h4>
        <h5>${moment(e.data).format('DD/MM/YYYY')}</h5>
        <p>${e.descrizione}</p>
    </tr>`
}

export {createAggiungi,createFiltri,createEventiTable,createEventRow};