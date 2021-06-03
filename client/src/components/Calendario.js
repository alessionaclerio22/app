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
  };

  handleEventClick = ({ event }) => {
    this.setState({ isOpen: true });
    this.setState({ event });
    this.setState({ obj: event.extendedProps.description });
    this.getMedico(event.extendedProps.description.mid);
    this.getPaziente(event.extendedProps.description.pid);
  };

  closeModal = () => this.setState({ isOpen: false });

  getMedico = (mid) => {
    API.getMedicoById(mid)
      .then((m) => {
        this.setState({ medico: m });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  getPaziente = (pid) => {
    API.getPazienteById(pid)
      .then((m) => {
        this.setState({ paziente: m });
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
      API.getMisurazioniByPaziente(this.props.id, "1")
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
                title: m.tipo,
                start: dataIn,
                end: dataFine,
                description: m,
              });
            }
          });
          console.log(vett);
          this.setState({ pazienteMisEvents: vett });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getMedicineByPaziente(this.props.id)
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

            vett.push({
              title: "Visita",
              date: data,
              description: m,
            });
          });
          this.setState({ pazienteVisEvents: vett });
        })
        .catch((errorObj) => console.error(errorObj));
    } else if (this.props.tipo === "medico") {
      API.getVisiteByMedico(this.props.id)
        .then((vettVis) => {
          let vett = [];
          vettVis.map((m) => {
            let data = moment(m.data + "" + m.ora, "DD-MM-YYYY hh:mm").format(
              "YYYY-MM-DDTHH:mm"
            );

            vett.push({
              title: "Visita",
              date: data,
              description: m,
            });
          });
          this.setState({ medicoVisEvents: vett });
        })
        .catch((errorObj) => console.error(errorObj));
    } else if (this.props.tipo === "infermiere") {
      API.getVisiteDelegaToday(this.props.id)
        .then((v) => {
          let vett = [];
          v.map((m) => {
            let data = moment(m.data + "" + m.ora, "DD-MM-YYYY hh:mm").format(
              "YYYY-MM-DDTHH:mm"
            );

            vett.push({
              title: "Visita",
              date: data,
              description: m,
            });
          });
          this.setState({ delegaVisiteEvents: vett });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getTodayHelpMedicine(this.props.id)
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

      API.getTodayHelpMisurazioni(this.props.id)
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
    }
  };

  render() {
    return (
      <Row>
        {this.props.tipo === "paziente" && (
          <Col>
            <FullCalendar
              displayEventEnd={true}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={this.state.pazienteMisEvents.concat(
                this.state.pazienteMedEvents.concat(
                  this.state.pazienteVisEvents
                )
              )}
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
                        <td>Medico</td>
                        <td>
                          {this.state.medico.nome} {this.state.medico.cognome}
                        </td>
                      </tr>

                      <tr>
                        <td>Tipo</td>
                        <td>{this.state.obj.tipo}</td>
                      </tr>

                      <tr>
                        <td>Ora</td>
                        {this.state.obj.ora_fascia_n === "1" ? (
                          <td>{this.state.obj.ora_fissata}</td>
                        ) : (
                          <td>{this.state.obj.fascia_oraria}</td>
                        )}
                      </tr>

                      <tr>
                        <td>Note</td>
                        <td>{this.state.obj.note}</td>
                      </tr>

                      <tr>
                        <td>Eseguita</td>
                        <td>{this.state.obj.timestamp_fatto}</td>
                      </tr>

                      <tr>
                        <td>Valore</td>
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
                        <td>Medico</td>
                        <td>
                          {this.state.medico.nome} {this.state.medico.cognome}
                        </td>
                      </tr>

                      <tr>
                        <td>Tipo</td>
                        <td>{this.state.obj.tipo}</td>
                      </tr>

                      <tr>
                        <td>Ora</td>
                        {this.state.obj.ora_fascia_n === "1" ? (
                          <td>{this.state.obj.ora_fissata}</td>
                        ) : (
                          <td>{this.state.obj.fascia_oraria}</td>
                        )}
                      </tr>

                      <tr>
                        <td>Note</td>
                        <td>{this.state.obj.note}</td>
                      </tr>

                      <tr>
                        <td>Presa</td>
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
                      <tr>
                        <td>Medico</td>
                        <td>
                          {this.state.medico.nome} {this.state.medico.cognome}
                        </td>
                      </tr>

                      <tr>
                        <td>Ora</td>
                        <td>{this.state.obj.ora}</td>
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
              events={this.state.medicoVisEvents}
              timeFormat={"H(:mm)"}
              eventClick={this.handleEventClick}
              eventColor="blue"
            />

            <Modal isOpen={this.state.isOpen}>
              <ModalHeader>Dettagli</ModalHeader>
              <ModalBody>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <td>Paziente</td>
                      <td>
                        {this.state.paziente.nome} {this.state.paziente.cognome}
                      </td>
                    </tr>

                    <tr>
                      <td>Ora</td>
                      <td>{this.state.obj.ora}</td>
                    </tr>
                  </tbody>
                </Table>
              </ModalBody>

              <ModalFooter>
                <Row>
                  <Button
                    color="danger"
                    onClick={() => this.deleteVisita(this.state.obj)}
                    style={{ marginRight: "2vh" }}
                  >
                    Rimuovi Visita
                  </Button>
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
              events={this.state.delegaVisiteEvents.concat(
                this.state.helpMedEvents.concat(this.state.helpMisEvents)
              )}
              timeFormat={"H(:mm)"}
              eventClick={this.handleEventClick}
              eventColor="blue"
            />
            <Modal isOpen={this.state.isOpen}>
              <ModalHeader>Dettagli</ModalHeader>
              {this.state.obj.misid && (
                <ModalBody>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <td>Paziente</td>
                        <td>
                          {this.state.paziente.nome}{" "}
                          {this.state.paziente.cognome}
                        </td>
                      </tr>

                      <tr>
                        <td>Tipo</td>
                        <td>{this.state.obj.tipo}</td>
                      </tr>

                      <tr>
                        <td>Ora</td>
                        {this.state.obj.ora_fascia_n === "1" ? (
                          <td>{this.state.obj.ora_fissata}</td>
                        ) : (
                          <td>{this.state.obj.fascia_oraria}</td>
                        )}
                      </tr>

                      <tr>
                        <td>Note</td>
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
                        <td>Paziente</td>
                        <td>
                          {this.state.paziente.nome}{" "}
                          {this.state.paziente.cognome}
                        </td>
                      </tr>

                      <tr>
                        <td>Tipo</td>
                        <td>{this.state.obj.tipo}</td>
                      </tr>

                      <tr>
                        <td>Ora</td>
                        {this.state.obj.ora_fascia_n === "1" ? (
                          <td>{this.state.obj.ora_fissata}</td>
                        ) : (
                          <td>{this.state.obj.fascia_oraria}</td>
                        )}
                      </tr>

                      <tr>
                        <td>Note</td>
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
                      <tr>
                        <td>Paziente</td>
                        <td>
                          {this.state.paziente.nome}{" "}
                          {this.state.paziente.cognome}
                        </td>
                      </tr>

                      <tr>
                        <td>Ora</td>
                        <td>{this.state.obj.ora}</td>
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
