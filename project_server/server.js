"use strict";

//Importing the various things needed

const express = require("express");
const moment = require("moment");
const medicoDao = require("./Medico_dao");
const comuneDao = require("./Comune_dao");
const infermiereDao = require("./Infermiere_dao");
const farmacoDao = require("./Farmaco_dao");
const medicinaDao = require("./Medicina_dao");
const misurazioneDao = require("./Misurazione_dao");
const notaDao = require("./Nota_dao");
const pazienteDao = require("./Paziente_dao");
const prescrizioneDao = require("./Prescrizione_dao");
const visitaDao = require("./Visita_dao");
const MedicoInfermiereDao = require("./Medico_Infermiere_dao");
const curaDao = require("./Cura_dao");
const Richiesta_MedInf = require("./Richiesta_MedInf_dao");
const Richiesta_MedPaz = require("./Richiesta_MedPaz_dao");
const InMemoryStorage = require("./sessionStore");
const morgan = require("morgan"); // logging middleware
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Prescrizione = require("./Prescrizione");

// Handle JWT

const jwtSecret =
  "6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX";
const expireTime = 600; //seconds
// Authorization error
const authErrorObj = {
  errors: [{ param: "Server", msg: "Authorization error" }],
};

// create the application
const app = express();
const port = 3001;

// Socket.IO

const httpServer = require("http").createServer(app);
const options = { cors: true, origins: ["http://localhost:3001"] };
const io = require("socket.io")(httpServer, options);
const sessionStore = new InMemoryStorage();

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

// Socket Handling

io.use((socket, next) => {
  const role = socket.handshake.auth.role;
  const tag = socket.handshake.auth.tag;

  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }

  if (role) socket.role = role;

  if (tag) socket.tag = tag;

  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  // persist session
  sessionStore.saveSession(
    JSON.stringify({
      tag: socket.tag,
      username: socket.username,
      role: socket.role,
    }),
    {
      tag: socket.tag,
      role: socket.role,
      username: socket.username,
      connected: true,
    }
  );

  // join the "userID" room
  console.log(
    "Room of " +
      JSON.stringify({
        tag: socket.tag,
        username: socket.username,
        role: socket.role,
      })
  );
  socket.join(
    JSON.stringify({
      tag: socket.tag,
      username: socket.username,
      role: socket.role,
    })
  );

  // fetch existing users
  const users = [];
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      username: session.username,
      tag: session.tag,
      role: session.role,
      connected: session.connected,
    });
  });
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    username: socket.username,
    tag: socket.tag,
    role: socket.role,
    connected: true,
  });

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("private message", ({ content, to }) => {
    console.log(content);
    console.log(to);
    const obj = JSON.parse(to);
    console.log(obj);
    let tagS = `${obj.tag}`;
    obj.tag = tagS;
    console.log(JSON.stringify(obj));
    socket.to(JSON.stringify(obj)).emit("private message", {
      tag: socket.tag,
      username: socket.username,
      role: socket.role,
      content: content,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", async () => {
    const matchingSockets = await io
      .in(
        JSON.stringify({
          tag: socket.tag,
          username: socket.username,
          role: socket.role,
        })
      )
      .allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", {
        tag: socket.tag,
        username: socket.username,
        role: socket.role,
      });
      // update the connection status of the session
      sessionStore.deleteSession(
        JSON.stringify({
          tag: socket.tag,
          username: socket.username,
          role: socket.role,
        })
      );
    }
  });
});
// Set-up logging
app.use(morgan("tiny"));

// Process body content
app.use(express.json());

// Authentication endpoint

/* AUTENTICAZIONE MEDICI */
app.post("/api/medici/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  medicoDao
    .getMedicoByMail(username)
    .then((medico) => {
      if (medico === undefined) {
        res.json({ found: "0" });
      } else {
        if (!medicoDao.checkPassword(medico, password)) {
          res.status(401).send({
            errors: [{ param: "Server", msg: "Password errata" }],
          });
        } else {
          //AUTHENTICATION SUCCESS
          const token = jsonwebtoken.sign(
            { user_id: medico.mid, tipo: "medico" },
            jwtSecret,
            { expiresIn: expireTime }
          );
          res.cookie("token", token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 30000 * expireTime,
          });
          res.json({
            id: medico.mid,
            user: medico,
            tipo: "medico",
          });
        }
      }
    })
    .catch(
      // Delay response when wrong user/pass is sent to avoid fast guessing attempts
      (err) => {
        new Promise((resolve) => {
          setTimeout(resolve, 1000);
        }).then(() => res.status(401).json(authErrorObj));
      }
    );
});

