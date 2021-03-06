import React from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", submitted: false };
  }

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = (event, onLogin) => {
    event.preventDefault();
    onLogin(this.state.username, this.state.password);
    this.setState({ submitted: true });
  };

  render() {
    if (this.submitted) return <Redirect to="/" />;
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            <Container fluid>
              <Row className="custom-row">
                <Col>
                  <Form
                    method="POST"
                    onSubmit={(event) =>
                      this.handleSubmit(event, context.loginUser)
                    }
                  >
                    <Form.Group>
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={this.state.username}
                        onChange={(event) => this.onChangeUsername(event)}
                        required
                        autoFocus
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={(event) => this.onChangePassword(event)}
                        required
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" size="lg">
                      Accedi
                    </Button>
                  </Form>

                  {context.authErr && (
                    <Alert variant="danger" style={{ marginTop: "1rem" }}>
                      {context.authErr.msg}
                    </Alert>
                  )}
                </Col>
              </Row>
            </Container>
          </>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default LoginForm;
