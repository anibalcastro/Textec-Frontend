import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';

const VerticalNavbar = () => {
  const location = useLocation();

  return (
    <Navbar bg="light" expand="lg" className="vertical-navbar">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav defaultActiveKey="#home" className="flex-column">
            <Nav.Link as={NavLink} to="/" className={location.pathname === '/' ? 'active' : ''}>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/clientes" className={location.pathname === '/clientes' ? 'active' : ''}>
              Clientes
            </Nav.Link>
            <Nav.Link as={NavLink} to="/mediciones" className={location.pathname === '/mediciones' ? 'active' : ''}>
              Mediciones
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default VerticalNavbar;
