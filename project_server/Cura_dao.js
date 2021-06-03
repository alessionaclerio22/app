"use strict"

const Medico = require("./Medico");
const Paziente = require("./Paziente");
const db = require("./db");
const moment = require("moment");

/* aggiunge una riga alla tabella Cura */
exports.addCura = function(s) {
    return new Promise((resolve, reject) => {
        const sql ="INSERT INTO Cura(mid,pid) VALUES(?, ?)";

        db.run(sql, [s.mid, s.pid], function (err){
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

/* Rimuove una riga dalla tabella Cura */
exports.deleteCura = function(s) {
    return new Promise((resolve, reject) => {
        const sql ="DELETE FROM Cura WHERE mid = ? AND pid = ?";
        db.run(sql, [s.mid, s.pid], function (err){
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