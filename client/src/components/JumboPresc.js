import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import API from "../api/API_prova";
import { BsInfo, BsX, BsPlus } from "react-icons/bs";
import "../App.css";
import { Alert } from "react-bootstrap";

import {
  Modal,
  Table,
  Button,
  Jumbotron,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import "./stylesheet.css";

class JumboPresc extends React.Component {
  state = {
    isOpen: false,
    isOpenAdd: false,
    tipo: "0",
    nome: null,
    di: null,
    df: null,
    freq: null,
    qg: null,
    note: null,
    prescId: null,
    aiuto: "0",
    vettOraFascia: Array(60).fill("0"),
    vettOra: Array(60).fill(null),
    vettInizioFascia: Array(60).fill(null),
    vettFineFascia: Array(60).fill(null),
  };

  modalAddPresc = () => {
    return (
      <Modal
        show={this.state.isOpenAdd}
        onHide={this.closeModalAdd}
        height="75vh"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi una Prescrizione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              as="select"
              name="tipo"
              value={this.state.tipo}
              onChange={this.handleChange}
              required
            >
              <option value="0">Misurazione</option>
              <option value="1">Medicinale</option>
            </Form.Control>
            <Form.Label>Richiedi Assistenza</Form.Label>
            <Form.Control
              as="select"
              name="aiuto"
              value={this.state.aiuto}
              onChange={this.handleChange}
              required
            >
              <option value="0">No</option>
              <option value="1">Sì</option>
            </Form.Control>

            <Form.Label>Nome</Form.Label>
            <Form.Control
              name="nome"
              value={this.state.nome}
              type="text"
              placeholder="Nome"
              onChange={this.handleChange}
              required
            />
            <Form.Label>Data Inizio</Form.Label>
            <Form.Control
              name="di"
              value={this.state.di}
              type="date"
              placeholder="gg/mm/aaaa"
              onChange={this.handleChange}
              required
            />
            <Form.Label>Data Fine</Form.Label>
            <Form.Control
              name="df"
              value={this.state.df}
              type="date"
              placeholder="gg/mm/aaaa"
              onChange={this.handleChange}
              required
            />
            <Form.Label>Ogni quanti giorni</Form.Label>
            <Form.Control
              as="select"
              name="freq"
              value={this.state.freq}
              type="text"
              placeholder="frequenza"
              onChange={this.handleChange}
              required
            >
              {this.returnInputs()}
            </Form.Control>
            <Form.Label>Volte al giorno</Form.Label>
            <Form.Control
              as="select"
              name="qg"
              value={this.state.qg}
              type="text"
              placeholder="quantità al giorno"
              onChange={this.handleChange}
              required
            >
              {this.returnInputs()}
            </Form.Control>
            {this.getOre()}
            <Form.Label>Note</Form.Label>
            <Form.Control
              name="note"
              value={this.state.note}
              type="text"
              placeholder="note"
              onChange={this.handleChange}
              required
            />
            <Button
              variant="primary"
              type="submit"
              onClick={this.handleClick}
              style={{ marginTop: "1vh" }}
            >
              Conferma
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  modalPresc = (p, i) => {
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
            Info prescrizione
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Campo</th>
                <th>Valore</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Data</td>
                <td>{p.data}</td>
              </tr>
              <tr>
                <td>Nome Medico</td>
                <td>{this.props.mediciPrescrizioni[i]}</td>
              </tr>
              <tr>
                <td>Tipo</td>
                {p.farm_mis_n === 1 ? <td>farmaco</td> : <td>misurazione</td>}
              </tr>
              <tr>
                <td>Nome</td>
                <td>{p.nome}</td>
              </tr>
              <tr>
                <td>Data Inizio</td>
                <td>{p.data_inizio}</td>
              </tr>
              <tr>
                <td>Data Fine</td>
                <td>{p.data_fine}</td>
              </tr>
              <tr>
                <td>Ogni quanti giorni</td>

                <td>{p.frequenza}</td>
              </tr>
              <tr>
                <td>Quantità giornaliera</td>
                <td>{p.quantita_giorno}</td>
              </tr>
              <tr>
                <td>Note</td>

                <td>{p.note}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    );
  };

  handleOraFasciaVett = (event) => {
    let nuovo = this.state.vettOraFascia.slice();
    nuovo[event.target.name] = event.target.value;
    this.setState({ vettOraFascia: nuovo });
  };

  handleOraVett = (event) => {
    let nuovo = this.state.vettOra.slice();
    nuovo[event.target.name] = event.target.value;
    this.setState({ vettOra: nuovo });
  };

  handleInizioFasciaVett = (event) => {
    let nuovo = this.state.vettInizioFascia.slice();
    nuovo[event.target.name] = event.target.value;
    this.setState({ vettInizioFascia: nuovo });
  };

  handleFineFasciaVett = (event) => {
    let nuovo = this.state.vettFineFascia.slice();
    nuovo[event.target.name] = event.target.value;
    this.setState({ vettFineFascia: nuovo });
  };

  getOre = () => {
    let i = 0;
    let forms = [];
    while (i < this.state.qg) {
      forms.push(
        <Jumbotron style={{ marginTop: "1vh" }}>
          <Form.Control
            as="select"
            name={i}
            value={this.state.vettOraFascia[i]}
            onChange={this.handleOraFasciaVett}
            required
            custom
          >
            <option value="1">Ora</option>
            <option value="0">Fascia Oraria</option>
          </Form.Control>
          {this.state.vettOraFascia[i] === "1" && (
            <>
              <Form.Control
                type="time"
                placeholder="Ora"
                name={i}
                onChange={this.handleOraVett}
                required
                style={{ marginTop: "2vh" }}
              />
            </>
          )}
          {this.state.vettOraFascia[i] === "0" && (
            <>
              <Row>
                <Col>
                  <Form.Label>Ora Inizio</Form.Label>
                  <Form.Control
                    type="time"
                    placeholder="Ora Inizio"
                    name={i}
                    onChange={this.handleInizioFasciaVett}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>Ora Fine</Form.Label>
                  <Form.Control
                    type="time"
                    placeholder="Ora Fine"
                    name={i}
                    onChange={this.handleFineFasciaVett}
                    required
                  />
                </Col>
              </Row>
            </>
          )}
        </Jumbotron>
      );

      i++;
    }
    return forms;
  };

  returnInputs() {
    let vett = [];
    for (let i = 0; i < 60; i++) {
      vett.push(<option>{i}</option>);
    }

    return vett;
  }

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  deletePresc = (i) => {
    let presc = this.props.prescUtente[i];
    API.deletePrescrizione(presc)
      .then()
      .catch((errorObj) => {
        console.error(errorObj);
      });
  };

  openModalAdd = () => this.setState({ isOpenAdd: true });
  closeModalAdd = () => this.setState({ isOpenAdd: false });
  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  handleSubmit = (event) => {
    event.preventDefault();
    var now = moment().format("DD-MM-YYYY");

    let startDate = moment(this.state.di, "YYYY-MM-DD");

    let prescData = {
      data: now,
      pid: this.props.pid,
      mid: this.props.mid,
      nome: this.state.nome,
      frequenza: this.state.freq,
      data_inizio: this.state.di,
      data_fine: this.state.df,
      note: this.state.note,
      quantita_giorno: this.state.qg,
      farm_mis_n: this.state.tipo,
    };

    if (true) {
      this.closeModal();
      API.addPrescrizione(prescData, this.props.pid)
        .then((lastID) => {
          if (this.state.tipo === "0") {
            //MISURAZIONE
            let currentDate = startDate;
            while (currentDate.isSameOrBefore(this.state.df)) {
              for (let i = 0; i < this.state.qg; i++) {
                let m = {
                  prescid: lastID,
                  pid: this.props.pid,
                  mid: this.props.mid,
                  data_fissata: currentDate.format("DD-MM-YYYY"),
                  tipo: this.state.nome,
                  valore: null,
                  note: this.state.note,
                  timestamp_fatto: null,
                  aiuto: this.state.aiuto,
                  ora_fissata: this.state.vettOra[i],
                  fascia_oraria:
                    this.state.vettInizioFascia[i] +
                    "-" +
                    this.state.vettFineFascia[i],
                  ora_fascia_n: this.state.vettOraFascia[i],
                };

                API.addMisurazione(m, this.props.pid)
                  .then()
                  .catch((errorObj) => console.error(errorObj));
              }
              currentDate.add(this.state.freq, "days");
            }
          } else if (this.state.tipo === "1") {
            //MEDICINA
            let currentDate = startDate;
            while (currentDate.isSameOrBefore(this.state.df)) {
              for (let i = 0; i < this.state.qg; i++) {
                let m = {
                  prescid: lastID,
                  pid: this.props.pid,
                  mid: this.props.mid,
                  data: currentDate.format("DD-MM-YYYY"),
                  tipo: this.state.nome,
                  note: this.state.note,
                  aiuto: this.state.aiuto,
                  ora_fissata: this.state.vettOra[i],
                  fascia_oraria:
                    this.state.vettInizioFascia[i] +
                    "-" +
                    this.state.vettFineFascia[i],
                  ora_fascia_n: this.state.vettOraFascia[i],

                  presa: "0",
                };

                API.addMedicina(m, this.props.pid)
                  .then()
                  .catch((errorObj) => console.error(errorObj));
              }
              currentDate.add(this.state.freq, "days");
            }
          }
        })
        .catch((errorObj) => console.error(errorObj));
    }
    this.closeModalAdd();
  };

  render() {
    return (
      <Jumbotron style={{ marginTop: "5vh", marginBottom: "5vh" }}>
        {this.props.tipo === "ConButton" && (
          <>
            <Row>
              <Col></Col>
              <Col>
                <h2>Prescrizioni</h2>
              </Col>
              <Col>
                <Button
                  style={{ borderRadius: "50%" }}
                  variant="outline-success"
                  onClick={this.openModalAdd}
                >
                  <BsPlus style={{ marginBottom: "0.5vh" }} />
                </Button>
                <this.modalAddPresc />
              </Col>
            </Row>
          </>
        )}

        {this.props.tipo === "SenzaButton" && (
          <>
            <h2>Le mie Prescrizioni</h2>
          </>
        )}

        {this.props.prescUtente.length !== 0 && (
          <Jumbotron className="jt" class="overflow-scroll">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Medico</th>
                  <th>Data</th>
                  <th>Nome</th>
                  <th>Info</th>
                  {this.props.tipo === "ConButton" && <th>Rimuovi</th>}
                </tr>
              </thead>
              <tbody>
                {this.props.prescUtente.map((presc, i) => (
                  <tr>
                    <td>{this.props.mediciPrescrizioni[i]}</td>
                    <td>{presc.data}</td>
                    <td>{presc.nome}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        style={{ borderRadius: "50%" }}
                        onClick={this.openModal}
                      >
                        <BsInfo style={{ marginBottom: "0.5vh" }} />
                      </Button>

                      {this.modalPresc(presc, i)}
                    </td>
                    {this.props.tipo === "ConButton" && (
                      <td>
                        <Button
                          variant="outline-danger"
                          style={{ borderRadius: "50%" }}
                          onClick={() => this.deletePresc(i)}
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

        {this.props.prescUtente.length === 0 && (
          <Alert variant="info" style={{ marginTop: "6vh" }}>
            Non ci sono prescrizioni
          </Alert>
        )}
      </Jumbotron>
    );
  }
}

export default JumboPresc;
