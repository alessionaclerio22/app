import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

import LoginForm from "./components/LoginForm";
import NavigationBar from "./components/NavigationBar";
import Registrazione from "./components/Registrazione";
import PaginaHome from "./components/PaginaHome";
import PazientePrescMis from "./components/PazientePrescMis";
import GestionePaziente from "./components/GestionePaziente";
import Calendario from "./components/Calendario";
import { Redirect, Route } from "react-router-dom";
import { Switch } from "react-router";
import {
  Container,
  Row,
  Col,
  Button,
  Jumbotron,
  Form,
  Modal,
} from "react-bootstrap";
import API from "./api/API_prova";
import { AuthContext } from "./auth/AuthContext";
import { withRouter } from "react-router-dom";
import JitsiComponent from "./components/Jitsi";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: "0",
      isPazFound: false,
      isMedFound: false,
      isInfFound: false,
      pazID: null,
      infID: null,
      medID: null,
      isOpen: false,
      mail: "",
      passw: "",
    };
  }

  componentDidMount() {
    //Check if the user is authenticated
    let a = this.props.history.location.pathname;

    let t = a.substring(1);
    t = t.substr(0, t.indexOf("/"));

    a = a.substring(1);
    a = a.substring(a.indexOf("/"));
    a = a.substring(1);
    if (a.indexOf("/") !== -1) {
      a = a.substr(0, a.indexOf("/"));
    }
    a = parseInt(a);

    console.log(a);
    console.log(t);

    /*if (t === "medici") {
      API.isAuthenticated("1")
        .then((user) => {
          this.setState({ authUser: user, userType: "1" });
        })
        .catch();
    } else if (t === "pazienti") {
      API.isAuthenticated("0")
        .then((user) => {
          this.setState({ authUser: user, userType: "0" });
        })
        .catch();
    } else if (t === "infermieri") {
      API.isAuthenticated("2")
        .then((user) => {
          this.setState({ authUser: user, userType: "2" });
        })
        .catch();
    }
    API.isAuthenticated()
      .then((user) => {
        console.log(user.id);
        if (user.tipo === "1") {
          if (user.id === a && t === "medici") {
            this.setState({ authUser: user, userType: "1" });
            //this.props.history.push(`/medici/${user.id}`);
          }
        } else if (user.tipo === "0") {
          if (user.id === a && t === "pazienti") {
            this.setState({ authUser: user, userType: "0" });
            //this.props.history.push(`/pazienti/${user.id}`);
          }
        } else if (user.tipo === "2") {
          if (user.id === a && t === "infermieri") {
            this.setState({ authUser: user, userType: "2" });
            //this.props.history.push(`/infermieri/${user.id}`);
          }
        }
      })
      .catch((err) => {
        this.setState({ authErr: err.errorObj });
      });*/

    API.isAuthenticated()
      .then((user) => {
        let auth;
        if (user.tipo === "0") {
          if (a === user.id && t === "pazienti") {
            auth = true;
            this.setState({ userType: "0", authUser: user });
            this.props.history.push(this.props.history.location.pathname);
          } else {
            this.props.history.push("/");
          }
        } else if (user.tipo === "1") {
          if (a === user.id && t === "medici") {
            auth = true;
            this.setState({ userType: "1", authUser: user });
            this.props.history.push(this.props.history.location.pathname);
          } else {
            this.props.history.push("/");
          }
        } else if (user.tipo === "2") {
          if (a === user.id && t === "infermieri") {
            auth = true;
            this.setState({ userType: "2", authUser: user });
            this.props.history.push(this.props.history.location.pathname);
          } else {
            this.props.history.push("/");
          }
        }

        if (this.props.history.location.pathname === "/") {
          if (user.tipo === "0") {
            this.props.history.push(`/pazienti/${user.id}`);
          } else if (user.tipo === "1") {
            this.props.history.push(`/medici/${user.id}`);
          } else if (user.tipo === "2") {
            this.props.history.push(`/infermieri/${user.id}`);
          }
        }
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

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  modalUser = () => {
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
            Come vuoi entrare
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.isPazFound === true &&
            this.state.isMedFound === true &&
            this.state.isInfFound === false && (
              <Form onSubmit={this.handleSubmit}>
                <Form.Label>Fai il login come:</Form.Label>
                <Form.Control
                  as="select"
                  name="userType"
                  value={this.state.userType}
                  onChange={this.handleChange}
                  required
                >
                  <option value="0">Paziente</option>
                  <option value="1">Medico</option>
                </Form.Control>
                <Button
                  className="form-submit-btn"
                  variant="primary"
                  type="submit"
                >
                  Conferma
                </Button>
              </Form>
            )}
          {this.state.isPazFound === true &&
            this.state.isMedFound === false &&
            this.state.isInfFound === true && (
              <Form onSubmit={this.handleSubmit}>
                <Form.Label>Fai il login come:</Form.Label>
                <Form.Control
                  as="select"
                  name="userType"
                  value={this.state.userType}
                  onChange={this.handleChange}
                  required
                >
                  <option value="0">Paziente</option>
                  <option value="2">Infermiere</option>
                </Form.Control>
                <Button
                  className="form-submit-btn"
                  variant="primary"
                  type="submit"
                >
                  Conferma
                </Button>
              </Form>
            )}
        </Modal.Body>
      </Modal>
    );
  };

  // Login method
  login = (username, password) => {
    this.setState({ passw: password, mail: username });
    console.log(username);
    API.isPazPresent(username)
      .then((user) => {
        if (user.found === "1") {
          this.setState({ isPazFound: true, pazID: user.id });
        } else {
          this.setState({ isPazFound: false });
        }

        API.isMedPresent(username)
          .then((user) => {
            if (user.found === "1") {
              this.setState({ isMedFound: true, medID: user.id });
            } else {
              this.setState({ isMedFound: false });
            }

            API.isInfPresent(username)
              .then((user) => {
                if (user.found === "1") {
                  this.setState({ isInfFound: true, infID: user.id });
                } else {
                  this.setState({ isInfFound: false });
                }

                if (
                  this.state.isPazFound === true &&
                  this.state.isMedFound === false &&
                  this.state.isInfFound === false
                ) {
                  API.pazienteLogin(username, password)
                    .then((paz) => {
                      console.log(paz);
                      this.setState({
                        authUser: paz.user,
                        authErr: null,
                        userType: "0",
                      });
                      this.props.history.push(`/pazienti/${paz.id}`);
                    })
                    .catch((errorObj) => {
                      const err0 = errorObj.errors[0];
                      this.setState({ authErr: err0 });
                    });
                } else if (
                  this.state.isPazFound === true &&
                  this.state.isMedFound === true &&
                  this.state.isInfFound === false
                ) {
                  this.openModal();
                } else if (
                  this.state.isPazFound === true &&
                  this.state.isMedFound === false &&
                  this.state.isInfFound === true
                ) {
                  this.openModal();
                }
              })

              .catch(() => {});
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  handleChange = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  updateField = (name, value) => {
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    this.setState({ isOpen: false });

    if (this.state.userType === "0") {
      API.pazienteLogin(this.state.mail, this.state.passw)
        .then((paz) => {
          this.setState({
            authUser: paz.user,
            authErr: null,
          });
        })
        .catch((errorObj) => {
          const err0 = errorObj.errors[0];
          this.setState({ authErr: err0 });
        });
    } else if (this.state.userType === "1") {
      API.medicoLogin(this.state.mail, this.state.passw)
        .then((m) => {
          this.setState({
            authUser: m.user,
            authErr: null,
          });
        })
        .catch((errorObj) => {
          const err0 = errorObj.errors[0];
          this.setState({ authErr: err0 });
        });
    } else if (this.state.userType === "2") {
      API.infermiereLogin(this.state.mail, this.state.passw)
        .then((i) => {
          this.setState({
            authUser: i.user,
            authErr: null,
          });
        })
        .catch((errorObj) => {
          const err0 = errorObj.errors[0];
          this.setState({ authErr: err0 });
        });
    }

    if (this.state.userType === "0") {
      this.props.history.push(`/pazienti/${this.state.pazID}`);
    } else if (this.state.userType === "1") {
      this.props.history.push(`/medici/${this.state.medID}`);
    } else if (this.state.userType === "2") {
      this.props.history.push(`/infermieri/${this.state.infID}`);
    }
  };

  render() {
    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout,
      tipo: this.state.userType,
    };

    {
      console.log(value);
    }

    return (
      <AuthContext.Provider value={value}>
        <div className="App">
          <Container fluid className="root-container">
            <Switch style={{ padding: 0 }}>
              <Route exact path="/">
                <this.modalUser />
                <Row className="custom-row">
                  <Col></Col>
                  <Col>
                    <Jumbotron
                      fluid
                      className="signin-jumbo"
                      style={{ marginTop: "2vh" }}
                    >
                      <h4>
                        Inserisci le tue credenziali per accedere alla tua
                        pagina personale
                      </h4>
                      <LoginForm />
                      <p style={{ marginTop: "1vh" }}>oppure</p>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => this.props.history.push("/signin")}
                      >
                        Registrati
                      </Button>
                    </Jumbotron>
                  </Col>
                  <Col></Col>
                </Row>
              </Route>

              <Route
                exact
                path="/medici/:medico/pazienti/:paziente"
                render={({ match }) => {
                  return (
                    <>
                      <NavigationBar />
                      <GestionePaziente
                        id={match.params.paziente}
                        mid={match.params.medico}
                      />
                    </>
                  );
                }}
              />

              <Route
                exact
                path="/pazienti/:paziente"
                render={({ match }) => {
                  return (
                    <>
                      <NavigationBar />
                      <PaginaHome
                        id={match.params.paziente}
                        tipo="paziente"
                        history={this.props.history}
                      />
                    </>
                  );
                }}
              />

              <Route
                exact
                path="/pazienti/:paziente/prescmis"
                render={({ match }) => {
                  return (
                    <>
                      <NavigationBar />
                      <PazientePrescMis
                        id={match.params.paziente}
                        tipo="home"
                      />
                    </>
                  );
                }}
              />

              <Route
                exact
                path="/signin"
                render={() => {
                  return <Registrazione />;
                }}
              />

              {/*<Route
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
            />*/}

              <Route
                exact
                path="/medici/:medico"
                render={({ match }) => {
                  return (
                    <>
                      <NavigationBar />
                      <PaginaHome
                        id={match.params.medico}
                        tipo="medico"
                        history={this.props.history}
                      />
                    </>
                  );
                }}
              />

              <Route
                exact
                path="/pazienti/:paziente/calendario"
                render={({ match }) => {
                  return (
                    <>
                      <NavigationBar />
                      <Calendario id={match.params.paziente} tipo="paziente" />
                    </>
                  );
                }}
              />

              <Route
                exact
                path="/medici/:medico/calendario"
                render={({ match }) => {
                  return (
                    <>
                      <NavigationBar />
                      <Calendario id={match.params.medico} tipo="medico" />
                    </>
                  );
                }}
              />

              <Route
                exact
                path="/infermieri/:infermiere/calendario"
                render={({ match }) => {
                  return (
                    <>
                      <NavigationBar />
                      <Calendario
                        id={match.params.infermiere}
                        tipo="infermiere"
                      />
                    </>
                  );
                }}
              />

              <Route
                exact
                path="/infermieri/:infermiere"
                render={({ match }) => {
                  return (
                    <>
                      <NavigationBar />
                      <PaginaHome
                        id={match.params.infermiere}
                        tipo="infermiere"
                        history={this.props.history}
                      />
                    </>
                  );
                }}
              />

              <Route
                exact
                path="/pazienti/:paziente/video"
                render={({ match }) => {
                  return (
                    <>
                      <NavigationBar />
                      <JitsiComponent
                        id={match.params.paziente}
                        tipo="paziente"
                      />
                    </>
                  );
                }}
              />

              <Route
                exact
                path="/medici/:medico/pazienti/:paziente/video"
                render={({ match }) => {
                  return (
                    <>
                      <NavigationBar />
                      <JitsiComponent
                        pid={match.params.paziente}
                        id={match.params.medico}
                        tipo="medico"
                      />
                    </>
                  );
                }}
              />

              <Route
                exact
                path="/infermieri/:infermiere/pazienti/:paziente/video"
                render={({ match }) => {
                  return (
                    <>
                      <NavigationBar />
                      <JitsiComponent
                        pid={match.params.paziente}
                        id={match.params.infermiere}
                        tipo="infermiere"
                      />
                    </>
                  );
                }}
              />
            </Switch>
          </Container>
        </div>
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);
