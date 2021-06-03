import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../App.css";
import { Image } from "cloudinary-react";
import ModalCard from "./ModalCard";
import Card from "react-bootstrap/Card";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import ListGroup from "react-bootstrap/ListGroup";
import { Col } from "react-bootstrap";

import "./stylesheet.css";

class CardDatiUtente extends React.Component {
  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.passw1 !== this.state.passw2) {
      this.setState({ showerror: true });
    }

    // inserire API
  };

  render() {
    return (
      <Col sm={2}>
        <>
          <Card style={{ width: "30vh", marginLeft: "1vh", marginTop: "1vh" }}>
            <Image cloudName="dwkouowyh" publicId={this.props.utente.foto} />
            <Card.Title style={{ marginTop: "3vh" }}>
              <b>
                {this.props.tipo === "medico" && <>Dott. </>}
                {this.props.utente && this.props.utente.nome}{" "}
                {this.props.utente && this.props.utente.cognome}
              </b>
            </Card.Title>
            <ListGroup className="list-group-flush">
              <ListGroupItem>
                <b style={{ color: "gray" }}>Data di Nascita:</b>
                <br />
                {this.props.utente && this.props.utente.data_nascita}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "gray" }}>Telefono:</b> <br />
                {this.props.utente && this.props.utente.telefono}
              </ListGroupItem>
              {this.props.tipo === "paziente" && (
                <>
                  <ListGroupItem>
                    <b style={{ color: "gray" }}>Codice Fiscale:</b>
                    <br />
                    {this.props.utente && this.props.utente.codice_fiscale}
                  </ListGroupItem>
                  <ListGroupItem>
                    <b style={{ color: "gray" }}>Tesserino Sanitario:</b>
                    <br />
                    {this.props.utente && this.props.utente.tesserino_sanitario}
                  </ListGroupItem>
                  <ListGroupItem>
                    <b style={{ color: "gray" }}>Indirizzo:</b>
                    <br />
                    {this.props.utente && this.props.utente.indirizzo}
                  </ListGroupItem>
                </>
              )}
              {this.props.tipo === "medico" && (
                <>
                  <ListGroupItem>
                    <b style={{ color: "gray" }}>Sede Ambulatorio:</b>
                    <br />
                    {this.props.utente && this.props.utente.sede_ambulatorio}
                  </ListGroupItem>
                  <ListGroupItem>
                    <b style={{ color: "gray" }}>Specializzazione:</b>
                    <br />
                    {this.props.utente && this.props.utente.spec}
                  </ListGroupItem>
                  <ListGroupItem>
                    <b style={{ color: "gray" }}>Ordine:</b>
                    <br />
                    {this.props.utente && this.props.utente.ordine}
                  </ListGroupItem>
                  <ListGroupItem>
                    <b style={{ color: "gray" }}>Numero dell'Ordine:</b>
                    <br />
                    {this.props.utente && this.props.utente.numero_ordine}
                  </ListGroupItem>
                </>
              )}
              {this.props.tipo === "infermiere" && (
                <>
                  <ListGroupItem>
                    <b style={{ color: "gray" }}>Ordine:</b>
                    <br />
                    {this.props.utente && this.props.utente.ordine}
                  </ListGroupItem>
                  <ListGroupItem>
                    <b style={{ color: "gray" }}>Numero dell'Ordine:</b>
                    <br />
                    {this.props.utente && this.props.utente.numero_ordine}
                  </ListGroupItem>
                </>
              )}
            </ListGroup>

            {this.props.pagina === "paginapaziente" &&
              this.props.tipo === "paziente" && (
                <Card.Body>
                  <ModalCard
                    tipo="paziente"
                    id={this.props.id}
                    utente={this.props.utente}
                  />
                </Card.Body>
              )}
            {this.props.pagina === "paginamedico" &&
              this.props.tipo === "medico" && (
                <Card.Body>
                  <ModalCard
                    tipo="medico"
                    id={this.props.id}
                    utente={this.props.utente}
                  />
                </Card.Body>
              )}
            {this.props.pagina === "paginainfermiere" &&
              this.props.tipo === "infermiere" && (
                <Card.Body>
                  <ModalCard
                    tipo="infermiere"
                    id={this.props.id}
                    utente={this.props.utente}
                  />
                </Card.Body>
              )}
          </Card>
        </>
      </Col>
    );
  }
}

export default CardDatiUtente;