/* AUTENTICAZIONE PAZIENTI */
app.post("/api/pazienti/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  pazienteDao
    .getPazienteByMail(username)
    .then((paziente) => {
      if (paziente === undefined) {
        res.status(404).send({
          errors: [
            {
              param: "Server",
              msg: "Non esiste nessun utente registrato con questa mail",
            },
          ],
        });
        res.json({ found: "0" });
      } else {
        if (!pazienteDao.checkPassword(paziente, password)) {
          res.status(401).send({
            errors: [{ param: "Server", msg: "Password errata" }],
          });
        } else {
          //AUTHENTICATION SUCCESS
          const token = jsonwebtoken.sign(
            { user_id: paziente.pid, tipo: "paziente" },
            jwtSecret,
            { expiresIn: expireTime }
          );
          res.cookie("token", token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 1000 * expireTime,
          });
          res.json({
            id: paziente.pid,
            tipo: "paziente",
            user: paziente,
          });
        }
      }
    })
    .catch(
      // Delay response when wrong user/pass is sent to avoid fast guessing attempts
      (err) => {
        new Promise((resolve) => {
          setTimeout(resolve, 1000);
        }).then(() => res.status(401).json(authErrorObj));
      }
    );
});

/* AUTENTICAZIONE INFERMIERI */
app.post("/api/infermieri/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  infermiereDao
    .getInfermiereByMail(username)
    .then((infermiere) => {
      if (infermiere === undefined) {
        res.json({ found: "0" });
      } else {
        if (!infermiereDao.checkPassword(infermiere, password)) {
          res.status(401).send({
            errors: [{ param: "Server", msg: "Password errata" }],
          });
        } else {
          //AUTHENTICATION SUCCESS
          const token = jsonwebtoken.sign(
            { user_id: infermiere.iid, tipo: "infermiere" },
            jwtSecret,
            { expiresIn: expireTime }
          );
          res.cookie("token", token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 1000 * expireTime,
          });
          res.json({
            id: infermiere.iid,
            user: infermiere,
            tipo: "infermiere",
          });
        }
      }
    })
    .catch(
      // Delay response when wrong user/pass is sent to avoid fast guessing attempts
      (err) => {
        new Promise((resolve) => {
          setTimeout(resolve, 1000);
        }).then(() => res.status(401).json(authErrorObj));
      }
    );
});

app.use(cookieParser());

app.get("/api/pazpresent", (req, res) => {
  console.log(req.query.username);
  pazienteDao
    .getPazienteByMail(req.query.username)
    .then((paziente) => {
      if (paziente === undefined) {
        res.json({ found: "0" });
      } else {
        res.json({ found: "1", id: paziente.pid });
      }
    })
    .catch();
});
app.get("/api/medpresent", (req, res) => {
  medicoDao
    .getMedicoByMail(req.query.username)
    .then((m) => {
      if (m === undefined) {
        res.json({ found: "0" });
      } else {
        res.json({ found: "1", id: m.mid });
      }
    })
    .catch();
});
app.get("/api/infpresent", (req, res) => {
  infermiereDao
    .getInfermiereByMail(req.query.username)
    .then((i) => {
      if (i === undefined) {
        res.json({ found: "0" });
      } else {
        res.json({ found: "1", id: i.iid });
      }
    })
    .catch();
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token").end();
});

// POST registra un medico
app.post("/api/medici", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const medico = req.body;
    medicoDao
      .addMedico(medico)
      .then(
        (
          result //AUTHENTICATION SUCCESS
        ) => {
          const token = jsonwebtoken.sign(
            { user_id: medico.mid, tipo: "medico" },
            jwtSecret,
            { expiresIn: expireTime }
          );
          res.cookie("token", token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 1000 * expireTime,
          });
          res.json({ id: medico.mid, name: medico.nome, tipo: "medico" });
          res.status(201).end();
        }
      )
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

