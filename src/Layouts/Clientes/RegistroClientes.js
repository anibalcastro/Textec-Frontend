import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from '../../Images/Logos/Icono.jpg'


const RegistroCliente = () => {
  const [cliente, setCliente] = useState({
    nombre: "",
    cedula: "",
    correo: "",
    Empresa: "",
    Departamento: "",
    Observaciones: "",
  });

  const handleInputChange = (event) => {
    setCliente(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes realizar la lógica de autenticación con los datos del formulario
    // por ejemplo, enviar una solicitud al servidor para verificar las credenciales

    // Restablecer los campos del formulario después de enviar
  };

  return (
    <React.Fragment>
      <div className="container registro">
        <h2 className="titulo-encabezado">Registro de clientes</h2>
        <hr className="division"></hr>

        <div className="container form-contenedor">
          <form className="form-registro-clientes" onSubmit={handleSubmit}>
            <div className="div-inp">
              <label htmlFor="username">Nombre completo:</label>
              <input type="text" id="nombre" autoComplete="nombre" />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Cédula:</label>
              <input type="text" id="cedula" autoComplete="current-password" />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Correo electronico:</label>
              <input type="text" id="cedula" autoComplete="current-password" />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Telefono:</label>
              <input type="text" id="cedula" autoComplete="current-password" />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Empresa:</label>
              <input type="text" id="cedula" autoComplete="current-password" />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Departamento:</label>
              <input type="text" id="cedula" autoComplete="current-password" />
            </div>

            <div className="div-inp">
              <label htmlFor="password">Observaciones:</label>
              <textarea id="txtArea" rows="5" cols="60"></textarea>
            </div>
          </form>

          <div className="container img-contenedor">
            <img className="isologo" src={Logo} alt="imagen" />
          </div>
        </div>

        <div className="container botones-contenedor">
            <button className="btn-registrar" type="submit">
              Registrar
            </button>
            <Link to='/clientes'>
            <button className="btn-registrar" type="submit">
              Regresar
            </button>
            </Link>
          </div>
      </div>
    </React.Fragment>
  );
};

export default RegistroCliente;
