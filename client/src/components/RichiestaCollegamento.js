import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../App.css";
import {
  BsFillPersonCheckFill,
  BsFillPersonDashFill,
  BsInfo,
  BsPersonDash,
} from "react-icons/bs";
import { Image, Transformation } from "cloudinary-react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Jumbotron, Alert } from "react-bootstrap";

import "./stylesheet.css";

class RichiestaCollegamento extends React.Component {
  state = {
    isOpenPaz: false,
    isOpenInf: false,
    isOpenMed: false,
    indexPaz: 0,
    indexInf: 0,
    indexMed: 0,
  };

  modalRicPaz = () => {
    return (
      <Modal
        show={this.state.isOpenPaz}
        onHide={this.closeModalPaz}
        height="75vh"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card style={{ width: "15rem" }}>
            <ListGroup style={{ width: "29rem" }}>
              <ListGroupItem>
                <Image
                  cloudName="dwkouowyh"
                  publicId={this.props.listaPaz[this.state.indexPaz].foto}
                  style={{ width: "25rem" }}
                />
                <Card.Title style={{ marginTop: "3rem" }}>
                  <b>
                    {this.props.listaPaz[this.state.indexPaz].nome}{" "}
                    {this.props.listaPaz[this.state.indexPaz].cognome}
                  </b>
                </Card.Title>
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Data di Nascita:</b>
                <br />
                {this.props.listaPaz[this.state.indexPaz].data_nascita}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Telefono: </b>
                <br />
                {this.props.listaPaz[this.state.indexPaz].telefono}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Mail: </b>
                <br />
                {this.props.listaPaz[this.state.indexPaz].mail}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Codice Fiscale:</b>
                <br />
                {this.props.listaPaz[this.state.indexPaz].codice_fiscale}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Tesserino Sanitario:</b>
                <br />
                {this.props.listaPaz[this.state.indexPaz].tesserino_sanitario}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Indirizzo:</b>
                <br />
                {this.props.listaPaz[this.state.indexPaz].indirizzo}
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Modal.Body>
      </Modal>
    );
  };

  modalRicInf = () => {
    return (
      <Modal
        show={this.state.isOpenInf}
        onHide={this.closeModalInf}
        height="75vh"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card style={{ width: "15rem" }}>
            <ListGroup style={{ width: "29rem" }}>
              <ListGroupItem>
                <Image
                  cloudName="dwkouowyh"
                  publicId={this.props.listaInf[this.state.indexInf].foto}
                  style={{ width: "25rem" }}
                />
                <Card.Title style={{ marginTop: "3rem" }}>
                  <b>
                    {this.props.listaInf[this.state.indexInf].nome}{" "}
                    {this.props.listaInf[this.state.indexInf].cognome}
                  </b>
                </Card.Title>
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Data di Nascita:</b>
                <br />
                {this.props.listaInf[this.state.indexInf].data_nascita}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Telefono: </b>
                <br />
                {this.props.listaInf[this.state.indexInf].telefono}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Mail: </b>
                <br />
                {this.props.listaInf[this.state.indexInf].mail}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Ordine: </b>
                <br />
                {this.props.listaInf[this.state.indexInf].ordine}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Numero dell'Ordine:</b>
                <br />
                {this.props.listaInf[this.state.indexInf].numero_ordine}
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Modal.Body>
      </Modal>
    );
  };

