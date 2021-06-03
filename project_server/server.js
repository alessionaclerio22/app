"use strict";

//Importing the various things needed

const express = require("express");
const moment = require("moment");
const medicoDao = require("./Medico_dao");
const infermiereDao = require("./Infermiere_dao");
const medicinaDao = require("./Medicina_dao");
const misurazioneDao = require("./Misurazione_dao");
const notaDao = require("./Nota_dao");
const pazienteDao = require("./Paziente_dao");
const prescrizioneDao = require("./Prescrizione_dao");
const visitaDao = require("./Visita_dao");
const MedicoInfermiereDao = require("./Medico_Infermiere_dao");
const curaDao = require("./Cura_dao");
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
        res.status(404).send({
          errors: [{ param: "Server", msg: "Invalid e-mail" }],
        });
      } else {
        if (!medicoDao.checkPassword(medico, password)) {
          res.status(401).send({
            errors: [{ param: "Server", msg: "Wrong password" }],
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
            maxAge: 1000 * expireTime,
          });
          res.json({ id: medico.mid, name: medico.nome, tipo: "medico" });
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
          errors: [{ param: "Server", msg: "Invalid e-mail" }],
        });
      } else {
        if (!pazienteDao.checkPassword(paziente, password)) {
          res.status(401).send({
            errors: [{ param: "Server", msg: "Wrong password" }],
          });
        } else {
          //AUTHENTICATION SUCCESS
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
        res.status(404).send({
          errors: [{ param: "Server", msg: "Invalid e-mail" }],
        });
      } else {
        if (!infermiereDao.checkPassword(infermiere, password)) {
          res.status(401).send({
            errors: [{ param: "Server", msg: "Wrong password" }],
          });
        } else {
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

//GET ritorna parametri medico o
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
      .editVisita(body.newData, body.newOra, body.newDelega, body.visita)
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
  misurazioneDao
    .getTodayHelpMisurazioni(req.params.infermiere, req.query.data)
    .then((mis) => {
      res.json(mis);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//GET ritorna medicine con aiuto per l'infermiere
app.get("/api/infermieri/:infermiere/medicine", (req, res) => {
  medicinaDao
    .getTodayHelpMedicine(req.params.infermiere, req.query.data)
    .then((med) => {
      res.json(med);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
});

//GET ritorna visite delegate all'infermiere
app.get("/api/infermieri/:infermiere/visite", (req, res) => {
  visitaDao
    .getVisiteDelegaToday(req.params.infermiere, req.query.data)
    .then((vis) => {
      res.json(vis);
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
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
app.listen(port, () => console.log("Server ready"));

// <------------------------------------------------------------>

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
