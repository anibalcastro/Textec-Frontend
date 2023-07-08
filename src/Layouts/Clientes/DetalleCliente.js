import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Logo from "../../Images/Logos/Icono.jpg";
import CardMediciones from "../../components/card-mediciones/Card-Mediciones";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const DetalleCliente = () => {
  const [cliente, setCliente] = useState({});
  const [mediciones, setMediciones] = useState([]);
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    obtenerInformacionCliente(userId);
    obtenerMediciones(userId);
  }, [userId]);

  const obtenerInformacionCliente = (parametro) => {
    let datos = localStorage.getItem("data");
    datos = JSON.parse(datos);

    let encontrado = false;

    datos.forEach((item) => {
      if (parseInt(item.id) === parseInt(parametro)) {
        setCliente(item);
        encontrado = true;
      }
    });

    if (!encontrado) {
      console.log("No se ha encontrado");
    }
  };

  const obtenerMediciones = (parametro) => {
    let medidas = JSON.parse(localStorage.getItem("medidas")) || [];

    if (medidas.length > 0) {
      const arrayMedicionesUsuario = medidas.filter(
        (item) => item.id_cliente === parametro
      );
      setMediciones(arrayMedicionesUsuario);
    } else {
      const myHeaders = new Headers({
        Authorization: `Bearer ${token}`,
      });

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "https://api.textechsolutionscr.com/api/v1/mediciones/clientes",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.hasOwnProperty("data")) {
            const { data } = result;
            localStorage.setItem("medidas", JSON.stringify(data));
            const arrayMedicionesUsuario = data.filter(
              (item) => item.id_cliente === parametro
            );
            setMediciones(arrayMedicionesUsuario);
            console.log(mediciones);
          } else {
            // Mostrar mensaje de error o realizar otra acción
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  const peticionEliminar = (idCliente) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/clientes/eliminar/${idCliente}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status } = result;
        console.log(status);

        if (status === 200) {
          Swal.fire({
            title: "Cliente eliminado!",
            text: "Se ha eliminado permanentemente",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/clientes");
            } else {
              navigate("/clientes");
            }
          });
        } else {
          Swal.fire({
            title: "Ha ocurrido un error!",
            text: "Por favor intentarlo luego",
            icon: "error",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/clientes");
            } else {
              navigate("/clientes");
            }
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  const eliminarCliente = () => {
    Swal.fire({
      title: "¿Desea eliminar el cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        peticionEliminar(userId);
      } else {
        Swal.fire({
          title: "Se ha cancelado!",
          text: "No se eliminará el cliente",
          icon: "info",
        });
      }
    });
  };

  const validarRol = (role) => {
    return role === "Admin";
  };

  const permisos = validarRol(role);

  return (
    <React.Fragment>
      <div className="container detalle-cliente-contenedor">
        <h2 className="titulo-encabezado">{`${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2}`}</h2>
        <hr className="division" />

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

        <hr className="division" />

        <div className="container mediciones-cliente-contenedor">
          <h2 className="titulo-encabezado">Mediciones</h2>

          <div className="container mediciones-card">
            {mediciones.map((medicion) => (
              <CardMediciones
                key={medicion.id}
                articulo={medicion.articulo}
                fecha={medicion.fecha}
                color="#6d949c"
                id={medicion.id}
              />
            ))}
          </div>
        </div>

        <hr className="division" />

        <div className="container botones-contenedor">
          <Link to="/clientes">
            <button className="btn-registrar">Regresar</button>
          </Link>

          <Link to={`/clientes/editar/${cliente.id}`}>
            <button className="btn-registrar">Editar</button>
          </Link>

          {permisos && (
            <button className="btn-registrar" onClick={eliminarCliente}>
              Eliminar
            </button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default DetalleCliente;
