"use strict";

const Richiesta_MedPaz = require("./Richiesta_MedPaz");
const db = require("./db");

const createRichiesta = function (row) {
  return new Richiesta_MedPaz(row["mid"], row["pid"], row["sender"]);
};

exports.addRichiesta = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO RichiesteMedico_Paziente(mid, pid, sender) VALUES(?, ?, ?)";
    db.run(sql, [s.mid, s.pid, s.sender], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};

exports.deleteRichiesta = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "DELETE FROM RichiesteMedico_Paziente WHERE mid = ? AND pid = ?";
    db.run(sql, [s.mid, s.pid], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};

exports.getRichiesteByMedicoID = function (mid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM RichiesteMedico_Paziente WHERE mid = ? AND sender = 'paziente'";
    db.all(sql, [mid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const ric = rows.map((row) => createRichiesta(row));
        resolve(ric);
      }
    });
  });
};

exports.getRichiesteSentByMedicoID = function (mid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM RichiesteMedico_Paziente WHERE mid = ? AND sender = 'medico'";
    db.all(sql, [mid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const ric = rows.map((row) => createRichiesta(row));
        resolve(ric);
      }
    });
  });
};

exports.getRichiesteByPazienteID = function (pid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM RichiesteMedico_Paziente WHERE pid = ? AND sender = 'medico'";
    db.all(sql, [pid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const ric = rows.map((row) => createRichiesta(row));
        resolve(ric);
      }
    });
  });
};

exports.getRichiesteSentByPazienteID = function (pid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM RichiesteMedico_Paziente WHERE pid = ? AND sender = 'paziente'";
    db.all(sql, [pid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const ric = rows.map((row) => createRichiesta(row));
        resolve(ric);
      }
    });
  });
};
