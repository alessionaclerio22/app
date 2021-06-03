"use strict";

const PrescrizioneNota = require("./Prescrizione");
const db = require("./db");
const moment = require("moment");

const createPrescrizione = function (row) {
  return new PrescrizioneNota(
    row["prescid"],
    row["data"],
    row["pid"],
    row["mid"],
    row["nome"],
    row["frequenza"],
    row["data_inizio"],
    row["data_fine"],
    row["note"],
    row["quantita_giorno"],
    row["farm_mis_n"]
  );
};

/* Aggiunge una prescrizione */
exports.addPrescrizione = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Prescrizioni(data, pid, mid, nome, frequenza, data_inizio, data_fine, note, quantita_giorno, farm_mis_n) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(
      sql,
      [
        s.data,
        s.pid,
        s.mid,
        s.nome,
        s.frequenza,
        s.data_inizio,
        s.data_fine,
        s.note,
        s.quantita_giorno,
        s.farm_mis_n,
      ],
      function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
};

/* Dato l'ID del paziente, ritorna la lista delle sue prescrizioni */
exports.getPrescrizioniByPaziente = function (pid) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Prescrizioni WHERE pid = ?";
    db.all(sql, [pid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const prescrizioni = rows.map((row) => createPrescrizione(row));
        resolve(prescrizioni);
      }
    });
  });
};

/* Date le CP ritorna i parametri di una prescrizione */
exports.getPrescrizioneByCP = function (prescid) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Prescrizioni WHERE prescid = ?";
    db.all(sql, [prescid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const prescrizioni = rows.map((row) => createPrescrizione(row));
        resolve(prescrizioni);
      }
    });
  });
};

exports.editPrescrizione = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Prescrizioni SET frequenza = ?, data_inizio = ?, data_fine = ?, note = ?, quantita_giorno = ?, farm_mis_n = ?, pid = ?, mid = ?, nome = ?, data = ? WHERE prescid = ?";

    db.run(
      sql,
      [
        s.frequenza,
        s.data_inizio,
        s.data_fine,
        s.note,
        s.quantita_giorno,
        s.farm_mis_n,
        s.pid,
        s.mid,
        s.nome,
        s.data,
        s.prescid,
      ],
      function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(null);
        }
      }
    );
  });
};

/* Elimina una prescrizione */
exports.deletePrescrizione = function (s) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Prescrizioni WHERE prescid=?";
    db.run(sql, [s.prescid], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};

/* 
// Dato l'ID del paziente e del medico, ritorna la lista delle prescrizioni a loro legate 
exports.getPrescrizioniByPazienteMedico= function (pid, mid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Prescrizioni WHERE pid = ? AND mid = ?";
        db.all(sql, [pid, mid], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const prescrizioni = rows.map((row) => createPrescrizione(row));
                resolve(prescrizioni);
            }
        })
    })
}

// Dato l'ID del paziente, ritorna  un array di oggetti(DATA, MEDICO, NOME) delle sue prescrizioni 
exports.getElencoPrescrizioniByPID= function (pid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT mid, data, nome FROM Prescrizioni WHERE pid = ?";
        db.all(sql, [pid], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const prescrizioni = rows.map((row) => {return {data: row["data"], mid: row["mid"], nome: row["nome"]}});
                resolve(prescrizioni);
            }
        })
    })
}*/
