import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../App.css";
import { AiOutlineLineChart, AiOutlineUnorderedList } from "react-icons/ai";

import { Modal, Table, Button, Jumbotron, Alert } from "react-bootstrap";
import Chart from "react-google-charts";
import API from "../api/API_prova";
import "./stylesheet.css";

class JumboMis extends React.Component {
  state = {
    isOpenMis: false,
    isOpenGraph: false,
    elencoMis: [],
    valoriMis: [],
    tipo: null,
  };

  modalMis = () => {
    return (
      <Modal
        show={this.state.isOpenMis}
        onHide={this.closeModalMis}
        height="75vh"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Elenco Misurazioni
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.elencoMis.length !== 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Valore</th>
                </tr>
              </thead>
              <tbody>
                {this.state.elencoMis.map((m) => (
                  <tr>
                    <td>{m.timestamp_fatto}</td>
                    <td>{m.valore}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {this.state.elencoMis.length === 0 && (
            <Alert variant="info" style={{ marginTop: "3vh" }}>
              Al momento c'è nessuna misurazione eseguita per il tipo
              selezionato
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    );
  };

  openModalMis = () => this.setState({ isOpenMis: true });
  closeModalMis = () => this.setState({ isOpenMis: false });
  openModalGraph = () => this.setState({ isOpenGraph: true });
  closeModalGraph = () => this.setState({ isOpenGraph: false });

  getElencoTipo = (pid, tipo) => {
    API.getMisurazioniByPazienteByTipo(pid, tipo)
      .then((vettMis) => {
        this.setState({ elencoMis: vettMis });
        let vett = [];
        vettMis.map((m) => {
          vett.push([
            new Date(
              m.timestamp_fatto.substring(6, 10),
              m.timestamp_fatto.substring(3, 5) - 1,
              m.timestamp_fatto.substring(0, 2),
              m.timestamp_fatto.substring(11, 13),
              m.timestamp_fatto.substring(14, 16)
            ),
            parseInt(m.valore),
          ]);
        });
        let vetSorted = vett.sort((a, b) => a[0] - b[0]);
        let finalVet = [];
        finalVet.push([{ type: "date", label: "Giorno" }, tipo]);

        for (let i = 0; i < vetSorted.length; i++) {
          finalVet.push(vetSorted[i]);
        }
        this.setState({ valoriMis: finalVet });
      })
      .catch((errorObj) => console.error(errorObj));
  };

  render() {
    return (
      <Jumbotron style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <h2>Misurazioni</h2>

        {this.props.tipiMis.length !== 0 && (
          <Jumbotron className="jt" class="overflow-scroll">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Elenco</th>
                  <th>Grafico</th>
                </tr>
              </thead>
              <tbody>
                {this.props.tipiMis.map((t) => (
                  <tr>
                    <td>{t.substring(1, t.length - 1)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        style={{ borderRadius: "50%" }}
                        onClick={() => {
                          this.openModalMis();
                          this.getElencoTipo(
                            this.props.pid,
                            t.substring(1, t.length - 1)
                          );
                        }}
                      >
                        <AiOutlineUnorderedList
                          style={{ marginBottom: "0.5rem" }}
                        />
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        style={{ borderRadius: "50%" }}
                        onClick={() => {
                          this.openModalGraph();
                          this.getElencoTipo(
                            this.props.pid,
                            t.substring(1, t.length - 1)
                          );
                          this.setState({ tipo: t });
                        }}
                      >
                        <AiOutlineLineChart style={{ marginBottom: "0.5rem" }} />
                      </Button>
                    </td>
                  </tr>
                ))}

                <this.modalMis />

                <Modal
                  show={this.state.isOpenGraph}
                  onHide={this.closeModalGraph}
                  height="75vh"
                  size="xl"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Grafico Misurazioni
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {this.state.elencoMis.length !== 0 && (
                      <Chart
                        width={"100%"}
                        height={"500"}
                        chartType="Line"
                        loader={<div>Loading Chart</div>}
                        data={this.state.valoriMis}
                        options={{
                          chart: {
                            title:
                              "Andamento nel tempo di " +
                              this.state.tipo.substring(
                                1,
                                this.state.tipo.length - 1
                              ),
                          },
                          width: 900,
                          height: 500,
                          series: {
                            // Gives each series an axis name that matches the Y-axis below.
                            0: { axis: "val" },
                          },
                          axes: {
                            // Adds labels to each axis; they don't have to match the axis names.
                            y: {
                              val: { label: "Valore" },
                            },
                          },
                        }}
                        rootProps={{ "data-testid": "4" }}
                      />
                    )}

                    {this.state.elencoMis.length === 0 && (
                      <Alert variant="info" style={{ marginTop: "1rem" }}>
                        Al momento c'è nessuna misurazione eseguita per il tipo
                        selezionato
                      </Alert>
                    )}
                  </Modal.Body>
                </Modal>
              </tbody>
            </Table>
          </Jumbotron>
        )}

        {this.props.tipiMis.length === 0 && (
          <Alert variant="info" style={{ marginTop: "1rem" }}>
            Non ci sono misurazioni effettuate
          </Alert>
        )}
      </Jumbotron>
    );
  }
}

export default JumboMis;
