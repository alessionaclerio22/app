import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import API from "../api/API_prova";
import "../App.css";
import { BsInfo, BsX, BsPlus, BsPencil } from "react-icons/bs";
import moment from "moment";
import { Alert } from "react-bootstrap";

import {
  Modal,
  Button,
  Jumbotron,
  Card,
  Accordion,
  Form,
  Row,
  Col,
} from "react-bootstrap";

import "./stylesheet.css";

class JumboNote extends React.Component {
  state = {
    isOpen: false,
    testo: null,
    isOpenEdit: false,
    index: 0,
  };

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  deleteNota = (i) => {
    let nota = this.props.note[i];
    this.props.deleteN(i);
    API.deleteNota(nota)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  editNota = (nota, index) => {
    nota.testo = this.state.testo;
    this.props.editN(nota, index);
    console.log(nota);
    API.editNota(nota.pid, nota)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
    this.closeEditModal();
  };

  handleSubmit = (event) => {
    event.preventDefault();
    var now = moment().format("DD-MM-YYYY h:mm:ss A");

    let n = {
      mid: this.props.mid,
      pid: this.props.pid,
      testo: this.state.testo,
      data: now,
    };

    if (n.testo !== "") {
      this.props.addN(n);
      this.closeModal();
      API.addNota(n, this.props.pid)
        .then()
        .catch((errorObj) => console.error(errorObj));
    }
  };

  modalNota = () => {
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
            Aggiungi una nota
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Label>Testo della Nota</Form.Label>
            <Form.Control
              as="textarea"
              rows="10"
              name="testo"
              type="text"
              placeholder="Testo"
              value={this.state.testo}
              onChange={this.handleChange}
              required
            />
            <Button className="form-submit-btn" variant="primary" type="submit">
              Conferma
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });
  openEditModal = () => this.setState({ isOpenEdit: true });
  closeEditModal = () => this.setState({ isOpenEdit: false });

  render() {
    return (
      <Jumbotron style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <h2>Note</h2>
        <Button
          style={{ borderRadius: "50%" }}
          variant="outline-success"
          onClick={this.openModal}
        >
          <BsPlus style={{ marginBottom: "0.33rem" }} />
        </Button>
        <this.modalNota />

        {this.props.note.length !== 0 && (
          <Jumbotron className="jt-3" class="overflow-scroll">
            <Accordion>
              {this.props.note.map((n, i) => (
                <Card>
                  <Card.Header>
                    <Row className="custom-row">
                      <Col>
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey={"#" + i}
                        >
                          Dott. {this.props.medicoNota[i]} -{" "}
                          {n.data.substring(0, 10)}
                        </Accordion.Toggle>
                      </Col>
                      <Col>
                        <Button
                          style={{ borderRadius: "50%" }}
                          variant="outline-primary"
                          onClick={() => {
                            this.openEditModal();
                            this.setState({ index: i });
                          }}
                        >
                          <BsPencil style={{ marginBottom: "0.33rem" }} />
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant="outline-danger"
                          style={{ borderRadius: "50%" }}
                          onClick={() => this.deleteNota(i)}
                        >
                          <BsX style={{ marginBottom: "0.33rem" }} />
                        </Button>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Accordion.Collapse eventKey={"#" + i}>
                    <Card.Body>{n.testo}</Card.Body>
                  </Accordion.Collapse>
                </Card>
              ))}

              <Modal
                show={this.state.isOpenEdit}
                onHide={this.closeEditModal}
                height="75vh"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                    Modifica nota
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Label>Testo della Nota</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="10"
                      name="testo"
                      type="text"
                      placeholder="Testo"
                      defaultValue={this.props.note[this.state.index].testo}
                      onChange={this.handleChange}
                      required
                    />
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => {
                        this.editNota(
                          this.props.note[this.state.index],
                          this.state.index
                        );
                      }}
                    >
                      Conferma
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>
            </Accordion>
          </Jumbotron>
        )}

        {this.props.note.length === 0 && (
          <Alert variant="info" style={{ marginTop: "1rem" }}>
            Non ci sono note
          </Alert>
        )}
      </Jumbotron>
    );
  }
}

export default JumboNote;