  modalRicMed = () => {
    return (
      <Modal
        show={this.state.isOpenMed}
        onHide={this.closeModalMed}
        height="75vh"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card style={{ width: "15rem" }}>
            <ListGroup style={{ width: "29rem" }}>
              <ListGroupItem>
                <Image
                  cloudName="dwkouowyh"
                  publicId={this.props.listaMed[this.state.indexMed].foto}
                  style={{ width: "25rem" }}
                />
                <Card.Title style={{ marginTop: "3rem" }}>
                  <b>
                    {this.props.listaMed[this.state.indexMed].nome}{" "}
                    {this.props.listaMed[this.state.indexMed].cognome}
                  </b>
                </Card.Title>
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Data di Nascita:</b>
                <br />
                {this.props.listaMed[this.state.indexMed].data_nascita}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Telefono: </b>
                <br />
                {this.props.listaMed[this.state.indexMed].telefono}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Mail: </b>
                <br />
                {this.props.listaMed[this.state.indexMed].mail}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Ordine: </b>
                <br />
                {this.props.listaMed[this.state.indexMed].ordine}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Numero dell'Ordine:</b>
                <br />
                {this.props.listaMed[this.state.indexMed].numero_ordine}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Specializzazione:</b>
                <br />
                {this.props.listaMed[this.state.indexMed].spec}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "grey" }}>Sede Ambulatorio:</b>
                <br />
                {this.props.listaMed[this.state.indexMed].sede_ambulatorio}
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Modal.Body>
      </Modal>
    );
  };

  openModalInf = () => this.setState({ isOpenInf: true });
  closeModalInf = () => this.setState({ isOpenInf: false });
  openModalPaz = () => this.setState({ isOpenPaz: true });
  closeModalPaz = () => this.setState({ isOpenPaz: false });
  openModalMed = () => this.setState({ isOpenMed: true });
  closeModalMed = () => this.setState({ isOpenMed: false });

  render() {
    return (
      <>
        {this.props.tipo === "paziente" &&
          this.props.richiesteMed.length === 0 && (
            <Alert variant="info" style={{ marginTop: "1rem" }}>
              Al momento non hai nessuna richiesta di collegamento
            </Alert>
          )}

        {this.props.tipo === "paziente" &&
          this.props.richiesteMed.length !== 0 && (
            <Jumbotron className="jtrichieste" class="overflow-scroll">
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
                  {this.props.listaMed.map((r, i) => (
                    <tr>
                      <td>{"Dott. " + r.nome + " " + r.cognome}</td>
                      <td>
                        <Button
                          variant="outline-success"
                          style={{ borderRadius: "50%" }}
                          onClick={() => {
                            this.props.handleAccettaMedByPaz(
                              r,
                              this.props.richiesteMed[i]
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
                            this.props.handleRifiutaMedByPaz(
                              r,
                              this.props.richiesteMed[i]
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
                            this.openModalMed();
                            this.setState({ indexMed: i });
                          }}
                        >
                          <BsInfo style={{ marginBottom: "0.5vh" }} />
                        </Button>
                        <this.modalRicMed />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Jumbotron>
          )}

        {this.props.tipo === "medico" &&
          this.props.richiesteInf.length === 0 &&
          this.props.richiestePaz.length === 0 && (
            <Alert variant="info" style={{ marginTop: "1rem" }}>
              Al momento non hai nessuna richiesta di collegamento
            </Alert>
          )}

        {this.props.tipo === "medico" &&
          (this.props.richiesteInf.length !== 0 ||
            this.props.richiestePaz.length !== 0) && (
            <Jumbotron className="jtrichieste" class="overflow-scroll">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Ruolo</th>
                    <th>Nome Utente</th>
                    <th>Accetta</th>
                    <th>Rifiuta</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.listaPaz.map((r, i) => (
                    <tr>
                      <td>Paziente</td>
                      <td>{r.nome + " " + r.cognome}</td>
                      <td>
                        <Button
                          variant="outline-success"
                          style={{ borderRadius: "50%" }}
                          onClick={() => {
                            this.props.handleAccettaMedPaz(
                              r,
                              this.props.richiestePaz[i]
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
                            this.props.handleRifiutaMedPaz(
                              r,
                              this.props.richiestePaz[i]
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
                            this.openModalPaz();
                            this.setState({ indexPaz: i });
                          }}
                        >
                          <BsInfo style={{ marginBottom: "0.5vh" }} />
                        </Button>
                        <this.modalRicPaz />
                      </td>
                    </tr>
                  ))}
                  {this.props.listaInf.map((r, i) => (
                    <tr>
                      <td>Infermiere</td>
                      <td>{r.nome + " " + r.cognome}</td>
                      <td>
                        <Button
                          variant="outline-success"
                          style={{ borderRadius: "50%" }}
                          onClick={() => {
                            this.props.handleAccettaMedInf(
                              r,
                              this.props.richiesteInf[i]
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
                            this.props.handleRifiutaMedInf(
                              r,
                              this.props.richiesteInf[i]
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
                            this.openModalInf();
                            this.setState({ indexInf: i });
                          }}
                        >
                          <BsInfo style={{ marginBottom: "0.5vh" }} />
                        </Button>
                        <this.modalRicInf />
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

export default RichiestaCollegamento;
