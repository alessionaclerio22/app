"use strict"

const Student = require("./Student");
const db = require("./db");
const moment = require("moment");

const createStudent = function(row) {
    return new Student(row["SID"], row["Name"], row["Surname"])
}

/* Get a student with given id */

exports.getStudent = function(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Students WHERE SID = ?";
        db.all(sql, [id], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const student = createStudent(rows[0]);
                resolve(student);
            }
        })
    })
}

exports.getStudentsOfTeacher = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Students WHERE SID IN (SELECT SID FROM Enrollments WHERE TID = ?)";

        db.all(sql, [id], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                let students = rows.map((row) => createStudent(row));
                resolve(students);
            }
        })
    })
}

exports.getStudentsOfTeacherForExam = function (id, eid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Students WHERE SID IN (SELECT SID FROM Assignements WHERE TID = ? AND EID = ?)";
        db.all(sql, [id, eid], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                let students = rows.map((row) => createStudent(row));
                resolve(students);
            }
        })
    })
}

