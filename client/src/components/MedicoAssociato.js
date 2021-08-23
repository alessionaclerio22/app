import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsPlus } from "react-icons/bs";
import "../App.css";
import { Image } from "cloudinary-react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import ListaUtenti from "./ListaUtenti";
import { Col, Jumbotron, Row, Alert, Tabs, Tab } from "react-bootstrap";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {
  BsFillPersonCheckFill,
  BsFillPersonDashFill,
  BsPersonDash,
} from "react-icons/bs";

import API from "../api/API_prova";
import "./stylesheet.css";
import { BsInfo, BsX } from "react-icons/bs";

class MedicoAssociato extends React.Component {
  state = {
    isOpen: false,
    isOpenD: false,
    isOpenRic: false,
    isOpenAdd: false,
    colMedico: null,
    indexMed: 0,
  };

  deleteMedicoAss = () => {
    let milf = { mid: this.props.medicoAssociato.mid, iid: this.props.id };
    API.deleteMedicoInfermiere(milf)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  modalMed = () => {
    return (
      <Modal
        show={this.state.isOpen}
        onHide={this.closeModal}
        height="75vh"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Info Medico
          </Modal.Title>
        </Modal.Header>
        <center>
          <Modal.Body>
            <Card
              style={{ width: "40vh", marginLeft: "1vh", marginTop: "1vh" }}
            >
              <Image
                cloudName="dwkouowyh"
                publicId={this.props.medicoAssociato.foto}
              />
              <Card.Title>
                <center>
                  <b>
                    Dott. {this.props.medicoAssociato.nome}{" "}
                    {this.props.medicoAssociato.cognome}
                  </b>
                </center>
              </Card.Title>

              <ListGroup style={{ width: "40vh" }}>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Data di Nascita:</b>
                  <br />
                  {this.props.medicoAssociato.data_nascita}
                </ListGroupItem>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Telefono:</b>
                  <br />
                  {this.props.medicoAssociato.telefono}
                </ListGroupItem>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Sede Ambulatorio:</b>
                  <br />
                  {this.props.medicoAssociato.sede_ambulatorio}
                </ListGroupItem>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Specializzazione:</b>
                  <br />
                  {this.props.medicoAssociato.spec}
                </ListGroupItem>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Ordine:</b>
                  <br />
                  {this.props.medicoAssociato.ordine}
                </ListGroupItem>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Numero dell'Ordine:</b>
                  <br />
                  {this.props.medicoAssociato.numero_ordine}
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Modal.Body>
        </center>
      </Modal>
    );
  };

  modalMedRic = () => {
    return (
      <Modal
        show={this.state.isOpenRic}
        onHide={this.closeModalRic}
        height="75vh"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Info Medico
          </Modal.Title>
        </Modal.Header>
        <center>
          <Modal.Body>
            <Card
              style={{ width: "40vh", marginLeft: "1vh", marginTop: "1vh" }}
            >
              <Image
                cloudName="dwkouowyh"
                publicId={this.props.listaMedForInf[this.state.indexMed].foto}
              />
              <Card.Title>
                <center>
                  <b>
                    Dott. {this.props.listaMedForInf[this.state.indexMed].nome}{" "}
                    {this.props.listaMedForInf[this.state.indexMed].cognome}
                  </b>
                </center>
              </Card.Title>

              <ListGroup style={{ width: "40vh" }}>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Data di Nascita:</b>
                  <br />
                  {this.props.listaMedForInf[this.state.indexMed].data_nascita}
                </ListGroupItem>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Telefono:</b>
                  <br />
                  {this.props.listaMedForInf[this.state.indexMed].telefono}
                </ListGroupItem>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Sede Ambulatorio:</b>
                  <br />
                  {
                    this.props.listaMedForInf[this.state.indexMed]
                      .sede_ambulatorio
                  }
                </ListGroupItem>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Specializzazione:</b>
                  <br />
                  {this.props.listaMedForInf[this.state.indexMed].spec}
                </ListGroupItem>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Ordine:</b>
                  <br />
                  {this.props.listaMedForInf[this.state.indexMed].ordine}
                </ListGroupItem>
                <ListGroupItem>
                  <b style={{ color: "gray" }}>Numero dell'Ordine:</b>
                  <br />
                  {this.props.listaMedForInf[this.state.indexMed].numero_ordine}
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Modal.Body>
        </center>
      </Modal>
    );
  };

  modalD = () => {
    return (
      <Modal
        show={this.state.isOpenD}
        onHide={this.closeModalD}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Col sm="9">
            <Modal.Title id="contained-modal-title-vcenter">
              Sei sicuro di volere rimuovere il medico associato?
            </Modal.Title>
          </Col>
          <Col>
            <Button
              variant="primary"
              onClick={() => {
                this.closeModalD();
                this.props.deleteMedAss();
                this.deleteMedicoAss();
              }}
            >
              Conferma
            </Button>
          </Col>
        </Modal.Header>
      </Modal>
    );
  };

  modalAdd = () => {
    return (
      <Modal
        show={this.state.isOpenAdd}
        onHide={this.closeModalAdd}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Cerca il tuo medico associato
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="custom-row">
            <Autocomplete
              name="nome"
              value={this.state.colMedico}
              onChange={(event, newValue) => {
                this.setState({ colMedico: newValue });
              }}
              options={this.props.allMedici}
              getOptionLabel={(option) => option.nome + "  " + option.cognome}
              style={{ width: 500, marginLeft: "2vh" }}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" />
              )}
            />
            <Button
              variant="primary"
              onClick={() => {
                console.log("Button Clicked");
                for (let el of this.props.users) {
                  if (el.tag == this.state.colMedico.mid) {
                    console.log(this.state.colMedico);
                    this.props.socket.emit("private message", {
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
                  iid: this.props.id,
                  sender: "infermiere",
                };
                API.addRichiestaMedInf(ric)
                  .then(() => {
                    //toglilo da selezione
                    this.props.wakawaka(this.state.colMedico);
                  })
                  .catch((errorObj) => console.error(errorObj));

                this.closeModalAdd();
              }}
              style={{ marginLeft: "2vh" }}
            >
              Conferma
            </Button>
          </Row>
        </Modal.Body>
      </Modal>
    );
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });
  openModalRic = () => this.setState({ isOpenRic: true });
  closeModalRic = () => this.setState({ isOpenRic: false });
  openModalD = () => this.setState({ isOpenD: true });
  closeModalD = () => this.setState({ isOpenD: false });
  openModalAdd = () => this.setState({ isOpenAdd: true });
  closeModalAdd = () => this.setState({ isOpenAdd: false });

  render() {
    return (
      <>
        <Jumbotron
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
            marginRight: "1rem",
          }}
        >
          <h2>Collegamenti </h2>
          <Tabs defaultActiveKey="medicoAss">
            <Tab eventKey="medicoAss" title="Medico associato">
              {!this.props.medicoAssociato.nome && (
                <>
                  <Row className="custom-row">
                    <Col sm={9}>
                      <Alert variant="info" style={{ marginTop: "6vh" }}>
                        Al momento non sei associato a nessun medico. Clicca sul
                        '+' per collegarti con il tuo medico.
                      </Alert>
                    </Col>

                    <Col sm={1}>
                      <Button
                        variant="outline-success"
                        style={{ borderRadius: "50%", marginTop: "8vh" }}
                        onClick={this.openModalAdd}
                      >
                        <BsPlus style={{ marginBottom: "0.5vh" }} />
                      </Button>
                      <this.modalAdd />
                    </Col>
                  </Row>

                  {this.props.richiesteCollegamentoByMed.length !== 0 && (
                    <>
                      <h4 style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                        Richieste di collegamento
                      </h4>

                      <Jumbotron
                        className="jtrichieste"
                        class="overflow-scroll"
                      >
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Nome Utente</th>
                              <th>Accetta</th>
                              <th>Rifiuta</th>
                              <th>Info</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.props.listaMedForInf.map((r, i) => (
                              <tr>
                                <td>{"Dott. " + r.nome + " " + r.cognome}</td>
                                <td>
                                  <Button
                                    variant="outline-success"
                                    style={{ borderRadius: "50%" }}
                                    onClick={() => {
                                      this.props.handleAccettaMedByInf(
                                        r,
                                        this.props.richiesteCollegamentoByMed[i]
                                      );
                                    }}
                                  >
                                    <BsFillPersonCheckFill
                                      style={{ marginBottom: "0.5vh" }}
                                    />
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    variant="outline-danger"
                                    style={{ borderRadius: "50%" }}
                                    onClick={() => {
                                      this.props.handleRifiutaMedByInf(
                                        r,
                                        this.props.richiesteCollegamentoByMed[i]
                                      );
                                    }}
                                  >
                                    <BsFillPersonDashFill
                                      style={{ marginBottom: "0.5vh" }}
                                    />
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    style={{ borderRadius: "50%" }}
                                    onClick={() => {
                                      this.openModalRic();
                                      this.setState({ indexMed: i });
                                    }}
                                  >
                                    <BsInfo style={{ marginBottom: "0.5vh" }} />
                                  </Button>
                                  <this.modalMedRic />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Jumbotron>
                    </>
                  )}
                </>
              )}

              {this.props.medicoAssociato.nome &&
                this.props.medicoAssociato.cognome && (
                  <Table striped bordered hover style={{ marginBottom: "5vh" }}>
                    <tbody>
                      <tr>
                        <td>
                          Dott. {this.props.medicoAssociato.nome}{" "}
                          {this.props.medicoAssociato.cognome}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            style={{ borderRadius: "50%" }}
                            onClick={this.openModal}
                          >
                            <BsInfo style={{ marginBottom: "0.5vh" }} />
                          </Button>
                          <this.modalMed />
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            style={{ borderRadius: "50%" }}
                            onClick={this.openModalD}
                          >
                            <BsX style={{ marginBottom: "0.5vh" }} />
                          </Button>
                          <this.modalD />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                )}
            </Tab>
            <Tab eventKey="pazienti" title="Pazienti">
              {this.props.pazientiMedico.length !== 0 && (
                <ListaUtenti
                  lista="listapazienti"
                  pagina="paginainfermiere"
                  pazientiMedico={this.props.pazientiMedico}
                />
              )}

              {this.props.pazientiMedico.length === 0 && (
                <Alert variant="info" style={{ marginTop: "6vh" }}>
                  Al momento non c'è nessun paziente in cura dal tuo medico
                </Alert>
              )}
            </Tab>
          </Tabs>
        </Jumbotron>
      </>
    );
  }
}

export default MedicoAssociato;
