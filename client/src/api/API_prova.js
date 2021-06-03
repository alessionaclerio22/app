import Paziente from "./Paziente";
import Medico from "./Medico";
import Infermiere from "./Infermiere";
import Medicina from "./Medicina";
import Misurazione from "./Misurazione";
import Visita from "./Visita";
import Prescrizione from "./Prescrizione";
import Nota from "./Nota";
const baseURL = "/api";

async function isAuthenticated(tipo) {
  let url = "/";
  const response = await fetch(baseURL + url);
  const userJson = await response.json();
  if (response.ok) {
    return userJson;
  } else {
    let err = { status: response.status, errObj: userJson };
    throw err; // An object with the error coming from the server
  }
}

async function pazienteLogin(username, password) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/pazienti/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((user) => {
            resolve(user);
          });
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

async function medicoLogin(username, password) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/medici/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((user) => {
            resolve(user);
          });
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

async function infermiereLogin(username, password) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/infermieri/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((user) => {
            resolve(user);
          });
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

async function userLogout(username, password) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/logout", {
      method: "POST",
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response
          .json()
          .then((obj) => {
            reject(obj);
          }) // error msg in the response body
          .catch((err) => {
            reject({
              errors: [
                { param: "Application", msg: "Cannot parse server response" },
              ],
            });
          }); // something else
      }
    });
  });
}

// GET

async function getPazienteById(id) {
  let url = "/pazienti/";

  url += id;

  const response = await fetch(baseURL + url);
  const p = await response.json();

  if (response.ok) {
    return new Paziente(
      p.pid,
      p.nome,
      p.cognome,
      p.data_nascita,
      p.password,
      p.mail,
      p.foto,
      p.telefono,
      p.codice_fiscale,
      p.tesserino_sanitario,
      p.indirizzo
    );
  } else {
    let err = { status: response.status, errObj: p };
    throw err;
  }
}

async function getPazientiByMedicoID(mid) {
  let url = "/medici/" + mid + "/pazienti";
  const response = await fetch(baseURL + url);
  const pJson = await response.json();

  if (response.ok) {
    return pJson.map((p) => {
      return new Paziente(
        p.pid,
        p.nome,
        p.cognome,
        p.data_nascita,
        p.password,
        p.mail,
        p.foto,
        p.telefono,
        p.codice_fiscale,
        p.tesserino_sanitario,
        p.indirizzo
      );
    });
  } else {
    let err = { status: response.status, errObj: pJson };
    throw err;
  }
}

async function getMedicoById(id) {
  let url = "/medici/";

  url += id;

  const response = await fetch(baseURL + url);
  const m = await response.json();

  if (response.ok) {
    return new Medico(
      m.mid,
      m.nome,
      m.cognome,
      m.data_nascita,
      m.sede_ambulatorio,
      m.spec,
      m.telefono,
      m.mail,
      m.foto,
      m.ordine,
      m.numero_ordine
    );
  } else {
    let err = { status: response.status, errObj: m };
    throw err;
  }
}

async function getInfermiereById(id) {
  let url = "/infermieri/";

  url += id;

  const response = await fetch(baseURL + url);
  const i = await response.json();

  if (response.ok) {
    return new Infermiere(
      i.iid,
      i.nome,
      i.cognome,
      i.data_nascita,
      i.mail,
      i.foto,
      i.numero_ordine,
      i.ordine,
      i.telefono
    );
  } else {
    let err = { status: response.status, errObj: i };
    throw err;
  }
}

async function getMediciByPaziente(pid) {
  let url = "/pazienti/" + pid + "/medici";

  const response = await fetch(baseURL + url);
  const medicoJson = await response.json();

  if (response.ok) {
    return medicoJson.map((m) => {
      return new Medico(
        m.mid,
        m.nome,
        m.cognome,
        m.data_nascita,
        m.sede_ambulatorio,
        m.spec,
        m.telefono,
        m.mail,
        m.foto,
        m.ordine,
        m.numero_ordine
      );
    });
  } else {
    let err = { status: response.status, errObj: medicoJson };
    throw err;
  }
}

