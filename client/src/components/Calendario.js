import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import moment from "moment";

import API from "../api/API_prova";

class Calendario extends React.Component {
  state = {
    pazienteMisEvents: [],
    pazienteMedEvents: [],
    pazienteVisEvents: [],
    medicoVisEvents: [],
    delegaVisiteEvents: [],
    helpMisEvents: [],
    helpMedEvents: [],
    isOpen: false,
    event: {
      title: "",
    },
    obj: {},
    medico: {},
    paziente: {},
    pidUtente: null,
    midUtente: null,
    iidUtente: null,
  };

  handleEventClick = ({ event }) => {
    this.setState({ isOpen: true });
    this.setState({ event });
    this.setState({ obj: event.extendedProps.description });
    this.getMedico(event.extendedProps.description.mid);
    this.getPaziente(event.extendedProps.description.pid);
    console.log(this.props.id);
  };

  closeModal = () => this.setState({ isOpen: false });

  getMedico = (mid) => {
    API.getMedicoById(mid)
      .then((m) => {
        this.setState({ medico: m });
        console.log(this.state.medico.mid);
      })
      .catch((errorObj) => console.error(errorObj));
  };

  getPaziente = (pid) => {
    API.getPazienteById(pid)
      .then((m) => {
        this.setState({ paziente: m });
        console.log(this.state.paziente.pid);
      })
      .catch((errorObj) => console.error(errorObj));
  };

