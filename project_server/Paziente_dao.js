"use strict";

const Paziente = require("./Paziente");
const db = require("./db");
const moment = require("moment");

const createPaziente = function (row) {
  return new Paziente(
    row["pid"],
    row["nome"],
    row["cognome"],
    row["data_nascita"],
    row["password"],
    row["mail"],
    row["foto"],
    row["telefono"],
    row["codice_fiscale"],
    row["tesserino_sanitario"],
    row["indirizzo"]
  );
};

/* aggiunge un paziente */
exports.addPaziente = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Pazienti(nome, cognome, data_nascita, password, mail, foto, telefono, codice_fiscale, tesserino_sanitario, indirizzo) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(
      sql,
      [
        s.nome,
        s.cognome,
        s.data_nascita,
        s.hash,
        s.mail,
        s.foto,
        s.telefono,
        s.codice_fiscale,
        s.tesserino_sanitario,
        s.indirizzo,
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

/* modifica i parametri di un paziente dato il suo ID */
exports.editPaziente = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Pazienti SET nome = ?, cognome = ?, data_nascita = ?, mail = ?, telefono = ?, codice_fiscale = ?, tesserino_sanitario = ?, indirizzo = ? WHERE pid = ?";

    db.run(
      sql,
      [
        s.nome,
        s.cognome,
        s.data_nascita,
        s.mail,
        s.telefono,
        s.codice_fiscale,
        s.tesserino_sanitario,
        s.indirizzo,
        s.pid,
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

/* Dato l'ID del medico ritorna i suoi pazienti */
exports.getPazientiByMedicoID = function (mid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Pazienti WHERE pid IN (SELECT pid FROM Cura WHERE mid = ?)";
    db.all(sql, [mid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const pazienti_ID = rows.map((row) => createPaziente(row));
        resolve(pazienti_ID);
      }
    });
  });
};

/* Dato l'ID del paziente ritorna i suoi parametri */
exports.getPazienteById = function (pid) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Pazienti WHERE pid = ?";
    db.all(sql, [pid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const paziente = createPaziente(rows[0]);
        resolve(paziente);
      }
    });
  });
};

/* Data la mail del paziente, ritorna i  suoi parametri */
exports.getPazienteByMail = function (mail) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Pazienti WHERE mail = ?";
    db.all(sql, [mail], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const paziente = createPaziente(rows[0]);
        resolve(paziente);
      }
    });
  });
};

/* Dato l'ID dell'infermiere ritorna i pazienti associati al suo medico */
// DA CONTROLLARE
exports.getPazientiByInfermiere = function (iid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Pazienti WHERE pid IN (SELECT pid FROM Cura WHERE mid IN (SELECT mid FROM MedicoInfermiere WHERE iid = ?))";
    db.all(sql, [iid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const medico = rows.map((row) => createPaziente(row));
        resolve(medico);
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

/* 
// Ritorna elenco pazienti 
exports.getAllPazienti = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Pazienti";
        db.all(sql, (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const pazienti = rows.map((row) => createPaziente(row));
                resolve(pazienti);
            }
        })
    })
}

// Dato l'ID del medico, ritorna un array di oggetti(NOME, COGNOME, DATA DI NASCITA) dei suoi pazienti 
exports.getPazientiByMedicoID = function (mid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT nome, cognome, pid FROM Pazienti WHERE pid IN (SELECT pid FROM Cura WHERE mid = ?)";
        db.all(sql, [mid], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const pazienti = rows.map((row) => {return {nome: row["nome"], cognome: row["cognome"], data_nascita: row["data_nascita"]}});
                resolve(pazienti);
            }
        })
    })
}*/
