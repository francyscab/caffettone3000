"use strict";

function createMenu() {
    return` <!--<li  class="col m"><a href="home.html"><button id="home_b" style="background-color: #4eaba1; color: aliceblue;" class="dropbtn">Home</button></a></li>-->
    <li class="col m">
        <div class="dropdown">
            <a href="/corsi"><button id="corsi_b" class="dropbtn">Corsi</button></a>
            <div class="dropdown-content">
              <a href="#">Artistica</a>
              <a href="#">Posturale</a>
              <a href="#">Pilates</a>
              <a href="#">TRX</a>
              <a href="#">Movida</a>
              <a href="#">Personal Trainer</a>
            </div>
          </div>
        </li>
    <li class="col m"><button id="iscrizioni_b" class="dropbtn">Iscrizioni</button></li>
    <li class="col m"><button id="orari_b" class="dropbtn">Orari</button></li>
    <li class="col m"><button id="tariffe_b" class="dropbtn">Tariffe</button></li>
    <li class="col m"><a href="/eventi"><button id="eventi_b" class="dropbtn">Eventi</button></a></li>
    <li class="col m"><button id="news_b" class="dropbtn">News</button></li>
    <li class="col m"><button id="staff_b" class="dropbtn">Staff</button></li>
    <li class="col-md-auto m"><a href="/areaPersonale"><button id="area_personale_b" class="dropbtn">Area Personale</button></a></li>
    <li class="col m"><button id="galleria_b" class="dropbtn">Galleria</button></li>
    <li class="col m"><button id="contatti_b" class="dropbtn">Contatti</button></li>`
}

export { createMenu }