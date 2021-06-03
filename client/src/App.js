import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

import LoginForm from "./components/LoginForm";
import NavigationBar from "./components/NavigationBar";
import RegistraUtente from "./components/RegistraUtente";
import PaginaHome from "./components/PaginaHome";
import PazientePrescMis from "./components/PazientePrescMis";
import GestionePaziente from "./components/GestionePaziente";
import Calendario from "./components/Calendario";
import { Redirect, Route } from "react-router-dom";
import { Switch } from "react-router";
import { Container, Row, Col, Button, Jumbotron, Form } from "react-bootstrap";
import API from "./api/API_prova";
import { AuthContext } from "./auth/AuthContext";
import { withRouter } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: "0",
    };
  }

  /*componentDidMount() {
    //Check if the user is authenticated
    API.isAuthenticated()
      .then((user) => {
        this.setState({ authUser: user });
        this.props.history.push(`/teachers/${user.id}`);
      })
      .catch((err) => {
        this.setState({ authErr: err.errorObj });
      });
  }

  handleErrors = (err) => {
    if (err) {
      if (err.status && err.status === 401) {
        this.setState({ authErr: err.errorObj });
        this.props.history.push("/login");
      } else console.error(err);
    }
  };

  // Logout method
  logout = () => {
    API.userLogout().then(() => {
      this.setState({ authUser: null, authErr: null });
      this.props.history.push("/");
    });
  };

  // Login method
  login = (username, password) => {
    if (this.state.userType === "0") {
      API.pazienteLogin(username, password)
        .then((user) => {
          this.setState({ authUser: user, authErr: null });
          this.props.history.push(`/pazienti/${user.id}`);
        })
        .catch((errorObj) => {
          const err0 = errorObj.errors[0];
          this.setState({ authErr: err0 });
        });
    } else if (this.state.userType === "1") {
      API.medicoLogin(username, password)
        .then((user) => {
          this.setState({ authUser: user, authErr: null });
          this.props.history.push(`/medici/${user.id}`);
          console.log(user);
        })
        .catch((errorObj) => {
          const err0 = errorObj.errors[0];
          this.setState({ authErr: err0 });
        });
    } else if (this.state.userType === "2") {
      API.infermiereLogin(username, password)
        .then((user) => {
          this.setState({ authUser: user, authErr: null });
          this.props.history.push(`/infermieri/${user.id}`);
        })
        .catch((errorObj) => {
          const err0 = errorObj.errors[0];
          this.setState({ authErr: err0 });
        });
    }
  };*/

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  render() {
    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout,
    };

    return (
      <AuthContext.Provider value={value}>
        <div className="App">
          <NavigationBar tipo={this.state.userType} />
          <Container fluid className="root-container">
            <Switch style={{ padding: 0 }}>
              <Route exact path="/">
                <Row>
                  <Col>
                    <Jumbotron fluid className="signin-jumbo">
                      <Row>
                        <Col>
                          <h4>
                            Se non sei ancora in possesso di un account, clicca
                            uno dei bottoni sottostanti per registrarti alla
                            piattaforma
                          </h4>
                        </Col>
                      </Row>
                      <Row style={{ height: "10vh", margin: 40 }}>
                        <Col>
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={() =>
                              this.props.history.push("/signin/pazienti")
                            }
                          >
                            Registrati come paziente
                          </Button>
                        </Col>
                      </Row>
                      <Row style={{ height: "10vh", margin: -30 }}>
                        <Col>
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={() =>
                              this.props.history.push("/signin/medici")
                            }
                          >
                            Registrati come medico
                          </Button>
                        </Col>
                      </Row>
                      <Row style={{ height: "10vh", margin: 40 }}>
                        <Col>
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={() =>
                              this.props.history.push("/signin/infermieri")
                            }
                          >
                            Registrati come infermiere
                          </Button>
                        </Col>
                      </Row>
                    </Jumbotron>
                  </Col>
                  <Col>
                    <Jumbotron fluid className="signin-jumbo">
                      <Row>
                        <Col>
                          <h4>
                            Per accedere alla tua pagina personale, insersisci
                            la tua mail e password
                          </h4>
                        </Col>
                      </Row>
                      <Row style={{ height: "20vh", margin: 0 }}>
                        <Col sm={4}></Col>
                        <Col sm={4}>
                          <Form.Group>
                            <Form.Label style={{ marginTop: "5rem" }}>
                              Accedi come:
                            </Form.Label>
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
                          <LoginForm />
                        </Col>
                      </Row>
                    </Jumbotron>
                  </Col>
                </Row>
              </Route>
            </Switch>

            <Route
              exact
              path="/medici/:medico/pazienti/:paziente"
              render={({ match }) => {
                return (
                  <GestionePaziente
                    id={match.params.paziente}
                    mid={match.params.medico}
                  />
                );
              }}
            />

            <Route
              exact
              path="/pazienti/:paziente"
              render={({ match }) => {
                return (
                  <PaginaHome id={match.params.paziente} tipo="paziente" />
                );
              }}
            />

            <Route
              exact
              path="/pazienti/:paziente/prescmis"
              render={({ match }) => {
                return (
                  <PazientePrescMis id={match.params.paziente} tipo="home" />
                );
              }}
            />

            <Route
              exact
              path="/signin/pazienti"
              render={() => {
                return <RegistraUtente tipo="paziente" />;
              }}
            />

            <Route
              exact
              path="/signin/medici"
              render={() => {
                return <RegistraUtente tipo="medico" />;
              }}
            />

            <Route
              exact
              path="/signin/infermieri"
              render={() => {
                return <RegistraUtente tipo="infermiere" />;
              }}
            />

            <Route
              exact
              path="/medici/:medico"
              render={({ match }) => {
                return <PaginaHome id={match.params.medico} tipo="medico" />;
              }}
            />

            <Route
              exact
              path="/pazienti/:paziente/calendario"
              render={({ match }) => {
                return (
                  <Calendario id={match.params.paziente} tipo="paziente" />
                );
              }}
            />

            <Route
              exact
              path="/medici/:medico/calendario"
              render={({ match }) => {
                return <Calendario id={match.params.medico} tipo="medico" />;
              }}
            />

            <Route
              exact
              path="/infermieri/:infermiere/calendario"
              render={({ match }) => {
                return (
                  <Calendario id={match.params.infermiere} tipo="infermiere" />
                );
              }}
            />

            <Route
              exact
              path="/infermieri/:infermiere"
              render={({ match }) => {
                return (
                  <PaginaHome id={match.params.infermiere} tipo="infermiere" />
                );
              }}
            />
          </Container>
        </div>
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);
