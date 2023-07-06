import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Logo from "../../Images/Logos/Icono.jpg";
import CardMediciones from "../../components/card-mediciones/Card-Mediciones";
import Cookies from "js-cookie";

const DetalleCliente = () => {
  let [cliente, setCliente] = useState([]);
  let [mediciones, setMediciones] = useState([]);
  const token = Cookies.get("jwtToken");
  let userId = useParams();

  useEffect(() => {
    obtenerInformacionCliente(userId);
    obtenerMediciones(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const obtenerInformacionCliente = (parametro) => {
    let datos = localStorage.getItem('data');
    datos = JSON.parse(datos);

    //console.log(parametro.userId);

    let encontrado = false;

    datos.forEach((item, i) => {
      //console.log(parseInt(item.id));
      if (parseInt(item.id) === parseInt(parametro.userId)) {
        setCliente(item);
        encontrado = true;
      }
    });

    if (!encontrado) {
      console.log('No se ha encontrado');
    }
  }


  const obtenerMediciones = (parametro) => {
    let medidas = JSON.parse(localStorage.getItem('medidas')) || [];

    if (medidas.length > 0) {
      //console.log(parametro.userId);
      const arrayMedicionesUsuario = medidas.filter(item => item.id_cliente == parametro.userId);
      setMediciones(arrayMedicionesUsuario);
      //console.log(mediciones);
    } else {
      const myHeaders = new Headers({
        "Authorization": `Bearer ${token}`
      });

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch("https://api.textechsolutionscr.com/api/v1/mediciones/clientes", requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.hasOwnProperty("data")) {
            const { data } = result;
            localStorage.setItem('medidas', JSON.stringify(data));
            const arrayMedicionesUsuario = data.filter(item => item.id_cliente == parametro.userId);
            setMediciones(arrayMedicionesUsuario);
            console.log(mediciones);
          } else {
            // Mostrar mensaje de error o realizar otra acción
          }
        })
        .catch(error => console.log('error', error));
    }


  }

  return (
    <React.Fragment>
      <div className="container detalle-cliente-contenedor">
        <h2 className="titulo-encabezado">{`${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2}`}</h2>
        <hr className="division"></hr>

        <div className="container form-contenedor">
          <div className="detalle-clientes">
            <div className="div-inp">
              <label htmlFor="cedula">Cédula:</label>
              <input
                type="text"
                id="cedula"
                autoComplete="current-password"
                value={cliente.cedula}
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="correo">Correo electronico:</label>
              <input
                type="text"
                id="correo"
                autoComplete="current-password"
                value={cliente.email}
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="telefono">Telefono:</label>
              <input
                type="text"
                id="telefono"
                value={cliente.telefono}
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="empresa">Empresa:</label>
              <input type="text" id="empresa" value={cliente.empresa} disabled />
            </div>
            <div className="div-inp">
              <label htmlFor="departamento">Departamento:</label>
              <input
                type="text"
                id="departamento"
                value={cliente.departamento}
                disabled
              />
            </div>

            <div className="div-inp">
              <label htmlFor="observaciones">Observaciones:</label>
              <textarea
                id="observaciones"
                rows="5"
                cols="60"
                style={{ resize: "none" }}
                value={cliente.comentarios}
                disabled
              ></textarea>
            </div>
          </div>

          <div className="container img-contenedor">
            <img className="isologo" src={Logo} alt="imagen" />
          </div>
        </div>

        <hr className="division"></hr>

        <div className="container mediciones-cliente-contenedor">
          <h2 className="titulo-encabezado">Mediciones</h2>

          <div className="container mediciones-card">

            {Object.entries(mediciones).map(([key, value]) => (
              <CardMediciones
                articulo={value.articulo}
                fecha={value.fecha}
                color="#6d949c"
                id={value.id}
              />
            ))}
          </div>
        </div>

        <hr className="division"></hr>

        <div className="container botones-contenedor">
          <Link to="/clientes">
            <button className="btn-registrar">Regresar</button>
          </Link>

          <Link to={`/clientes/editar/${cliente.id}`}>
            <button className="btn-registrar">Editar</button>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DetalleCliente;
