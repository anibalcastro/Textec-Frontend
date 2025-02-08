import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Filtro from "../../components/Filters/Filtro-clientes";

const Clientes = () => {
  const [listaClientes, setListaClientes] = useState([]);
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const solicitudClientesApi = async () => {
      try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch(
          "https://api.textechsolutionscr.com/api/v1/clientes",
          requestOptions
        );
        const result = await response.json();

        if (result.hasOwnProperty("data")) {
          const formattedData = result.data.map((cliente) => ({
            id: cliente.id,
            nombre: cliente.nombre,
            apellido1: cliente.apellido1,
            apellido2: cliente.apellido2,
            cedula: cliente.cedula,
            empresa: cliente.empresa || "Sin empresa",
            departamento: cliente.departamento || "Sin departamento"
          }));

          setListaClientes(formattedData);
        }
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    solicitudClientesApi();
  }, [token, navigate]);

  const validarPermisos = () => role === "Admin" || role === "Colaborador";

  return (
    <React.Fragment>
      <h2 className="titulo-encabezado">Clientes</h2>
      <hr className="division"></hr>

      <div className="container mediciones-filtro">
        {validarPermisos() && (
          <Link to="/clientes/registro">
            <button className="btn-registrar">Registrar</button>
          </Link>
        )}
      </div>

      {listaClientes.length > 0 ? (
        <Filtro datos={listaClientes} />
      ) : (
        <p>Cargando datos o no se encontraron clientes.</p>
      )}
    </React.Fragment>
  );
};

export default Clientes;
