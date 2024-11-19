"use strict"

class User{


    constructor(id,nome,cognome,ruolo){
        this.id=id;
        this.nome=nome;
        this.cognome=cognome;
        this.ruolo=ruolo;
    }

     /**
     * Construct an event from a plain object
     * @param {*} json 
     * @return {User} the newly created Evento object
     */
     static from(json) {
        const e = Object.assign(new User(), json);
        return e;
    }
}

export default User