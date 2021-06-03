import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../App.css";

///import Graph from "./Graph";
import CardDatiUtente from "./CardDatiUtente";
import JumboPresc from "./JumboPresc";
import JumboMis from "./JumboMis";
import { Row, Col } from "react-bootstrap";
import API from "../api/API_prova";

import "./stylesheet.css";

class PazientePrescMis extends React.Component {
  ///

  constructor(props) {
    super(props);
    this.state = {
      idprov: false,
      showerror: false,
      utente: {},
      prescUtente: [],
      tipiMis: [],
      mediciPrescrizioni: [],
    };
  }

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.passw1 !== this.state.passw2) {
      this.setState({ showerror: true });
    }

    // inserire API
  };

  handleAlertClose = (event) => {
    this.setState({ showerror: false });
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  componentDidMount = () => {
    API.getPazienteById(this.props.id)
      .then((p) => {
        this.setState({ utente: p });
      })
      .catch((errorObj) => console.error(errorObj));

    API.getPrescrizioniByPaziente(this.props.id)
      .then((presc) => {
        this.setState({ prescUtente: presc });
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
  };

  render() {
    return (
      <Row>
        {this.props.tipo === "home" && (
          <CardDatiUtente tipo="paziente" utente={this.state.utente} />
        )}

        <Col sm={4} style={{ marginLeft: "4vh" }}>
          <JumboPresc
            tipo="SenzaButton"
            prescUtente={this.state.prescUtente}
            mediciPrescrizioni={this.state.mediciPrescrizioni}
          />
        </Col>

        <Col sm={4} style={{ marginLeft: "10vh" }}>
          <JumboMis tipiMis={this.state.tipiMis} pid={this.props.id} />
        </Col>
      </Row>
    );
  }
}
export default PazientePrescMis;
