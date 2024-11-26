import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const FiltroMediciones = ({ datos }) => {
  const [filtro, setFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 80; // Número de mediciones por página
  const [typeFilter, setTypeFilter] = useState("nombre");
  const [name, setName] = useState("");

  useEffect(() => {
    console.log("Datos recibidos:", datos); // Verifica que lleguen correctamente
    setCurrentPage(1); // Resetear la página cuando los datos cambian
    getDataFilter();
    loadingData();
  }, [datos]);

  const getDataFilter = () => {
    const storedFiltro = localStorage.getItem("filtro");
    const storedTipoFiltro = localStorage.getItem("tipoFiltro");

    if (storedFiltro !== null && storedTipoFiltro !== null) {
      setFiltro(storedFiltro || "");
      setTypeFilter(storedTipoFiltro || "nombre");
    } else {
      setFiltro("");
      setTypeFilter("nombre");
    }
  };

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    localStorage.setItem("filtro", event.target.value);
    setCurrentPage(1);
  };

  const handleFiltroNombreChange = (event) => {
    setName(event.target.value);
  };

  const filtrarDatos = () => {
    if (!Array.isArray(datos) || datos.length === 0) {
      return [];
    }

    if (typeFilter === "nombre") {
      return datos.filter((dato) => {
        const nombreCompleto = `${dato.nombre} ${dato.apellido1} ${dato.apellido2}`;
        return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
      });
    }

    if (typeFilter === "empresa") {
      return datos.filter((dato) => {
        const nombreEmpresa = dato.empresa?.toLowerCase() || "";
        const nombreCompleto = `${dato.nombre} ${dato.apellido1} ${dato.apellido2}`.toLowerCase();

        return (
          nombreEmpresa.includes(filtro.toLowerCase()) &&
          nombreCompleto.includes(name.toLowerCase())
        );
      });
    }

    if (typeFilter === "cedula") {
      return datos.filter((dato) => {
        const numeroCedula = `${dato.cedula}`;
        return numeroCedula.toLowerCase().includes(filtro.toLowerCase());
      });
    }

    return [];
  };

  const loadingData = () => {
    Swal.fire({
      title: "Cargando datos!",
      html: "Se va a cerrar en <b></b> segundos",
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => Swal.showLoading(),
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentFilteredItems = filtrarDatos()
    .sort((a, b) => b.id - a.id) // Cambia `id` por el campo que quieras usar para el orden descendente
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtrarDatos().length / itemsPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  let iterador = indexOfFirstItem;

  return (
    <React.Fragment>
      <div className="container-filtro-ordenes">
        <input
          className="filtro-pedidos"
          type="text"
          value={filtro}
          onChange={handleFiltroChange}
          placeholder={`Buscar por ${typeFilter}`}
        />

        {typeFilter === "empresa" && (
          <input
            className="filtro-pedidos"
            type="text"
            value={name}
            onChange={handleFiltroNombreChange}
            placeholder="Buscar el nombre de la persona"
          />
        )}

        <div className="d-flex align-items-center">
          <label>Buscar por:</label>
          <select
            className="sc-filter"
            onChange={(e) => setTypeFilter(e.target.value)}
            value={typeFilter}
          >
            <option value="nombre">Nombre</option>
            <option value="empresa">Empresa</option>
            <option value="cedula">Cédula</option>
          </select>
        </div>
      </div>

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Completo</th>
            <th>Cédula</th>
            <th>Empresa</th>
          </tr>
        </thead>
        <tbody>
          {currentFilteredItems.map((dato, index) => (
            <tr key={index}>
              <td>{iterador + index + 1}</td>
              <td>
                <Link
                  className="link-nombre"
                  to={`/mediciones/cliente/${dato.id}`}
                >
                  {`${dato.nombre} ${dato.apellido1} ${dato.apellido2}`}
                </Link>
              </td>
              <td>{dato.cedula}</td>
              <td>{dato.empresa}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => handleClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </React.Fragment>
  );
};

export default FiltroMediciones;