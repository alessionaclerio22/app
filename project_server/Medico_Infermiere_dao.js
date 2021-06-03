"use strict"

const Medico = require("./Medico");
const Infermiere = require("./Infermiere");
const db = require("./db");
const moment = require("moment");

/* aggiunge una riga alla tabella MedicoInfermiere */
exports.addMedicoInfermiere = function(s) {
    return new Promise((resolve, reject) => {
        const sql ="INSERT INTO MedicoInfermiere (mid,iid) VALUES(?, ?)";

        db.run(sql, [s.mid, s.iid], function (err){
            if(err){  
                console.log(err);
                reject(err);
            }
            else{
                resolve(null);
            }
        });
    })
}

/* Rimuove una riga dalla tabella MedicoInfermiere */
exports.deleteMedicoInfermiere = function(s) {
    return new Promise((resolve, reject) => {
        const sql ="DELETE FROM MedicoInfermiere WHERE mid = ? AND iid = ?";
        db.run(sql, [s.mid, s.iid], function (err){
            if(err){  
                console.log(err);
                reject(err);
            }
            else{
                resolve(null);
            }
        });
    })
}