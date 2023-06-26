import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Logo from "../../Images/Logos/Icono.jpg";
import CardMediciones from "../../components/card-mediciones/Card-Mediciones";

const DetalleCliente = () => {
  let [datos, setDatos] = useState([]);
  let [mediciones, setMediciones] = useState([]);

  let userId = useParams();

  useEffect(() => {
    obtenerInformacion(userId);
    obtenerMediciones(userId);
  }, []);

  const obtenerInformacion = (userId) => {
    let array = {
      id: 1,
      nombre: "Anibal Jafeth Castro Ponce",
      cedula: 208110305,
      correo: "anibalcastro1515@gmail.com",
      telefono: "85424471",
      empresa: "Soluciones Empresariales",
      departamento: "Departamento TI",
      Observaciones: "Puede llegar a retirar los paquetes sin pago previo.",
    };

    setDatos(array);
  };

  const obtenerMediciones = (userId) => {
    let array = [
      {
        id: 1,
        prenda: "Camisa",
        fecha: "21/06/2023",
      },
      {
        id: 2,
        prenda: "Jacket",
        fecha: "21/06/2023",
      },
      {
        id: 3,
        prenda: "Pantalón",
        fecha: "21/06/2023",
      },
      {
        id: 4,
        prenda: "Short",
        fecha: "21/06/2023",
      },
    ];

    setMediciones(array);
  };

  return (
    <React.Fragment>
      <div className="container detalle-cliente-contenedor">
        <h2 className="titulo-encabezado">{datos.nombre}</h2>
        <hr className="division"></hr>

        <div className="container form-contenedor">
          <div className="detalle-clientes">
            <div className="div-inp">
              <label htmlFor="cedula">Cédula:</label>
              <input
                type="text"
                id="cedula"
                autoComplete="current-password"
                value={datos.cedula}
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="correo">Correo electronico:</label>
              <input
                type="text"
                id="correo"
                autoComplete="current-password"
                value={datos.correo}
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="telefono">Telefono:</label>
              <input
                type="text"
                id="telefono"
                value={datos.telefono}
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="empresa">Empresa:</label>
              <input type="text" id="empresa" value={datos.empresa} disabled />
            </div>
            <div className="div-inp">
              <label htmlFor="departamento">Departamento:</label>
              <input
                type="text"
                id="departamento"
                value={datos.departamento}
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
                value={datos.Observaciones}
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
                articulo={value.prenda}
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

          <Link to={`/clientes/editar/${datos.id}`}>
            <button className="btn-registrar">Editar</button>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DetalleCliente;
