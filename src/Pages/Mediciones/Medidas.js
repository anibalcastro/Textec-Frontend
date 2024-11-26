import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import Filtro from "../../components/Filters/Filtro-mediciones";

const Mediciones = () => {
  const [listaClientes, setListaClientes] = useState([]);

  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  useEffect(() => {
    const solicitudClientesApi = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch(
          "https://api.textechsolutionscr.com/api/v1/clientes",
          requestOptions
        );
        const result = await response.json();

        console.log(result); // Depuración: Verifica la respuesta de la API

        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setListaClientes(data);
          localStorage.setItem("data", JSON.stringify(data));
        } else {
          console.warn("No se encontró la propiedad 'data' en la respuesta.");
        }
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    solicitudClientesApi();
  }, [token]); // Escucha cambios en el token

  const validarPermisos = () => {
    return role === "Admin" || role === "Colaborador";
  };

  const permisosColaborador = validarPermisos();

  return (
    <React.Fragment>
      <h2 className="titulo-encabezado">Mediciones</h2>
      <hr className="division"></hr>
      <div className="container mediciones-filtro">
        {permisosColaborador && (
          <Link to="/mediciones/registro">
            <button className="btn-registrar">Registrar</button>
          </Link>
        )}
      </div>
      <Filtro datos={listaClientes} />
    </React.Fragment>
  );
};

export default Mediciones;
