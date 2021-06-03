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

import API from "../api/API_prova";
import "./stylesheet.css";
import { BsInfo, BsX } from "react-icons/bs";

class MedicoAssociato extends React.Component {
  state = {
    isOpen: false,
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

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  render() {
    return (
      <>
        <Jumbotron
          style={{ marginTop: "5vh", width: "70vh", marginBottom: "5vh" }}
        >
          <h2>Collegamenti </h2>
          <Tabs defaultActiveKey="medicoAss">
            <Tab eventKey="medicoAss" title="Medico associato">
              {!this.props.medicoAssociato.nome && (
                <>
                  <Row>
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
                      >
                        <BsPlus style={{ marginBottom: "0.5vh" }} />
                      </Button>
                    </Col>
                  </Row>
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
                            onClick={this.deleteMedicoAss}
                          >
                            <BsX style={{ marginBottom: "0.5vh" }} />
                          </Button>
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
                  Al momento c'è nessun paziente in cura dal tuo medico
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
