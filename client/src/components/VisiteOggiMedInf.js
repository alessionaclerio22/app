import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsCameraVideoFill, BsCheck } from "react-icons/bs";
import "../App.css";
import API from "../api/API_prova";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Jumbotron, Image } from "react-bootstrap";
import moment from "moment";
import "./stylesheet.css";

class CardDatiUtente extends React.Component {
  constructor(props) {
    super(props);
    this.state = { idprov: false, showerror: false };
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

  segnaFatta = (i) => {
    let m = this.props.visiteMedico[i];
    m.fatto = "1";
    let newData = m.data;
    let newOra = m.ora;
    let newDelega = m.delega;
    let data = {
      visita: m,
      newOra: newOra,
      newData: newData,
      newDelega: newDelega,
    };
    API.editVisita(m.mid, data)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  segnaFattaInf = (i) => {
    let m = this.props.visiteDelega[i];
    m.fatto = "1";
    let newData = m.data;
    let newOra = m.ora;
    let data = { visita: m, newOra: newOra, newData: newData };
    API.editVisita(m.mid, data)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  render() {
    return (
      <>
        {this.props.pagina === "paginamedico" && (
          <Jumbotron className="jt" class="overflow-scroll">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Paziente</th>
                  <th>Ora</th>
                  <th>Segna come fatta</th>
                  <th>Inizia Videochiamata</th>
                </tr>
              </thead>
              <tbody>
                {this.props.visiteMedico.map((v, i) => (
                  <tr>
                    <td>{this.props.pazientiVisita[i]}</td>
                    <td>{v.ora}</td>
                    <td>
                      <Button
                        variant="outline-success"
                        style={{ borderRadius: "50%" }}
                        onClick={() => this.segnaFatta(i)}
                      >
                        <BsCheck style={{ marginBottom: "0.5vh" }} />
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        style={{ borderRadius: "50%" }}
                      >
                        <BsCameraVideoFill style={{ marginBottom: "0.5vh" }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Jumbotron>
        )}

        {this.props.pagina === "paginainfermiere" &&
          this.props.delega_mismed_n === 1 && (
            <Jumbotron className="jt" class="overflow-scroll">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Paziente</th>
                    <th>Ora</th>
                    <th>Segna come fatta</th>

                    <th>Videochiamata</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.visiteDelega.map((v, i) => (
                    <tr>
                      <td>{this.props.pazientiVisitaDelega[i]}</td>
                      <td>{v.ora}</td>
                      <td>
                        <Button
                          variant="outline-success"
                          style={{ borderRadius: "50%" }}
                          onClick={() => this.segnaFattaInf(i)}
                        >
                          <BsCheck style={{ marginBottom: "0.5vh" }} />
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          style={{ borderRadius: "50%" }}
                        >
                          <BsCameraVideoFill
                            style={{ marginBottom: "0.5vh" }}
                          />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Jumbotron>
          )}

        {this.props.pagina === "paginainfermiere" &&
          this.props.delega_mismed_n === 0 && (
            <Jumbotron className="jt" class="overflow-scroll">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Paziente</th>
                    <th>Attività</th>
                    <th>Ora/Fascia oraria</th>
                    <th>Videochiamata</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.misAiuto.map((v, i) => (
                    <tr>
                      <td>{this.props.pazientiMisurazioniAiuto[i]}</td>
                      <td>{v.tipo}</td>
                      <td>
                        {v.ora_fascia_n === "0"
                          ? v.fascia_oraria
                          : v.ora_fissata}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          style={{ borderRadius: "50%" }}
                        >
                          <BsCameraVideoFill
                            style={{ marginBottom: "0.5vh" }}
                          />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {this.props.medAiuto.map((v, i) => (
                    <tr>
                      <td>{this.props.pazientiMedicineAiuto[i]}</td>
                      <td>
                        {v.ora_fascia_n === "0"
                          ? v.fascia_oraria
                          : v.ora_fissata}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          style={{ borderRadius: "50%" }}
                        >
                          <BsCameraVideoFill
                            style={{ marginBottom: "0.5vh" }}
                          />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Jumbotron>
          )}
      </>
    );
  }
}

export default CardDatiUtente;
