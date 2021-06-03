"use strict"

const Exam = require("./Exam");
const db = require("./db");
const moment = require("moment");

const createExam = function(row) {
    return new Exam(row["EID"], row["Exam_Name"], row["TID"]);
}

exports.createExam = function (exam) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Exams (Exam_Name, TID) VALUES (?, ?)";
        db.run(sql, [exam.examname, exam.tid], function (err) {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                resolve(this.lastID);
            }
        })
    })
}

exports.assignExam = function (tid,sid,eid) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Assignements (SID, EID, TID) VALUES (?, ?, ?)";
        db.run(sql, [sid, eid, tid], (err) => {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                resolve(null);
            }
        })
    })
}

exports.getStudentExams = function(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Exams WHERE EID IN (SELECT EID FROM Assignements WHERE SID = ?)";
        db.all(sql, [id], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                let exams = rows.map((row) => createExam(row));
                resolve(exams);
            }
        })
    })
} 

exports.getTeacherExams = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Exams WHERE TID = ?";
        db.all(sql, [id], (err,rows) => {
            if(err)
                reject(err);
            else if(rows.length === 0){
                resolve(undefined);
            }
            else{
                const exams = rows.map((row) => createExam(row));
                resolve(exams);
            }
        })
    })
}