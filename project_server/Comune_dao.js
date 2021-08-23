"use strict";

const Comune = require("./Comune");
const db = require("./db");
const moment = require("moment");

const createComune = function (row) {
  return new Comune(row["nome"], row["sigla"]);
};

exports.getComuni = function () {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Comuni";
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const comuni = rows.map((row) => createComune(row));
        resolve(comuni);
      }
    });
  });
};