async function getMedicoByInfermiere(iid) {
  let url = "/infermieri/" + iid + "/medici";

  const response = await fetch(baseURL + url);
  const m = await response.json();

  if (response.ok) {
    return new Medico(
      m.mid,
      m.nome,
      m.cognome,
      m.data_nascita,
      m.sede_ambulatorio,
      m.spec,
      m.telefono,
      m.mail,
      m.foto,
      m.ordine,
      m.numero_ordine
    );
  } else {
    let err = { status: response.status, errObj: m };
    throw err;
  }
}

async function getPrescrizioniByPaziente(pid) {
  let url = "/pazienti/" + pid + "/prescrizioni";

  const response = await fetch(baseURL + url);
  const prescJson = await response.json();

  if (response.ok) {
    return prescJson.map((presc) => {
      return new Prescrizione(
        presc.prescid,
        presc.data,
        presc.pid,
        presc.mid,
        presc.nome,
        presc.frequenza,
        presc.data_inizio,
        presc.data_fine,
        presc.note,
        presc.quantita_giorno,
        presc.farm_mis_n
      );
    });
  } else {
    let err = { status: response.status, errObj: prescJson };
    throw err;
  }
}

async function getMedicineByPazienteData(pid) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;

  let url = "/pazienti/" + pid + "/medicine/?data=" + today;

  const response = await fetch(baseURL + url);
  const medicineJson = await response.json();

  if (response.ok) {
    return medicineJson.map((m) => {
      console.log(m);
      return new Medicina(
        m.medid,
        m.prescid,
        m.mid,
        m.pid,
        m.data,
        m.tipo,
        m.note,
        m.aiuto,
        m.presa,
        m.ora_fissata,
        m.fascia_oraria,
        m.ora_fascia_n
      );
    });
  } else {
    let err = { status: response.status, errObj: medicineJson };
    throw err;
  }
}

async function getMedicineByPaziente(pid) {
  let url = "/pazienti/" + pid + "/medicine";

  const response = await fetch(baseURL + url);
  const medicineJson = await response.json();

  if (response.ok) {
    return medicineJson.map((m) => {
      console.log(m);
      return new Medicina(
        m.medid,
        m.prescid,
        m.mid,
        m.pid,
        m.data,
        m.tipo,
        m.note,
        m.aiuto,
        m.presa,
        m.ora_fissata,
        m.fascia_oraria,
        m.ora_fascia_n
      );
    });
  } else {
    let err = { status: response.status, errObj: medicineJson };
    throw err;
  }
}

async function getTodayHelpMedicine(iid) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;

  let url = "/infermieri/" + iid + "/medicine/?data=" + today;

  const response = await fetch(baseURL + url);
  const medicineJson = await response.json();

  if (response.ok) {
    return medicineJson.map((m) => {
      return new Medicina(
        m.medid,
        m.prescid,
        m.mid,
        m.pid,
        m.data,
        m.tipo,
        m.note,
        m.aiuto,
        m.presa,
        m.ora_fissata,
        m.fascia_oraria,
        m.ora_fascia_n
      );
    });
  } else {
    let err = { status: response.status, errObj: medicineJson };
    throw err;
  }
}

async function getMisurazioniByPazienteData(pid) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;

  let url = "/pazienti/" + pid + "/misurazioni/?data=" + today;

  const response = await fetch(baseURL + url);
  const misJson = await response.json();

  if (response.ok) {
    return misJson.map((m) => {
      return new Misurazione(
        m.misid,
        m.prescid,
        m.mid,
        m.pid,
        m.data_fissata,
        m.tipo,
        m.valore,
        m.note,
        m.timestamp_fatto,
        m.aiuto,
        m.ora_fissata,
        m.fascia_oraria,
        m.ora_fascia_n
      );
    });
  } else {
    let err = { status: response.status, errObj: misJson };
    throw err;
  }
}

async function getTodayHelpMisurazioni(iid) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;

  let url = "/infermieri/" + iid + "/misurazioni/?data=" + today;

  const response = await fetch(baseURL + url);
  const misJson = await response.json();

  if (response.ok) {
    return misJson.map((m) => {
      return new Misurazione(
        m.misid,
        m.prescid,
        m.mid,
        m.pid,
        m.data_fissata,
        m.tipo,
        m.valore,
        m.note,
        m.timestamp_fatto,
        m.aiuto,
        m.ora_fissata,
        m.fascia_oraria,
        m.ora_fascia_n
      );
    });
  } else {
    let err = { status: response.status, errObj: misJson };
    throw err;
  }
}

