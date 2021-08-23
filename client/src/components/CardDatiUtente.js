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
import { Button } from "bootstrap";

class CardDatiUtente extends React.Component {
  constructor(props) {
    super(props);
    ///this.changeUtente = this.changeUtente.bind(this);

    this.state = {
      utente: {},
    };
  }

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  changeUtente = (u) => {
    let d = u.data_nascita.slice(0, 10);

    u.data_nascita =
      d.substring(8, 10) + "/" + d.substring(5, 7) + "/" + d.substring(0, 4);
    this.setState({ utente: u });
  };

  componentWillReceiveProps = (n) => {
    if (this.state.utente !== n.utente) {
      this.setState({
        utente: n.utente,
      });
    }
  };

  render() {
    return (
      <Card style={{ marginLeft: "1rem", marginTop: "1rem" }}>
        <Image cloudName="dwkouowyh" publicId={this.props.utente.foto} />
        <Card.Title style={{ marginTop: "3rem" }}>
          <b>
            {this.props.tipo === "medico" && <>Dott. </>}
            {this.state.utente.nome} {this.state.utente.cognome}
          </b>
        </Card.Title>
        <ListGroup className="list-group-flush">
          <ListGroupItem>
            <b style={{ color: "gray" }}>Data di Nascita:</b>
            <br />
            {this.state.utente.data_nascita}
          </ListGroupItem>
          <ListGroupItem>
            <b style={{ color: "gray" }}>Telefono:</b> <br />
            {this.state.utente.telefono}
          </ListGroupItem>
          {this.props.tipo === "paziente" && (
            <>
              <ListGroupItem>
                <b style={{ color: "gray" }}>Codice Fiscale:</b>
                <br />
                {this.state.utente.codice_fiscale}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "gray" }}>Tesserino Sanitario:</b>
                <br />
                {this.state.utente.tesserino_sanitario}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "gray" }}>Indirizzo:</b>
                <br />
                {this.state.utente.indirizzo}
              </ListGroupItem>
            </>
          )}
          {this.props.tipo === "medico" && (
            <>
              <ListGroupItem>
                <b style={{ color: "gray" }}>Sede Ambulatorio:</b>
                <br />
                {this.state.utente.sede_ambulatorio}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "gray" }}>Specializzazione:</b>
                <br />
                {this.state.utente.spec}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "gray" }}>Ordine:</b>
                <br />
                {this.state.utente.ordine}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "gray" }}>Numero dell'Ordine:</b>
                <br />
                {this.state.utente.numero_ordine}
              </ListGroupItem>
            </>
          )}
          {this.props.tipo === "infermiere" && (
            <>
              <ListGroupItem>
                <b style={{ color: "gray" }}>Ordine:</b>
                <br />
                {this.state.utente.ordine}
              </ListGroupItem>
              <ListGroupItem>
                <b style={{ color: "gray" }}>Numero dell'Ordine:</b>
                <br />
                {this.state.utente.numero_ordine}
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
                utente={this.state.utente}
                changeUtente={this.changeUtente}
              />
            </Card.Body>
          )}
        {this.props.pagina === "paginamedico" && this.props.tipo === "medico" && (
          <Card.Body>
            <ModalCard
              tipo="medico"
              id={this.props.id}
              utente={this.state.utente}
              changeUtente={this.changeUtente}
            />
          </Card.Body>
        )}
        {this.props.pagina === "paginainfermiere" &&
          this.props.tipo === "infermiere" && (
            <Card.Body>
              <ModalCard
                tipo="infermiere"
                id={this.props.id}
                utente={this.state.utente}
                changeUtente={this.changeUtente}
              />
            </Card.Body>
          )}
      </Card>
    );
  }
}

export default CardDatiUtente;
