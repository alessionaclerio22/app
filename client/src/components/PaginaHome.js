import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import toast, { Toaster } from "react-hot-toast";

import CardDatiUtente from "./CardDatiUtente";
import VisiteOggiMedInf from "./VisiteOggiMedInf";
import RichiestaCollegamento from "./RichiestaCollegamento";
import ListaUtenti from "./ListaUtenti";
import DaFareOggiPaziente from "./DaFareOggiPaziente";
import MedicoAssociato from "./MedicoAssociato";
import { AuthContext } from "../auth/AuthContext";
import {
  Row,
  Col,
  Form,
  Jumbotron,
  Alert,
  Tab,
  Tabs,
  Button,
} from "react-bootstrap";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import "./stylesheet.css";
import API from "../api/API_prova";

//Socket Import
import socket from "../socket";

class PaginaHome extends React.Component {
  ///

  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      utente: {},
      mediciPaziente: [],
      medicineOggi: [],
      misOggi: [],
      visOggi: [],
      visMedOggi: [],
      pazientiMedico: [],
      infermieriMedico: [],
      visiteDelega: [],
      helpMedicine: [],
      helpMisurazioni: [],
      medicoAssociato: {},
      pazientiVisitaDelega: [],
      pazientiMedicineAiuto: [],
      pazientiMisurazioniAiuto: [],
      mediciVisita: [],
      pazientiVisita: [],
      users: [],
      allMediciForPaz: [],
      allMediciForInf: [],
      allPazienti: [],
      allInfermieri: [],
      jojo: "1",
      richiesteInf: [],
      richiestePaz: [],
      listaInf: [],
      listaPaz: [],
      richiestePazSentByMed: [],
      richiesteInfSentByMed: [],
      listaMedForPaz: [],
      listaMedForInf: [],
      colPaziente: null,
      colMedico: null,
    };
  }

  componentDidMount = () => {
    // Socket Handling

    socket.on("connect_error", (err) => {
      // Implement
    });

    socket.on("users", (users) => {
      this.setState({ users: users });
    });

    socket.on("user connected", (u) => {
      let users = this.state.users;
      users.push(u);
      this.setState({ users: users });
    });

    socket.on("user disconnected", ({ tag, username, role }) => {
      const users = this.state.users;
      this.setState({
        users: users.filter(
          (u) => u.tag !== tag && u.username !== username && u.role !== role
        ),
      });
      console.log(this.state.users);
    });

    socket.on("private message", this.handleMessageReception);

    /*let a = this.props.history.location.pathname;

    let t = a.substring(1);
    t = t.substr(0, t.indexOf("/"));

    a = a.substring(1);
    a = a.substring(a.indexOf("/"));
    a = a.substring(1);
    if (a.indexOf("/") !== -1) {
      a = a.substr(0, a.indexOf("/"));
    }
    a = parseInt(a);

    if (t === "medici") {
      API.isAuthenticated("1")
        .then((user) => {
          if (user.id === a) {
            this.setState({ auth: true });
            this.setState({ authUser: user, userType: "1" });
          }
        })
        .catch();
    } else if (t === "pazienti") {
      API.isAuthenticated("0")
        .then((user) => {
          if (user.id === a) {
            this.setState({ auth: true });
            this.setState({ authUser: user, userType: "0" });
          }
        })
        .catch();
    } else if (t === "infermieri") {
      API.isAuthenticated("2")
        .then((user) => {
          if (user.id === a) {
            this.setState({ auth: true });
            this.setState({ authUser: user, userType: "2" });
          }
        })
        .catch();
    }*/

    if (this.props.tipo === "medico") {
      API.getAllPazienti()
        .then((vettPaz) => {
          this.setState({
            allPazienti: vettPaz,
          });
          API.getPazientiByMedicoID(this.props.id)
            .then((v) => {
              let l = this.state.allPazienti.slice();
              for (let el of v) {
                l = l.filter((e) => {
                  return e.pid != el.pid;
                });
              }
              this.setState({
                allPazienti: l,
              });
              API.getRichiestePazByMedicoID(this.props.id)
                .then((p) => {
                  let l = this.state.allPazienti.slice();
                  for (let el of p) {
                    l = l.filter((e) => {
                      return e.pid != el.pid;
                    });
                  }
                  this.setState({
                    allPazienti: l,
                  });
                })
                .catch((errorObj) => console.error(errorObj));
            })
            .catch((errorObj) => console.error(errorObj));
        })
        .catch((errorObj) => console.error(errorObj));

      API.getRichiestePazSentByMedicoID(this.props.id)
        .then((p) => {
          let l = this.state.allPazienti.slice();
          for (let el of p) {
            l = l.filter((e) => {
              return e.pid != el.pid;
            });
          }
          this.setState({
            allPazienti: l,
          });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getAllInfermieri()
        .then((vettInf) => {
          this.setState({
            allInfermieri: vettInf,
          });
          API.getInfermieriByMedicoID(this.props.id)
            .then((v) => {
              let l = this.state.allInfermieri.slice();
              for (let el of v) {
                l = l.filter((e) => {
                  return e.iid != el.iid;
                });
              }
              this.setState({
                allInfermieri: l,
              });
              API.getRichiesteInfByMedicoID(this.props.id)
                .then((p) => {
                  let l = this.state.allInfermieri.slice();
                  for (let el of p) {
                    l = l.filter((e) => {
                      return e.iid != el.iid;
                    });
                  }
                  this.setState({
                    allInfermieri: l,
                  });
                })
                .catch((errorObj) => console.error(errorObj));
            })
            .catch((errorObj) => console.error(errorObj));
        })
        .catch((errorObj) => console.error(errorObj));

      API.getRichiesteInfSentByMedicoID(this.props.id)
        .then((p) => {
          let l = this.state.allInfermieri.slice();
          for (let el of p) {
            l = l.filter((e) => {
              return e.iid != el.iid;
            });
          }
          this.setState({
            allInfermieri: l,
          });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getRichiestePazByMedicoID(this.props.id)
        .then((p) => {
          this.setState({ richiestePaz: p });
          p.map((r) => {
            API.getPazienteById(r.pid)
              .then((p) => {
                let nuovoe = this.state.listaPaz.concat(p);
                this.setState({ listaPaz: nuovoe });
              })
              .catch((errorObj) => console.error(errorObj));
          });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getRichiesteInfByMedicoID(this.props.id)
        .then((p) => {
          this.setState({ richiesteInf: p });
          p.map((r) => {
            API.getInfermiereById(r.iid)
              .then((p) => {
                let nuovo = this.state.listaInf.concat(p);
                this.setState({ listaInf: nuovo });
              })
              .catch((errorObj) => console.error(errorObj));
          });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getMedicoById(this.props.id)
        .then((m) => {
          m.data_nascita =
            m.data_nascita.substring(8, 10) +
            "/" +
            m.data_nascita.substring(5, 7) +
            "/" +
            m.data_nascita.substring(0, 4);
          this.setState({ utente: m });
          socket.auth = {
            tag: this.props.id,
            username: this.state.utente.nome + "-" + this.state.utente.cognome,
            role: this.props.tipo,
          };
          socket.connect();
        })
        .catch((errorObj) => console.error(errorObj));

      API.getVisiteByMedicoData(this.props.id)
        .then((v) => {
          this.setState({ visMedOggi: v });

          v.map((vis) => {
            API.getPazienteById(vis.pid)
              .then((p) => {
                let nuovo = this.state.pazientiVisita.concat(
                  p.nome + " " + p.cognome
                );
                console.log(nuovo);
                this.setState({ pazientiVisita: nuovo });
              })
              .catch((errorObj) => console.error(errorObj));
          });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getPazientiByMedicoID(this.props.id)
        .then((p) => {
          this.setState({ pazientiMedico: p });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getInfermieriByMedicoID(this.props.id)
        .then((i) => {
          this.setState({ infermieriMedico: i });
        })
        .catch((errorObj) => console.error(errorObj));
    } else if (this.props.tipo === "paziente") {
      API.getAllMedici()
        .then((vettMed) => {
          this.setState({
            allMediciForPaz: vettMed,
          });
          API.getMediciByPaziente(this.props.id)
            .then((v) => {
              let l = this.state.allMediciForPaz.slice();
              for (let el of v) {
                l = l.filter((e) => {
                  return e.mid != el.mid;
                });
              }
              this.setState({
                allMediciForPaz: l,
              });
              API.getRichiesteByPazienteID(this.props.id)
                .then((p) => {
                  let l = this.state.allMediciForPaz.slice();
                  for (let el of p) {
                    l = l.filter((e) => {
                      return e.mid != el.mid;
                    });
                  }
                  this.setState({
                    allMediciForPaz: l,
                  });
                })
                .catch((errorObj) => console.error(errorObj));
            })
            .catch((errorObj) => console.error(errorObj));
        })
        .catch((errorObj) => console.error(errorObj));

      API.getRichiesteSentByPazienteID(this.props.id)
        .then((p) => {
          let l = this.state.allMediciForPaz.slice();
          for (let el of p) {
            l = l.filter((e) => {
              return e.mid != el.mid;
            });
          }
          this.setState({
            allMediciForPaz: l,
          });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getRichiesteByPazienteID(this.props.id)
        .then((p) => {
          this.setState({ richiestePazSentByMed: p });
          p.map((r) => {
            API.getMedicoById(r.mid)
              .then((p) => {
                let nuovoe = this.state.listaMedForPaz.concat(p);
                this.setState({ listaMedForPaz: nuovoe });
              })
              .catch((errorObj) => console.error(errorObj));
          });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getPazienteById(this.props.id)
        .then((p) => {
          p.data_nascita =
            p.data_nascita.substring(8, 10) +
            "/" +
            p.data_nascita.substring(5, 7) +
            "/" +
            p.data_nascita.substring(0, 4);
          this.setState({ utente: p });
          socket.auth = {
            tag: this.props.id,
            username: this.state.utente.nome + "-" + this.state.utente.cognome,
            role: this.props.tipo,
          };
          socket.connect();
        })
        .catch((errorObj) => console.error(errorObj));

      API.getMediciByPaziente(this.props.id)
        .then((vettMedici) => {
          this.setState({ mediciPaziente: vettMedici });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getMedicineByPazienteData(this.props.id)
        .then((vettMedicine) => {
          /* E' qui che avviene la magia*/

          let sortedVett = vettMedicine.sort((a, b) => {
            let dateA, dateB;

            if (a.ora_fascia_n === "1") {
              dateA = new Date(
                2069,
                12,
                12,
                a.ora_fissata.substring(0, 2),
                a.ora_fissata.substring(3, 5)
              );
            }
            if (b.ora_fascia_n === "1") {
              dateB = new Date(
                2069,
                12,
                12,
                b.ora_fissata.substring(0, 2),
                b.ora_fissata.substring(3, 5)
              );
            }
            if (a.ora_fascia_n === "0") {
              dateA = new Date(
                2069,
                12,
                12,
                a.fascia_oraria.substring(0, 2),
                a.fascia_oraria.substring(3, 5)
              );
            }
            if (b.ora_fascia_n === "0") {
              dateB = new Date(
                2069,
                12,
                12,
                b.fascia_oraria.substring(0, 2),
                b.fascia_oraria.substring(3, 5)
              );
            }

            return dateA - dateB;
          });
          console.log(sortedVett);
          this.setState({ medicineOggi: sortedVett });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getMisurazioniByPazienteData(this.props.id)
        .then((vettMis) => {
          /* E' qui che avviene la magia*/

          let sortedVett = vettMis.sort((a, b) => {
            let dateA, dateB;

            if (a.ora_fascia_n === "1") {
              dateA = new Date(
                2069,
                12,
                12,
                a.ora_fissata.substring(0, 2),
                a.ora_fissata.substring(3, 5)
              );
            }
            if (b.ora_fascia_n === "1") {
              dateB = new Date(
                2069,
                12,
                12,
                b.ora_fissata.substring(0, 2),
                b.ora_fissata.substring(3, 5)
              );
            }
            if (a.ora_fascia_n === "0") {
              dateA = new Date(
                2069,
                12,
                12,
                a.fascia_oraria.substring(0, 2),
                a.fascia_oraria.substring(3, 5)
              );
            }
            if (b.ora_fascia_n === "0") {
              dateB = new Date(
                2069,
                12,
                12,
                b.fascia_oraria.substring(0, 2),
                b.fascia_oraria.substring(3, 5)
              );
            }

            return dateA - dateB;
          });
          this.setState({ misOggi: sortedVett });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getVisiteByPazienteData(this.props.id)
        .then((vettVis) => {
          this.setState({ visOggi: vettVis });
          vettVis.map((vis) => {
            API.getMedicoById(vis.mid)
              .then((m) => {
                let nuovo = this.state.mediciVisita.concat(
                  m.nome + " " + m.cognome
                );
                this.setState({ mediciVisita: nuovo });
              })
              .catch((errorObj) => console.error(errorObj));
          });
        })
        .catch((errorObj) => console.error(errorObj));
    } else if (this.props.tipo === "infermiere") {
      API.getAllMedici()
        .then((vettMed) => {
          this.setState({
            allMediciForInf: vettMed,
          });
          API.getRichiesteByInfermiereID(this.props.id)
            .then((p) => {
              let l = this.state.allMediciForInf.slice();
              for (let el of p) {
                l = l.filter((e) => {
                  return e.mid != el.mid;
                });
              }
              this.setState({
                allMediciForInf: l,
              });
            })
            .catch((errorObj) => console.error(errorObj));
        })
        .catch((errorObj) => console.error(errorObj));

      API.getRichiesteSentByInfermiereID(this.props.id)
        .then((p) => {
          let l = this.state.allMediciForInf.slice();
          for (let el of p) {
            l = l.filter((e) => {
              return e.mid != el.mid;
            });
          }
          this.setState({
            allMediciForInf: l,
          });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getRichiesteByInfermiereID(this.props.id)
        .then((p) => {
          this.setState({ richiesteInfSentByMed: p });
          p.map((r) => {
            API.getMedicoById(r.mid)
              .then((p) => {
                let nuovoe = this.state.listaMedForInf.concat(p);
                this.setState({ listaMedForInf: nuovoe });
              })
              .catch((errorObj) => console.error(errorObj));
          });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getInfermiereById(this.props.id)
        .then((i) => {
          i.data_nascita =
            i.data_nascita.substring(8, 10) +
            "/" +
            i.data_nascita.substring(5, 7) +
            "/" +
            i.data_nascita.substring(0, 4);
          this.setState({ utente: i });
          socket.auth = {
            tag: this.props.id,
            username: this.state.utente.nome + "-" + this.state.utente.cognome,
            role: this.props.tipo,
          };
          socket.connect();
          API.getMedicoByInfermiere(this.props.id)
            .then((m) => {
              this.setState({ medicoAssociato: m });
              API.getPazientiByMedicoID(m.mid)
                .then((p) => {
                  this.setState({ pazientiMedico: p });
                })
                .catch((errorObj) => console.error(errorObj));
            })
            .catch((errorObj) => console.error(errorObj));
        })
        .catch((errorObj) => console.error(errorObj));

      API.getVisiteDelegaToday(this.props.id)
        .then((v) => {
          this.setState({ visiteDelega: v });
          v.map((vis) => {
            API.getPazienteById(vis.pid)
              .then((p) => {
                let nuovo = this.state.pazientiVisitaDelega.concat(
                  p.nome + " " + p.cognome
                );
                this.setState({ pazientiVisitaDelega: nuovo });
              })
              .catch((errorObj) => console.error(errorObj));
          });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getTodayHelpMedicine(this.props.id)
        .then((v) => {
          this.setState({ helpMedicine: v });
          v.map((vis) => {
            API.getPazienteById(vis.pid)
              .then((p) => {
                let nuovo = this.state.pazientiMedicineAiuto.concat(
                  p.nome + " " + p.cognome
                );
                this.setState({ pazientiMedicineAiuto: nuovo });
              })
              .catch((errorObj) => console.error(errorObj));
          });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getTodayHelpMisurazioni(this.props.id)
        .then((v) => {
          this.setState({ helpMisurazioni: v });
          v.map((vis) => {
            API.getPazienteById(vis.pid)
              .then((p) => {
                let nuovo = this.state.pazientiMisurazioniAiuto.concat(
                  p.nome + " " + p.cognome
                );
                this.setState({ pazientiMisurazioniAiuto: nuovo });
              })
              .catch((errorObj) => console.error(errorObj));
          });
        })
        .catch((errorObj) => console.error(errorObj));
    }
  };

  notify = (content) =>
    toast.success(content, { duration: 4000, position: "top-right" });

  handleMessageReception = ({ tag, username, role, content }) => {
    console.log(
      "Messagio ricevuto da: " +
        JSON.stringify({ tag: tag, username: username, role: role }) +
        " " +
        content
    );

    if (this.props.tipo === "medico") {
      if (role === "infermiere") {
        let ric = { mid: this.props.id, iid: tag, sender: "infermiere" };
        let nuovo = this.state.richiesteInf.concat(ric);
        this.setState({ richiesteInf: nuovo });
        API.getInfermiereById(tag)
          .then((p) => {
            let l = this.state.listaInf.concat(p);
            this.setState({
              listaInf: l,
            });

            let r = this.state.allInfermieri.filter((e) => {
              return e.iid != p.iid;
            });
            this.setState({ allInfermieri: r });
          })
          .catch((errorObj) => console.error(errorObj));
      } else if (role === "paziente") {
        let ric = { mid: this.props.id, pid: tag, sender: "paziente" };
        let nuovo = this.state.richiestePaz.concat(ric);
        this.setState({ richiestePaz: nuovo });
        API.getPazienteById(tag)
          .then((p) => {
            let l = this.state.listaPaz.concat(p);
            this.setState({
              listaPaz: l,
            });

            let r = this.state.allPazienti.filter((e) => {
              return e.pid != p.pid;
            });
            this.setState({ allPazienti: r });
          })
          .catch((errorObj) => console.error(errorObj));
      }
    } else if (this.props.tipo === "paziente") {
      let ric = { mid: tag, pid: this.props.id, sender: "medico" };
      let nuovo = this.state.richiestePazSentByMed.concat(ric);
      this.setState({ richiestePazSentByMed: nuovo });

      API.getMedicoById(tag)
        .then((p) => {
          let l = this.state.listaMedForPaz.concat(p);
          this.setState({
            listaMedForPaz: l,
          });

          let r = this.state.allMediciForPaz.filter((e) => {
            return e.mid != p.mid;
          });
          this.setState({ allMediciForPaz: r });
        })
        .catch((errorObj) => console.error(errorObj));
    } else if (this.props.tipo === "infermiere") {
      let ric = { mid: tag, iid: this.props.id, sender: "medico" };
      let nuovo = this.state.richiesteInfSentByMed.concat(ric);
      this.setState({ richiesteInfSentByMed: nuovo });

      API.getMedicoById(tag)
        .then((p) => {
          let l = this.state.listaMedForInf.concat(p);
          this.setState({
            listaMedForInf: l,
          });

          let r = this.state.allMediciForInf.filter((e) => {
            return e.mid != p.mid;
          });
          this.setState({ allMediciForInf: r });
        })
        .catch((errorObj) => console.error(errorObj));
    }

    this.notify(
      `${username} ti vuole inculare a sangue e ti ha scritto ${content}`
    );
  };

  deleteMed = (index) => {
    let medVett = this.state.mediciPaziente.slice();
    let medico = medVett[index];
    medVett.splice(index, 1);
    this.setState({ mediciPaziente: medVett });

    let v = this.state.allMediciForPaz.concat(medico);
    this.setState({ allMediciForPaz: v });
  };

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  deletePaz = (index) => {
    let medVett = this.state.pazientiMedico.slice();
    let paziente = medVett[index];
    medVett.splice(index, 1);
    this.setState({ pazientiMedico: medVett });

    let v = this.state.allPazienti.concat(paziente);
    this.setState({ allPazienti: v });
  };

  deleteInf = (index) => {
    let medVett = this.state.infermieriMedico.slice();
    let infermiere = medVett[index];
    medVett.splice(index, 1);
    this.setState({ infermieriMedico: medVett });

    let v = this.state.allInfermieri.concat(infermiere);
    this.setState({ allInfermieri: v });
  };

  deleteMedAss = () => {
    this.setState({ medicoAssociato: {} });

    API.getAllMedici()
      .then((vettMed) => {
        this.setState({
          allMediciForInf: vettMed,
        });
        API.getRichiesteByInfermiereID(this.props.id)
          .then((p) => {
            let l = this.state.allMediciForInf.slice();
            for (let el of p) {
              l = l.filter((e) => {
                return e.mid != el.mid;
              });
            }
            this.setState({
              allMediciForInf: l,
            });
          })
          .catch((errorObj) => console.error(errorObj));
      })
      .catch((errorObj) => console.error(errorObj));

    API.getRichiesteSentByInfermiereID(this.props.id)
      .then((p) => {
        let l = this.state.allMediciForInf.slice();
        for (let el of p) {
          l = l.filter((e) => {
            return e.mid != el.mid;
          });
        }
        this.setState({
          allMediciForInf: l,
        });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  segnaComeFatta = (index) => {
    let v = this.state.visMedOggi.slice();
    v.splice(index, 1);
    this.setState({ visMedOggi: v });
  };

  segnaComeFattaInf = (index) => {
    let v = this.state.visiteDelega.slice();
    v.splice(index, 1);
    this.setState({ visiteDelega: v });
  };

  handleAccettaMedInf = (inf, ric) => {
    let mi = { mid: this.props.id, iid: inf.iid };
    API.addMedInf(mi)
      .then(() => {
        let nuovo = this.state.infermieriMedico.concat(inf);
        this.setState({ infermieriMedico: nuovo });
        API.deleteRichiestaMedInf(ric)
          .then(() => {
            let r = this.state.richiesteInf.filter((e) => {
              return e.iid != inf.iid;
            });
            let l = this.state.listaInf.filter((e) => {
              return e.iid != inf.iid;
            });
            let a = this.state.allInfermieri.filter((e) => {
              return e.iid != inf.iid;
            });

            this.setState({ richiesteInf: r });
            this.setState({ listaInf: l });
            this.setState({ allInfermieri: a });
          })
          .catch((errorObj) => console.error(errorObj));
      })
      .catch((errorObj) => console.error(errorObj));
  };

  handleAccettaMedByInf = (med, ric) => {
    let mi = { iid: this.props.id, mid: med.mid };
    API.addMedInf(mi)
      .then(() => {
        this.setState({ medicoAssociato: med });
        API.deleteRichiestaMedInfAll(ric)
          .then(() => {
            this.setState({ richiesteInfSentByMed: [] });
            this.setState({ listaMedForInf: [] });
          })
          .catch((errorObj) => console.error(errorObj));
      })
      .catch((errorObj) => console.error(errorObj));
  };

  handleAccettaMedPaz = (paz, ric) => {
    let cura = { mid: this.props.id, pid: paz.pid };
    API.addCura(cura)
      .then(() => {
        let nuovo = this.state.pazientiMedico.concat(paz);
        this.setState({ pazientiMedico: nuovo });
        API.deleteRichiestaMedPaz(ric)
          .then(() => {
            let r = this.state.richiestePaz.filter((e) => {
              return e.pid != paz.pid;
            });
            let l = this.state.listaPaz.filter((e) => {
              return e.pid != paz.pid;
            });

            let a = this.state.allPazienti.filter((e) => {
              return e.pid != paz.pid;
            });

            this.setState({ richiestePaz: r });
            this.setState({ listaPaz: l });
            this.setState({ allPazienti: a });
          })
          .catch((errorObj) => console.error(errorObj));
      })
      .catch((errorObj) => console.error(errorObj));
  };

  handleAccettaMedByPaz = (med, ric) => {
    let cura = { pid: this.props.id, mid: med.mid };
    API.addCura(cura)
      .then(() => {
        let nuovo = this.state.mediciPaziente.concat(med);
        this.setState({ mediciPaziente: nuovo });
        API.deleteRichiestaMedPaz(ric)
          .then(() => {
            let r = this.state.richiestePazSentByMed.filter((e) => {
              return e.mid != med.mid;
            });
            let l = this.state.listaMedForPaz.filter((e) => {
              return e.mid != med.mid;
            });

            let a = this.state.allMediciForPaz.filter((e) => {
              return e.mid != med.mid;
            });

            this.setState({ richiestePazSentByMed: r });
            this.setState({ listaMedForPaz: l });
            this.setState({ allMediciForPaz: a });
          })
          .catch((errorObj) => console.error(errorObj));
      })
      .catch((errorObj) => console.error(errorObj));
  };

  handleRifiutaMedInf = (inf, ric) => {
    API.deleteRichiestaMedInf(ric)
      .then(() => {
        let r = this.state.richiesteInf.filter((e) => {
          return e.iid != inf.iid;
        });
        let l = this.state.listaInf.filter((e) => {
          return e.iid != inf.iid;
        });

        let d = this.state.allInfermieri.concat(inf);

        this.setState({ richiesteInf: r });
        this.setState({ listaInf: l });
        this.setState({ allInfermieri: d });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  handleRifiutaMedPaz = (paz, ric) => {
    API.deleteRichiestaMedPaz(ric)
      .then(() => {
        let r = this.state.richiestePaz.filter((e) => {
          return e.pid != paz.pid;
        });
        let l = this.state.listaPaz.filter((e) => {
          return e.pid != paz.pid;
        });

        let d = this.state.allPazienti.concat(paz);

        this.setState({ richiestePaz: r });
        this.setState({ listaPaz: l });
        this.setState({ allPazienti: d });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  handleRifiutaMedByPaz = (med, ric) => {
    API.deleteRichiestaMedPaz(ric)
      .then(() => {
        let r = this.state.richiestePazSentByMed.filter((e) => {
          return e.mid != med.mid;
        });
        let l = this.state.listaMedForPaz.filter((e) => {
          return e.mid != med.mid;
        });

        let d = this.state.allMediciForPaz.concat(med);

        this.setState({ richiestePazSentByMed: r });
        this.setState({ listaMedForPaz: l });
        this.setState({ allMediciForPaz: d });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  handleRifiutaMedByInf = (med, ric) => {
    API.deleteRichiestaMedInf(ric)
      .then(() => {
        let r = this.state.richiesteInfSentByMed.filter((e) => {
          return e.mid != med.mid;
        });

        let l = this.state.listaMedForInf.filter((e) => {
          return e.mid != med.mid;
        });

        let d = this.state.allMediciForInf.concat(med);

        this.setState({ richiesteInfSentByMed: r });
        this.setState({ listaMedForInf: l });
        this.setState({ allMediciForInf: d });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  wakawaka = (colMedico) => {
    let r = this.state.allMediciForInf.filter((e) => {
      return e.mid != colMedico.mid;
    });

    this.setState({ allMediciForInf: r });
  };

  render() {
    return (
        <Row className="custom-row">
         
              <>
                <Toaster />
                <Col sm={2}>
                  {this.props.tipo === "paziente" && (
                    <CardDatiUtente
                      tipo="paziente"
                      pagina="paginapaziente"
                      utente={this.state.utente}
                      id={this.props.id}
                    />
                  )}

                  {this.props.tipo === "medico" && (
                    <CardDatiUtente
                      tipo="medico"
                      pagina="paginamedico"
                      utente={this.state.utente}
                      id={this.props.id}
                    />
                  )}

                  {this.props.tipo === "infermiere" && (
                    <CardDatiUtente
                      tipo="infermiere"
                      pagina="paginainfermiere"
                      utente={this.state.utente}
                      id={this.props.id}
                    />
                  )}
                </Col>

                <Col sm={4} style={{ marginLeft: "5rem" }}>
                  {this.props.tipo === "paziente" && (
                    <>
                      <DaFareOggiPaziente
                        utente={this.state.utente}
                        medicineOggi={this.state.medicineOggi}
                        misOggi={this.state.misOggi}
                        visOggi={this.state.visOggi}
                        mediciVisita={this.state.mediciVisita}
                      />
                    </>
                  )}

                  {this.props.tipo === "medico" && (
                    <>
                      <Jumbotron
                        style={{
                          marginTop: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <h2>Visite da fare oggi</h2>
                        {this.state.visMedOggi.length !== 0 && (
                          <VisiteOggiMedInf
                            medico={this.state.utente}
                            visiteMedico={this.state.visMedOggi}
                            pazientiVisita={this.state.pazientiVisita}
                            pagina="paginamedico"
                            segnaComeFatta={this.segnaComeFatta}
                          />
                        )}
                        {this.state.visMedOggi.length === 0 && (
                          <Alert variant="info" style={{ marginTop: "1rem" }}>
                            Non ci sono visite da fare oggi
                          </Alert>
                        )}
                      </Jumbotron>
                    </>
                  )}

                  {this.props.tipo === "infermiere" && (
                    <>
                      <Jumbotron
                        style={{
                          marginTop: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <h2>Richieste di Aiuto</h2>

                        {(this.state.helpMisurazioni.length !== 0 ||
                          this.state.helpMedicine.length !== 0) && (
                          <VisiteOggiMedInf
                            infermiere={this.state.utente}
                            misAiuto={this.state.helpMisurazioni}
                            medAiuto={this.state.helpMedicine}
                            pazientiMisurazioniAiuto={
                              this.state.pazientiMisurazioniAiuto
                            }
                            pazientiMedicineAiuto={
                              this.state.pazientiMedicineAiuto
                            }
                            pagina="paginainfermiere"
                            delega_mismed_n={0}
                          />
                        )}

                        {this.state.helpMisurazioni.length === 0 &&
                          this.state.helpMedicine.length === 0 && (
                            <Alert variant="info" style={{ marginTop: "1rem" }}>
                              Non ci sono altre richieste di aiuto
                            </Alert>
                          )}

                        <h2>Visite di controllo di oggi</h2>
                        {this.state.visiteDelega.length !== 0 && (
                          <VisiteOggiMedInf
                            infermiere={this.state.utente}
                            visiteDelega={this.state.visiteDelega}
                            pagina="paginainfermiere"
                            delega_mismed_n={1}
                            pazientiVisitaDelega={
                              this.state.pazientiVisitaDelega
                            }
                            segnaComeFattaInf={this.segnaComeFattaInf}
                          />
                        )}

                        {this.state.visiteDelega.length === 0 && (
                          <Alert variant="info" style={{ marginTop: "1rem" }}>
                            Non ci sono altre visite di controllo da fare oggi
                          </Alert>
                        )}
                      </Jumbotron>
                    </>
                  )}
                </Col>

                <Col sm={4} style={{ marginLeft: "2rem", marginRight: "1rem" }}>
                  {this.props.tipo === "paziente" && (
                    <>
                      <Jumbotron
                        style={{
                          marginTop: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <h2>I miei collegamenti</h2>

                        <Tabs defaultActiveKey="pazientiMed">
                          <Tab eventKey="pazientiMed" title="Medici">
                            {this.state.mediciPaziente.length !== 0 && (
                              <ListaUtenti
                                lista="listamedici"
                                pagina="paginapaziente"
                                mediciPaziente={this.state.mediciPaziente}
                                id={this.props.id}
                                deleteMed={this.deleteMed}
                              />
                            )}
                            {this.state.mediciPaziente.length === 0 && (
                              <Alert
                                variant="info"
                                style={{ marginTop: "1rem" }}
                              >
                                Al momento non hai nessun medico
                              </Alert>
                            )}
                          </Tab>
                          <Tab eventKey="riccol" title="Gestione collegamenti">
                            <h4
                              style={{
                                marginTop: "2rem",
                                marginBottom: "2rem",
                              }}
                            >
                              Collegati
                            </h4>
                            <Autocomplete
                              name="colMedico"
                              value={this.state.colMedico}
                              onChange={(event, newValue) => {
                                this.setState({ colMedico: newValue });
                              }}
                              options={this.state.allMediciForPaz}
                              getOptionLabel={(option) =>
                                option.nome + "  " + option.cognome
                              }
                              style={{ marginTop: "1rem" }}
                              renderInput={(params) => (
                                <TextField {...params} variant="outlined" />
                              )}
                            />
                            <Button
                              variant="primary"
                              style={{ marginTop: "1rem" }}
                              onClick={() => {
                                console.log("Button Clicked");
                                for (let el of this.state.users) {
                                  if (el.tag == this.state.colMedico.mid) {
                                    socket.emit("private message", {
                                      content: "Ciaoo Provaaaa",

                                      to: JSON.stringify({
                                        tag: this.state.colMedico.mid,
                                        username: `${this.state.colMedico.nome}-${this.state.colMedico.cognome}`,
                                        role: "medico",
                                      }),
                                    });
                                  }
                                }
                                let ric = {
                                  mid: this.state.colMedico.mid,
                                  pid: this.props.id,
                                  sender: "paziente",
                                };

                                let l = this.state.allMediciForPaz.filter(
                                  (e) => {
                                    return e.mid != this.state.colMedico.mid;
                                  }
                                );
                                this.setState({ allMediciForPaz: l });

                                API.addRichiestaMedPaz(ric)
                                  .then(() => {})
                                  .catch((errorObj) => console.error(errorObj));
                              }}
                            >
                              Invia Richiesta
                            </Button>

                            <h4
                              style={{
                                marginTop: "2rem",
                                marginBottom: "1rem",
                              }}
                            >
                              Richieste di Collegamento
                            </h4>
                            <RichiestaCollegamento
                              tipo="paziente"
                              socket={socket}
                              users={this.state.users}
                              richiesteMed={this.state.richiestePazSentByMed}
                              listaMed={this.state.listaMedForPaz}
                              handleAccettaMedByPaz={this.handleAccettaMedByPaz}
                              handleRifiutaMedByPaz={this.handleRifiutaMedByPaz}
                            />
                          </Tab>
                        </Tabs>
                      </Jumbotron>
                    </>
                  )}

                  {this.props.tipo === "medico" && (
                    <>
                      <Jumbotron
                        style={{
                          marginTop: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <h2 style={{ marginBottom: "5rem" }}>
                          I miei collegamenti
                        </h2>

                        <Tabs defaultActiveKey="pazientiMed">
                          <Tab eventKey="pazientiMed" title="Pazienti">
                            {this.state.pazientiMedico.length !== 0 && (
                              <ListaUtenti
                                style={{ marginTop: "4rem" }}
                                lista="listapazienti"
                                pagina="paginamedico"
                                pazientiMedico={this.state.pazientiMedico}
                                id={this.props.id}
                                deletePaz={this.deletePaz}
                              />
                            )}

                            {this.state.pazientiMedico.length === 0 && (
                              <Alert
                                variant="info"
                                style={{ marginTop: "1rem" }}
                              >
                                Al momento non hai nessun paziente in cura
                              </Alert>
                            )}
                          </Tab>
                          <Tab eventKey="infermeriMed" title="Infermieri">
                            {this.state.infermieriMedico.length !== 0 && (
                              <ListaUtenti
                                lista="listainfermieri"
                                pagina="paginamedico"
                                infermieriMedico={this.state.infermieriMedico}
                                id={this.props.id}
                                deleteInf={this.deleteInf}
                              />
                            )}

                            {this.state.infermieriMedico.length === 0 && (
                              <Alert
                                variant="info"
                                style={{ marginTop: "1rem" }}
                              >
                                Al momento non hai nessun infermiere associato
                              </Alert>
                            )}
                          </Tab>
                          <Tab eventKey="riccol" title="Gestione collegamenti">
                            <h4
                              style={{
                                marginTop: "2rem",
                                marginBottom: "2rem",
                              }}
                            >
                              Collegati
                            </h4>

                            <Form.Control
                              as="select"
                              name={"jojo"}
                              value={this.state.jojo}
                              onChange={this.handleChange}
                              style={{
                                marginTop: "3rem",
                                marginBottom: "1rem",
                              }}
                            >
                              <option value="1">Infermiere</option>
                              <option value="0">Paziente</option>
                            </Form.Control>
                            {this.state.jojo === "1" && (
                              <>
                                <Autocomplete
                                  name="colPaziente"
                                  value={this.state.colPaziente}
                                  onChange={(event, newValue) => {
                                    this.setState({ colPaziente: newValue });
                                  }}
                                  options={this.state.allInfermieri}
                                  getOptionLabel={(option) =>
                                    option.nome + "  " + option.cognome
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} variant="outlined" />
                                  )}
                                />
                                <Button
                                  variant="primary"
                                  style={{ marginTop: "1rem" }}
                                  onClick={() => {
                                    console.log("Button Clicked");
                                    for (let el of this.state.users) {
                                      if (
                                        el.tag == this.state.colPaziente.iid
                                      ) {
                                        socket.emit("private message", {
                                          content: "Ciaoo Provaaaa",

                                          to: JSON.stringify({
                                            tag: this.state.colPaziente.iid,
                                            username: `${this.state.colPaziente.nome}-${this.state.colPaziente.cognome}`,
                                            role: "infermiere",
                                          }),
                                        });
                                      }
                                    }
                                    let ric = {
                                      mid: this.props.id,
                                      iid: this.state.colPaziente.iid,
                                      sender: "medico",
                                    };

                                    let l = this.state.allInfermieri.filter(
                                      (e) => {
                                        return (
                                          e.iid != this.state.colPaziente.iid
                                        );
                                      }
                                    );
                                    this.setState({ allInfermieri: l });

                                    API.addRichiestaMedInf(ric)
                                      .then(() => {})
                                      .catch((errorObj) =>
                                        console.error(errorObj)
                                      );
                                  }}
                                >
                                  Invia Richiesta
                                </Button>
                              </>
                            )}
                            <h4
                              style={{
                                marginTop: "2rem",
                                marginBottom: "2rem",
                              }}
                            >
                              Richieste di collegamento
                            </h4>
                            <RichiestaCollegamento
                              tipo="medico"
                              socket={socket}
                              richiestePaz={this.state.richiestePaz}
                              richiesteInf={this.state.richiesteInf}
                              listaPaz={this.state.listaPaz}
                              listaInf={this.state.listaInf}
                              handleAccettaMedInf={this.handleAccettaMedInf}
                              handleAccettaMedPaz={this.handleAccettaMedPaz}
                              handleRifiutaMedInf={this.handleRifiutaMedInf}
                              handleRifiutaMedPaz={this.handleRifiutaMedPaz}
                            />

                            {this.state.jojo === "0" && (
                              <>
                                <Autocomplete
                                  name="colPaziente"
                                  value={this.state.colPaziente}
                                  onChange={(event, newValue) => {
                                    this.setState({ colPaziente: newValue });
                                  }}
                                  options={this.state.allPazienti}
                                  getOptionLabel={(option) =>
                                    option.nome + "  " + option.cognome
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} variant="outlined" />
                                  )}
                                />
                                <Button
                                  variant="primary"
                                  style={{ marginTop: "1rem" }}
                                  onClick={() => {
                                    console.log("Button Clicked");
                                    for (let el of this.state.users) {
                                      console.log("Porco");
                                      if (
                                        el.tag == this.state.colPaziente.pid
                                      ) {
                                        console.log("Dio");
                                        socket.emit("private message", {
                                          content: "Ciaoo Provaaaa",

                                          to: JSON.stringify({
                                            tag: this.state.colPaziente.pid,
                                            username: `${this.state.colPaziente.nome}-${this.state.colPaziente.cognome}`,
                                            role: "paziente",
                                          }),
                                        });
                                      }
                                    }
                                    let ric = {
                                      mid: this.props.id,
                                      pid: this.state.colPaziente.pid,
                                      sender: "medico",
                                    };

                                    let l = this.state.allPazienti.filter(
                                      (e) => {
                                        return (
                                          e.pid != this.state.colPaziente.pid
                                        );
                                      }
                                    );
                                    this.setState({ allPazienti: l });

                                    API.addRichiestaMedPaz(ric)
                                      .then(() => {
                                        //toglilo da selezione
                                      })
                                      .catch((errorObj) =>
                                        console.error(errorObj)
                                      );
                                  }}
                                >
                                  Invia Richiesta
                                </Button>
                              </>
                            )}
                          </Tab>
                        </Tabs>
                      </Jumbotron>
                    </>
                  )}

                  {this.props.tipo === "infermiere" && (
                    <>
                      <MedicoAssociato
                        pazientiMedico={this.state.pazientiMedico}
                        medicoAssociato={this.state.medicoAssociato}
                        id={this.props.id}
                        deleteMedAss={this.deleteMedAss}
                        users={this.state.users}
                        allMedici={this.state.allMediciForInf}
                        richiesteCollegamentoByMed={
                          this.state.richiesteInfSentByMed
                        }
                        listaMedForInf={this.state.listaMedForInf}
                        handleAccettaMedByInf={this.handleAccettaMedByInf}
                        handleRifiutaMedByInf={this.handleRifiutaMedByInf}
                        socket={socket}
                        wakawaka={this.wakawaka}
                      />
                    </>
                  )}
                </Col>
              </>
        </Row>
    );
  }
}
export default PaginaHome;
