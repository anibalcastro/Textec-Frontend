import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Logo from "../../Images/Logos/Icono.jpg";
import CardMediciones from "../../components/card-mediciones/Card-Mediciones";

const DetalleCliente = () => {
  let [cliente, setCliente] = useState([]);
  let [mediciones, setMediciones] = useState([]);

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
    let medidas = localStorage.getItem('medidas');
    medidas = JSON.parse(medidas);

    let arrayMedicionesUsuario = [];

    medidas.forEach((item, i) => {
      if(item.id_cliente === parametro.userId){
        console.log(item);
        arrayMedicionesUsuario.push(item);
      }
    });

    setMediciones(arrayMedicionesUsuario);
    console.log(mediciones);
  };

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
