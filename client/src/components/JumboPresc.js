import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import API from "../api/API_prova";
import { BsInfo, BsX, BsPlus } from "react-icons/bs";
import "../App.css";
import { Alert, Tabs, Tab } from "react-bootstrap";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

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
    isOpenDel: false,
    tipo: "0",
    nome: null,
    di: moment().format("YYYY-MM-DD"),
    df: moment().add(6, "days").format("YYYY-MM-DD"),
    freq: 1,
    qg: 1,
    note: null,
    prescId: null,
    aiuto: "0",
    vettOraFascia: Array(60).fill("0"),
    vettOra: Array(60).fill(null),
    vettInizioFascia: Array(60).fill(null),
    vettFineFascia: Array(60).fill(null),
    vettPrimaDopo: Array(60).fill("0"),
    vettPasti: Array(60).fill("0"),
    vettTabs: Array(60).fill("base"),
    presc: {},
    index: null,
    farmaci: [],
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
              <option value="1">Medicina</option>
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

            {this.state.tipo === "1" && (
              <>
                <Form.Label>Medicinale</Form.Label>
                <Autocomplete
                  name="nome"
                  value={this.state.nome}
                  onChange={(event, newValue) => {
                    this.setState({ nome: newValue });
                  }}
                  options={this.state.farmaci}
                  getOptionLabel={(option) => option.farm + "  " + option.conf}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" />
                  )}
                />
              </>
            )}

            <Form.Label>Data Inizio</Form.Label>
            <Form.Control
              name="di"
              value={this.state.di}
              defaultValue={moment().format("YYYY-MM-DD")}
              type="date"
              placeholder="gg/mm/aaaa"
              onChange={this.handleChange}
              required
            />
            <Form.Label>Data Fine</Form.Label>
            <Form.Control
              name="df"
              value={this.state.df}
              defaultValue={moment().add(6, "days").format("YYYY-MM-DD")}
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
              style={{ marginTop: "1vh" }}
              onClick={this.handleSubmit}
            >
              Conferma
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  modalPresc = () => {
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
            <tbody>
              <tr>
                <td>
                  <b>Data</b>
                </td>
                <td>{this.state.presc.data}</td>
              </tr>
              <tr>
                <td>
                  <b>Nome Medico</b>
                </td>
                <td>{this.props.mediciPrescrizioni[this.state.index]}</td>
              </tr>
              <tr>
                <td>
                  <b>Tipo</b>
                </td>
                {this.state.presc.farm_mis_n === "1" ? (
                  <td>Medicina</td>
                ) : (
                  <td>Misurazione</td>
                )}
              </tr>
              <tr>
                <td>
                  <b>Nome</b>
                </td>
                <td>{this.state.presc.nome}</td>
              </tr>
              <tr>
                <td>
                  <b>Data Inizio</b>
                </td>
                <td>{this.state.presc.data_inizio}</td>
              </tr>
              <tr>
                <td>
                  <b>Data Fine</b>
                </td>
                <td>{this.state.presc.data_fine}</td>
              </tr>
              <tr>
                <td>
                  <b>Ogni quanti giorni</b>
                </td>

                <td>{this.state.presc.frequenza}</td>
              </tr>
              <tr>
                <td>
                  <b>Quantità giornaliera</b>
                </td>
                <td>{this.state.presc.quantita_giorno}</td>
              </tr>
              <tr>
                <td>
                  <b>Note</b>
                </td>

                <td>{this.state.presc.note}</td>
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

  handlePrimaDopo = (event) => {
    let nuovo = this.state.vettPrimaDopo.slice();
    nuovo[event.target.name] = event.target.value;
    this.setState({ vettPrimaDopo: nuovo });
  };

  handleVettPasti = (event) => {
    let nuovo = this.state.vettPasti.slice();
    nuovo[event.target.name] = event.target.value;
    this.setState({ vettPasti: nuovo });
  };

  getOre = () => {
    let i = 0;
    let forms = [];
    while (i < this.state.qg) {
      forms.push(
        <Jumbotron style={{ marginTop: "1vh" }}>
          <Tabs
            defaultActiveKey="base"
            id={i + 1}
            onSelect={(key, event) => {
              let nuovo = this.state.vettTabs.slice();
              nuovo[parseInt(event.target.id.substring(0)) - 1] = key;
              this.setState({ vettTabs: nuovo });
            }}
          >
            <Tab eventKey="base" title="Base">
              <Row className="custom-row">
                <Col>
                  <Form.Control
                    as="select"
                    name={i}
                    value={this.state.vettPrimaDopo[i]}
                    onChange={this.handlePrimaDopo}
                    required
                    custom
                  >
                    <option value="0">Prima</option>
                    <option value="1">Dopo</option>
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    name={i}
                    value={this.state.vettPasti[i]}
                    onChange={this.handleVettPasti}
                    required
                    custom
                  >
                    <option value="0">Colazione</option>
                    <option value="1">Pranzo</option>
                    <option value="2">Cena</option>
                  </Form.Control>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="pro" title="Pro">
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
                  <Row className="custom-row">
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
            </Tab>
          </Tabs>
        </Jumbotron>
      );

      i++;
    }
    return forms;
  };

  returnInputs() {
    let vett = [];
    for (let i = 1; i < 60; i++) {
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
  openModalDel = () => this.setState({ isOpenDel: true });
  closeModalDel = () => this.setState({ isOpenDel: false });

  componentDidMount = () => {
    API.getFarmaci()
      .then((v) => {
        let farmaciVeri = [];
        let farmaciSenzaSpazi = [];
        let eq = 0;
        let conf;

        v.map((m) => {
          m.conf1 = m.conf.replace(/\s/g, "");
          farmaciSenzaSpazi.push(m);
        });
        for (let i = 0; i < v.length; i++) {
          for (let j = 0; j < farmaciVeri.length; j++) {
            if (
              farmaciSenzaSpazi[i].farm === farmaciVeri[j].farm &&
              farmaciSenzaSpazi[i].conf1 === farmaciVeri[j].conf1
            ) {
              eq = 1;
            }
          }
          if (eq === 0) {
            farmaciVeri.push(v[i]);
          }
          eq = 0;
        }
        this.setState({ farmaci: farmaciVeri });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.closeModalAdd();
    var now = moment().format("DD-MM-YYYY");

    let startDate = moment(this.state.di, "YYYY-MM-DD");

    let prescData = {
      data: now,
      pid: this.props.pid,
      mid: this.props.mid,
      nome: this.state.nome.farm + " " + this.state.nome.conf,
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
          this.props.addP(prescData, lastID);
          if (this.state.tipo === "0") {
            //MISURAZIONE
            let currentDate = startDate;
            while (currentDate.isSameOrBefore(this.state.df)) {
              for (let i = 0; i < this.state.qg; i++) {
                if (this.state.vettTabs[i] === "base") {
                  let fasciaOraria;
                  if (this.state.vettPrimaDopo[i] === "0") {
                    if (this.state.vettPasti[i] === "0") {
                      fasciaOraria = "04:00-07:00";
                    } else if (this.state.vettPasti[i] === "1") {
                      fasciaOraria = "10:00-12:00";
                    } else if (this.state.vettPasti[i] === "2") {
                      fasciaOraria = "17:00-19:00";
                    }
                  } else if (this.state.vettPrimaDopo[i] === "1") {
                    if (this.state.vettPasti[i] === "0") {
                      fasciaOraria = "07:00-10:00";
                    } else if (this.state.vettPasti[i] === "1") {
                      fasciaOraria = "13:00-15:00";
                    } else if (this.state.vettPasti[i] === "2") {
                      fasciaOraria = "20:00-22:30";
                    }
                  }
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
                    ora_fissata: null,
                    fascia_oraria: fasciaOraria,
                    ora_fascia_n: "0",
                  };
                  console.log(m);
                  API.addMisurazione(m, this.props.pid)
                    .then()
                    .catch((errorObj) => console.error(errorObj));
                } else if (this.state.vettTabs[i] === "pro") {
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
              }
              currentDate.add(this.state.freq, "days");
            }
          } else if (this.state.tipo === "1") {
            //MEDICINA
            let currentDate = startDate;
            console.log(this.state.vettTabs);
            console.log(this.state.vettPasti);
            console.log(this.state.vettPrimaDopo);
            while (currentDate.isSameOrBefore(this.state.df)) {
              for (let i = 0; i < this.state.qg; i++) {
                if (this.state.vettTabs[i] === "base") {
                  let fasciaOraria;
                  if (this.state.vettPrimaDopo[i] === "0") {
                    if (this.state.vettPasti[i] === "0") {
                      fasciaOraria = "04:00-07:00";
                    } else if (this.state.vettPasti[i] === "1") {
                      fasciaOraria = "10:00-12:00";
                    } else if (this.state.vettPasti[i] === "2") {
                      fasciaOraria = "17:00-19:00";
                    }
                  } else if (this.state.vettPrimaDopo[i] === "1") {
                    if (this.state.vettPasti === "0") {
                      fasciaOraria = "07:00-10:00";
                    } else if (this.state.vettPasti[i] === "1") {
                      fasciaOraria = "13:00-15:00";
                    } else if (this.state.vettPasti[i] === "2") {
                      fasciaOraria = "20:00-22:30";
                    }
                  }
                  let m = {
                    prescid: lastID,
                    pid: this.props.pid,
                    mid: this.props.mid,
                    data: currentDate.format("DD-MM-YYYY"),
                    tipo: this.state.nome,
                    note: this.state.note,
                    aiuto: this.state.aiuto,
                    ora_fissata: this.state.vettOra[i],
                    fascia_oraria: fasciaOraria,
                    ora_fascia_n: "0",
                    presa: "0",
                  };

                  API.addMedicina(m, this.props.pid)
                    .then()
                    .catch((errorObj) => console.error(errorObj));
                } else if (this.state.vettTabs[i] === "pro") {
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
      <Jumbotron style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        {this.props.tipo === "ConButton" && (
          <>
            <h2>Prescrizioni</h2>
            <Button
              style={{ borderRadius: "50%" }}
              variant="outline-success"
              onClick={this.openModalAdd}
            >
              <BsPlus style={{ marginBottom: "0.33rem" }} />
            </Button>
            <this.modalAddPresc />
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
                        onClick={() => {
                          this.setState({ index: i, presc: presc });
                          this.openModal();
                        }}
                      >
                        <BsInfo style={{ marginBottom: "0.5rem" }} />
                      </Button>
                    </td>
                    {this.props.tipo === "ConButton" && (
                      <td>
                        <Button
                          variant="outline-danger"
                          style={{ borderRadius: "50%" }}
                          onClick={() => {
                            this.setState({ index: i });
                            this.openModalDel();
                          }}
                        >
                          <BsX style={{ marginBottom: "0.5rem" }} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
                <this.modalPresc />
                <Modal
                  show={this.state.isOpenDel}
                  onHide={this.closeModalDel}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Col sm="9">
                      <Modal.Title id="contained-modal-title-vcenter">
                        Sei sicuro di volere rimuovere la prescrizione?
                      </Modal.Title>
                    </Col>
                    <Col>
                      <Button
                        variant="primary"
                        onClick={() => {
                          this.props.deleteP(this.state.index);
                          this.deletePresc(this.state.index);
                          this.closeModalDel();
                        }}
                      >
                        Conferma
                      </Button>
                    </Col>
                  </Modal.Header>
                </Modal>
              </tbody>
            </Table>
          </Jumbotron>
        )}

        {this.props.prescUtente.length === 0 && (
          <Alert variant="info" style={{ marginTop: "1rem" }}>
            Non ci sono prescrizioni
          </Alert>
        )}
      </Jumbotron>
    );
  }
}

export default JumboPresc;
