"use strict"

const db = require("./db");
const Teacher = require("./Teacher");
const bcrypt = require('bcrypt');

const createTeacher = function (row) {
    return new Teacher(row["TID"], row["Name"], row["Surname"], row["Email"], row["Hash"], row["CourseCode"], row["CourseName"]);
}

exports.getTeacher = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Teachers WHERE Email = ?";
        db.all(sql, [email], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const teacher = createTeacher(rows[0]);
                resolve(teacher);
            }
        })
    })
} 

exports.getTeachersOfStudentForOral = function (sid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Teachers WHERE TID IN (SELECT TID FROM Assignements WHERE SID = ?)";
        db.all(sql, [sid], (err,rows) => {
                if(err)
                    reject(err);
                else if(rows.length === 0){
                    resolve(undefined);
                }
                else{
                    const teachers = rows.map((row) => createTeacher(row));
                    resolve(teachers);
                }
        });
    })
} 

exports.getTeacherById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Teachers WHERE TID = ?";
        db.all(sql, [id], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const teacher = createTeacher(rows[0]);
                resolve(teacher);
            }
        })
    })
}

exports.checkPassword = function(user, password){
    console.log("hash of: " + password);
    let hash = bcrypt.hashSync(password, 10);
    console.log(hash);
    console.log("DONE");

    return bcrypt.compareSync(password, user.hash);
} 