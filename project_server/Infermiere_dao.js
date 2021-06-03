"use strict";

const Infermiere = require("./Infermiere");
const db = require("./db");
const moment = require("moment");

const createInfermiere = function (row) {
  return new Infermiere(
    row["iid"],
    row["nome"],
    row["cognome"],
    row["data_nascita"],
    row["mail"],
    row["foto"],
    row["numero_ordine"],
    row["ordine"],
    row["telefono"],
    row["password"]
  );
};

/* aggiunge un infermiere */
exports.addInfermiere = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Infermieri(nome, cognome, data_nascita, mail, foto, numero_ordine, ordine, telefono, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.run(
      sql,
      [
        s.nome,
        s.cognome,
        s.data_nascita,
        s.mail,
        s.foto,
        s.numero_ordine,
        s.ordine,
        s.telefono,
        s.password,
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

/* modifica i parametri di un infermiere dato il suo ID */
exports.editInfermiere = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Infermieri SET nome = ?, cognome = ?, data_nascita = ?, mail = ?, numero_ordine = ?, ordine = ?, telefono = ? WHERE iid = ?";
    db.run(
      sql,
      [
        s.nome,
        s.cognome,
        s.data_nascita,
        s.mail,
        s.numero_ordine,
        s.ordine,
        s.telefono,
        s.iid,
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

/* Dato un ID dell' infermiere, ritorna tutti i parametri dell'infermiere */
exports.getInfermiereById = function (iid) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Infermieri WHERE iid = ?";
    db.all(sql, [iid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const infermiere = createInfermiere(rows[0]);
        resolve(infermiere);
      }
    });
  });
};

// Dato l'ID del medico ritorna i suoi infermieri
exports.getInfermieriByMedicoID = function (mid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Infermieri WHERE iid IN (SELECT iid FROM MedicoInfermiere WHERE mid = ?)";
    db.all(sql, [mid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const infermieri = rows.map((row) => createInfermiere(row));
        resolve(infermieri);
      }
    });
  });
};

/* Data la mail dell'infermiere, ritorna tutti i parametri dell'infermiere */
exports.getInfermiereByMail = function (mail) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Infermieri WHERE mail = ?";
    db.all(sql, [mail], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const paziente = createInfermiere(rows[0]);
        resolve(paziente);
      }
    });
  });
};

exports.checkPassword = function (user, password) {
  console.log("hash of: " + password);
  let hash = bcrypt.hashSync(password, 10);
  console.log(hash);
  console.log("DONE");

  return bcrypt.compareSync(password, user.hash);
};
