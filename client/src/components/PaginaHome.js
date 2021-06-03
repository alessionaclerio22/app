import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import CardDatiUtente from "./CardDatiUtente";
import VisiteOggiMedInf from "./VisiteOggiMedInf";
import RichiestaCollegamento from "./RichiestaCollegamento";
import ListaUtenti from "./ListaUtenti";
import DaFareOggiPaziente from "./DaFareOggiPaziente";
import MedicoAssociato from "./MedicoAssociato";
import { Row, Col, Jumbotron, Alert, Tab, Tabs } from "react-bootstrap";

import "./stylesheet.css";
import API from "../api/API_prova";

class PaginaHome extends React.Component {
  ///

  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  componentDidMount = () => {
    if (this.props.tipo === "medico") {
      API.getMedicoById(this.props.id)
        .then((m) => {
          this.setState({ utente: m });
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
      API.getPazienteById(this.props.id)
        .then((p) => {
          this.setState({ utente: p });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getMediciByPaziente(this.props.id)
        .then((vettMedici) => {
          this.setState({ mediciPaziente: vettMedici });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getMedicineByPazienteData(this.props.id)
        .then((vettMedicine) => {
          this.setState({ medicineOggi: vettMedicine });
        })
        .catch((errorObj) => console.error(errorObj));

      API.getMisurazioniByPazienteData(this.props.id)
        .then((vettMis) => {
          this.setState({ misOggi: vettMis });
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
      API.getInfermiereById(this.props.id)
        .then((i) => {
          this.setState({ utente: i });
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

  render() {
    return (
      <Row>
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

        <Col sm={4} style={{ marginLeft: "10vh" }}>
          {this.props.tipo === "paziente" && (
            <>
              <DaFareOggiPaziente
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
                style={{ marginTop: "5vh", width: "70vh", marginBottom: "5vh" }}
              >
                <h2>Visite da fare oggi</h2>
                {this.state.visMedOggi.length !== 0 && (
                  <VisiteOggiMedInf
                    visiteMedico={this.state.visMedOggi}
                    pazientiVisita={this.state.pazientiVisita}
                    pagina="paginamedico"
                  />
                )}
                {this.state.visMedOggi.length === 0 && (
                  <Alert variant="info" style={{ marginTop: "6vh" }}>
                    Non ci sono visite da fare oggi
                  </Alert>
                )}
              </Jumbotron>
            </>
          )}

          {this.props.tipo === "infermiere" && (
            <>
              <Jumbotron
                style={{ marginTop: "5vh", width: "70vh", marginBottom: "5vh" }}
              >
                <h2>Richieste di Aiuto</h2>

                {(this.state.helpMisurazioni.length !== 0 ||
                  this.state.helpMedicine.length !== 0) && (
                  <VisiteOggiMedInf
                    misAiuto={this.state.helpMisurazioni}
                    medAiuto={this.state.helpMedicine}
                    pazientiMisurazioniAiuto={
                      this.state.pazientiMisurazioniAiuto
                    }
                    pazientiMedicineAiuto={this.state.pazientiMedicineAiuto}
                    pagina="paginainfermiere"
                    delega_mismed_n={0}
                  />
                )}

                {this.state.helpMisurazioni.length === 0 &&
                  this.state.helpMedicine.length === 0 && (
                    <Alert variant="info" style={{ marginTop: "6vh" }}>
                      Non ci sono altre richieste di aiuto
                    </Alert>
                  )}

                <h2>Visite di controllo di oggi</h2>
                {this.state.visiteDelega.length !== 0 && (
                  <VisiteOggiMedInf
                    visiteDelega={this.state.visiteDelega}
                    pagina="paginainfermiere"
                    delega_mismed_n={1}
                    pazientiVisitaDelega={this.state.pazientiVisitaDelega}
                  />
                )}

                {this.state.visiteDelega.length === 0 && (
                  <Alert variant="info" style={{ marginTop: "6vh" }}>
                    Non ci sono altre visite di controllo da fare oggi
                  </Alert>
                )}
              </Jumbotron>
            </>
          )}
        </Col>

        <Col sm={4} style={{ marginLeft: "10vh" }}>
          {this.props.tipo === "paziente" && (
            <>
              <Jumbotron
                style={{ marginTop: "5vh", width: "70vh", marginBottom: "5vh" }}
              >
                <h2 style={{ marginBottom: "2vh" }}>Collegamenti</h2>

                <Tabs defaultActiveKey="pazientiMed">
                  <Tab eventKey="pazientiMed" title="Medici">
                    {this.state.mediciPaziente.length !== 0 && (
                      <ListaUtenti
                        lista="listamedici"
                        pagina="paginapaziente"
                        mediciPaziente={this.state.mediciPaziente}
                        id={this.props.id}
                      />
                    )}
                    {this.state.mediciPaziente.length === 0 && (
                      <Alert variant="info" style={{ marginTop: "6vh" }}>
                        Al momento non hai nessun medico
                      </Alert>
                    )}
                  </Tab>
                  <Tab eventKey="riccol" title="Richieste di collegamento">
                    <RichiestaCollegamento tipo="paziente" />
                  </Tab>
                </Tabs>
              </Jumbotron>
            </>
          )}

          {this.props.tipo === "medico" && (
            <>
              <Jumbotron
                style={{ marginTop: "5vh", width: "70vh", marginBottom: "2vh" }}
              >
                <h2 style={{ marginBottom: "5vh" }}>I miei collegamenti</h2>

                <Tabs defaultActiveKey="pazientiMed">
                  <Tab eventKey="pazientiMed" title="Pazienti">
                    {this.state.pazientiMedico.length !== 0 && (
                      <ListaUtenti
                        style={{ marginTop: "4vh" }}
                        lista="listapazienti"
                        pagina="paginamedico"
                        pazientiMedico={this.state.pazientiMedico}
                        id={this.props.id}
                      />
                    )}

                    {this.state.pazientiMedico.length === 0 && (
                      <Alert variant="info" style={{ marginTop: "6vh" }}>
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
                      />
                    )}

                    {this.state.infermieriMedico.length === 0 && (
                      <Alert variant="info" style={{ marginTop: "6vh" }}>
                        Al momento non hai nessun infermiere associato
                      </Alert>
                    )}
                  </Tab>
                  <Tab eventKey="riccol" title="Richieste di collegamento">
                    <RichiestaCollegamento tipo="medico" />
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
              />
            </>
          )}
        </Col>
      </Row>
    );
  }
}
export default PaginaHome;
