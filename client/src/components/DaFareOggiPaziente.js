import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom";

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

class ListaUtenti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      medVis: [],
      valore: null,
      isOpen: false,
    };
  }

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  addValueMis = (i) => {
    let m = this.props.misOggi[i];
    m.valore = this.state.valore;
    m.timestamp_fatto = moment().format("DD-MM-YYYY HH:mm");
    API.editMisurazione(m.pid, m)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
    this.closeModal();
  };

  segnaComePresa = (i) => {
    let medicina = this.props.medicineOggi[i];
    medicina.presa = "1";
    API.editMedicina(medicina.pid, medicina)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  aiutoMis = (i) => {
    let m = this.props.misOggi[i];
    m.aiuto = "1";
    API.editMisurazione(m.pid, m)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  togliAiutoMis = (i) => {
    let m = this.props.misOggi[i];
    m.aiuto = "0";
    API.editMisurazione(m.pid, m)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  aiutoMed = (i) => {
    let m = this.props.medicineOggi[i];
    m.aiuto = "1";
    API.editMedicina(m.pid, m)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  togliAiutoMed = (i) => {
    let m = this.props.medicineOggi[i];
    m.aiuto = "0";
    API.editMedicina(m.pid, m)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  render() {
    return (
      <Jumbotron
        style={{ marginTop: "5vh", width: "70vh", marginBottom: "5vh" }}
      >
        <h2>
          Da Fare Oggi
          <br />
          <br />
        </h2>

        <h4>Medicine</h4>

        {this.props.medicineOggi.length !== 0 && (
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
                {this.props.medicineOggi.map((m, i) => (
                  <tr>
                    <td>{m.tipo}</td>
                    <td>
                      {m.ora_fascia_n === "0" ? m.fascia_oraria : m.ora_fissata}
                    </td>
                    <td>
                      <Button
                        variant="outline-success"
                        style={{ borderRadius: "50%" }}
                        onClick={() => this.segnaComePresa(i)}
                      >
                        <BsCheck style={{ marginBottom: "0.5vh" }} />
                      </Button>
                    </td>
                    {m.aiuto === "0" && (
                      <td>
                        <Button
                          variant="outline-primary"
                          style={{ borderRadius: "50%" }}
                          onClick={() => this.aiutoMed(i)}
                        >
                          <FaHandsHelping style={{ marginBottom: "0.5vh" }} />
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
                          <BsX style={{ marginBottom: "0.5vh" }} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Jumbotron>
        )}

        {this.props.medicineOggi.length === 0 && (
          <Alert variant="info" style={{ marginTop: "6vh" }}>
            Non ci sono altre medicine per oggi
          </Alert>
        )}

        <h4>Misurazioni</h4>
        {this.props.misOggi.length !== 0 && (
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
                {this.props.misOggi.map((m, i) => (
                  <tr>
                    <td>{m.tipo}</td>
                    <td>
                      {m.ora_fascia_n === "0" ? m.fascia_oraria : m.ora_fissata}
                    </td>
                    <td>
                      <Button
                        variant="outline-success"
                        style={{ borderRadius: "50%" }}
                        onClick={this.openModal}
                      >
                        <IoIosAdd style={{ marginBottom: "0.5vh" }} />
                      </Button>
                      <Modal
                        show={this.state.isOpen}
                        onHide={this.closeModal}
                        height="75vh"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-vcenter">
                            Aggiungi Valore
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form.Row className="align-items-center">
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
                              <Button
                                variant="success"
                                onClick={() => {
                                  this.addValueMis(i);
                                }}
                              >
                                Conferma
                              </Button>
                            </Col>
                          </Form.Row>
                        </Modal.Body>
                      </Modal>
                    </td>
                    <td>
                      {m.aiuto === "0" && (
                        <Button
                          variant="outline-primary"
                          style={{ borderRadius: "50%" }}
                          onClick={() => this.aiutoMis(i)}
                        >
                          <FaHandsHelping style={{ marginBottom: "0.5vh" }} />
                        </Button>
                      )}
                      {m.aiuto === "1" && (
                        <Button
                          variant="outline-danger"
                          style={{ borderRadius: "50%" }}
                          onClick={() => this.togliAiutoMis(i)}
                        >
                          <BsX style={{ marginBottom: "0.5vh" }} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Jumbotron>
        )}

        {this.props.misOggi.length === 0 && (
          <Alert variant="info" style={{ marginTop: "6vh" }}>
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
                </tr>
              </thead>
              <tbody>
                {this.props.visOggi.map((m, i) => (
                  <tr>
                    <td>{this.props.mediciVisita[i]}</td>
                    <td>{m.ora}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Jumbotron>
        )}

        {this.props.visOggi.length === 0 && (
          <Alert variant="info" style={{ marginTop: "6vh" }}>
            Non ci sono altre visite per oggi
          </Alert>
        )}
      </Jumbotron>
    );
  }
}

export default ListaUtenti;
