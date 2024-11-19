"use strict"

class Evento{


    constructor(id,titolo,corsi,data,descrizione){
        this.id=id;
        this.titolo=titolo;
        this.corso=corsi;
        this.data=data;
        this.descrizione=descrizione;
    }

     /**
     * Construct an event from a plain object
     * @param {*} json 
     * @return {Evento} the newly created Evento object
     */
     static from(json) {
        const e = Object.assign(new Evento(), json);
        e.data = moment(e.data);
        return e;
    }
}

export default Evento