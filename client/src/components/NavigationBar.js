import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";

import "./stylesheet.css";
import { AuthContext } from "../auth/AuthContext";

const NavigationBar = (props) => {
  return (
    <AuthContext.Consumer>
      {(context) => (
        <Navbar bg="dark" variant="dark" className="navigationbar">
          <Navbar.Brand>App</Navbar.Brand>

          <Nav className="mr-auto">
            {context.authUser && context.tipo === "0" && (
              <>
                <Nav.Link
                  as={NavLink}
                  to={
                    context.authUser ? `/pazienti/${context.authUser.id}` : `/`
                  }
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to={`/pazienti/${context.authUser.id}/prescmis`}
                >
                  Prescrizioni e Misurazioni
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to={`/pazienti/${context.authUser.id}/calendario`}
                >
                  Calendario
                </Nav.Link>
              </>
            )}

            {context.authUser && context.tipo === "1" && (
              <>
                <Nav.Link
                  as={NavLink}
                  to={context.authUser ? `/medici/${context.authUser.id}` : `/`}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to={`/medici/${context.authUser.id}/calendario`}
                >
                  Calendario
                </Nav.Link>
              </>
            )}

            {context.authUser && context.tipo === "2" && (
              <>
                <Nav.Link
                  as={NavLink}
                  to={
                    context.authUser
                      ? `/infermieri/${context.authUser.id}`
                      : `/`
                  }
                >
                  Home
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="ml-md-auto">
            {context.authUser && context.tipo === "0" && (
              <>
                <Navbar.Brand>Benvenuto {context.authUser.name}</Navbar.Brand>
                <Nav.Link
                  onClick={() => {
                    context.logoutUser();
                  }}
                >
                  Logout
                </Nav.Link>
              </>
            )}

            {context.authUser && context.tipo === "1" && (
              <>
                <Navbar.Brand>Benvenuto {context.authUser.name}</Navbar.Brand>
                <Nav.Link
                  onClick={() => {
                    context.logoutUser();
                  }}
                >
                  Logout
                </Nav.Link>
              </>
            )}

            {context.authUser && context.tipo === "2" && (
              <>
                <Navbar.Brand>Benvenuto {context.authUser.name}</Navbar.Brand>
                <Nav.Link
                  onClick={() => {
                    context.logoutUser();
                  }}
                >
                  Logout
                </Nav.Link>
              </>
            )}

            <Nav.Link href="#">
              <svg
                className="bi bi-people-circle"
                width="30"
                height="30"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z" />
                <path
                  fillRule="evenodd"
                  d="M8 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z"
                  clipRule="evenodd"
                />
              </svg>
            </Nav.Link>
          </Nav>
        </Navbar>
      )}
    </AuthContext.Consumer>
  );
};

export default NavigationBar;
