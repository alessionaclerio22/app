import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import API from "../api/API_prova";
import { Redirect, Route } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Row, Col } from "react-bootstrap";
import "./stylesheet.css";
import Axios from "axios";

class RegistraUtente extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idprov: false,
      showerror: false,
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
      ordine: "",
      nord: "",
    };
  }

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    if (this.state.passw1 !== this.state.passw2) {
      this.setState({ showerror: true });
    } else {
      // inserire API
      if (this.props.tipo === "medico") {
        let m = {
          nome: this.state.nome,
          cognome: this.state.cognome,
          data_nascita: this.state.data,
          sede_ambulatorio: this.state.sa,
          specializzazione: this.state.spec,
          telefono: this.state.tel,
          mail: this.state.mail,
          foto: this.state.foto,
          ordine: this.state.ordine,
          numero_ordine: this.state.nord,
          hash: this.state.passw1,
        };
        API.addMedico(m)
          .then()
          .catch((errorObj) => console.error(errorObj));
      } else if (this.props.tipo === "paziente") {
        let p = {
          nome: this.state.nome,
          cognome: this.state.cognome,
          data_nascita: this.state.data,
          tesserino_sanitario: this.state.ts,
          codice_fiscale: this.state.cf,
          indirizzo: this.state.indirizzo,
          telefono: this.state.tel,
          mail: this.state.mail,
          foto: this.state.foto,
          hash: this.state.passw1,
        };
        API.addPaziente(p)
          .then()
          .catch((errorObj) => console.error(errorObj));
      } else if (this.props.tipo === "infermiere") {
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

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  handleUploadImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "hjhioni8");

    Axios.post(
      "https://api.cloudinary.com/v1_1/dwkouowyh/image/upload",
      formData
    ).then((res) => {
      console.log(res);
      this.setState({ foto: res.data.url });
    });
  };

  render() {
    return (
      <Row>
        <Col
          style={{ marginRight: "70vh", marginLeft: "70vh", marginTop: "2vh" }}
        >
          {this.props.tipo === "paziente" && (
            <>
              <h2>Compilare il seguente form con i propri dati personali</h2>
              <Form onSubmit={this.handleSubmit}>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  name="nome"
                  type="text"
                  value={this.state.nome}
                  placeholder="Nome"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  name="cognome"
                  type="text"
                  value={this.state.cognome}
                  placeholder="Cognome"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Data di Nascita</Form.Label>
                <Form.Control
                  name="data"
                  type="date"
                  value={this.state.data}
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>email</Form.Label>
                <Form.Control
                  name="mail"
                  type="text"
                  value={this.state.mail}
                  placeholder="paziente@mail.com"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Foto</Form.Label>
                <Form.File
                  name="foto"
                  type="file"
                  onChange={(e) => this.handleUploadImage(e)}
                  required
                />
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  name="tel"
                  type="text"
                  value={this.state.tel}
                  placeholder="1234567890"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Codice Fiscale</Form.Label>
                <Form.Control
                  name="cf"
                  type="text"
                  value={this.state.cf}
                  placeholder="Codice Fiscale"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Tesserino Sanitario</Form.Label>
                <Form.Control
                  name="ts"
                  type="text"
                  value={this.state.ts}
                  placeholder="Tesserino Sanitario"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Indirizzo</Form.Label>
                <Form.Control
                  name="indirizzo"
                  type="text"
                  value={this.state.indirizzo}
                  placeholder="Città(Provincia), Via, Numero Civico"
                  onChange={this.handleChange}
                  required
                />
                <h4 style={{ marginTop: "2vh", marginBottom: "2vh" }}>
                  Inserire due volte la propria password:
                </h4>
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
                <Button
                  className="form-submit-btn"
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </>
          )}

          {this.props.tipo === "medico" && (
            <>
              <h2>Compilare il seguente form con i propri dati personali</h2>
              <Form onSubmit={this.handleSubmit}>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  name="nome"
                  type="text"
                  value={this.state.nome}
                  placeholder="Nome"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  name="cognome"
                  type="text"
                  value={this.state.cognome}
                  placeholder="Cognome"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Data di Nascita</Form.Label>
                <Form.Control
                  name="data"
                  type="date"
                  value={this.state.data}
                  placeholder="gg/mm/aaaa"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>email</Form.Label>
                <Form.Control
                  name="mail"
                  type="text"
                  value={this.state.mail}
                  placeholder="paziente@mail.com"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Foto</Form.Label>
                <Form.File
                  name="foto"
                  type="file"
                  onChange={(e) => this.handleUploadImage(e)}
                  required
                />
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  name="tel"
                  type="text"
                  value={this.state.tel}
                  placeholder="1234567890"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Sede Ambulatorio</Form.Label>
                <Form.Control
                  name="sa"
                  type="text"
                  value={this.state.sa}
                  placeholder="Città(Provincia), Via, Numero Civico"
                  onChange={this.handleChange}
                  required
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
                <Form.Label>Ordine</Form.Label>
                <Form.Control
                  name="ordine"
                  type="text"
                  value={this.state.ordine}
                  placeholder="Ordine"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Numero dell'Ordine</Form.Label>
                <Form.Control
                  name="nord"
                  type="text"
                  value={this.state.nord}
                  placeholder="Numero dell'Ordine"
                  onChange={this.handleChange}
                  required
                />
                <h4 style={{ marginTop: "2vh", marginBottom: "2vh" }}>
                  Inserire due volte la propria password:
                </h4>
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
                <Button
                  className="form-submit-btn"
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </>
          )}

          {this.props.tipo === "infermiere" && (
            <>
              <h2>Compilare il seguente form con i propri dati personali</h2>
              <Form onSubmit={this.handleSubmit}>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  name="nome"
                  type="text"
                  value={this.state.nome}
                  placeholder="Nome"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  name="cognome"
                  type="text"
                  value={this.state.cognome}
                  placeholder="Cognome"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Data di Nascita</Form.Label>
                <Form.Control
                  name="data"
                  type="date"
                  value={this.state.data}
                  placeholder="gg/mm/aaaa"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Foto</Form.Label>
                <Form.File
                  name="foto"
                  type="file"
                  onChange={(e) => this.handleUploadImage(e)}
                  required
                />
                <Form.Label>email</Form.Label>
                <Form.Control
                  name="mail"
                  type="text"
                  value={this.state.mail}
                  placeholder="paziente@mail.com"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  name="tel"
                  type="text"
                  value={this.state.tel}
                  placeholder="1234567890"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Ordine</Form.Label>
                <Form.Control
                  name="ordine"
                  type="text"
                  value={this.state.ordine}
                  placeholder="Ordine"
                  onChange={this.handleChange}
                  required
                />
                <Form.Label>Numero dell'Ordine</Form.Label>
                <Form.Control
                  name="nord"
                  type="text"
                  value={this.state.nord}
                  placeholder="Numero dell'Ordine"
                  onChange={this.handleChange}
                  required
                />
                <h4 style={{ marginTop: "2vh", marginBottom: "2vh" }}>
                  Inserire due volte la propria password:
                </h4>
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
                <Button
                  className="form-submit-btn"
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </>
          )}

          {this.state.showerror && (
            <div className="student-alert-container">
              <Alert
                className="student-alert"
                variant="danger"
                onClose={this.handleAlertClose}
                dismissible
              >
                <Alert.Heading>
                  Le due password inserite non coincidono
                </Alert.Heading>
              </Alert>
            </div>
          )}
        </Col>
      </Row>
    );
  }
}
export default RegistraUtente;