async function getVisiteByPazienteData(pid) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;

  let url = "/pazienti/" + pid + "/visite/?data=" + today;

  const response = await fetch(baseURL + url);
  const visJson = await response.json();

  if (response.ok) {
    return visJson.map((m) => {
      return new Visita(m.mid, m.pid, m.data, m.ora, m.fatto, m.delega);
    });
  } else {
    let err = { status: response.status, errObj: visJson };
    throw err;
  }
}

async function getVisiteByPaziente(pid) {
  let url = "/pazienti/" + pid + "/visite";

  const response = await fetch(baseURL + url);
  const visJson = await response.json();

  if (response.ok) {
    return visJson.map((m) => {
      return new Visita(m.mid, m.pid, m.data, m.ora, m.fatto, m.delega);
    });
  } else {
    let err = { status: response.status, errObj: visJson };
    throw err;
  }
}

async function getNoteByPazienteID(pid) {
  let url = "/pazienti/" + pid + "/note";

  const response = await fetch(baseURL + url);
  const noteJson = await response.json();

  if (response.ok) {
    return noteJson.map((n) => {
      return new Nota(n.mid, n.pid, n.data, n.testo);
    });
  } else {
    let err = { status: response.status, errObj: noteJson };
    throw err;
  }
}

async function getVisiteDelegaToday(iid) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;

  let url = "/infermieri/" + iid + "/visite/?data=" + today;

  const response = await fetch(baseURL + url);
  const visJson = await response.json();

  if (response.ok) {
    return visJson.map((m) => {
      return new Visita(m.mid, m.pid, m.data, m.ora, m.fatto, m.delega);
    });
  } else {
    let err = { status: response.status, errObj: visJson };
    throw err;
  }
}

async function getVisiteByMedicoData(mid) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;

  let url = "/medici/" + mid + "/visite/?data=" + today;

  const response = await fetch(baseURL + url);
  const visJson = await response.json();

  if (response.ok) {
    return visJson.map((m) => {
      return new Visita(m.mid, m.pid, m.data, m.ora, m.fatto, m.delega);
    });
  } else {
    let err = { status: response.status, errObj: visJson };
    throw err;
  }
}

async function getVisiteByMedico(mid) {
  let url = "/medici/" + mid + "/visite";

  const response = await fetch(baseURL + url);
  const visJson = await response.json();

  if (response.ok) {
    return visJson.map((m) => {
      return new Visita(m.mid, m.pid, m.data, m.ora, m.fatto, m.delega);
    });
  } else {
    let err = { status: response.status, errObj: visJson };
    throw err;
  }
}

async function getInfermieriByMedicoID(mid) {
  let url = "/medici/" + mid + "/infermieri";

  const response = await fetch(baseURL + url);
  const infJson = await response.json();

  if (response.ok) {
    return infJson.map((i) => {
      return new Infermiere(
        i.iid,
        i.nome,
        i.cognome,
        i.data_nascita,
        i.mail,
        i.foto,
        i.numero_ordine,
        i.ordine,
        i.telefono,
        i.hash
      );
    });
  } else {
    let err = { status: response.status, errObj: infJson };
    throw err;
  }
}

async function getTipiByPaziente(pid) {
  let url = "/pazienti/" + pid + "/misurazioni";

  const response = await fetch(baseURL + url);
  const tipiJson = await response.json();

  if (response.ok) {
    return tipiJson.map((i) => {
      return JSON.stringify(i);
    });
  } else {
    let err = { status: response.status, errObj: tipiJson };
    throw err;
  }
}

async function getMisurazioniByPazienteByTipo(pid, tipo) {
  let url = "/pazienti/" + pid + "/misurazioni/?tipo=" + tipo;

  const response = await fetch(baseURL + url);
  const misJson = await response.json();

  if (response.ok) {
    return misJson.map((m) => {
      return new Misurazione(
        m.misid,
        m.prescid,
        m.mid,
        m.pid,
        m.data_fissata,
        m.tipo,
        m.valore,
        m.note,
        m.timestamp_fatto,
        m.aiuto,
        m.ora_fissata,
        m.fascia_oraria,
        m.ora_fascia_n
      );
    });
  } else {
    let err = { status: response.status, errObj: misJson };
    throw err;
  }
}

