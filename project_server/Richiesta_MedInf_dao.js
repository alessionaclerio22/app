"use strict";

const Richiesta_MedInf = require("./Richiesta_MedInf");
const db = require("./db");

const createRichiesta = function (row) {
  return new Richiesta_MedInf(row["mid"], row["iid"], row["sender"]);
};

exports.addRichiesta = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO RichiesteMedico_Infermiere(mid, iid, sender) VALUES(?, ?, ?)";
    db.run(sql, [s.mid, s.iid, s.sender], function (err) {
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
      "DELETE FROM RichiesteMedico_Infermiere WHERE mid = ? AND iid = ?";
    db.run(sql, [s.mid, s.iid], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};

exports.deleteRichiesteInf = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "DELETE FROM RichiesteMedico_Infermiere WHERE iid = ?";
    db.run(sql, [s.iid], function (err) {
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
      "SELECT * FROM RichiesteMedico_Infermiere WHERE mid = ? AND sender = 'infermiere'";
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
      "SELECT * FROM RichiesteMedico_Infermiere WHERE mid = ? AND sender = 'medico'";
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

exports.getRichiesteByInfermiereID = function (iid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM RichiesteMedico_Infermiere WHERE iid = ? AND sender = 'medico'";
    db.all(sql, [iid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const ric = rows.map((row) => createRichiesta(row));
        resolve(ric);
      }
    });
  });
};

exports.getRichiesteSentByInfermiereID = function (iid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM RichiesteMedico_Infermiere WHERE iid = ? AND sender = 'infermiere'";
    db.all(sql, [iid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const ric = rows.map((row) => createRichiesta(row));
        resolve(ric);
      }
    });
  });
};
