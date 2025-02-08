import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const FiltroMediciones = ({ datos }) => {
  const [filtro, setFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // Número de mediciones por página
  const [typeFilter, setTypeFilter] = useState("nombre");
  const [name, setName] = useState("");
  const location = useLocation(); // Hook para obtener la ruta actual

  useEffect(() => {
    if (location.pathname === "/") {
      // Borra los datos del filtro cuando estés en la página de inicio
      localStorage.removeItem("filtro");
      localStorage.removeItem("tipoFiltro");
      localStorage.removeItem("currentPage");
      setFiltro("");
      setTypeFilter("nombre");
      setCurrentPage(1);
    } else {
      restoreFilterState();
    }
  }, [location.pathname, datos]);

  const restoreFilterState = () => {
    const storedFiltro = localStorage.getItem("filtro");
    const storedTipoFiltro = localStorage.getItem("tipoFiltro");
    const storedCurrentPage = localStorage.getItem("currentPage");

    setFiltro(storedFiltro || "");
    setTypeFilter(storedTipoFiltro || "nombre"); // Restaurar tipoFiltro desde localStorage
    setCurrentPage(storedCurrentPage ? parseInt(storedCurrentPage, 10) : 1);
  };

  const handleFiltroChange = (event) => {
    const value = event.target.value;
    setFiltro(value);
    localStorage.setItem("filtro", value);
    setCurrentPage(1);
    localStorage.setItem("currentPage", 1);
  };

  const handleFiltroNombreChange = (event) => {
    setName(event.target.value);
  };

  const handleFilterTypeChange = (event) => {
    const value = event.target.value;
    setTypeFilter(value);
    localStorage.setItem("tipoFiltro", value); // Almacenar el tipo de filtro seleccionado
    setCurrentPage(1);
    localStorage.setItem("currentPage", 1);
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


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentFilteredItems = filtrarDatos()
    .sort((a, b) => b.id - a.id) // Cambia `id` por el campo que quieras usar para el orden descendente
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtrarDatos().length / itemsPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page);
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
            onChange={handleFilterTypeChange}
            value={typeFilter} // Asegurarse de usar el estado actualizado
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
