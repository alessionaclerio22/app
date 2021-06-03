import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import API from "../api/API_prova";
class ModalCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      nome: "",
      cognome: "",
      data: "",
      mail: "",
      tel: "",
      cf: "",
      ts: "",
      indirizzo: "",
      sa: "",
      spec: "",
      ordine: "",
      numord: "",
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      nome: props.utente.nome,
      cognome: props.utente.cognome,
      data: props.utente.data_nascita,
      mail: props.utente.mail,
      tel: props.utente.telefono,
      cf: props.utente.codice_fiscale,
      ts: props.utente.tesserino_sanitario,
      indirizzo: props.utente.indirizzo,
      sa: props.utente.sede_ambulatorio,
      spec: props.utente.spec,
      ordine: props.utente.ordine,
      numord: props.utente.numero_ordine,
    });
  }

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  modifyUtente = (event) => {
    event.preventDefault();
    if (this.props.tipo === "paziente") {
      let p = {
        nome: this.state.nome,
        cognome: this.state.cognome,
        data_nascita: this.state.data,
        tesserino_sanitario: this.state.ts,
        codice_fiscale: this.state.cf,
        indirizzo: this.state.indirizzo,
        telefono: this.state.tel,
        mail: this.state.mail,
        pid: this.props.id,
      };
      API.editPaziente(p)
        .then()
        .catch((errorObj) => {
          console.error(errorObj);
        });
    } else if (this.props.tipo === "medico") {
      let m = {
        nome: this.state.nome,
        cognome: this.state.cognome,
        data_nascita: this.state.data,
        sede_ambulatorio: this.state.sa,
        specializzazione: this.state.spec,
        telefono: this.state.tel,
        mail: this.state.mail,
        ordine: this.state.ordine,
        numero_ordine: this.state.numord,
        mid: this.props.id,
      };
      API.editMedico(m)
        .then()
        .catch((errorObj) => {
          console.error(errorObj);
        });
    } else if (this.props.tipo === "infermiere") {
      let i = {
        nome: this.state.nome,
        cognome: this.state.cognome,
        telefono: this.state.tel,
        mail: this.state.mail,
        data_nascita: this.state.data,
        ordine: this.state.ordine,
        numero_ordine: this.state.numord,
        iid: this.props.id,
      };
      API.editInfermiere(i)
        .then()
        .catch((errorObj) => {
          console.error(errorObj);
        });
    }
    this.closeModal();
  };

  render() {
    return (
      <>
        <Button variant="outline-primary" onClick={this.openModal}>
          Modifica Dati
        </Button>
        <Modal show={this.state.isOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Modifica Dati Personali
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.modifyUtente}>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                name="nome"
                type="text"
                defaultValue={this.props.utente.nome}
                placeholder="Nome"
                onChange={this.handleChange}
              />
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                name="cognome"
                type="text"
                defaultValue={this.props.utente.cognome}
                placeholder="Cognome"
                onChange={this.handleChange}
              />
              <Form.Label>Data di Nascita</Form.Label>
              <Form.Control
                name="data"
                type="date"
                defaultValue={this.props.utente.data_nascita}
                placeholder="gg/mm/aaaa"
                onChange={this.handleChange}
              />
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                name="tel"
                type="text"
                defaultValue={this.props.utente.telefono}
                placeholder="1234567890"
                onChange={this.handleChange}
              />

              {this.props.tipo === "paziente" && (
                <>
                  <Form.Label>Tesserino Sanitario</Form.Label>
                  <Form.Control
                    name="ts"
                    type="text"
                    defaultValue={this.props.utente.tesserino_sanitario}
                    placeholder="Tesserino Sanitario"
                    onChange={this.handleChange}
                  />
                  <Form.Label>Codice Fiscale</Form.Label>
                  <Form.Control
                    name="cf"
                    type="text"
                    defaultValue={this.props.utente.codice_fiscale}
                    placeholder="Codice Fiscale"
                    onChange={this.handleChange}
                  />
                  <Form.Label>Indirizzo</Form.Label>
                  <Form.Control
                    name="indirizzo"
                    type="text"
                    defaultValue={this.props.utente.indirizzo}
                    placeholder="Indirizzo"
                    onChange={this.handleChange}
                  />
                </>
              )}
              {this.props.tipo === "medico" && (
                <>
                  <Form.Label>Sede Ambulatorio</Form.Label>
                  <Form.Control
                    name="sa"
                    type="text"
                    defaultValue={this.props.utente.sede_ambulatorio}
                    placeholder="Sede Ambulatorio"
                    onChange={this.handleChange}
                  />
                  <Form.Label>Specializzazione</Form.Label>
                  <Form.Control
                    name="spec"
                    type="text"
                    defaultValue={this.props.utente.spec}
                    placeholder="Specializzazione"
                    onChange={this.handleChange}
                  />
                  <Form.Label>Ordine</Form.Label>
                  <Form.Control
                    name="ordine"
                    type="text"
                    defaultValue={this.props.utente.ordine}
                    placeholder="Ordine"
                    onChange={this.handleChange}
                  />
                  <Form.Label>Numero dell'Ordine</Form.Label>
                  <Form.Control
                    name="numord"
                    type="text"
                    defaultValue={this.props.utente.numero_ordine}
                    placeholder="Numero dell'Ordine"
                    onChange={this.handleChange}
                  />
                </>
              )}
              {this.props.tipo === "infermiere" && (
                <>
                  <Form.Label>Ordine</Form.Label>
                  <Form.Control
                    name="ordine"
                    type="text"
                    defaultValue={this.props.utente.ordine}
                    placeholder="Ordine"
                    onChange={this.handleChange}
                  />
                  <Form.Label>Numero dell'Ordine</Form.Label>
                  <Form.Control
                    name="numord"
                    type="text"
                    defaultValue={this.props.utente.numero_ordine}
                    placeholder="Numero dell'Ordine"
                    onChange={this.handleChange}
                  />
                </>
              )}
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
      </>
    );
  }
}

export default ModalCard;