  deleteVisita = (vis) => {
    API.deleteVisita(vis)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  componentDidMount = () => {
    if (this.props.tipo === "paziente") {
      this.setState({ pidUtente: this.props.id });
      API.getPazienteById(this.props.id)
        .then((p) => {
          API.getMedicoByMail(p.mail)
            .then((m) => {
              this.setState({ midUtente: m.mid });
              API.getVisiteByMedico(m.mid)
                .then((vettVis) => {
                  let vett = [];
                  vettVis.map((m) => {
                    let data = moment(
                      m.data + "" + m.ora,
                      "DD-MM-YYYY hh:mm"
                    ).format("YYYY-MM-DDTHH:mm");
                    if (parseInt(m.remoto) === 1) {
                      vett.push({
                        color: "green",
                        title: "Visita",
                        date: data,
                        description: m,
                      });
                    } else {
                      vett.push({
                        color: "gray",
                        title: "Visita",
                        date: data,
                        description: m,
                      });
                    }
                  });
                  this.setState({ medicoVisEvents: vett });
                })
                .catch((errorObj) => console.error(errorObj));
            })
            .catch((errorObj) => {
              console.error(errorObj);
            });
          API.getInfermiereByMail(p.mail)
            .then((i) => {
              this.setState({ iidUtente: i.iid });
              API.getAllVisiteDelega(i.iid)
                .then((v) => {
                  let vett = [];
                  v.map((m) => {
                    let data = moment(
                      m.data + "" + m.ora,
                      "DD-MM-YYYY hh:mm"
                    ).format("YYYY-MM-DDTHH:mm");

                    if (parseInt(m.remoto) === 1) {
                      vett.push({
                        color: "green",
                        title: "Visita",
                        date: data,
                        description: m,
                      });
                    } else {
                      vett.push({
                        color: "gray",
                        title: "Visita",
                        date: data,
                        description: m,
                      });
                    }
                  });
                  this.setState({ delegaVisiteEvents: vett });
                })
                .catch((errorObj) => console.error(errorObj));

              API.getAllHelpMedicine(i.iid)
                .then((v) => {
                  let vett = [];
                  v.map((m) => {
                    let data;
                    if (m.ora_fascia_n === "1") {
                      data = moment(
                        m.data + "" + m.ora_fissata,
                        "DD-MM-YYYY hh:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "orange",
                        title: m.tipo,
                        date: data,
                        description: m,
                      });
                    } else {
                      let oraInizio = m.fascia_oraria.substring(0, 5);
                      let oraFine = m.fascia_oraria.substring(6, 11);

                      let dataIn = moment(
                        m.data + "" + oraInizio,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      let dataFine = moment(
                        m.data + "" + oraFine,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "orange",
                        title: m.tipo,
                        start: dataIn,
                        end: dataFine,
                        description: m,
                      });
                    }
                  });
                  this.setState({ helpMedEvents: vett });
                })
                .catch((errorObj) => {
                  console.error(errorObj);
                });

              API.getAllHelpMisurazioni(i.iid)
                .then((v) => {
                  let vett = [];
                  v.map((m) => {
                    let data;
                    if (m.ora_fascia_n === "1") {
                      data = moment(
                        m.data_fissata + "" + m.ora_fissata,
                        "DD-MM-YYYY hh:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "blue",
                        title: m.tipo,
                        date: data,
                        description: m,
                      });
                    } else {
                      let oraInizio = m.fascia_oraria.substring(0, 5);
                      let oraFine = m.fascia_oraria.substring(6, 11);

                      let dataIn = moment(
                        m.data_fissata + "" + oraInizio,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      let dataFine = moment(
                        m.data_fissata + "" + oraFine,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "blue",
                        title: m.tipo,
                        start: dataIn,
                        end: dataFine,
                        description: m,
                      });
                    }
                  });
                  this.setState({ helpMisEvents: vett });
                })
                .catch((errorObj) => console.error(errorObj));
            })
            .catch((errorObj) => {
              console.error(errorObj);
            });
        })
        .catch((errorObj) => {
          console.error(errorObj);
        });

      API.getAllMisurazioniByPaziente(this.props.id, "1")
        .then((vettMis) => {
          let vett = [];
          vettMis.map((m) => {
            let data;
            if (m.ora_fascia_n === "1") {
              data = moment(
                m.data_fissata + "" + m.ora_fissata,
                "DD-MM-YYYY hh:mm"
              ).format("YYYY-MM-DDTHH:mm");

              vett.push({
                color: "red",
                title: m.tipo,
                date: data,
                description: m,
              });
            } else {
              let oraInizio = m.fascia_oraria.substring(0, 5);
              let oraFine = m.fascia_oraria.substring(6, 11);

              let dataIn = moment(
                m.data_fissata + "" + oraInizio,
                "DD-MM-YYYY HH:mm"
              ).format("YYYY-MM-DDTHH:mm");

              let dataFine = moment(
                m.data_fissata + "" + oraFine,
                "DD-MM-YYYY HH:mm"
              ).format("YYYY-MM-DDTHH:mm");

              vett.push({
                color: "red",
                title: m.tipo,
                start: dataIn,
                end: dataFine,
                description: m,
              });
            }
          });
          this.setState({ pazienteMisEvents: vett });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getAllMedicineByPaziente(this.props.id)
        .then((vettMed) => {
          let vett = [];
          vettMed.map((m) => {
            let data;
            if (m.ora_fascia_n === "1") {
              data = moment(
                m.data + " " + m.ora_fissata,
                "DD-MM-YYYY hh:mm"
              ).format("YYYY-MM-DDTHH:mm");

              vett.push({
                color: "yellow",
                title: m.tipo,
                date: data,
                description: m,
              });
            } else {
              let oraInizio = m.fascia_oraria.substring(0, 5);
              let oraFine = m.fascia_oraria.substring(6, 11);

              let dataIn = moment(
                m.data + "" + oraInizio,
                "DD-MM-YYYY HH:mm"
              ).format("YYYY-MM-DDTHH:mm");

              let dataFine = moment(
                m.data + "" + oraFine,
                "DD-MM-YYYY HH:mm"
              ).format("YYYY-MM-DDTHH:mm");

              vett.push({
                color: "yellow",
                title: m.tipo,
                start: dataIn,
                end: dataFine,
                description: m,
              });
            }
          });
          this.setState({ pazienteMedEvents: vett });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getVisiteByPaziente(this.props.id)
        .then((vettVis) => {
          let vett = [];
          vettVis.map((m) => {
            let data = moment(m.data + "" + m.ora, "DD-MM-YYYY hh:mm").format(
              "YYYY-MM-DDTHH:mm"
            );

            if (parseInt(m.remoto) === 1) {
              vett.push({
                color: "purple",
                title: "Visita",
                date: data,
                description: m,
              });
            } else {
              vett.push({
                color: "white",
                title: "Visita",
                date: data,
                description: m,
              });
            }
          });
          this.setState({ pazienteVisEvents: vett });
        })
        .catch((errorObj) => console.error(errorObj));
    } else if (this.props.tipo === "medico") {
      this.setState({ midUtente: this.props.id });
      API.getVisiteByMedico(this.props.id)
        .then((vettVis) => {
          let vett = [];
          vettVis.map((m) => {
            let data = moment(m.data + "" + m.ora, "DD-MM-YYYY hh:mm").format(
              "YYYY-MM-DDTHH:mm"
            );

            if (parseInt(m.remoto) === 1) {
              vett.push({
                color: "green",
                title: "Visita",
                date: data,
                description: m,
              });
            } else {
              vett.push({
                color: "gray",
                title: "Visita",
                date: data,
                description: m,
              });
            }
          });
          this.setState({ medicoVisEvents: vett });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getMedicoById(this.props.id)
        .then((m) => {
          API.getPazienteByMail(m.mail)
            .then((p) => {
              this.setState({ pidUtente: p.pid });
              API.getAllMisurazioniByPaziente(p.pid, "1")
                .then((vettMis) => {
                  let vett = [];
                  vettMis.map((mis) => {
                    let data;
                    if (mis.ora_fascia_n === "1") {
                      data = moment(
                        mis.data_fissata + "" + mis.ora_fissata,
                        "DD-MM-YYYY hh:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "red",
                        title: mis.tipo,
                        date: data,
                        description: mis,
                      });
                    } else {
                      let oraInizio = mis.fascia_oraria.substring(0, 5);
                      let oraFine = mis.fascia_oraria.substring(6, 11);

                      let dataIn = moment(
                        mis.data_fissata + "" + oraInizio,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      let dataFine = moment(
                        mis.data_fissata + "" + oraFine,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "red",
                        title: mis.tipo,
                        start: dataIn,
                        end: dataFine,
                        description: mis,
                      });
                    }
                  });
                  this.setState({ pazienteMisEvents: vett });
                })
                .catch((errorObj) => console.error(errorObj));

              API.getAllMedicineByPaziente(p.pid)
                .then((vettMed) => {
                  let vett = [];
                  vettMed.map((med) => {
                    let data;
                    if (med.ora_fascia_n === "1") {
                      data = moment(
                        med.data + " " + med.ora_fissata,
                        "DD-MM-YYYY hh:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "yellow",
                        title: med.tipo,
                        date: data,
                        description: med,
                      });
                    } else {
                      let oraInizio = med.fascia_oraria.substring(0, 5);
                      let oraFine = med.fascia_oraria.substring(6, 11);

                      let dataIn = moment(
                        med.data + "" + oraInizio,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      let dataFine = moment(
                        med.data + "" + oraFine,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "yellow",
                        title: med.tipo,
                        start: dataIn,
                        end: dataFine,
                        description: med,
                      });
                    }
                  });
                  this.setState({ pazienteMedEvents: vett });
                })
                .catch((errorObj) => console.error(errorObj));

              API.getVisiteByPaziente(p.pid)
                .then((vettVis) => {
                  let vett = [];
                  vettVis.map((vis) => {
                    let data = moment(
                      vis.data + "" + vis.ora,
                      "DD-MM-YYYY hh:mm"
                    ).format("YYYY-MM-DDTHH:mm");

                    if (parseInt(m.remoto) === 1) {
                      vett.push({
                        color: "purple",
                        title: "Visita",
                        date: data,
                        description: m,
                      });
                    } else {
                      vett.push({
                        color: "white",
                        title: "Visita",
                        date: data,
                        description: m,
                      });
                    }
                  });
                  this.setState({ pazienteVisEvents: vett });
                })
                .catch((errorObj) => console.error(errorObj));
            })
            .catch((errorObj) => console.error(errorObj));
        })
        .catch((errorObj) => console.error(errorObj));
    } else if (this.props.tipo === "infermiere") {
      this.setState({ iidUtente: this.props.id });
      API.getAllVisiteDelega(this.props.id)
        .then((v) => {
          let vett = [];
          v.map((m) => {
            let data = moment(m.data + "" + m.ora, "DD-MM-YYYY hh:mm").format(
              "YYYY-MM-DDTHH:mm"
            );

            if (parseInt(m.remoto) === 1) {
              vett.push({
                color: "green",
                title: "Visita",
                date: data,
                description: m,
              });
            } else {
              vett.push({
                color: "gray",
                title: "Visita",
                date: data,
                description: m,
              });
            }
          });
          this.setState({ delegaVisiteEvents: vett });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getAllHelpMedicine(this.props.id)
        .then((v) => {
          let vett = [];
          v.map((m) => {
            let data;
            if (m.ora_fascia_n === "1") {
              data = moment(
                m.data + "" + m.ora_fissata,
                "DD-MM-YYYY hh:mm"
              ).format("YYYY-MM-DDTHH:mm");

              vett.push({
                color: "orange",
                title: m.tipo,
                date: data,
                description: m,
              });
            } else {
              let oraInizio = m.fascia_oraria.substring(0, 5);
              let oraFine = m.fascia_oraria.substring(6, 11);

              let dataIn = moment(
                m.data + "" + oraInizio,
                "DD-MM-YYYY HH:mm"
              ).format("YYYY-MM-DDTHH:mm");

              let dataFine = moment(
                m.data + "" + oraFine,
                "DD-MM-YYYY HH:mm"
              ).format("YYYY-MM-DDTHH:mm");

              vett.push({
                color: "orange",
                title: m.tipo,
                start: dataIn,
                end: dataFine,
                description: m,
              });
            }
          });
          this.setState({ helpMedEvents: vett });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getAllHelpMisurazioni(this.props.id)
        .then((v) => {
          let vett = [];
          v.map((m) => {
            let data;
            if (m.ora_fascia_n === "1") {
              data = moment(
                m.data_fissata + "" + m.ora_fissata,
                "DD-MM-YYYY hh:mm"
              ).format("YYYY-MM-DDTHH:mm");

              vett.push({
                color: "blue",
                title: m.tipo,
                date: data,
                description: m,
              });
            } else {
              let oraInizio = m.fascia_oraria.substring(0, 5);
              let oraFine = m.fascia_oraria.substring(6, 11);

              let dataIn = moment(
                m.data_fissata + "" + oraInizio,
                "DD-MM-YYYY HH:mm"
              ).format("YYYY-MM-DDTHH:mm");

              let dataFine = moment(
                m.data_fissata + "" + oraFine,
                "DD-MM-YYYY HH:mm"
              ).format("YYYY-MM-DDTHH:mm");

              vett.push({
                color: "blue",
                title: m.tipo,
                start: dataIn,
                end: dataFine,
                description: m,
              });
            }
          });
          this.setState({ helpMisEvents: vett });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getInfermiereById(this.props.id)
        .then((i) => {
          API.getPazienteByMail(i.mail)
            .then((p) => {
              this.setState({ pidUtente: p.pid });
              API.getAllMisurazioniByPaziente(p.pid, "1")
                .then((vettMis) => {
                  let vett = [];
                  vettMis.map((mis) => {
                    let data;
                    if (mis.ora_fascia_n === "1") {
                      data = moment(
                        mis.data_fissata + "" + mis.ora_fissata,
                        "DD-MM-YYYY hh:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "red",
                        title: mis.tipo,
                        date: data,
                        description: mis,
                      });
                    } else {
                      let oraInizio = mis.fascia_oraria.substring(0, 5);
                      let oraFine = mis.fascia_oraria.substring(6, 11);

                      let dataIn = moment(
                        mis.data_fissata + "" + oraInizio,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      let dataFine = moment(
                        mis.data_fissata + "" + oraFine,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "red",
                        title: mis.tipo,
                        start: dataIn,
                        end: dataFine,
                        description: mis,
                      });
                    }
                  });
                  this.setState({ pazienteMisEvents: vett });
                })
                .catch((errorObj) => console.error(errorObj));

              API.getAllMedicineByPaziente(p.pid)
                .then((vettMed) => {
                  let vett = [];
                  vettMed.map((med) => {
                    let data;
                    if (med.ora_fascia_n === "1") {
                      data = moment(
                        med.data + " " + med.ora_fissata,
                        "DD-MM-YYYY hh:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "yellow",
                        title: med.tipo,
                        date: data,
                        description: med,
                      });
                    } else {
                      let oraInizio = med.fascia_oraria.substring(0, 5);
                      let oraFine = med.fascia_oraria.substring(6, 11);

                      let dataIn = moment(
                        med.data + "" + oraInizio,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      let dataFine = moment(
                        med.data + "" + oraFine,
                        "DD-MM-YYYY HH:mm"
                      ).format("YYYY-MM-DDTHH:mm");

                      vett.push({
                        color: "yellow",
                        title: med.tipo,
                        start: dataIn,
                        end: dataFine,
                        description: med,
                      });
                    }
                  });
                  this.setState({ pazienteMedEvents: vett });
                })
                .catch((errorObj) => console.error(errorObj));

              API.getVisiteByPaziente(p.pid)
                .then((vettVis) => {
                  let vett = [];
                  vettVis.map((vis) => {
                    let data = moment(
                      vis.data + "" + vis.ora,
                      "DD-MM-YYYY hh:mm"
                    ).format("YYYY-MM-DDTHH:mm");

                    if (parseInt(vis.remoto) === 1) {
                      vett.push({
                        color: "purple",
                        title: "Visita",
                        date: data,
                        description: vis,
                      });
                    } else {
                      vett.push({
                        color: "white",
                        title: "Visita",
                        date: data,
                        description: vis,
                      });
                    }
                  });
                  this.setState({ pazienteVisEvents: vett });
                })
                .catch((errorObj) => console.error(errorObj));
            })
            .catch((errorObj) => console.error(errorObj));
        })
        .catch((errorObj) => console.error(errorObj));
    }
  };

  render() {
    return (
      <Row className="custom-row">
        {this.props.tipo === "paziente" && (
          <Col>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={this.state.pazienteMisEvents
                .concat(this.state.pazienteMedEvents)
                .concat(this.state.pazienteVisEvents)
                .concat(this.state.medicoVisEvents)
                .concat(this.state.delegaVisiteEvents)
                .concat(this.state.helpMedEvents)
                .concat(this.state.helpMisEvents)}
              timeFormat={"HH:mm"}
              eventClick={this.handleEventClick}
            />

            <Modal isOpen={this.state.isOpen}>
              <ModalHeader>Dettagli</ModalHeader>

              {this.state.obj.misid && (
                <ModalBody>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <td>
                          <b>Medico</b>
                        </td>
                        <td>
                          {this.state.medico.nome} {this.state.medico.cognome}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <b>Tipo</b>
                        </td>
                        <td>{this.state.obj.tipo}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Ora</b>
                        </td>
                        {this.state.obj.ora_fascia_n === "1" ? (
                          <td>{this.state.obj.ora_fissata}</td>
                        ) : (
                          <td>{this.state.obj.fascia_oraria}</td>
                        )}
                      </tr>

                      <tr>
                        <td>
                          <b>Note</b>
                        </td>
                        <td>{this.state.obj.note}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Eseguita</b>
                        </td>
                        <td>{this.state.obj.timestamp_fatto}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Valore</b>
                        </td>
                        <td>{this.state.obj.valore}</td>
                      </tr>
                    </tbody>
                  </Table>
                </ModalBody>
              )}

              {this.state.obj.medid && (
                <ModalBody>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <td>
                          <b>Medico</b>
                        </td>
                        <td>
                          {this.state.medico.nome} {this.state.medico.cognome}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <b>Tipo</b>
                        </td>
                        <td>{this.state.obj.tipo}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Ora</b>
                        </td>
                        {this.state.obj.ora_fascia_n === "1" ? (
                          <td>{this.state.obj.ora_fissata}</td>
                        ) : (
                          <td>{this.state.obj.fascia_oraria}</td>
                        )}
                      </tr>

                      <tr>
                        <td>
                          <b>Note</b>
                        </td>
                        <td>{this.state.obj.note}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Presa</b>
                        </td>
                        <td>{this.state.obj.presa === "0" ? "No" : "Sì"}</td>
                      </tr>
                    </tbody>
                  </Table>
                </ModalBody>
              )}

              {this.state.obj.delega && (
                <ModalBody>
                  <Table striped bordered hover>
                    <tbody>
                      {parseInt(this.state.obj.mid) !==
                      parseInt(this.state.midUtente) ? (
                        <>
                          <tr>
                            <td>
                              <b>Medico</b>
                            </td>
                            <td>
                              {this.state.medico.nome}{" "}
                              {this.state.medico.cognome}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <></>
                      )}
                      {parseInt(this.state.obj.pid) !==
                      parseInt(this.state.pidUtente) ? (
                        <>
                          <tr>
                            <td>
                              <b>Paziente</b>
                            </td>
                            <td>
                              {this.state.paziente.nome}{" "}
                              {this.state.paziente.cognome}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <></>
                      )}

                      <tr>
                        <td>
                          <b>Ora</b>
                        </td>
                        <td>{this.state.obj.ora}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Modalità</b>
                        </td>
                        {parseInt(this.state.obj.remoto) === 1 ? (
                          <td>Remoto</td>
                        ) : (
                          <td>In presenza</td>
                        )}
                      </tr>

                      <tr>
                        <td>
                          <b>Note</b>
                        </td>
                        {this.state.obj.note !== null ? (
                          <td>{this.state.obj.note}</td>
                        ) : (
                          <td>
                            <i>Non è stata inserita nessuna nota</i>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </Table>
                </ModalBody>
              )}

              <ModalFooter>
                <Button color="secondary" onClick={this.closeModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Col>
        )}

        {this.props.tipo === "medico" && (
          <Col>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={this.state.medicoVisEvents
                .concat(this.state.pazienteMedEvents)
                .concat(this.state.pazienteMisEvents)
                .concat(this.state.pazienteVisEvents)}
              timeFormat={"H(:mm)"}
              eventClick={this.handleEventClick}
            />

            <Modal isOpen={this.state.isOpen}>
              <ModalHeader>Dettagli</ModalHeader>

              {this.state.obj.misid && (
                <ModalBody>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <td>
                          <b>Medico</b>
                        </td>
                        <td>
                          {this.state.medico.nome} {this.state.medico.cognome}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <b>Tipo</b>
                        </td>
                        <td>{this.state.obj.tipo}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Ora</b>
                        </td>
                        {this.state.obj.ora_fascia_n === "1" ? (
                          <td>{this.state.obj.ora_fissata}</td>
                        ) : (
                          <td>{this.state.obj.fascia_oraria}</td>
                        )}
                      </tr>

                      <tr>
                        <td>
                          <b>Note</b>
                        </td>
                        <td>{this.state.obj.note}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Eseguita</b>
                        </td>
                        <td>{this.state.obj.timestamp_fatto}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Valore</b>
                        </td>
                        <td>{this.state.obj.valore}</td>
                      </tr>
                    </tbody>
                  </Table>
                </ModalBody>
              )}

              {this.state.obj.medid && (
                <ModalBody>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <td>
                          <b>Medico</b>
                        </td>
                        <td>
                          {this.state.medico.nome} {this.state.medico.cognome}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <b>Tipo</b>
                        </td>
                        <td>{this.state.obj.tipo}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Ora</b>
                        </td>
                        {this.state.obj.ora_fascia_n === "1" ? (
                          <td>{this.state.obj.ora_fissata}</td>
                        ) : (
                          <td>{this.state.obj.fascia_oraria}</td>
                        )}
                      </tr>

                      <tr>
                        <td>
                          <b>Note</b>
                        </td>
                        <td>{this.state.obj.note}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Presa</b>
                        </td>
                        <td>{this.state.obj.presa === "0" ? "No" : "Sì"}</td>
                      </tr>
                    </tbody>
                  </Table>
                </ModalBody>
              )}

              {this.state.obj.delega && (
                <ModalBody>
                  <Table striped bordered hover>
                    <tbody>
                      {parseInt(this.state.obj.mid) !==
                      parseInt(this.state.midUtente) ? (
                        <>
                          <tr>
                            <td>
                              <b>Medico</b>
                            </td>
                            <td>
                              {this.state.medico.nome}{" "}
                              {this.state.medico.cognome}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <></>
                      )}
                      {parseInt(this.state.obj.pid) !==
                      parseInt(this.state.pidUtente) ? (
                        <>
                          <tr>
                            <td>
                              <b>Paziente</b>
                            </td>
                            <td>
                              {this.state.paziente.nome}{" "}
                              {this.state.paziente.cognome}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <></>
                      )}

                      <tr>
                        <td>
                          <b>Ora</b>
                        </td>
                        <td>{this.state.obj.ora}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Modalità</b>
                        </td>
                        {parseInt(this.state.obj.remoto) === 1 ? (
                          <td>Remoto</td>
                        ) : (
                          <td>In presenza</td>
                        )}
                      </tr>

                      <tr>
                        <td>
                          <b>Note</b>
                        </td>
                        {this.state.obj.note !== null ? (
                          <td>{this.state.obj.note}</td>
                        ) : (
                          <td>
                            <i>Non è stata inserita nessuna nota</i>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </Table>
                </ModalBody>
              )}

              <ModalFooter>
                <Row className="custom-row">
                  {this.state.obj.delega &&
                    parseInt(this.state.obj.pid) !==
                      parseInt(this.state.pidUtente) && (
                      <Button
                        color="danger"
                        onClick={() => this.deleteVisita(this.state.obj)}
                        style={{ marginRight: "2vh" }}
                      >
                        Rimuovi Visita
                      </Button>
                    )}
                  <Button color="secondary" onClick={this.closeModal}>
                    Chiudi
                  </Button>
                </Row>
              </ModalFooter>
            </Modal>
          </Col>
        )}

        {this.props.tipo === "infermiere" && (
          <Col>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={this.state.delegaVisiteEvents
                .concat(this.state.helpMedEvents)
                .concat(this.state.helpMisEvents)
                .concat(this.state.pazienteMedEvents)
                .concat(this.state.pazienteMisEvents)
                .concat(this.state.pazienteVisEvetns)}
              timeFormat={"H(:mm)"}
              eventClick={this.handleEventClick}
            />
            <Modal isOpen={this.state.isOpen}>
              <ModalHeader>Dettagli</ModalHeader>
              {this.state.obj.misid && (
                <ModalBody>
                  <Table striped bordered hover>
                    <tbody>
                      {
                        <tr>
                          <td>
                            <b>Paziente</b>
                          </td>
                          <td>
                            {this.state.paziente.nome}{" "}
                            {this.state.paziente.cognome}
                          </td>
                        </tr>
                      }

                      <tr>
                        <td>
                          <b>Tipo</b>
                        </td>
                        <td>{this.state.obj.tipo}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Ora</b>
                        </td>
                        {this.state.obj.ora_fascia_n === "1" ? (
                          <td>{this.state.obj.ora_fissata}</td>
                        ) : (
                          <td>{this.state.obj.fascia_oraria}</td>
                        )}
                      </tr>

                      <tr>
                        <td>
                          <b>Note</b>
                        </td>
                        <td>{this.state.obj.note}</td>
                      </tr>
                    </tbody>
                  </Table>
                </ModalBody>
              )}

              {this.state.obj.medid && (
                <ModalBody>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <td>
                          <b>Paziente</b>
                        </td>
                        <td>
                          {this.state.paziente.nome}{" "}
                          {this.state.paziente.cognome}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <b>Tipo</b>
                        </td>
                        <td>{this.state.obj.tipo}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Ora</b>
                        </td>
                        {this.state.obj.ora_fascia_n === "1" ? (
                          <td>{this.state.obj.ora_fissata}</td>
                        ) : (
                          <td>{this.state.obj.fascia_oraria}</td>
                        )}
                      </tr>

                      <tr>
                        <td>
                          <b>Note</b>
                        </td>
                        <td>{this.state.obj.note}</td>
                      </tr>
                    </tbody>
                  </Table>
                </ModalBody>
              )}

              {this.state.obj.delega && (
                <ModalBody>
                  <Table striped bordered hover>
                    <tbody>
                      {parseInt(this.state.obj.pid) !==
                        parseInt(this.state.pidUtente) && (
                        <tr>
                          <td>
                            <b>Paziente</b>
                          </td>
                          <td>
                            {this.state.paziente.nome}{" "}
                            {this.state.paziente.cognome}
                          </td>
                        </tr>
                      )}

                      {parseInt(this.state.obj.pid) ===
                        parseInt(this.state.pidUtente) && (
                        <tr>
                          <td>
                            <b>Medico</b>
                          </td>
                          <td>
                            {this.state.medico.nome} {this.state.medico.cognome}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td>
                          <b>Ora</b>
                        </td>
                        <td>{this.state.obj.ora}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Modalità</b>
                        </td>
                        {parseInt(this.state.obj.remoto) === 1 ? (
                          <td>Remoto</td>
                        ) : (
                          <td>In presenza</td>
                        )}
                      </tr>

                      <tr>
                        <td>
                          <b>Note</b>
                        </td>
                        {this.state.obj.note !== null ? (
                          <td>{this.state.obj.note}</td>
                        ) : (
                          <td>
                            <i>Non è stata inserita nessuna nota</i>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </Table>
                </ModalBody>
              )}

              <ModalFooter>
                <Button color="secondary" onClick={this.closeModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Col>
        )}
      </Row>
    );
  }
}

export default Calendario;
