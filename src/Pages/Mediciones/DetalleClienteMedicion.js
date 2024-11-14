/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import CardMediciones from "../../components/card-mediciones/Card-Mediciones";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const DetalleClienteMediciones = () => {
  let [cliente, setCliente] = useState([]);
  let [mediciones, setMediciones] = useState([]);
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  let userId = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    obtenerInformacionCliente(userId);
    obtenerMediciones(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerInformacionCliente = (parametro) => {
    let datos = localStorage.getItem("data");
    datos = JSON.parse(datos);

    const cliente = datos.find(
      (item) => parseInt(item.id) === parseInt(parametro.userId)
    );

    if (cliente) {
      setCliente(cliente);
    } else {
      // Manejar caso donde no se encuentra el cliente
      console.log("Cliente no encontrado");
    }
  };

  const obtenerMediciones = (parametro) => {
    const myHeaders = new Headers({
      Authorization: `Bearer ${token}`,
    });

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    //console.log(`https://api.textechsolutionscr.com/apiv1/medicion/${parametro.userId}`)

    fetch(
      `https://api.textechsolutionscr.com/api/v1/medicion/${parametro.userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result && result.hasOwnProperty("data")) {
          const { data } = result;
          console.log(data);
          
          // Actualizamos el estado con las mediciones del cliente
          setMediciones(data);
        } else {
          // Muestra un mensaje de información con un valor por defecto si `mensaje` no está definido
          const mensajeError = result?.mensaje || "No se encontró información";
          Swal.fire("Info", mensajeError, "info");
        }
      })
      .catch((error) => {
        Swal.fire("Ha ocurrido un error en la petición!", `${error}`, "error");

        // Si hay un error, intentar obtener las mediciones desde el localStorage
        let storedMedidas = localStorage.getItem("medidas");

        if (storedMedidas) {
          storedMedidas = JSON.parse(storedMedidas);

          const arrayMedicionesUsuario = storedMedidas.filter(
            (item) => item.id_cliente == parametro.userId
          );
          setMediciones(arrayMedicionesUsuario);
        } else {
          console.log("No se encontraron datos en localStorage.");
        }
      });
  };

  const randomColores = () => {
    let listaColores = ["#94744C", "#6d949c"];
    let randomIndex = Math.floor(Math.random() * listaColores.length);
    return listaColores[randomIndex];
  };

  if (!mediciones || mediciones.length === 0) {
    Swal.fire({
      title: "Cargando los datos...",
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1000, // Duración en milisegundos (10 segundos),
    });
  }

  const goBack = () => {
    navigate(-1);
  };

  const validarPermisos = () => {
    if (role === "Admin" || role === "Colaborador") {
      return true;
    }
    return false;
  };

  const permisosColaborador = validarPermisos();

  return (
    <React.Fragment>
      <div className="container detalle-cliente-contenedor">
        <h2 className="titulo-encabezado">{`${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2}`}</h2>
        <h3 className="titulo-encabezado">{`${cliente.empresa} - ${cliente.departamento} `}</h3>
      </div>

      <hr className="division"></hr>

      <div className="container mediciones-cliente-contenedor">
        <div className="container mediciones-card">
          {Object.entries(mediciones).length === 0 ? (
            <p>No hay mediciones registradas para este cliente.</p>
          ) : (
            Object.entries(mediciones).map(([key, value]) => (
              <CardMediciones
                key={key}
                articulo={value.articulo}
                fecha={value.fecha}
                color={randomColores()}
                id={value.id}
              />
            ))
          )}
        </div>
      </div>

      <hr className="division"></hr>

      <div className="container botones-contenedor">
        <button className="btn-registrar" onClick={() => goBack()}>
          Regresar
        </button>

        {permisosColaborador && (
          <Link to={`/mediciones/registro/cliente/${userId.userId}`}>
            <button className="btn-registrar">Agregar</button>
          </Link>
        )}
      </div>
    </React.Fragment>
  );
};

export default DetalleClienteMediciones;
