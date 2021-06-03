"use strict"

//Importing the various things needed

const express = require('express');
const studentDao = require('./student_dao');
const teacherDao = require('./teacher_dao');
const examDao = require ('./exam_dao');
const slotDao = require ('./slots_dao');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


// Handle JWT

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 600; //seconds
// Authorization error
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };

// create the application
const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());


// Authentication endpoint
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;


    teacherDao.getTeacher(username)
      .then((user) => {

        if(user === undefined) {
            res.status(404).send({
                errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }] 
              });
        } else {
            if(!teacherDao.checkPassword(user, password)){
                res.status(401).send({
                    errors: [{ 'param': 'Server', 'msg': 'Wrong password' }] 
                  });
            } else {
                //AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json({id: user.id, name: user.name});
            }
        } 
      }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        }
      );
});

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

// Students APIs definition

//GET /student 
app.get('/api/students/:student', (req,res) => {
        studentDao.getStudent(req.params.student)
        .then((student) => {
            res.json(student);
        }).catch((err) => {
            res.status(500).json({errors: [{"msg": err}]});
        });
});


// GET /students/<student id>/exams 
app.get("/api/students/:student/exams", (req, res) => {
    examDao.getStudentExams(req.params.student)
        .then((exams) => res.json(exams))
        .catch((err) => {
            res.status(500).json({errors: [{"msg": err}]});
        });
})

// GET /students/<student id>/teachers used for teachers who have selected the student for an exam at least
app.get("/api/students/:student/teachers", (req, res) => {
    teacherDao.getTeachersOfStudentForOral(req.params.student)
        .then((teachers) => {
            res.json(teachers);
        })
        .catch((err) => {
            res.status(500).json({errors: [{"msg": err}]});
        });
})

// GET /teachers/<teacher id>/slots
app.get("/api/teachers/:teacher/slots", (req, res) => {
    slotDao.getSlotsOfTeacher(req.params.teacher)
        .then((slots) => {
            res.json(slots);
        })
        .catch((err) => {
            res.status(500).json({errors: [{"msg": err}]});
        });
})

// PUT //teachers/<teacher id>/slots/<student id> used for just the booking of a slot
app.put("/api/teachers/:teacher/exams/:exam/slots/:student", (req, res) => {
    if(!req.body.day || !req.body.time || !req.body.tid || !req.body.eid){
        res.status(400).end();
    }
    else {
        slotDao.handleSlotBooking(req.body.tid, req.body.day, req.body.time, req.body.sid, req.body.eid)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{"param": "Server", "msg": err}],
            }));
    }

})

// GET /students/<student id>/slots
app.get("/api/students/:student/slots", (req, res) => {
    slotDao.getSlotsOfStudent(req.params.student)
        .then((slots) => {
            res.json(slots);
        })
        .catch((err) => {
            res.status(500).json({errors: [{"msg": err}]});
        });
})

// <------------------------------------------------------------>

// For the rest of the code, all APIs require authentication
app.use(
    jwt({
      secret: jwtSecret,
      getToken: req => req.cookies.token,
      algorithms: ['HS256']
    })
  );
  
// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json(authErrorObj);
    }
  });


// AUTHENTICATED REST API endpoints

//GET /teacher
app.get('/api/teacher', (req,res) => {
    const user = req.user && req.user.user;
    teacherDao.getTeacherById(user)
        .then((user) => {
            res.json({id: user.id, name: user.name});
        }).catch(
        (err) => {
         res.status(401).json(authErrorObj);
        }
      );
});

// GET /teachers/<teacher id>/exams
app.get("/api/teachers/:teacher/exams", (req,res) => {
    const user = req.user && req.user.user;
    examDao.getTeacherExams(user)
        .then((exams) => res.json(exams))
        .catch((err) => {
            res.status(500).json({errors: [{"msg": err}]});
        });
})

// GET all students of a teacher
app.get("/api/teachers/:teacher/students", (req, res) => {
    const user = req.user && req.user.user;
    studentDao.getStudentsOfTeacher(user)
        .then((slots) => {
            res.json(slots);
        })
        .catch((err) => {
            res.status(500).json({errors: [{"msg": err}]});
        });
})

// GET all students of a teacher for a specific exam
app.get("/api/teachers/:teacher/exams/:exam/students", (req, res) => {
    const user = req.user && req.user.user;
    studentDao.getStudentsOfTeacherForExam(user,req.params.exam)
        .then((slots) => {
            res.json(slots);
        })
        .catch((err) => {
            res.status(500).json({errors: [{"msg": err}]});
        });
})


// POST Select a student for an exam
app.post("/api/teachers/:teacher/exams/:exam/students/:student", (req, res) => {
    const user = req.user && req.user.user;
    if(!req.body || !req.body.eid || !req.body.tid)
        res.status(400).end();
    else{
        const exam = req.body;
        examDao.assignExam(user, req.params.student, exam.eid)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{"param": "Server", "msg": err}],
            }));
    }
}) 

// POST create an exam
app.post("/api/teachers/:teacher/exams", (req, res) => {
    if(!req.body || !req.body.tid || !req.body.examname){
        res.status(400).end();
    }
    else{
        const exam = req.body;
        examDao.createExam(exam)
            .then((id) => res.status(201).json({eid: id}))
            .catch((err) => res.status(500).json({
                errors: [{"param": "Server", "msg": err}],
            }));
    }
}) 

// POST create a slot
app.post("/api/teachers/:teacher/exams/:exam/slots", (req, res) => {
    if(!req.body || !req.body.day || !req.body.time || !req.body.tid || !req.body.duration || !req.body.eid){
        res.status(400).end();
    }
    else{
        const slot = req.body;
        slotDao.addSlot(slot)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{"param": "Server", "msg": err}],
            }));
    }
}) 

// PUT modify a slot for teachers 
app.put("/api/teachers/:teacher/exams/:exam/slots", (req, res) => {
    if(!req.body || !req.body.day || !req.body.time || !req.body.tid || !req.body.eid){
        res.status(400).end();
    }
    else {
        const slot = req.body;
        slotDao.updateSlot(slot)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{"param": "Server", "msg": err}],
            }));
    }
}) 


//activate server
app.listen(port, () => console.log('Server ready'));