import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../App.css";

import { Tab, Tabs, Col, Row } from "react-bootstrap";
import CardDatiUtente from "./CardDatiUtente";
import JumboNote from "./JumboNote";
import JumboVisite from "./JumboVisite";
import "./stylesheet.css";
import JumboPresc from "./JumboPresc";
import JumboMis from "./JumboMis";
import API from "../api/API_prova";

class GestionePaziente extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paziente: {},
      prescPaziente: [],
      mediciPrescrizioni: [],
      tipiMis: [],
      misPaziente: [],
      notePaziente: [],
      visitePaziente: [],
      medicoNota: [],
      medicoVisita: [],
    };
  }

  componentDidMount = () => {
    API.getPazienteById(this.props.id)
      .then((p) => {
        this.setState({ paziente: p });
      })
      .catch((errorObj) => console.error(errorObj));

    API.getPrescrizioniByPaziente(this.props.id)
      .then((presc) => {
        this.setState({ prescPaziente: presc });
        presc.map((p) => {
          API.getMedicoById(p.mid)
            .then((m) => {
              let nuovo = this.state.mediciPrescrizioni.concat(
                m.nome + " " + m.cognome
              );
              this.setState({ mediciPrescrizioni: nuovo });
            })
            .catch((errorObj) => console.error(errorObj));
        });
      })
      .catch((errorObj) => console.error(errorObj));
    API.getTipiByPaziente(this.props.id)
      .then((tipi) => {
        this.setState({ tipiMis: tipi });
      })
      .catch((errorObj) => console.error(errorObj));

    API.getVisiteByPaziente(this.props.id)
      .then((v) => {
        this.setState({ visitePaziente: v });
        v.map((vis) => {
          API.getMedicoById(vis.mid)
            .then((m) => {
              let nuovo = this.state.medicoVisita.concat(
                m.nome + " " + m.cognome
              );
              this.setState({ medicoVisita: nuovo });
            })
            .catch((errorObj) => console.error(errorObj));
        });
      })
      .catch((errorObj) => console.error(errorObj));

    API.getNoteByPazienteID(this.props.id)
      .then((v) => {
        this.setState({ notePaziente: v });
        v.map((nota) => {
          API.getMedicoById(nota.mid)
            .then((m) => {
              let nuovo = this.state.medicoNota.concat(
                m.nome + " " + m.cognome
              );
              this.setState({ medicoNota: nuovo });
            })
            .catch((errorObj) => console.error(errorObj));
        });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  deleteP = (index) => {
    let medVett = this.state.prescPaziente.slice();
    medVett.splice(index, 1);
    this.setState({ prescPaziente: medVett });
  };

  addP = (p, id) => {
    let pogba = { ...p };
    pogba.prescid = id;
    let medVett = this.state.prescPaziente.slice();
    medVett.push(pogba);
    this.setState({ prescPaziente: medVett });

    API.getMedicoById(pogba.mid)
      .then((m) => {
        let nuovo = this.state.mediciPrescrizioni.concat(
          m.nome + " " + m.cognome
        );
        this.setState({ mediciPrescrizioni: nuovo });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  addN = (nota) => {
    let medVett = this.state.notePaziente.slice();
    medVett.push(nota);
    this.setState({ notePaziente: medVett });

    API.getMedicoById(this.props.mid)
      .then((m) => {
        let nuovo = this.state.medicoNota.concat(m.nome + " " + m.cognome);
        this.setState({ medicoNota: nuovo });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  deleteN = (index) => {
    let medVett = this.state.notePaziente.slice();
    medVett.splice(index, 1);
    this.setState({ notePaziente: medVett });
  };

  editN = (n, i) => {
    let medVett = this.state.notePaziente.slice();
    medVett[i] = n;
    this.setState({ notePaziente: medVett });
  };

  addV = (nota) => {
    let medVett = this.state.visitePaziente.slice();
    medVett.push(nota);
    this.setState({ visitePaziente: medVett });

    API.getMedicoById(this.props.mid)
      .then((m) => {
        let nuovo = this.state.medicoVisita.concat(m.nome + " " + m.cognome);
        this.setState({ medicoVisita: nuovo });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  deleteV = (index) => {
    let medVett = this.state.visitePaziente.slice();
    medVett.splice(index, 1);
    this.setState({ visitePaziente: medVett });
  };

  editV = (n, i) => {
    let medVett = this.state.visitePaziente.slice();
    medVett[i] = n;
    this.setState({ visitePaziente: medVett });
  };

  render() {
    return (
      <Row className="custom-row">
        <Col sm={2}>
          <CardDatiUtente
            tipo="paziente"
            pagina="paginamedico"
            utente={this.state.paziente}
          />
        </Col>

        <Col style={{ marginLeft: "1rem", marginTop: "1rem" }}>
          <Tabs defaultActiveKey="prescmis">
            <Tab
              eventKey="prescmis"
              title="Prescrizioni e Misurazioni"
              style={{ marginRight: "4vh" }}
            >
              <Row className="custom-row">
                <Col>
                  <JumboPresc
                    tipo="ConButton"
                    prescUtente={this.state.prescPaziente}
                    mediciPrescrizioni={this.state.mediciPrescrizioni}
                    pid={this.props.id}
                    mid={this.props.mid}
                    deleteP={this.deleteP}
                    addP={this.addP}
                  />
                </Col>
                <Col>
                  <JumboMis tipiMis={this.state.tipiMis} pid={this.props.id} />
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="notevis" title="Note e Visite">
              <Row className="custom-row">
                <Col>
                  <JumboNote
                    note={this.state.notePaziente}
                    medicoNota={this.state.medicoNota}
                    pid={this.props.id}
                    mid={this.props.mid}
                    addN={this.addN}
                    deleteN={this.deleteN}
                    editN={this.editN}
                  />
                </Col>
                <Col>
                  <JumboVisite
                    visite={this.state.visitePaziente}
                    medicoVisita={this.state.medicoVisita}
                    pid={this.props.id}
                    mid={this.props.mid}
                    addV={this.addV}
                    deleteV={this.deleteV}
                    editV={this.editV}
                  />
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    );
  }
}

export default GestionePaziente;
