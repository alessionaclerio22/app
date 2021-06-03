import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Image } from "cloudinary-react";
import "../App.css";
import { BsFillReplyFill, BsX } from "react-icons/bs";
import API from "../api/API_prova";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Row, Col, Jumbotron, Table, Modal } from "react-bootstrap";

import "./stylesheet.css";

class ListaUtenti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOspen: false,
      isOpenInf: false,
      isOpenMed: false,
      index: null,
    };
  }

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  deleteMedico = (i) => {
    let cura = { mid: this.props.mediciPaziente[i].mid, pid: this.props.id };
    API.deleteCura(cura)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  deletePaziente = (i) => {
    let cura = { pid: this.props.pazientiMedico[i].pid, mid: this.props.id };
    API.deleteCura(cura)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  deleteInf = (i) => {
    let milf = { iid: this.props.infermieriMedico[i].iid, mid: this.props.id };
    API.deleteMedicoInfermiere(milf)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });
  openModalInf = () => this.setState({ isOpenInf: true });
  closeModalInf = () => this.setState({ isOpenInf: false });
  openModalMed = () => this.setState({ isOpenMed: true });
  closeModalMed = () => this.setState({ isOpenMed: false });

  render() {
    return (
      <>
        {this.props.lista === "listamedici" &&
          this.props.pagina === "paginapaziente" && (
            <Tab.Container defaultActiveKey="#0">
              <Row>
                <Col sm={4}>
                  <ListGroup>
                    {this.props.mediciPaziente.map((m, i) => (
                      <ListGroup.Item action href={"#" + i}>
                        {m.nome} {m.cognome}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
                <Col sm={8}>
                  <Tab.Content>
                    {this.props.mediciPaziente.map((m, i) => (
                      <Tab.Pane eventKey={"#" + i}>
                        <Card style={{ width: "10rem" }}>
                          <ListGroup style={{ width: "40vh" }}>
                            <ListGroupItem>
                              <Image cloudName="dwkouowyh" publicId={m.foto} />
                            </ListGroupItem>
                            <ListGroupItem>
                              <b style={{ color: "grey" }}>Data di Nascita:</b>
                              <br />
                              {m.data_nascita}
                            </ListGroupItem>
                            <ListGroupItem>
                              <b style={{ color: "grey" }}>Telefono:</b>
                              <br />
                              {m.telefono}
                            </ListGroupItem>
                            <ListGroupItem>
                              <b style={{ color: "grey" }}>Sede Ambulatorio:</b>
                              <br />
                              {m.sede_ambulatorio}
                            </ListGroupItem>
                            <ListGroupItem>
                              <b style={{ color: "grey" }}>
                                Specializzazione:
                                <br />
                              </b>
                              {m.spec}
                            </ListGroupItem>
                            <ListGroupItem>
                              <b style={{ color: "grey" }}>Ordine</b>
                              <br /> {m.ordine}
                            </ListGroupItem>
                            <ListGroupItem>
                              <b style={{ color: "grey" }}>Numero</b>
                              <br />
                              dell'Ordine: {m.numero_ordine}
                            </ListGroupItem>
                            <ListGroupItem>
                              <Button
                                variant="outline-primary"
                                onClick={() => {
                                  this.openModalMed();
                                  this.setState({
                                    index: i,
                                  });
                                }}
                              >
                                Rimuovi medico
                              </Button>

                              <Modal
                                show={this.state.isOpenMed}
                                onHide={this.closeModalMed}
                                size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                              >
                                <Modal.Header closeButton>
                                  <Col sm="9">
                                    <Modal.Title id="contained-modal-title-vcenter">
                                      Sei sicuro di volere rimuovere il medico?
                                    </Modal.Title>
                                  </Col>
                                  <Col>
                                    <Button
                                      variant="primary"
                                      onClick={() => {
                                        this.deleteMedico(this.state.index);
                                        this.closeModalMed();
                                      }}
                                    >
                                      Conferma
                                    </Button>
                                  </Col>
                                </Modal.Header>
                              </Modal>
                            </ListGroupItem>
                          </ListGroup>
                        </Card>
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          )}

        {this.props.lista === "listapazienti" && (
          <Jumbotron className="jtrichieste" class="overflow-scroll">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Paziente</th>
                  <th>Accedi alla sua pagina</th>
                  <th>Rimuovi</th>
                </tr>
              </thead>
              <tbody>
                {this.props.pazientiMedico.map((p, i) => (
                  <tr>
                    <td>
                      {p.nome} {p.cognome}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        style={{ borderRadius: "50%" }}
                      >
                        <BsFillReplyFill style={{ marginBottom: "0.5vh" }} />
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        style={{ borderRadius: "50%" }}
                        onClick={() => {
                          this.openModal();
                          this.setState({ index: i });
                        }}
                      >
                        <BsX style={{ marginBottom: "0.5vh" }} />
                      </Button>
                      <Modal
                        show={this.state.isOpen}
                        onHide={this.closeModal}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Col sm="9">
                            <Modal.Title id="contained-modal-title-vcenter">
                              Sei sicuro di volere rimuovere il paziente?
                            </Modal.Title>
                          </Col>
                          <Col>
                            <Button
                              variant="primary"
                              onClick={() => {
                                this.deletePaziente(this.state.index);
                                this.closeModal();
                              }}
                            >
                              Conferma
                            </Button>
                          </Col>
                        </Modal.Header>
                      </Modal>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Jumbotron>
        )}

        {this.props.lista === "listainfermieri" &&
          this.props.pagina === "paginamedico" && (
            <Tab.Container defaultActiveKey="#0">
              <Row>
                <Col sm={4}>
                  <ListGroup>
                    {this.props.infermieriMedico.map((m, i) => (
                      <ListGroup.Item action href={"#" + i}>
                        {m.nome} {m.cognome}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
                <Col sm={8}>
                  <Tab.Content>
                    {this.props.infermieriMedico.map((m, i) => (
                      <Tab.Pane eventKey={"#" + i}>
                        <Card style={{ width: "10rem" }}>
                          <ListGroup style={{ width: "40vh" }}>
                            <ListGroupItem>
                              <Image cloudName="dwkouowyh" publicId={m.foto} />
                            </ListGroupItem>
                            <ListGroupItem>
                              <b style={{ color: "grey" }}>Data di Nascita:</b>
                              <br />
                              {m.data_nascita}
                            </ListGroupItem>
                            <ListGroupItem>
                              <b style={{ color: "grey" }}>Telefono: </b>
                              <br />
                              {m.telefono}
                            </ListGroupItem>
                            <ListGroupItem>
                              <b style={{ color: "grey" }}>Ordine: </b>
                              <br />
                              {m.ordine}
                            </ListGroupItem>
                            <ListGroupItem>
                              <b style={{ color: "grey" }}>
                                Numero dell'Ordine:
                              </b>
                              <br />
                              {m.numero_ordine}
                            </ListGroupItem>
                            <ListGroupItem>
                              <Button
                                variant="outline-primary"
                                onClick={() => {
                                  this.openModalInf();
                                  this.setState({ index: i });
                                }}
                              >
                                Rimuovi infermiere
                              </Button>

                              <Modal
                                show={this.state.isOpenInf}
                                onHide={this.closeModalInf}
                                size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                              >
                                <Modal.Header closeButton>
                                  <Col sm="9">
                                    <Modal.Title id="contained-modal-title-vcenter">
                                      Sei sicuro di volere rimuovere
                                      l'infermiere?
                                    </Modal.Title>
                                  </Col>
                                  <Col>
                                    <Button
                                      variant="primary"
                                      onClick={() => {
                                        this.deleteInf(this.state.index);
                                        this.closeModalInf();
                                      }}
                                    >
                                      Conferma
                                    </Button>
                                  </Col>
                                </Modal.Header>
                              </Modal>
                            </ListGroupItem>
                          </ListGroup>
                        </Card>
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          )}
      </>
    );
  }
}

export default ListaUtenti;
