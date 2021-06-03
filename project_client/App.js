import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

import API from "./api/API";

import LoginForm from "./components/LoginForm";
import StudentMenu from "./components/StudentMenu";
import TeacherMenu from "./components/TeacherMenu";
import NavigationBar from "./components/NavigationBar";
import StudentIDForm from "./components/StudentIDForm";
import { Redirect,Route } from "react-router-dom";
import {Switch} from 'react-router';
import {Container,Row,Col,Button,Jumbotron} from "react-bootstrap";

import { AuthContext } from "./auth/AuthContext";
import {withRouter} from "react-router-dom";




class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    //Check if the user is authenticated
    API.isAuthenticated().then(
      (user) => {
        this.setState({authUser: user});
        this.props.history.push(`/teachers/${user.id}`);
      }
    ).catch((err) => { 
      this.setState({authErr: err.errorObj});
    });
  }
 
  handleErrors = (err) => {
    if (err) {
        if (err.status && err.status === 401) {
          this.setState({authErr: err.errorObj});
          this.props.history.push("/login");
        }
        else
          console.error(err);
    }
  }

  // Logout method
  logout = () => {
    API.userLogout().then(() => {
      this.setState({authUser: null,authErr: null});
      this.props.history.push("/")
    });
  }

  // Login method
  login = (username, password) => {
    API.userLogin(username, password).then(
      (user) => {
        this.setState({authUser: user, authErr: null}); 
        this.props.history.push(`/teachers/${user.id}`);
      }
    ).catch(
      (errorObj) => {
        const err0 = errorObj.errors[0];
        this.setState({authErr: err0});
      }
    );
  } 

  render () {

    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout
    };

    return (
        <AuthContext.Provider value={value}>
          <div className="App">
           <NavigationBar />
            <Container fluid className="root-container">

              <Switch style={{padding: 0}}>

                <Route exact path="/">
                    <Row style={{height: "100vh", margin: 0}}>
                      <Col sm={6} className="teacher-column">
                        <Jumbotron fluid className="teacher-jumbo">
                          <Container>
                            <h1>Teachers</h1>
                            <p>
                              Welcome to The Scheduler Teacher! Please to gain access to your personal functionalities hit the button below to Log In.
                            </p>
                            <p>
                              <Button variant="primary" onClick={() => this.props.history.push("/login")}>Log In !</Button>
                            </p>
                          </Container>
                        </Jumbotron>
                      </Col>
                      <Col sm={6} className="student-column">
                        <Jumbotron fluid className="student-jumbo">
                          <Container>
                            <h1>Students</h1>
                            <p>
                              Welcome to The Scheduler Student! Please to gain access to your personal functionalities insert your ID below.
                            </p>
                            <StudentIDForm />
                          </Container>
                        </Jumbotron>
                      </Col>
                    </Row>
                  </Route>
                
                <Route path="/login" >
                  <Row style={{height: "100vh", margin: 0}}>
                    <Col sm={4}></Col>
                    <Col sm={4}> 
                      <LoginForm/>
                    </Col>
                  </Row>
                </Route>

                <Route path="/students/:student" render = {({match}) => {
                  return  <StudentMenu sid={match.params.student}/>
                }} />

                <Route path="/teachers/:teacher" render = {({match}) => {
                  return <TeacherMenu tid={match.params.teacher} handleErrors = {this.handleErrors}/>
                }} />

                <Route>
                  {this.state.authUser ? <Redirect to={`/teachers/${this.state.authUser.id}`} /> : <Redirect to="/" />}
                </Route>

              </Switch>

            </Container> 
          </div>
        </AuthContext.Provider>
    );
  }

  
}

export default withRouter(App);
