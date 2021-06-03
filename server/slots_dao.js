"use-strict"

const Slot = require("./Slot");
const db = require("./db");
const moment = require ("moment");

const createSlot = function (row) {
    return new Slot(row["TID"], row["Day"], row["Starting_Time"], row["Duration"], row["EID"], row["SID"], row["Mark"], row["Present"], row["Whitdrawn"], row["OralTaken"]);
}

exports.addSlot = function(s) {
    s.day = moment(s.day).format("DD/MM/YYYY");
    s.time = moment(s.time).format("HH:mm");
    return new Promise((resolve, reject) => {
        const sql ="INSERT INTO Slots(TID, Day, Starting_Time, Duration, EID) VALUES(?, ?, ?, ?, ?)";

        db.run(sql, [s.tid, s.day, s.time, s.duration, s.eid], function (err){
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                resolve(null);
            }
        });
    })
}

exports.updateSlot = function (newS) {
    newS.day = moment(newS.day).format("DD/MM/YYYY");
    newS.time = moment(newS.time).format("HH:mm");
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Slots SET Mark = ?, Present = ?, Whitdrawn = ?, OralTaken = 1 WHERE TID = ? AND Day = ? AND Starting_Time = ? AND EID = ?";

        db.run(sql, [newS.mark, newS.present, newS.whitdrawn, newS.tid, newS.day, newS.time, newS.eid], (err) => {
            if(err)
                reject(err);
            else
                resolve(null);
        })
    })
}

exports.handleSlotBooking = function (tid, day, time, sid, eid) {
    day = moment(day).format("DD/MM/YYYY");
    time = moment(time).format("HH:mm");
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Slots SET SID = ? WHERE TID = ? AND Day = ? AND Starting_Time = ? AND EID = ?";

        db.run(sql, [sid, tid, day, time, eid], (err) => {
            if(err)
                reject(err);
            else
                resolve(null);
        })
    })
}

exports.getSlotsOfStudent = function (sid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Slots WHERE SID = ?";
        db.all(sql, [sid], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                let slots = rows.map((row) => createSlot(row));
                resolve(slots);
            }
        })
    })
}

exports.getSlotsOfTeacher = function (tid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Slots WHERE TID = ?";
        db.all(sql, [tid], (err, rows) => {
            if(err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                let slots = rows.map((row) => createSlot(row));
                resolve(slots);
            }
        })
    })
}



