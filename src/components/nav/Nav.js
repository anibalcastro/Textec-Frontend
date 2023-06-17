import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';

const VerticalNavbar = () => {
  const location = useLocation();

  return (
    <Navbar bg="white" expand="lg" className="vertical-navbar">
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
            <Nav.Link as={NavLink} to="/empresas" className={location.pathname === '/empresas' ? 'active' : ''}>
              Empresas
            </Nav.Link>
            <Nav.Link as={NavLink} to="/mediciones" className={location.pathname === '/mediciones' ? 'active' : ''}>
              Mediciones
            </Nav.Link>

            <Nav.Link as={NavLink} to="/orden" className={location.pathname === '/orden' ? 'active' : ''}>
              Orden de compra
            </Nav.Link>


            <Nav.Link as={NavLink} to="/arreglos" className={location.pathname === '/arreglos' ? 'active' : ''}>
              Arreglos
            </Nav.Link>

            <Nav.Link as={NavLink} to="/articulos" className={location.pathname === '/articulos' ? 'active' : ''}>
              Articulos
            </Nav.Link>

            <Nav.Link as={NavLink} to="/inventario" className={location.pathname === '/inventario' ? 'active' : ''}>
              Inventario
            </Nav.Link>

            <Nav.Link as={NavLink} to="/reportes" className={location.pathname === '/reportes' ? 'active' : ''}>
              Reportes
            </Nav.Link>

            <Nav.Link as={NavLink} to="/salir" className={location.pathname === '/salir' ? 'active' : ''}>
              Salir 
            </Nav.Link>


          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default VerticalNavbar;
