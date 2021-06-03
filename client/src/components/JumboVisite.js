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
    delega: null,
    isOpenEdit: false,
    index: 0,
    gesù: "0",
    giuseppe: "0",
  };

  deleteVisita = (i) => {
    let vis = this.props.visite[i];
    API.deleteVisita(vis)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  modifyVisita = (v) => {
    let d =
      this.state.data !== null
        ? moment(this.state.data, "YYYY-MM-DD").format("DD-MM-YYYY")
        : null;
    let newData = d !== null ? d : v.data;
    let newOra = this.state.ora || v.ora;
    let newDelega = this.state.delega || v.delega;
    let data = {
      visita: v,
      newOra: newOra,
      newData: newData,
      newDelega: newDelega,
    };
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
    };

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
  openEdit = () => {
    this.setState({ isOpenEdit: true });
    console.log(this.props.visite);
  };
  closeEdit = () => {
    this.setState({ isOpenEdit: false });
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
      <Jumbotron style={{ marginTop: "5vh", marginBottom: "5vh" }}>
        <Row>
          <Col></Col>
          <Col>
            <h2>Visite</h2>
          </Col>
          <Col>
            <Button
              style={{ borderRadius: "50%" }}
              variant="outline-success"
              onClick={this.openModal}
            >
              <BsPlus style={{ marginBottom: "0.5vh" }} />
            </Button>
            <this.modalVisita />
          </Col>
        </Row>

        <Jumbotron>
          <Row>
            <Col>
              <h3>Da fare</h3>
              {this.state.giuseppe === "1" && (
                <Jumbotron className="jt-2">
                  <ListGroup>
                    {this.props.visite.map(
                      (v, i) =>
                        v.fatto === "0" && (
                          <>
                            <ListGroup.Item>
                              <Row>
                                <Col>
                                  Dott. {this.props.medicoVisita[i]} - {v.data}{" "}
                                  - {v.ora}
                                </Col>

                                <Col>
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
                                      style={{ marginBottom: "0.5vh" }}
                                    />
                                  </Button>

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
                                      <Form
                                        onSubmit={() => {
                                          this.modifyVisita(
                                            this.props.visite[this.state.index]
                                          );
                                          this.closeEdit();
                                        }}
                                      >
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
                                            this.props.visite[this.state.index]
                                              .ora
                                          }
                                          onChange={this.handleChange}
                                        />
                                        <Form.Label>Delega</Form.Label>
                                        <Form.Control
                                          as="select"
                                          name="delega"
                                          defaultValue={
                                            this.props.visite[this.state.index]
                                              .delega
                                          }
                                          onChange={this.handleChange}
                                          required
                                        >
                                          <option value="0">No</option>
                                          <option value="1">Sì</option>
                                        </Form.Control>
                                        <Button
                                          className="form-submit-btn"
                                          variant="primary"
                                          type="submit"
                                        >
                                          Conferma
                                        </Button>
                                      </Form>
                                    </Modal.Body>
                                  </Modal>
                                </Col>
                                <Col>
                                  <Button
                                    style={{ borderRadius: "50%" }}
                                    variant="outline-danger"
                                    onClick={() => this.deleteVisita(i)}
                                  >
                                    <BsX style={{ marginBottom: "0.5vh" }} />
                                  </Button>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </>
                        )
                    )}
                  </ListGroup>
                </Jumbotron>
              )}

              {this.state.giuseppe === "0" && (
                <Alert variant="info" style={{ marginTop: "6vh" }}>
                  Non ci sono visite da fare
                </Alert>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Già fatte</h3>
              {this.state.gesù === "1" && (
                <Jumbotron className="jt-2">
                  <ListGroup>
                    {this.props.visite.map(
                      (v, i) =>
                        v.fatto === "1" && (
                          <>
                            <ListGroup.Item>
                              Dott. {this.props.medicoVisita[i]} - {v.data} -{" "}
                              {v.ora}
                            </ListGroup.Item>
                          </>
                        )
                    )}
                  </ListGroup>
                </Jumbotron>
              )}

              {this.state.gesù === "0" && (
                <Alert variant="info" style={{ marginTop: "6vh" }}>
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
