import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import API from "../api/API_prova";
import "../App.css";
import { BsInfo, BsX, BsPlus, BsPencil } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import moment from "moment";
import { Alert, Table } from "react-bootstrap";

import {
  Modal,
  Button,
  Jumbotron,
  Form,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";

import "./stylesheet.css";

class JumboVisite extends React.Component {
  state = {
    isOpen: false,
    data: null,
    ora: null,
    delega: "0",
    remoto: "0",
    note: null,
    isOpenEdit: false,
    isOpenNotes: false,
    index: 0,
    gesù: "0",
    giuseppe: "0",
    indexNotes: 0,
  };

  deleteVisita = (i) => {
    let vis = this.props.visite[i];
    this.props.deleteV(i);
    API.deleteVisita(vis)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  modifyVisita = (v, i) => {
    let d =
      this.state.data !== null
        ? moment(this.state.data, "YYYY-MM-DD").format("DD-MM-YYYY")
        : null;
    let newData = d !== null ? d : v.data;
    let newOra = this.state.ora || v.ora;
    let newDelega = this.state.delega || v.delega;
    let newRemoto = this.state.remoto || v.remoto;
    let newNote = this.state.note || v.note;
    let data = {
      visita: v,
      newOra: newOra,
      newData: newData,
      newDelega: newDelega,
      newRemoto: newRemoto,
      newNote: newNote,
    };

    v.ora = newOra;
    v.data = newData;
    v.delega = newDelega;
    v.remoto = newRemoto;
    v.note = newNote;

    this.props.editV(v, i);

    API.editVisita(v.mid, data)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.data);
    let d = moment(this.state.data, "YYYY-MM-DD").format("DD-MM-YYYY");

    let v = {
      mid: this.props.mid,
      pid: this.props.pid,
      data: d,
      ora: this.state.ora,
      delega: this.state.delega,
      fatto: "0",
      remoto: this.state.remoto,
      note: this.state.note,
    };

    this.props.addV(v);

    if (v.data !== "" && v.ora !== "") {
      this.closeModal();
      API.addVisita(v, this.props.pid)
        .then()
        .catch((errorObj) => console.error(errorObj));
    }
  };

  modalVisita = () => {
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
            Aggiungi una Visita
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Label>Data</Form.Label>
            <Form.Control
              name="data"
              type="date"
              placeholder="Data"
              value={this.state.data}
              onChange={this.handleChange}
              required
            />
            <Form.Label>Ora</Form.Label>
            <Form.Control
              name="ora"
              type="time"
              placeholder="Ora"
              required
              value={this.state.ora}
              onChange={this.handleChange}
            />

            <Form.Label>Delega</Form.Label>
            <Form.Control
              as="select"
              name="delega"
              value={this.state.delega}
              onChange={this.handleChange}
              required
            >
              <option value="0">No</option>
              <option value="1">Sì</option>
            </Form.Control>

            <Form.Label>Modalità</Form.Label>
            <Form.Control
              as="select"
              name="remoto"
              value={this.state.remoto}
              onChange={this.handleChange}
              required
            >
              <option value="0">In presenza</option>
              <option value="1">Remoto</option>
            </Form.Control>

            <Button className="form-submit-btn" variant="primary" type="submit">
              Conferma
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  modalNotes = () => {
    return (
      <Modal
        show={this.state.isOpenNotes}
        onHide={this.closeNotes}
        height="75vh"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Note della visita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="custom-row">
            <Col>
              <h6>{this.props.visite[this.state.indexNotes].note}</h6>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });
  openEdit = () => {
    this.setState({ isOpenEdit: true });
  };
  closeEdit = () => {
    this.setState({ isOpenEdit: false });
  };
  openNotes = () => {
    this.setState({ isOpenNotes: true });
  };
  closeNotes = () => {
    this.setState({ isOpenNotes: false });
  };

  componentWillReceiveProps = () => {
    this.props.visite.map((v) => {
      if (v.fatto === "1") {
        this.setState({ gesù: "1" });
      }
    });

    this.props.visite.map((v) => {
      if (v.fatto === "0") {
        this.setState({ giuseppe: "1" });
      }
    });
  };

  render() {
    return (
      <Jumbotron style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <h2>Visite</h2>
        <Button
          style={{ borderRadius: "50%" }}
          variant="outline-success"
          onClick={this.openModal}
        >
          <BsPlus style={{ marginBottom: "0.33rem" }} />
        </Button>
        <this.modalVisita />

        <Jumbotron style={{ padding: "2rem 2rem 1rem 2rem" }}>
          <Row className="custom-row">
            <Col>
              <h3>Da fare</h3>
              {this.state.giuseppe === "1" && (
                <Jumbotron className="jt-2">
                  <Table striped bordered hover>
                    <thead>
                      <th>Medico</th>
                      <th>Data</th>
                      <th>ora</th>
                      <th>Modalità</th>
                    </thead>
                    <tbody>
                      {this.props.visite.map(
                        (v, i) =>
                          v.fatto === "0" && (
                            <tr>
                              <td>{this.props.medicoVisita[i]}</td>
                              <td>{v.data}</td>
                              <td>{v.ora}</td>
                              {parseInt(v.remoto) === 1 ? (
                                <td>Remoto</td>
                              ) : (
                                <td>In presenza</td>
                              )}
                              <td>
                                <Button
                                  style={{ borderRadius: "50%" }}
                                  variant="outline-primary"
                                  onClick={() => {
                                    this.setState({
                                      index: i,
                                    });
                                    this.openEdit();
                                  }}
                                >
                                  <BsPencil
                                    style={{ marginBottom: "0.33rem" }}
                                  />
                                </Button>
                              </td>
                              <td>
                                <Button
                                  style={{ borderRadius: "50%" }}
                                  variant="outline-danger"
                                  onClick={() => this.deleteVisita(i)}
                                >
                                  <BsX style={{ marginBottom: "0.33rem" }} />
                                </Button>
                              </td>
                            </tr>
                          )
                      )}

                      <Modal
                        show={this.state.isOpenEdit}
                        onHide={this.closeEdit}
                        height="75vh"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-vcenter">
                            Modifica Visita
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Label>Data</Form.Label>
                            <Form.Control
                              name="data"
                              type="date"
                              placeholder="Data"
                              defaultValue={
                                this.props.visite[
                                  this.state.index
                                ].data.substring(6, 10) +
                                "-" +
                                this.props.visite[
                                  this.state.index
                                ].data.substring(3, 5) +
                                "-" +
                                this.props.visite[
                                  this.state.index
                                ].data.substring(0, 2)
                              }
                              onChange={this.handleChange}
                              required
                            />
                            <Form.Label>Ora</Form.Label>
                            <Form.Control
                              name="ora"
                              type="time"
                              placeholder="Ora"
                              required
                              defaultValue={
                                this.props.visite[this.state.index].ora
                              }
                              onChange={this.handleChange}
                            />
                            <Form.Label>Delega</Form.Label>
                            <Form.Control
                              as="select"
                              name="delega"
                              defaultValue={
                                this.props.visite[this.state.index].delega
                              }
                              onChange={this.handleChange}
                              required
                            >
                              <option value="0">No</option>
                              <option value="1">Sì</option>
                            </Form.Control>

                            <Form.Label>Modalità</Form.Label>
                            <Form.Control
                              as="select"
                              name="remoto"
                              defaultValue={
                                this.props.visite[this.state.index].remoto
                              }
                              onChange={this.handleChange}
                              required
                            >
                              <option value="0">In presenza</option>
                              <option value="1">Remoto</option>
                            </Form.Control>

                            <Button
                              variant="primary"
                              type="button"
                              onClick={() => {
                                this.modifyVisita(
                                  this.props.visite[this.state.index],
                                  this.state.index
                                );
                                this.closeEdit();
                              }}
                            >
                              Conferma
                            </Button>
                          </Form>
                        </Modal.Body>
                      </Modal>
                    </tbody>
                  </Table>
                </Jumbotron>
              )}
              {this.state.giuseppe === "0" && (
                <Alert variant="info" style={{ marginTop: "1rem" }}>
                  Non ci sono visite da fare
                </Alert>
              )}
            </Col>
          </Row>
          <Row className="custom-row">
            <Col>
              <h3>Già fatte</h3>
              {this.state.gesù === "1" && (
                <Jumbotron className="jt-2">
                  <Table striped bordered hover>
                    <thead>
                      <th>Medico</th>
                      <th>Data</th>
                      <th>Ora</th>
                      <th>Modalità</th>
                      <th>Note</th>
                    </thead>
                    <tbody>
                      {this.props.visite.map(
                        (v, i) =>
                          v.fatto === "1" && (
                            <tr>
                              <td>Dott. {this.props.medicoVisita[i]}</td>
                              <td>{v.data}</td>
                              <td>{v.ora}</td>
                              {parseInt(v.remoto) === 1 ? (
                                <td>Remoto</td>
                              ) : (
                                <td>In presenza</td>
                              )}
                              <td>
                                <Button
                                  style={{ borderRadius: "50%" }}
                                  variant="outline-primary"
                                  onClick={() => {
                                    this.setState({ indexNotes: i });
                                    this.openNotes();
                                  }}
                                >
                                  <CgNotes
                                    style={{ marginBottom: "0.33rem" }}
                                  />
                                </Button>
                              </td>
                            </tr>
                          )
                      )}
                      <this.modalNotes />
                    </tbody>
                  </Table>
                </Jumbotron>
              )}

              {this.state.gesù === "0" && (
                <Alert variant="info" style={{ marginTop: "1rem" }}>
                  Non ci visite fatte
                </Alert>
              )}
            </Col>
          </Row>
        </Jumbotron>
      </Jumbotron>
    );
  }
}

export default JumboVisite;
