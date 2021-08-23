"use strict";

const Farmaco = require("./Farmaco");
const db = require("./db");

const createFarmaco = function (row) {
  return new Farmaco(
    row["pa"],
    row["confRif"],
    row["ATC"],
    row["AIC"],
    row["farm"],
    row["conf"],
    row["ditta"],
    row["prezzoRif"],
    row["prezzoPub"],
    row["diff"],
    row["nota"],
    row["cge"]
  );
};

exports.getFarmaci = function () {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Lista_farmaci_equivalenti";
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        const farmaci = rows.map((row) => createFarmaco(row));
        resolve(farmaci);
      }
    });
  });
};
