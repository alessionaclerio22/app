import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../App.css";
import {
  BsFillPersonCheckFill,
  BsFillPersonDashFill,
  BsInfo,
  BsPersonDash,
} from "react-icons/bs";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Jumbotron } from "react-bootstrap";

import "./stylesheet.css";

class RichiestaCollegamento extends React.Component {
  state = {
    isOpen: false,
  };

  modalRic = () => {
    return (
      <Modal
        show={this.state.isOpen}
        onHide={this.closeModal}
        height="75vh"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card style={{ width: "16rem" }}>
            <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />

            <ListGroup className="listmedico" style={{ width: "50vh" }}>
              <ListGroupItem>Nome: </ListGroupItem>
              <ListGroupItem>Cognome: </ListGroupItem>
              <ListGroupItem>Data di Nascita:</ListGroupItem>
              <ListGroupItem>Telefono:</ListGroupItem>
              <ListGroupItem>Sede Ambulatorio:</ListGroupItem>
              <ListGroupItem>Specializzazione:</ListGroupItem>
              <ListGroupItem>Ordine:</ListGroupItem>
              <ListGroupItem>Numero dell'Ordine:</ListGroupItem>
            </ListGroup>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  render() {
    return (
      <>
        {this.props.tipo === "paziente" && (
          <Jumbotron className="jtrichieste" class="overflow-scroll">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Medico</th>
                  <th>Accetta</th>
                  <th>Rifiuta</th>
                  <th>Info</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>$Nome Medico&</td>
                  <td>
                    <Button
                      variant="outline-success"
                      style={{ borderRadius: "50%" }}
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
                    >
                      <BsFillPersonDashFill style={{ marginBottom: "0.5vh" }} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      style={{ borderRadius: "50%" }}
                      onClick={this.openModal}
                    >
                      <BsInfo style={{ marginBottom: "0.5vh" }} />
                    </Button>
                    <this.modalRic />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Jumbotron>
        )}

        {this.props.tipo === "medico" && (
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
                <tr>
                  <td>$Ruolo&</td>
                  <td>$Nome Utente&</td>
                  <td>
                    <Button
                      variant="outline-success"
                      style={{ borderRadius: "50%" }}
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
                    >
                      <BsFillPersonDashFill style={{ marginBottom: "0.5vh" }} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      style={{ borderRadius: "50%" }}
                      onClick={this.openModal}
                    >
                      <BsInfo style={{ marginBottom: "0.5vh" }} />
                    </Button>
                    <this.modalRic />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Jumbotron>
        )}
      </>
    );
  }
}

export default RichiestaCollegamento;
