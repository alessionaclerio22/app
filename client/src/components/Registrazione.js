import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import API from "../api/API_prova";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Row, Col } from "react-bootstrap";
import "./stylesheet.css";
import Axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

class Registrazione extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comuni: [],
      idprov: false,
      showerror: false,
      cfError: false,
      tsError: false,
      nordError: false,
      numTelError: false,
      mailError: false,
      nome: "",
      cognome: "",
      data: "",
      mail: "",
      tel: "",
      cf: "",
      ts: "",
      foto: "",
      indirizzo: "",
      passw1: "",
      passw2: "",
      sa: "",
      spec: "",
      ordine: "Agrigento",
      nord: "",
      userType: "0",
      sameMail: false,
      viaViale: "0",
      via: "",
      comune: null,
      numCiv: "",
      viaViale1: "0",
      via1: "",
      comune1: null,
      numCiv1: "",
    };
  }

  componentDidMount = () => {
    API.getComuni()
      .then((v) => {
        this.setState({ comuni: v });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  getProv = () => {
    let v = [
      "Agrigento",
      "Alessandria",
      "Ancona",
      "Aosta",
      "L'Aquila",
      "Arezzo",
      "Ascoli-Piceno",
      "Asti",
      "Avellino",
      "Bari",
      "Barletta-Andria-Trani",
      "Belluno",
      "Benevento",
      "Bergamo",
      "Biella",
      "Bologna",
      "Bolzano",
      "Brescia",
      "Brindisi",
      "Cagliari",
      "Caltanissetta",
      "Campobasso",
      "CarboniaIglesias",
      "Caserta",
      "Catania",
      "Catanzaro",
      "Chieti",
      "Como",
      "Cosenza",
      "Cremona",
      "Crotone",
      "Cuneo",
      "Enna",
      "Fermo",
      "Ferrara",
      "Firenze",
      "Foggia",
      "Forli-Cesena",
      "Frosinone",
      "Genova",
      "Gorizia",
      "Grosseto",
      "Imperia",
      "Isernia",
      "La-Spezia",
      "Latina",
      "Lecce",
      "Lecco",
      "Livorno",
      "Lodi",
      "Lucca",
      "Macerata",
      "Mantova",
      "Massa-Carrara",
      "Matera",
      "MedioCampidano",
      "Messina",
      "Milano",
      "Modena",
      "Monza-Brianza",
      "Napoli",
      "Novara",
      "Nuoro",
      "Ogliastra",
      "OlbiaTempio",
      "Oristano",
      "Padova",
      "Palermo",
      "Parma",
      "Pavia",
      "Perugia",
      "Pesaro-Urbino",
      "Pescara",
      "Piacenza",
      "Pisa",
      "Pistoia",
      "Pordenone",
      "Potenza",
      "Prato",
      "Ragusa",
      "Ravenna",
      "Reggio-Calabria",
      "Reggio-Emilia",
      "Rieti",
      "Rimini",
      "Roma",
      "Rovigo",
      "Salerno",
      "Sassari",
      "Savona",
      "Siena",
      "Siracusa",
      "Sondrio",
      "Taranto",
      "Teramo",
      "Terni",
      "Torino",
      "Trapani",
      "Trento",
      "Treviso",
      "Trieste",
      "Udine",
      "Varese",
      "Venezia",
      "Verbania",
      "Vercelli",
      "Verona",
      "Vibo-Valentia",
      "Vicenza",
      "Viterbo",
    ];
    let vett = [];
    for (let i = 0; i < v.length; i++) {
      vett.push(<option>{v[i]}</option>);
    }

    return vett;
  };

  handleSubmit = (event) => {
    event.preventDefault();

    let regCodFisc = new RegExp(
      /([A-Z]){6}\d{2}([A-Z]){1}\d{2}([A-Z0-9]){4}([A-Z]){1}/
    );

    let regNumOrd = new RegExp(/([0-9])+/);

    let regTesSan = new RegExp(/([0-9]){20}/);

    let regNumTel = new RegExp(/([0-9]){10}/);

    let regMail = new RegExp(
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    );

    if (this.state.passw1 !== this.state.passw2) {
      this.setState({ showerror: true });
    } else if (!regCodFisc.test(this.state.cf)) {
      this.setState({ cfError: true });
    } else if (!regTesSan.test(this.state.ts)) {
      this.setState({ tsError: true });
    } else if (!regNumTel.test(this.state.tel)) {
      this.setState({ numTelError: true });
    } else if (!regMail.test(this.state.mail)) {
      this.setState({ mailError: true });
    } else if (!regNumOrd.test(this.state.nord)) {
      this.setState({ nordError: true });
    } else {
      // inserire API

      let k;
      if (this.state.viaViale === "0") {
        k = "Via ";
      } else {
        k = "Viale ";
      }

      let p = {
        nome: this.state.nome,
        cognome: this.state.cognome,
        data_nascita: this.state.data,
        tesserino_sanitario: this.state.ts,
        codice_fiscale: this.state.cf,
        indirizzo:
          k +
          this.state.via +
          " " +
          this.state.numCiv +
          ", " +
          this.state.comune.nome +
          " (" +
          this.state.comune.sigla +
          ")",
        telefono: this.state.tel,
        mail: this.state.mail,
        foto: this.state.foto,
        hash: this.state.passw1,
      };
      API.addPaziente(p)
        .then()
        .catch((errorObj) => {
          console.error(errorObj);
          this.setState({ sameMail: true });
        });

      if (this.state.userType === "1") {
        let j;
        if (this.state.viaViale1 === "0") {
          j = "Via ";
        } else {
          j = "Viale ";
        }

        let medico = {
          nome: this.state.nome,
          cognome: this.state.cognome,
          data_nascita: this.state.data,
          sede_ambulatorio:
            j +
            this.state.via1 +
            " " +
            this.state.numCiv1 +
            ", " +
            this.state.comune1.nome +
            " (" +
            this.state.comune1.sigla +
            ")",
          spec: this.state.spec,
          telefono: this.state.tel,
          mail: this.state.mail,
          foto: this.state.foto,
          ordine: this.state.ordine,
          numero_ordine: this.state.nord,
          hash: this.state.passw1,
        };

        API.addMedico(medico)
          .then()
          .catch((errorObj) => console.error(errorObj));
      } else if (this.state.userType === "2") {
        let i = {
          nome: this.state.nome,
          cognome: this.state.cognome,
          telefono: this.state.tel,
          mail: this.state.mail,
          foto: this.state.foto,
          data_nascita: this.state.data,
          ordine: this.state.ordine,
          numero_ordine: this.state.nord,
          password: this.state.passw1,
        };
        API.addInfermiere(i)
          .then()
          .catch((errorObj) => console.error(errorObj));
      }
    }
  };

  handleAlertClose = (event) => {
    this.setState({ showerror: false });
  };
  handleAlertCloseCF = (event) => {
    this.setState({ cfError: false });
  };
  handleAlertCloseTS = (event) => {
    this.setState({ tsError: false });
  };
  handleAlertCloseTel = (event) => {
    this.setState({ numTelError: false });
  };
  handleAlertCloseMail = (event) => {
    this.setState({ sameMail: false });
  };
  handleAlertCloseMailErr = (event) => {
    this.setState({ mailError: false });
  };
  handleAlertCloseNord = (event) => {
    this.setState({ nordError: false });
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  handleUploadImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "hjhioni8");

    Axios.post(
      "https://api.cloudinary.com/v1_1/dwkouowyh/image/upload/",
      formData
    ).then((res) => {
      console.log(res);
      this.setState({ foto: res.data.url });
    });
  };

  render() {
    return (
      <Row className="custom-row">
        <Col></Col>
        <Col>
          <h2>Compilare il seguente form con i propri dati personali</h2>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                name="nome"
                type="text"
                value={this.state.nome}
                placeholder="Nome"
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                name="cognome"
                type="text"
                value={this.state.cognome}
                placeholder="Cognome"
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Data di Nascita</Form.Label>
              <Form.Control
                name="data"
                type="date"
                value={this.state.data}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="mail"
                type="text"
                value={this.state.mail}
                placeholder="paziente@mail.com"
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Foto</Form.Label>
              <Form.File
                name="foto"
                type="file"
                onChange={(e) => this.handleUploadImage(e)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                name="tel"
                type="text"
                value={this.state.tel}
                placeholder="1234567890"
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Codice fiscale</Form.Label>
              <Form.Control
                name="cf"
                type="text"
                value={this.state.cf}
                placeholder="Codice Fiscale"
                onChange={this.handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Tesserino sanitario</Form.Label>
              <Form.Control
                name="ts"
                type="text"
                value={this.state.ts}
                placeholder="Tesserino Sanitario"
                onChange={this.handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Indirizzo</Form.Label>
              <Row className="custom-row">
                <Col sm={2}>
                  <Form.Control
                    as="select"
                    name="viaViale"
                    value={this.state.viaViale}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="0">Via</option>
                    <option value="1">Viale</option>
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Via/Viale"
                    name="via"
                    type="text"
                    value={this.state.via}
                    onChange={this.handleChange}
                    required
                  />
                </Col>
                <Col sm={2}>
                  <Form.Control
                    placeholder="Civico"
                    name="numCiv"
                    type="text"
                    value={this.state.numCiv}
                    onChange={this.handleChange}
                    required
                  />
                </Col>
              </Row>

              <Autocomplete
                name="comune"
                value={this.state.comune}
                onChange={(event, newValue) => {
                  this.setState({ comune: newValue });
                }}
                options={this.state.comuni}
                getOptionLabel={(option) =>
                  option.nome + " (" + option.sigla + ")"
                }
                renderInput={(params) => (
                  <TextField
                    style={{ marginTop: "2vh" }}
                    variant="outlined"
                    {...params}
                    label="Comune(Provincia)"
                  />
                )}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Registrati come:</Form.Label>
              <Form.Control
                as="select"
                name="userType"
                value={this.state.userType}
                onChange={this.handleChange}
              >
                <option value="0">Paziente</option>
                <option value="1">Medico</option>
                <option value="2">Infermiere</option>
              </Form.Control>
            </Form.Group>

            {this.state.userType === "1" && (
              <Form.Group>
                <Form.Label>Sede Ambulatorio</Form.Label>
                <Row className="custom-row">
                  <Col sm={2}>
                    <Form.Control
                      as="select"
                      name="viaViale1"
                      value={this.state.viaViale1}
                      onChange={this.handleChange}
                      required
                    >
                      <option value="0">Via</option>
                      <option value="1">Viale</option>
                    </Form.Control>
                  </Col>
                  <Col>
                    <Form.Control
                      placeholder="Via/Viale"
                      name="via1"
                      type="text"
                      value={this.state.via1}
                      onChange={this.handleChange}
                      required
                    />
                  </Col>
                  <Col sm={2}>
                    <Form.Control
                      placeholder="Civico"
                      name="numCiv1"
                      type="text"
                      value={this.state.numCiv1}
                      onChange={this.handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Autocomplete
                  name="comune"
                  value={this.state.comune1}
                  onChange={(event, newValue) => {
                    this.setState({ comune1: newValue });
                  }}
                  options={this.state.comuni}
                  getOptionLabel={(option) =>
                    option.nome + " (" + option.sigla + ")"
                  }
                  renderInput={(params) => (
                    <TextField
                      style={{ marginTop: "2vh" }}
                      variant="outlined"
                      {...params}
                      label="Comune(Provincia)"
                    />
                  )}
                />
                <Form.Label>Specializzazione</Form.Label>
                <Form.Control
                  name="spec"
                  type="text"
                  value={this.state.spec}
                  placeholder="Specializzazione"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Ordine dei medici di</Form.Label>
                <Form.Control
                  as="select"
                  name="ordine"
                  type="text"
                  value={this.state.ordine}
                  placeholder="Ordine"
                  onChange={this.handleChange}
                  required
                >
                  {this.getProv()}
                </Form.Control>
                <Form.Label>Numero dell'Ordine</Form.Label>
                <Form.Control
                  name="nord"
                  type="text"
                  value={this.state.nord}
                  placeholder="Numero dell'Ordine"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
            )}
            {this.state.userType === "2" && (
              <>
                <Form.Label>
                  Ordine delle professioni infermieristiche di
                </Form.Label>
                <Form.Control
                  as="select"
                  name="ordine"
                  type="text"
                  value={this.state.ordine}
                  placeholder="Ordine"
                  onChange={this.handleChange}
                  required
                >
                  {this.getProv()}
                </Form.Control>
                <Form.Label>Numero dell'Ordine</Form.Label>
                <Form.Control
                  name="nord"
                  type="text"
                  value={this.state.nord}
                  placeholder="Numero dell'Ordine"
                  onChange={this.handleChange}
                  required
                />
              </>
            )}

            <Form.Group>
              <h4>Inserire due volte la propria password:</h4>
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="passw1"
                type="password"
                value={this.state.passw1}
                placeholder="Password"
                onChange={this.handleChange}
                required
              />
              <Form.Label></Form.Label>
              <Form.Control
                name="passw2"
                type="password"
                value={this.state.passw2}
                placeholder="Password"
                onChange={this.handleChange}
                required
              />
            </Form.Group>

            <Button className="form-submit-btn" variant="primary" type="submit">
              Conferma
            </Button>
          </Form>

          {this.state.showerror && (
            <div className="student-alert-container">
              <Alert
                className="student-alert"
                variant="danger"
                onClose={this.handleAlertCloseTel}
                dismissible
              >
                <Alert.Heading>
                  Le due password inserite non coincidono
                </Alert.Heading>
              </Alert>
            </div>
          )}

          {this.state.cfError && (
            <div className="student-alert-container">
              <Alert
                className="student-alert"
                variant="danger"
                onClose={this.handleAlertCloseCF}
                dismissible
              >
                <Alert.Heading>
                  Il codice fiscale inserito non presenta il formato corretto
                </Alert.Heading>
              </Alert>
            </div>
          )}

          {this.state.tsError && (
            <div className="student-alert-container">
              <Alert
                className="student-alert"
                variant="danger"
                onClose={this.handleAlertCloseTS}
                dismissible
              >
                <Alert.Heading>
                  Il tesserino sanitario inserito non presenta il formato
                  corretto
                </Alert.Heading>
              </Alert>
            </div>
          )}

          {this.state.numTelError && (
            <div className="student-alert-container">
              <Alert
                className="student-alert"
                variant="danger"
                onClose={this.handleAlertCloseTel}
                dismissible
              >
                <Alert.Heading>
                  Il numero di telefono inserito non presenta il formato
                  corretto
                </Alert.Heading>
              </Alert>
            </div>
          )}

          {this.state.mailError && (
            <div className="student-alert-container">
              <Alert
                className="student-alert"
                variant="danger"
                onClose={this.handleAlertCloseMailErr}
                dismissible
              >
                <Alert.Heading>La mail inserita non è valida</Alert.Heading>
              </Alert>
            </div>
          )}

          {this.state.sameMail && (
            <div className="student-alert-container">
              <Alert
                className="student-alert"
                variant="danger"
                onClose={this.handleAlertCloseMail}
                dismissible
              >
                <Alert.Heading>
                  La mail inserita è già in uso in un altro account
                </Alert.Heading>
              </Alert>
            </div>
          )}

          {this.state.nordError && (
            <div className="student-alert-container">
              <Alert
                className="student-alert"
                variant="danger"
                onClose={this.handleAlertCloseNord}
                dismissible
              >
                <Alert.Heading>
                  Il campo "Numero ordine" deve essere numerico
                </Alert.Heading>
              </Alert>
            </div>
          )}
        </Col>
        <Col></Col>
      </Row>
    );
  }
}
export default Registrazione;