async function getMisurazioniByPaziente(pid, tutto) {
  let url = "/pazienti/" + pid + "/misurazioni/?tutto=" + tutto;

  const response = await fetch(baseURL + url);
  const misJson = await response.json();

  if (response.ok) {
    return misJson.map((m) => {
      return new Misurazione(
        m.misid,
        m.prescid,
        m.mid,
        m.pid,
        m.data_fissata,
        m.tipo,
        m.valore,
        m.note,
        m.timestamp_fatto,
        m.aiuto,
        m.ora_fissata,
        m.fascia_oraria,
        m.ora_fascia_n
      );
    });
  } else {
    let err = { status: response.status, errObj: misJson };
    throw err;
  }
}
// POST

async function addMedico(medico) {
  let url = "/medici";

  return new Promise((resolve, reject) => {
    fetch(baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medico),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function addInfermiere(infermiere) {
  let url = "/infermieri";

  return new Promise((resolve, reject) => {
    fetch(baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(infermiere),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function addPaziente(paziente) {
  let url = "/pazienti";

  return new Promise((resolve, reject) => {
    fetch(baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paziente),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function addNota(nota, pid) {
  let url = "/pazienti/" + pid + "/note";

  return new Promise((resolve, reject) => {
    fetch(baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nota),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function addVisita(visita, pid) {
  let url = "/pazienti/" + pid + "/visite";

  return new Promise((resolve, reject) => {
    fetch(baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(visita),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function addPrescrizione(prescrizione, pid) {
  let url = "/pazienti/" + pid + "/prescrizioni";

  return new Promise((resolve, reject) => {
    fetch(baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prescrizione),
    })
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((obj) => resolve(obj.lastID))
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function addMisurazione(misurazione, pid) {
  let url = "/pazienti/" + pid + "/misurazioni";

  return new Promise((resolve, reject) => {
    fetch(baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(misurazione),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function addMedicina(medicina, pid) {
  let url = "/pazienti/" + pid + "/medicine";

  return new Promise((resolve, reject) => {
    fetch(baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicina),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

// PUT

async function editPaziente(p) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/pazienti", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(p),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function editMedico(m) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/medici", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(m),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function editInfermiere(i) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/infermieri", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(i),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function editMedicina(pid, medicina) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/pazienti/" + pid + "/medicine", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicina),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function editMisurazione(pid, misurazione) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/pazienti/" + pid + "/misurazioni", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(misurazione),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function editNota(pid, nota) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/pazienti/" + pid + "/note", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nota),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function editVisita(mid, data) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/medici/" + mid + "/visite", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

// DELETE

async function deleteCura(cura) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/cure", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cura),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function deleteMedicoInfermiere(milf) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/mediciinfermieri", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(milf),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function deleteVisita(visita) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/visite", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(visita),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function deleteNota(nota) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/note", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nota),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

async function deletePrescrizione(presc) {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/prescrizioni", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(presc),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            });
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}

const API = {
  isAuthenticated,
  pazienteLogin,
  medicoLogin,
  infermiereLogin,
  userLogout,
  //GET
  getPazienteById,
  getMedicoById,
  getInfermiereById,
  getMediciByPaziente,
  getMedicineByPazienteData,
  getInfermieriByMedicoID,
  getMisurazioniByPazienteData,
  getVisiteByPazienteData,
  getPrescrizioniByPaziente,
  getTipiByPaziente,
  getMisurazioniByPazienteByTipo,
  getVisiteByMedicoData,
  getPazientiByMedicoID,
  getVisiteDelegaToday,
  getTodayHelpMisurazioni,
  getTodayHelpMedicine,
  getMedicoByInfermiere,
  getVisiteByPaziente,
  getNoteByPazienteID,
  getMisurazioniByPaziente,
  getVisiteByMedico,
  //POST
  addMedico,
  addPaziente,
  addInfermiere,
  addNota,
  addVisita,
  addPrescrizione,
  addMisurazione,
  addMedicina,
  //PUT
  editMedico,
  editPaziente,
  editInfermiere,
  editMedicina,
  editMisurazione,
  editVisita,
  editNota,
  // DELETE
  deleteCura,
  deleteMedicoInfermiere,
  deleteNota,
  deleteVisita,
  deletePrescrizione,
  getMedicineByPaziente,
};

export default API;
