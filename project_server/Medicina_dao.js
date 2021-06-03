"use strict";

const Medicina = require("./Medicina");
const db = require("./db");

const createMedicina = function (row) {
  return new Medicina(
    row["medid"],
    row["prescid"],
    row["mid"],
    row["pid"],
    row["data"],
    row["tipo"],
    row["note"],
    row["aiuto"],
    row["presa"],
    row["ora_fissata"],
    row["fascia_oraria"],
    row["ora_fascia_n"]
  );
};

/* Aggiunge una medicina  */
exports.addMedicina = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Medicine(prescid, mid, pid, data, tipo, note, aiuto, presa, ora_fissata, fascia_oraria, ora_fascia_n) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(
      sql,
      [
        s.prescid,
        s.mid,
        s.pid,
        s.data,
        s.tipo,
        s.note,
        s.aiuto,
        s.presa,
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

/* Dato l'ID del paziente e la data, ritorna la lista delle medicine che non sono state ancora prese*/
exports.getMedicineByPazienteData = function (pid, data) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Medicine WHERE pid = ? AND data = ? AND presa = 0";
    db.all(sql, [pid, data], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const medicine = rows.map((row) => createMedicina(row));
        resolve(medicine);
      }
    });
  });
};

/* modifica i parametri di una medicina (è stata presa)*/
exports.editMedicina = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Medicine SET mid = ?, prescid = ?, pid = ?, data = ?, tipo = ?, note = ?, aiuto = ?, presa = ?, ora_fissata = ?, fascia_oraria = ?, ora_fascia_n = ? WHERE medid = ?";

    db.run(
      sql,
      [
        s.mid,
        s.prescid,
        s.pid,
        s.data,
        s.tipo,
        s.note,
        s.aiuto,
        s.presa,
        s.ora_fissata,
        s.fascia_oraria,
        s.ora_fascia_n,
        s.medid,
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

/* Ritorna le medicine con aiuto da fare in data odierna */
exports.getTodayHelpMedicine = function (iid, data) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Medicine WHERE data = ? AND aiuto = 1 AND mid IN (SELECT mid FROM MedicoInfermiere WHERE iid = ?)";
    db.all(sql, [data, iid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const med = rows.map((row) => createMedicina(row));
        resolve(med);
      }
    });
  });
};

// Dato l'ID del paziente, ritorna la lista delle sue medicine
exports.getMedicineByPaziente = function (pid) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Medicine WHERE pid = ? AND presa = 0";
    db.all(sql, [pid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const medicine = rows.map((row) => createMedicina(row));
        resolve(medicine);
      }
    });
  });
};

/*
// Dato l'ID del paziente e del medico, ritorna la lista delle medicine a loro legate 
exports.getMedicineByPazienteMedico= function (pid, mid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Medicine WHERE pid = ? AND mid = ?";
        db.all(sql, [pid, mid], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const misurazioni = rows.map((row) => createMedicina(row));
                resolve(misurazioni);
            }
        })
    })
}
*/
