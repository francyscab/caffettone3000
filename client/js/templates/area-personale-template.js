"use strict";

function createAreaPersonalePage() {
    return`<div class="row">
    <aside class="col-3" id="menu_persona">
        <ul id="sidebar">
            <li id="nome_utente"><form id="myForm">
            <label for="textInput">Inserisci il testo:</label>
            <input type="text" id="textInput" name="textInput" placeholder="Inserisci qui il testo" required>
            <br>
            <input type="submit" value="Invia">
        </form></li>
            <li class="d" ><a href="dati"><button id="dati_ap" class="button2">Dati</button></a></li>
            <li class="d" ><a href="corsi"><button id="corsi_ap"class="button2">I miei corsi</button></a></li>
            <li class="d" ><a href="posta"><button id="posta_ap"class="button2">Posta</button></a></li>
            <li class="d" ><a href="logout"><button id="loguot_ap"class="button2">Log out</button></a></li>
        </ul>   
    </aside>
</div> `
}

function createAreaPersonaleDati() {
    return`<div id="dati" class="col-7">
        <fieldset>
            <label>dati personali</label>
            <table class="table table-sm">
                <tr>
                    <td>nome: </td>
                    <td id="nome"></td>
                </tr>
                <tr>
                    <td>cognome: </td>
                    <td id="cognome"></td>
                </tr>
                <tr>
                    <td>data nascita: </td>
                    <td id="anno_nascita"></td>
                </tr>
                <tr>
                    <td>citta nascita: </td>
                    <td id="citta_nascita"></td>
                </tr>
                <tr>
                    <td>indirizzo residenza: </td>
                    <td id="indirizzo"></td>
                </tr>
                <tr>
                    <td>data iscrizione: </td>
                    <td id="anno_iscrizione"></td>
                </tr>
                <tr>
                    <td>CF: </td>
                    <td id="cf"></td>
                </tr>
            </table>
        </fieldset>
    </div>`

}

function createAreaPersonaleCorsi() {
    return`<div class="col-7">
    <table id="tabella_miei_corsi" >
        <!--<tr>
            <h2 id="nome"></h2>
            <h3 id="data_iscrzione"></h3>
        </tr>-->
    </table>
    </div>
    </div> 
    </div>   `

}

export {createAreaPersonalePage,createAreaPersonaleDati,createAreaPersonaleCorsi};