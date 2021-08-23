import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsCameraVideoFill, BsCheck } from "react-icons/bs";
import "../App.css";
import API from "../api/API_prova";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Jumbotron, Form, Modal, Row, Col } from "react-bootstrap";

import "./stylesheet.css";

class VisiteOggiMedInf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idprov: false,
      showerror: false,
      isOpenFatta: false,
      addNotes: "0",
      testoNote: null,
      indexVis: null,
    };
  }

  openConfirmVis = () => {
    this.setState({ isOpenFatta: true });
    console.log(this.state.isOpenFatta);
  };
  closeConfirmVis = () => {
    this.setState({ isOpenFatta: false });
  };

  modalConfirmVisita = () => {
    return (
      <Modal
        show={this.state.isOpenFatta}
        onHide={this.closeConfirmVis}
        height="75vh"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Conferma di aver eseguito la visita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="custom-row">
            <Col>
              <p>Vuoi inserire delle note associate alla visita?</p>
            </Col>
            <Col>
              <Form>
                <Form.Control
                  as="select"
                  name="addNotes"
                  value={this.state.addNotes}
                  onChange={this.handleChange}
                  required
                >
                  <option value="0">No</option>
                  <option value="1">Sì</option>
                </Form.Control>
              </Form>
            </Col>
          </Row>
          <Row className="custom-row">
            <Col>
              {this.state.addNotes === "1" && (
                <Form>
                  <Form.Control
                    as="textarea"
                    rows="10"
                    name="testoNote"
                    type="text"
                    placeholder="Inserisci qui la nota"
                    value={this.state.testoNote}
                    onChange={this.handleChange}
                    required
                  />
                </Form>
              )}
              <Button
                variant="outline-primary"
                onClick={() => {
                  this.segnaFatta();
                  this.props.segnaComeFatta(this.state.indexVis);
                }}
              >
                Conferma
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  };

  modalConfirmVisitaInf = () => {
    return (
      <Modal
        show={this.state.isOpenFatta}
        onHide={this.closeConfirmVis}
        height="75vh"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Conferma di aver eseguito la visita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="custom-row">
            <Col>
              <p>Vuoi inserire delle note associate alla visita?</p>
            </Col>
            <Col>
              <Form>
                <Form.Control
                  as="select"
                  name="addNotes"
                  value={this.state.addNotes}
                  onChange={this.handleChange}
                  required
                >
                  <option value="0">No</option>
                  <option value="1">Sì</option>
                </Form.Control>
              </Form>
            </Col>
          </Row>
          <Row className="custom-row">
            <Col>
              {this.state.addNotes === "1" && (
                <Form>
                  <Form.Control
                    as="textarea"
                    rows="10"
                    name="testoNote"
                    type="text"
                    placeholder="Inserisci qui la nota"
                    value={this.state.testoNote}
                    onChange={this.handleChange}
                    required
                  />
                </Form>
              )}
              <Button
                variant="outline-primary"
                onClick={() => {
                  this.segnaFattaInf();
                  this.props.segnaComeFattaInf(this.state.indexVis);
                }}
              >
                Conferma
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  };

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

  segnaFatta = () => {
    let m = this.props.visiteMedico[this.state.indexVis];
    m.fatto = "1";
    let newData = m.data;
    let newOra = m.ora;
    let newDelega = m.delega;
    let newRemoto = m.remoto;
    let newNote = this.state.testoNote;
    let data = {
      visita: m,
      newOra: newOra,
      newData: newData,
      newDelega: newDelega,
      newRemoto: newRemoto,
      newNote: newNote,
    };
    API.editVisita(m.mid, data)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
    this.setState({ isOpenFatta: false });
  };

  segnaFattaInf = () => {
    let m = this.props.visiteDelega[this.state.indexVis];
    m.fatto = "1";
    let newData = m.data;
    let newOra = m.ora;
    let newDelega = m.delega;
    let newRemoto = m.remoto;
    let newNote = this.state.testoNote;
    let data = {
      visita: m,
      newOra: newOra,
      newData: newData,
      newDelega: newDelega,
      newRemoto: newRemoto,
      newNote: newNote,
    };
    API.editVisita(m.mid, data)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
    this.setState({ isOpenFatta: false });
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
                  <th>Modalità</th>
                  <th>Segna come fatta</th>
                  <th>Inizia Videochiamata</th>
                </tr>
              </thead>
              <tbody>
                {this.props.visiteMedico.map((v, i) => (
                  <tr>
                    <td>{this.props.pazientiVisita[i]}</td>
                    <td>{v.ora}</td>
                    {parseInt(v.remoto) === 1 ? (
                      <td>Remoto</td>
                    ) : (
                      <td>In presenza</td>
                    )}
                    <td>
                      <Button
                        variant="outline-success"
                        style={{ borderRadius: "50%" }}
                        onClick={() => {
                          this.openConfirmVis();
                          this.setState({ indexVis: i });
                        }}
                      >
                        <BsCheck style={{ marginBottom: "0.5vh" }} />
                      </Button>
                    </td>
                    <td>
                      {parseInt(v.remoto) === 1 && (
                        <Button
                          variant="outline-primary"
                          style={{ borderRadius: "50%" }}
                          onClick={(event) =>
                            (window.location.href =
                              "/medici/" +
                              this.props.medico.mid +
                              "/pazienti/" +
                              v.pid +
                              "/video")
                          }
                        >
                          <BsCameraVideoFill
                            style={{ marginBottom: "0.5vh" }}
                          />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                <this.modalConfirmVisita />
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
                    <th>Modalità</th>
                    <th>Segna come fatta</th>
                    <th>Videochiamata</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.visiteDelega.map((v, i) => (
                    <tr>
                      <td>{this.props.pazientiVisitaDelega[i]}</td>
                      <td>{v.ora}</td>
                      {parseInt(v.remoto) === 1 ? (
                        <td>Remoto</td>
                      ) : (
                        <td>In presenza</td>
                      )}
                      <td>
                        <Button
                          variant="outline-success"
                          style={{ borderRadius: "50%" }}
                          onClick={() => {
                            this.openConfirmVis();
                            this.setState({ indexVis: i });
                          }}
                        >
                          <BsCheck style={{ marginBottom: "0.5vh" }} />
                        </Button>
                      </td>
                      <td>
                        {parseInt(v.remoto) === 1 && (
                          <Button
                            variant="outline-primary"
                            style={{ borderRadius: "50%" }}
                            onClick={(event) =>
                              (window.location.href =
                                "/infermieri/" +
                                this.props.infermiere.iid +
                                "/pazienti/" +
                                v.pid +
                                "/video")
                            }
                          >
                            <BsCameraVideoFill
                              style={{ marginBottom: "0.5vh" }}
                            />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  <this.modalConfirmVisitaInf />
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
                </tbody>
              </Table>
            </Jumbotron>
          )}
      </>
    );
  }
}

export default VisiteOggiMedInf;
