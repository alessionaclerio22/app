"use strict";

const Medico = require("./Medico");
const db = require("./db");
const moment = require("moment");
const bcrypt = require("bcrypt");

const createMedico = function (row) {
  return new Medico(
    row["mid"],
    row["nome"],
    row["cognome"],
    row["data_nascita"],
    row["sede_ambulatorio"],
    row["specializzazione"],
    row["telefono"],
    row["mail"],
    row["foto"],
    row["ordine"],
    row["numero_ordine"],
    row["password"]
  );
};

/* aggiunge un medico */
exports.addMedico = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Medici(nome, cognome, data_nascita, sede_ambulatorio, specializzazione, telefono, mail, foto, ordine, numero_ordine, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.run(
      sql,
      [
        s.nome,
        s.cognome,
        s.data_nascita,
        s.sede_ambulatorio,
        s.specializzazione,
        s.telefono,
        s.mail,
        s.foto,
        s.ordine,
        s.numero_ordine,
        s.hash,
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

/* modifica i parametri di un medico dato il suo ID */
exports.editMedico = function (s) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Medici SET nome = ?, cognome = ?, data_nascita = ?, sede_ambulatorio = ?, specializzazione = ?, telefono = ?, mail = ?, ordine = ?, numero_ordine = ? WHERE mid = ?";

    db.run(
      sql,
      [
        s.nome,
        s.cognome,
        s.data_nascita,
        s.sede_ambulatorio,
        s.specializzazione,
        s.telefono,
        s.mail,
        s.ordine,
        s.numero_ordine,
        s.mid,
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

/* Dato un ID del paziente, ritorna i suoi medici */
exports.getMediciByPaziente = function (pid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Medici WHERE mid IN (SELECT mid FROM Cura WHERE pid = ?)";
    db.all(sql, [pid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const medici_ID = rows.map((row) => createMedico(row));
        resolve(medici_ID);
      }
    });
  });
};

/* Dato un ID del medico, ritorna tutti i parametri del medico */
exports.getMedicoById = function (mid) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Medici WHERE mid = ?";
    db.all(sql, [mid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const medico = createMedico(rows[0]);
        resolve(medico);
      }
    });
  });
};

/* Data la mail del medico, ritorna tutti i parametri del medico */
exports.getMedicoByMail = function (mail) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Medici WHERE mail = ?";
    db.all(sql, [mail], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const medico = createMedico(rows[0]);
        console.log(medico);
        resolve(medico);
      }
    });
  });
};

/* Dato l'ID dell'infermiere ritorna il suo medico associato */
exports.getMedicoByInfermiere = function (iid) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Medici WHERE mid IN (SELECT mid FROM MedicoInfermiere where iid = ?)";
    db.all(sql, [iid], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const medico = createMedico(rows[0]);
        resolve(medico);
      }
    });
  });
};

exports.checkPassword = function (user, password) {
  /*console.log("hash of: " + password);
  let hash = bcrypt.hashSync(password, 10);
  console.log(hash);
  console.log("DONE");
  console.log(user.hash);*/
  //return bcrypt.compareSync(password, user.hash);

  return password === user.hash;
};

/* 
//Ritorna la lista di tutti i medici 
exports.getAllMedici = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Medici";
        db.all(sql, (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const medici = rows.map((row) => createMedico(row));
                resolve(medici);
            }
        })
    })
} */
