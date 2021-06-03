"use strict";

const Nota = require("./Nota");
const db = require("./db");
const moment = require("moment");

const createNota = function (row) {
  return new Nota(row["mid"], row["pid"], row["data"], row["testo"]);
};

/* Aggiunge una nota */
exports.addNota = function (s) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO Note(mid, pid, data, testo) VALUES(?, ?, ?, ?)";
    db.run(sql, [s.mid, s.pid, s.data, s.testo], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};

/* Modifica una nota */
exports.editNota = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Note SET testo = ? WHERE pid = ? AND mid = ? AND data = ?";

    db.run(sql, [s.testo, s.pid, s.mid, s.data], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};

/* Elimina una nota */
exports.deleteNota = function (s) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Note WHERE mid = ? AND pid = ? AND data = ?";
    db.run(sql, [s.mid, s.pid, s.data], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};

/* Dato l'ID del paziente, ritorna le sue note */
exports.getNoteByPazienteID = function (pid) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Note WHERE pid = ?";
    db.all(sql, [pid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const note = rows.map((row) => createNota(row));
        resolve(note);
      }
    });
  });
};