// POST registra un paziente
app.post("/api/pazienti", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const paziente = req.body;
    pazienteDao
      .addPaziente(paziente)
      .then(
        (
          result //AUTHENTICATION SUCCESS
        ) => {
          const token = jsonwebtoken.sign(
            { user_id: paziente.pid },
            jwtSecret,
            { expiresIn: expireTime }
          );
          res.cookie("token", token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 1000 * expireTime,
          });
          res.json({ id: paziente.pid, name: paziente.nome, tipo: "paziente" });
          res.status(201).end();
        }
      )

      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

// POST registra un infermiere
app.post("/api/infermieri", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const infermiere = req.body;
    infermiereDao
      .addInfermiere(infermiere)
      .then((result) => {
        //AUTHENTICATION SUCCESS
        const token = jsonwebtoken.sign(
          { user_id: infermiere.iid },
          jwtSecret,
          { expiresIn: expireTime }
        );
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: true,
          maxAge: 1000 * expireTime,
        });
        res.json({
          id: infermiere.iid,
          name: infermiere.nome,
          tipo: "infermiere",
        });
        res.status(201).end();
      })
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

app.get("/api/comuni", (req, res) => {
  comuneDao
    .getComuni()
    .then((comuni) => {
      res.json(comuni);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

// For the rest of the code, all APIs require authentication
app.use(
  jwt({
    secret: jwtSecret,
    getToken: (req) => req.cookies.token,
    algorithms: ["HS256"],
  })
);

// To return a better object in case of errors
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json(authErrorObj);
  }
});

// AUTHENTICATED REST API endpoints

app.get("/api/auth", (req, res) => {
  const user = req.user.user_id && req.user;
  console.log(user.tipo);

  if (req.user.tipo === "medico") {
    medicoDao
      .getMedicoById(user.user_id)
      .then((u) => {
        res.json({ id: u.mid, tipo: "1" });
      })
      .catch((err) => {
        res.status(401).json(authErrorObj);
      });
  } else if (req.user.tipo === "paziente") {
    pazienteDao
      .getPazienteById(user.user_id)
      .then((u) => {
        res.json({ id: u.pid, tipo: "0" });
      })
      .catch((err) => {
        res.status(401).json(authErrorObj);
      });
  } else if (req.user.tipo === "infermiere") {
    infermiereDao
      .getInfermiereById(user.user_id)
      .then((u) => {
        res.json({ id: u.iid, tipo: "2" });
      })
      .catch((err) => {
        res.status(401).json(authErrorObj);
      });
  }
});

app.get("/api/infermieri/:infermiere/richieste", (req, res) => {
  if (req.query.sender === "medico") {
    Richiesta_MedInf.getRichiesteByInfermiereID(req.params.infermiere)
      .then((ric) => {
        res.json(ric);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else if (req.query.sender === "infermiere") {
    Richiesta_MedInf.getRichiesteSentByInfermiereID(req.params.infermiere)
      .then((ric) => {
        res.json(ric);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

app.get("/api/pazienti/:paziente/richieste", (req, res) => {
  if (req.query.sender === "medico") {
    Richiesta_MedPaz.getRichiesteByPazienteID(req.params.paziente)
      .then((ric) => {
        res.json(ric);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else if (req.query.sender === "paziente") {
    Richiesta_MedPaz.getRichiesteSentByPazienteID(req.params.paziente)
      .then((ric) => {
        res.json(ric);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

app.get("/api/medici/:medico/richiestepaz", (req, res) => {
  if (req.query.sender === "paziente") {
    Richiesta_MedPaz.getRichiesteByMedicoID(req.params.medico)
      .then((ric) => {
        res.json(ric);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else if (req.query.sender === "medico") {
    Richiesta_MedPaz.getRichiesteSentByMedicoID(req.params.medico)
      .then((ric) => {
        res.json(ric);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

app.get("/api/medici/:medico/richiesteinf", (req, res) => {
  if (req.query.sender === "infermiere") {
    Richiesta_MedInf.getRichiesteByMedicoID(req.params.medico)
      .then((ric) => {
        res.json(ric);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else if (req.query.sender === "medico") {
    Richiesta_MedInf.getRichiesteSentByMedicoID(req.params.medico)
      .then((ric) => {
        res.json(ric);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

app.post("/api/richiestemedpaz", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const ric = req.body;
    Richiesta_MedPaz.addRichiesta(ric)
      .then((result) => res.status(201).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

app.post("/api/richiestemedinf", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const ric = req.body;
    Richiesta_MedInf.addRichiesta(ric)
      .then((result) => res.status(201).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

app.delete("/api/richiestemedpaz", (req, res) => {
  Richiesta_MedPaz.deleteRichiesta(req.body)
    .then((ric) => {
      res.json(ric);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

app.delete("/api/richiestemedinf", (req, res) => {
  if (!req.query.all) {
    Richiesta_MedInf.deleteRichiesta(req.body)
      .then((ric) => {
        res.json(ric);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    Richiesta_MedInf.deleteRichiesteInf(req.body)
      .then((ric) => {
        res.json(ric);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

app.get("/api/farmaci", (req, res) => {
  farmacoDao
    .getFarmaci()
    .then((farmaci) => {
      res.json(farmaci);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//GET ritorna parametri paziente o
app.get("/api/pazienti/:paziente", (req, res) => {
  pazienteDao
    .getPazienteById(req.params.paziente)
    .then((paziente) => {
      res.json(paziente);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//GET ritorna parametri medico data la mail
app.get("/api/medici", (req, res) => {
  if (req.query.mail) {
    medicoDao
      .getMedicoByMail(req.query.mail)
      .then((medico) => {
        res.json(medico);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    medicoDao
      .getAllMedici()
      .then((medici) => {
        res.json(medici);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

//GET ritorna parametri infermiere data la mail
app.get("/api/infermieri", (req, res) => {
  if (req.query.mail) {
    infermiereDao
      .getInfermiereByMail(req.query.mail)
      .then((inf) => {
        res.json(inf);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    infermiereDao
      .getAllInfermieri()
      .then((infermieri) => {
        res.json(infermieri);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

//GET ritorna parametri paziente data la mail
app.get("/api/pazienti", (req, res) => {
  if (req.query.mail) {
    pazienteDao
      .getPazienteByMail(req.query.mail)
      .then((p) => {
        res.json(p);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    pazienteDao
      .getAllPazienti()
      .then((pazienti) => {
        res.json(pazienti);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

//GET ritorna parametri medico dato il mid
app.get("/api/medici/:medico", (req, res) => {
  medicoDao
    .getMedicoById(req.params.medico)
    .then((medico) => {
      res.json(medico);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//GET ritorna parametri medico o
app.get("/api/infermieri/:infermiere/medici", (req, res) => {
  medicoDao
    .getMedicoByInfermiere(req.params.infermiere)
    .then((medico) => {
      res.json(medico);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//GET ritorna parametri infermiere o
app.get("/api/infermieri/:infermiere", (req, res) => {
  infermiereDao
    .getInfermiereById(req.params.infermiere)
    .then((infermiere) => {
      res.json(infermiere);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//GET ritorna tutti i medici associati ad un paziente o
app.get("/api/pazienti/:paziente/medici", (req, res) => {
  medicoDao
    .getMediciByPaziente(req.params.paziente)
    .then((medici) => {
      res.json(medici);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//GET ritorna medicine in data odierna non fatte per un paziente o
app.get("/api/pazienti/:paziente/medicine", (req, res) => {
  if (req.query.data) {
    medicinaDao
      .getMedicineByPazienteData(req.params.paziente, req.query.data)
      .then((med) => {
        res.json(med);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    medicinaDao
      .getMedicineByPaziente(req.params.paziente)
      .then((med) => {
        res.json(med);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

app.get("/api/pazienti/:paziente/calendario/medicine", (req, res) => {
  medicinaDao
    .getAllMedicineByPaziente(req.params.paziente)
    .then((med) => {
      res.json(med);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//GET ritorna gli infermieri di un medico o
app.get("/api/medici/:medico/infermieri", (req, res) => {
  infermiereDao
    .getInfermieriByMedicoID(req.params.medico)
    .then((infermiere) => {
      res.json(infermiere);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});
/*
    PAZIENTE
*/

// PUT modifica i dati di un paziente
app.put("/api/pazienti", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const paziente = req.body;
    pazienteDao
      .editPaziente(paziente)
      .then((result) => res.status(200).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//GET ritorna misurazioni da fare in data odierna per un paziente
//GET ritorna tutte le misurazioni per un tipo e per un paziente
app.get("/api/pazienti/:paziente/misurazioni", (req, res) => {
  if (req.query.data) {
    misurazioneDao
      .getMisurazioniByPazienteData(req.params.paziente, req.query.data)
      .then((mis) => {
        res.json(mis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else if (req.query.tipo) {
    console.log(req.query.tipo);
    misurazioneDao
      .getMisurazioniByPazienteByTipo(req.params.paziente, req.query.tipo)
      .then((mis) => {
        res.json(mis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else if (req.query.tutto) {
    misurazioneDao
      .getMisurazioniByPaziente(req.params.paziente)
      .then((mis) => {
        res.json(mis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    misurazioneDao
      .getTipiByPaziente(req.params.paziente)
      .then((mis) => {
        res.json(mis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

//GET ritorna gli infermieri di un medico o
app.get("/api/pazienti/:paziente/calendario/misurazioni", (req, res) => {
  misurazioneDao
    .getAllMisurazioniByPaziente(req.params.paziente)
    .then((mis) => {
      res.json(mis);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//GET ritorna visite in data odierna per un paziente
app.get("/api/pazienti/:paziente/visite", (req, res) => {
  if (req.query.data) {
    visitaDao
      .getVisiteByPazienteData(req.params.paziente, req.query.data)
      .then((vis) => {
        res.json(vis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    visitaDao
      .getVisiteByPaziente(req.params.paziente)
      .then((vis) => {
        res.json(vis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

//GET ritorna tutte le prescrizioni (no dettagli) per un paziente
//GET ritorna i dettagli per una prescrizione di un paziente
app.get("/api/pazienti/:paziente/prescrizioni", (req, res) => {
  if (req.query.prescid) {
    prescrizioneDao
      .getPrescrizioneByCP(req.query.prescid)
      .then((pres) => {
        res.json(pres);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    prescrizioneDao
      .getPrescrizioniByPaziente(req.params.paziente)
      .then((pres) => {
        res.json(pres);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

//GET ritorna i tipi di misurazioni per un paziente

//PUT modifica valori di una misurazione
app.put("/api/pazienti/:paziente/misurazioni", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const misurazione = req.body;
    misurazioneDao
      .editMisurazione(misurazione)
      .then((result) => res.status(200).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//PUT modifica valore "presa" di medicina
app.put("/api/pazienti/:paziente/medicine", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const medicina = req.body;
    medicinaDao
      .editMedicina(medicina)
      .then((result) => res.status(200).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

/*
    MEDICO
*/

//PUT modifica i dati di un medico
app.put("/api/medici", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const medico = req.body;
    medicoDao
      .editMedico(medico)
      .then((result) => res.status(200).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//POST aggiungi visita
app.post("/api/pazienti/:paziente/visite", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const visita = req.body;
    visitaDao
      .addVisita(visita)
      .then((result) => res.status(201).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//GET ritorna le visita da fare in data odierna per il medico
app.get("/api/medici/:medico/visite", (req, res) => {
  if (req.query.data) {
    visitaDao
      .getVisiteByMedicoData(req.params.medico, req.query.data)
      .then((vis) => {
        res.json(vis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    visitaDao
      .getVisiteByMedico(req.params.medico)
      .then((vis) => {
        res.json(vis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

//PUT modifica valore "fatto" per una visita
app.put("/api/medici/:medico/visite", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const body = req.body;
    visitaDao
      .editVisita(
        body.newData,
        body.newOra,
        body.newDelega,
        body.newRemoto,
        body.newNote,
        body.visita
      )
      .then((result) => res.status(200).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//GET elenco pazienti per il medico
app.get("/api/medici/:medico/pazienti", (req, res) => {
  pazienteDao
    .getPazientiByMedicoID(req.params.medico)
    .then((pazienti) => {
      res.json(pazienti);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//GET ritorna note del paziente
app.get("/api/pazienti/:paziente/note", (req, res) => {
  notaDao
    .getNoteByPazienteID(req.params.paziente)
    .then((note) => {
      res.json(note);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//POST aggiungi prescrizione
app.post("/api/pazienti/:paziente/prescrizioni", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const prescrizione = req.body;
    prescrizioneDao
      .addPrescrizione(prescrizione)
      .then((id) => res.status(201).json({ lastID: id }))
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//POST aggiungi misurazione
app.post("/api/pazienti/:paziente/misurazioni", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const misurazione = req.body;
    misurazioneDao
      .addMisurazione(misurazione)
      .then((result) => {
        res.status(201).end();
      })
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//POST aggiungi medicina
app.post("/api/pazienti/:paziente/medicine", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const medicina = req.body;
    medicinaDao
      .addMedicina(medicina)
      .then((result) => {
        res.status(201).end();
      })
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//PUT modifica nota
app.put("/api/pazienti/:paziente/note", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const nota = req.body;
    notaDao
      .editNota(nota)
      .then((result) => res.status(201).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//POST aggiungi nota
app.post("/api/pazienti/:paziente/note", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const nota = req.body;
    notaDao
      .addNota(nota)
      .then((result) => res.status(201).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

/*
  INFERMIERE
*/

//PUT modifica i dati di un infermiere
app.put("/api/infermieri", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const infermiere = req.body;
    infermiereDao
      .editInfermiere(infermiere)
      .then((result) => res.status(200).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//GET ritorna misurazioni con aiuto per l'infermiere
app.get("/api/infermieri/:infermiere/misurazioni", (req, res) => {
  if (req.query.data) {
    misurazioneDao
      .getTodayHelpMisurazioni(req.params.infermiere, req.query.data)
      .then((mis) => {
        res.json(mis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    misurazioneDao
      .getAllHelpMisurazioni(req.params.infermiere)
      .then((mis) => {
        res.json(mis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

//GET ritorna medicine con aiuto per l'infermiere
app.get("/api/infermieri/:infermiere/medicine", (req, res) => {
  if (req.query.data) {
    medicinaDao
      .getTodayHelpMedicine(req.params.infermiere, req.query.data)
      .then((med) => {
        res.json(med);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    medicinaDao
      .getAllHelpMedicine(req.params.infermiere)
      .then((med) => {
        res.json(med);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

//GET ritorna visite delegate all'infermiere
app.get("/api/infermieri/:infermiere/visite", (req, res) => {
  if (req.query.data) {
    visitaDao
      .getVisiteDelegaToday(req.params.infermiere, req.query.data)
      .then((vis) => {
        res.json(vis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  } else {
    visitaDao
      .getAllVisiteDelega(req.params.infermiere)
      .then((vis) => {
        res.json(vis);
      })
      .catch((err) => {
        res.status(500).json({ errors: [{ msg: err }] });
      });
  }
});

//GET ritorna pazienti del medico a cui l'infermiere è associato
app.get("/api/infermieri/:infermiere/pazienti", (req, res) => {
  infermiereDao
    .getPazientiByInfermiere(req.params.infermiere)
    .then((pazienti) => {
      res.json(pazienti);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//POST aggiungi cura
app.post("/api/cure", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const cura = req.body;
    curaDao
      .addCura(cura)
      .then((result) => res.status(201).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//POST aggiungi MedicoInfermiere
app.post("/api/mediciinfermieri", (req, res) => {
  if (!req.body) {
    res.status(400).end();
  } else {
    const mi = req.body;
    MedicoInfermiereDao.addMedicoInfermiere(mi)
      .then((result) => res.status(201).end())
      .catch((err) =>
        res.status(500).json({
          errors: [{ param: "Server", msg: err }],
        })
      );
  }
});

//DELETE cancella una visita
app.delete("/api/visite", (req, res) => {
  visitaDao
    .deleteVisita(req.body)
    .then((visita) => {
      res.json(visita);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//DELETE cancella una nota
app.delete("/api/note", (req, res) => {
  notaDao
    .deleteNota(req.body)
    .then((nota) => {
      res.json(nota);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//DELETE cancella una cura
app.delete("/api/cure", (req, res) => {
  curaDao
    .deleteCura(req.body)
    .then((cura) => {
      res.json(cura);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//DELETE cancella un MedicoInfermiere
app.delete("/api/mediciinfermieri", (req, res) => {
  MedicoInfermiereDao.deleteMedicoInfermiere(req.body)
    .then((medicoinfermiere) => {
      res.json(medicoinfermiere);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//DELETE cancella un Prescizione
app.delete("/api/prescrizioni", (req, res) => {
  prescrizioneDao
    .deletePrescrizione(req.body)
    .then((prescrizione) => {
      res.json(prescrizione);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//activate server
httpServer.listen(port, () => console.log("Server ready"));

// <------------------------------------------------------------>
