import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom";

import { BsCameraVideoFill } from "react-icons/bs";
import "../App.css";
import { BsCheck, BsX } from "react-icons/bs";
import { FaHandsHelping } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Popover from "react-bootstrap/Popover";
import Overlay from "react-bootstrap/Overlay";
import Form from "react-bootstrap/Form";
import { Col, Jumbotron, Modal, Alert } from "react-bootstrap";
import API from "../api/API_prova";
import moment from "moment";
import "./stylesheet.css";
import CardDatiUtente from "./CardDatiUtente";

class DaFareOggiPaziente extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      medVis: [],
      visOggi: [],
      valore: null,
      isOpen: false,
      isOpenPresa: false,
      medicineOggi: [],
      misOggi: [],
      index: null,
    };
  }

  componentWillReceiveProps = (n) => {
    if (this.state.medicineOggi !== n.medicineOggi) {
      this.setState({
        medicineOggi: n.medicineOggi,
      });
    }

    if (this.state.misOggi !== n.misOggi) {
      this.setState({
        misOggi: n.misOggi,
      });
    }
  };

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  addValueMis = () => {
    let misVett = this.state.misOggi.slice();
    misVett[this.state.index].valore = this.state.valore;
    misVett[this.state.index].timestamp_fatto =
      moment().format("DD-MM-YYYY HH:mm");

    API.editMisurazione(
      misVett[this.state.index].pid,
      misVett[this.state.index]
    )
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });

    misVett.splice(this.state.index, 1);
    this.setState({ misOggi: misVett });
    this.closeModal();
  };

  segnaComePresa = () => {
    let medVett = this.state.medicineOggi.slice();
    medVett[this.state.index].presa = "1";

    API.editMedicina(medVett[this.state.index].pid, medVett[this.state.index])
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });

    medVett.splice(this.state.index, 1);
    this.setState({ medicineOggi: medVett });
  };

  aiutoMis = (i) => {
    let misVett = this.state.misOggi.slice();
    misVett[i].aiuto = "1";
    this.setState({ misOggi: misVett });

    API.editMisurazione(misVett[i].pid, misVett[i])
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  togliAiutoMis = (i) => {
    let misVett = this.state.misOggi.slice();
    misVett[i].aiuto = "0";
    this.setState({ misOggi: misVett });
    API.editMisurazione(misVett[i].pid, misVett[i])
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  aiutoMed = (i) => {
    let medVett = this.state.medicineOggi.slice();
    medVett[i].aiuto = "1";
    this.setState({ medicineOggi: medVett });

    API.editMedicina(medVett[i].pid, medVett[i])
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  togliAiutoMed = (i) => {
    let medVett = this.state.medicineOggi.slice();
    medVett[i].aiuto = "0";
    this.setState({ medicineOggi: medVett });

    API.editMedicina(medVett[i].pid, medVett[i])
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });
  openModalPresa = () => this.setState({ isOpenPresa: true });
  closeModalPresa = () => this.setState({ isOpenPresa: false });

  render() {
    return (
      <Jumbotron
        style={{ marginTop: "1rem", marginBottom: "1rem" }}
      >
        <h2>
          Da Fare Oggi
          <br />
          <br />
        </h2>

        <h4>Medicine</h4>

        {this.state.medicineOggi.length !== 0 && (
          <Jumbotron className="jt" class="overflow-scroll">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Medicina</th>
                  <th>Ora/Fascia oraria</th>
                  <th>Segna come fatta</th>
                  <th>Richiedi assistenza</th>
                </tr>
              </thead>
              <tbody>
                {this.state.medicineOggi.map((m, i) => (
                  <tr>
                    <td>{m.tipo}</td>
                    <td>
                      {m.ora_fascia_n === "0" ? m.fascia_oraria : m.ora_fissata}
                    </td>
                    <td>
                      <Button
                        variant="outline-success"
                        style={{ borderRadius: "50%" }}
                        onClick={() => {
                          this.setState({
                            index: i,
                          });
                          this.openModalPresa();
                        }}
                      >
                        <BsCheck style={{ marginBottom: "0.5rem" }} />
                      </Button>
                    </td>
                    {m.aiuto === "0" && (
                      <td>
                        <Button
                          variant="outline-primary"
                          style={{ borderRadius: "50%" }}
                          onClick={() => this.aiutoMed(i)}
                        >
                          <FaHandsHelping style={{ marginBottom: "0.5rem" }} />
                        </Button>
                      </td>
                    )}
                    {m.aiuto === "1" && (
                      <td>
                        <Button
                          variant="outline-danger"
                          style={{ borderRadius: "50%" }}
                          onClick={() => this.togliAiutoMed(i)}
                        >
                          <BsX style={{ marginBottom: "0.5rem" }} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}

                <Modal
                  show={this.state.isOpenPresa}
                  onHide={this.closeModalPresa}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Col sm="9">
                      <Modal.Title id="contained-modal-title-vcenter">
                        Confermi di aver preso la medicina?
                      </Modal.Title>
                    </Col>
                    <Col>
                      <Button
                        variant="primary"
                        onClick={() => {
                          this.segnaComePresa();
                          this.closeModalPresa();
                        }}
                      >
                        Conferma
                      </Button>
                    </Col>
                  </Modal.Header>
                </Modal>
              </tbody>
            </Table>
          </Jumbotron>
        )}

        {this.state.medicineOggi.length === 0 && (
          <Alert variant="info" style={{ marginTop: "1rem" }}>
            Non ci sono altre medicine per oggi
          </Alert>
        )}

        <h4>Misurazioni</h4>
        {this.state.misOggi.length !== 0 && (
          <Jumbotron className="jt" class="overflow-scroll">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Misurazione</th>
                  <th>Ora/Fascia oraria</th>
                  <th>Aggiungi valore</th>
                  <th>Richiedi assistenza</th>
                </tr>
              </thead>
              <tbody>
                {this.state.misOggi.map((m, i) => (
                  <tr>
                    <td>{m.tipo}</td>
                    <td>
                      {m.ora_fascia_n === "0" ? m.fascia_oraria : m.ora_fissata}
                    </td>
                    <td>
                      <Button
                        variant="outline-success"
                        style={{ borderRadius: "50%" }}
                        onClick={() => {
                          this.openModal();
                          this.setState({ index: i });
                        }}
                      >
                        <IoIosAdd style={{ marginBottom: "0.5rem" }} />
                      </Button>
                    </td>
                    <td>
                      {m.aiuto === "0" && (
                        <Button
                          variant="outline-primary"
                          style={{ borderRadius: "50%" }}
                          onClick={() => this.aiutoMis(i)}
                        >
                          <FaHandsHelping style={{ marginBottom: "0.5rem" }} />
                        </Button>
                      )}
                      {m.aiuto === "1" && (
                        <Button
                          variant="outline-danger"
                          style={{ borderRadius: "50%" }}
                          onClick={() => this.togliAiutoMis(i)}
                        >
                          <BsX style={{ marginBottom: "0.5rem" }} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}

                <Modal
                  show={this.state.isOpen}
                  onHide={this.closeModal}
                  height="75rem"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Aggiungi Valore
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Row className="align-items-center custom-row">
                      <Col sm={8}>
                        <Form>
                          <Form.Control
                            type="numeric"
                            name="valore"
                            onChange={this.handleChange}
                            placeholder="Valore"
                          />
                        </Form>
                      </Col>
                      <Col sm={2}>
                        <Button variant="success" onClick={this.addValueMis}>
                          Conferma
                        </Button>
                      </Col>
                    </Form.Row>
                  </Modal.Body>
                </Modal>
              </tbody>
            </Table>
          </Jumbotron>
        )}

        {this.state.misOggi.length === 0 && (
          <Alert variant="info" style={{ marginTop: "1rem" }}>
            Non ci sono altre misurazioni per oggi
          </Alert>
        )}

        <h4>Visite</h4>

        {this.props.visOggi.length !== 0 && (
          <Jumbotron className="jt" class="overflow-scroll">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Medico</th>
                  <th>Ora</th>
                  <th>Modalità</th>
                  <th>Entra nella videochiamata</th>
                </tr>
              </thead>
              <tbody>
                {this.props.visOggi.map((m, i) => (
                  <tr>
                    <td>{this.props.mediciVisita[i]}</td>
                    <td>{m.ora}</td>
                    {parseInt(m.remoto) === 1 ? (
                      <>
                        <td>Remoto</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            style={{ borderRadius: "50%" }}
                            onClick={(event) =>
                              (window.location.href =
                                "/pazienti/" + this.props.utente.pid + "/video")
                            }
                          >
                            <BsCameraVideoFill
                              style={{ marginBottom: "0.5rem" }}
                            />
                          </Button>
                        </td>
                      </>
                    ) : (
                      <td>In presenza</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Jumbotron>
        )}

        {this.props.visOggi.length === 0 && (
          <Alert variant="info" style={{ marginTop: "1rem" }}>
            Non ci sono altre visite per oggi
          </Alert>
        )}
      </Jumbotron>
    );
  }
}

export default DaFareOggiPaziente;
