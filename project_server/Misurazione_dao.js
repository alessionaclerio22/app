"use strict";

const Misurazione = require("./Misurazione");
const db = require("./db");
const moment = require("moment");

const createMisurazione = function (row) {
  return new Misurazione(
    row["misid"],
    row["prescid"],
    row["mid"],
    row["pid"],
    row["data_fissata"],
    row["tipo"],
    row["valore"],
    row["note"],
    row["timestamp_fatto"],
    row["aiuto"],
    row["ora_fissata"],
    row["fascia_oraria"],
    row["ora_fascia_n"]
  );
};

/* Aggiunge una misurazione */
exports.addMisurazione = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Misurazioni(prescid, mid, pid, data_fissata, tipo, valore, note, timestamp_fatto, aiuto, ora_fissata, fascia_oraria, ora_fascia_n) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(
      sql,
      [
        s.prescid,
        s.mid,
        s.pid,
        s.data_fissata,
        s.tipo,
        s.valore,
        s.note,
        s.timestamp_fatto,
        s.aiuto,
        s.ora_fissata,
        s.fascia_oraria,
        s.ora_fascia_n,
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

/* Dato l'ID del paziente e la data, ritorna la lista delle misurazioni da fare */
exports.getMisurazioniByPazienteData = function (pid, data) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Misurazioni WHERE pid = ? AND data_fissata = ? AND timestamp_fatto IS NULL";
    db.all(sql, [pid, data], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const misurazioni = rows.map((row) => createMisurazione(row));
        resolve(misurazioni);
      }
    });
  });
};

/* modifica i parametri di una misurazione date le sue CP */
exports.editMisurazione = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Misurazioni SET mid = ?, prescid = ?, pid = ?, data_fissata = ?, tipo = ?, valore = ?, note = ?, timestamp_fatto = ?, aiuto = ?, ora_fissata = ?, fascia_oraria = ?, ora_fascia_n = ? WHERE misid = ?";

    db.run(
      sql,
      [
        s.mid,
        s.prescid,
        s.pid,
        s.data_fissata,
        s.tipo,
        s.valore,
        s.note,
        s.timestamp_fatto,
        s.aiuto,
        s.ora_fissata,
        s.fascia_oraria,
        s.ora_fascia_n,
        s.misid,
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

/* dato l'ID del paziente ritorna tutti i tipi di misurazioni associate a lui */
exports.getTipiByPaziente = function (pid) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT DISTINCT tipo FROM Misurazioni WHERE pid = ?";
    db.all(sql, [pid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const tipi = rows.map((row) => row["tipo"]);
        resolve(tipi);
      }
    });
  });
};

/* dato l'ID del paziente e il tipo ritorna tutte le misurazioni fatte */
exports.getMisurazioniByPazienteByTipo = function (pid, tipo) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Misurazioni WHERE pid = ? AND tipo = ? AND timestamp_fatto IS NOT NULL";
    db.all(sql, [pid, tipo], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const misurazioni = rows.map((row) => createMisurazione(row));
        resolve(misurazioni);
      }
    });
  });
};

/* Ritorna le misurazioni con aiuto da fare in data odierna */
exports.getTodayHelpMisurazioni = function (iid, data) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Misurazioni WHERE data_fissata = ? AND aiuto = 1 AND mid IN (SELECT mid FROM MedicoInfermiere WHERE iid = ?)";
    db.all(sql, [data, iid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const mis = rows.map((row) => createMisurazione(row));
        resolve(mis);
      }
    });
  });
};

/* 
// Dato l'ID del paziente e del medico, ritorna la lista delle misurazioni a loro legate 
exports.getMisurazioniByPazienteMedico= function (pid, mid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Misurazioni WHERE pid = ? AND mid = ?";
        db.all(sql, [pid, mid], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const misurazioni = rows.map((row) => createMisurazione(row));
                resolve(misurazioni);
            }
        })
    })
}
*/

// Dato l'ID del paziente, ritorna la lista delle sue misurazioni
exports.getMisurazioniByPaziente = function (pid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Misurazioni WHERE pid = ? AND timestamp_fatto IS NULL";
    db.all(sql, [pid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const misurazioni = rows.map((row) => createMisurazione(row));
        resolve(misurazioni);
      }
    });
  });
};
