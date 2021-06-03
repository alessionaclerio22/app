"use strict";

const Visita = require("./Visita");
const db = require("./db");
const moment = require("moment");

const createVisita = function (row) {
  return new Visita(
    row["mid"],
    row["pid"],
    row["data"],
    row["ora"],
    row["fatto"],
    row["delega"]
  );
};

/* Aggiunge una visita */
exports.addVisita = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Visite(mid, pid, data, ora, fatto, delega) VALUES(?, ?, ?, ?, ?, ?)";
    db.run(
      sql,
      [s.mid, s.pid, s.data, s.ora, s.fatto, s.delega],
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

/* Dato un paziente e la data, ritorna le sue visite da fare */
exports.getVisiteByPazienteData = function (pid, data) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Visite WHERE pid = ? AND data = ? AND fatto = 0";
    db.all(sql, [pid, data], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const visite = rows.map((row) => createVisita(row));
        resolve(visite);
      }
    });
  });
};

/* Dato un paziente ritorna le sue visite*/
exports.getVisiteByPaziente = function (pid) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Visite WHERE pid = ?";
    db.all(sql, [pid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const visite = rows.map((row) => createVisita(row));
        resolve(visite);
      }
    });
  });
};

/* Dato un medico ritorna le sue visite*/
exports.getVisiteByMedico = function (mid) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Visite WHERE mid = ?";
    db.all(sql, [mid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const visite = rows.map((row) => createVisita(row));
        resolve(visite);
      }
    });
  });
};

/* Dato un medico e la data, ritorna le sue visite da fare*/
exports.getVisiteByMedicoData = function (mid, data) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Visite WHERE mid = ? AND data = ? AND fatto = 0";
    db.all(sql, [mid, data], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const visite = rows.map((row) => createVisita(row));
        resolve(visite);
      }
    });
  });
};

/* Modifica i parametri di una visita */
exports.editVisita = function (newData, newOra, newDelega, s) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Visite SET fatto = ?, delega = ?, data = ?, ora = ? WHERE pid = ? AND mid = ? AND data=? AND ora=?";

    db.run(
      sql,
      [s.fatto, newDelega, newData, newOra, s.pid, s.mid, s.data, s.ora],
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

/* Ritorna le visite con delega da fare in data odierna di tutti i pazienti associati al medico dell'infermiere */
exports.getVisiteDelegaToday = function (iid, data) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Visite WHERE mid IN (SELECT mid FROM MedicoInfermiere WHERE iid = ?) AND data = ? AND fatto = 0 AND delega = 1";
    db.all(sql, [iid, data], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const visite = rows.map((row) => createVisita(row));
        resolve(visite);
      }
    });
  });
};

/* Elimina una visita */
exports.deleteVisita = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "DELETE FROM Visite WHERE mid = ? AND pid = ? AND data = ? AND ora = ?";
    db.run(sql, [s.mid, s.pid, s.data, s.ora], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};
