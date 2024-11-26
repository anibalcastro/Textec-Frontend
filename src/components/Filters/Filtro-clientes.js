import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const FiltroClientes = ({ datos }) => {
  const [filtro, setFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 80;
  const [typeFilter, setTypeFilter] = useState("nombre");
  const [name, setName] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    loadingData();
  }, []);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    setCurrentPage(1);
  };

  const handleFiltroNombreChange = (event) => {
    setName(event.target.value);
  };

  const filtrarDatos = () => {
    if (!Array.isArray(datos)) return [];
    if (typeFilter === "nombre") {
      return datos.filter((dato) =>
        `${dato.nombre} ${dato.apellido1} ${dato.apellido2}`
          .toLowerCase()
          .includes(filtro.toLowerCase())
      );
    }
    if (typeFilter === "empresa") {
      return datos.filter((dato) =>
        (dato.empresa || "").toLowerCase().includes(filtro.toLowerCase())
      );
    }
    if (typeFilter === "cedula") {
      return datos.filter((dato) =>
        (dato.cedula || "").toLowerCase().includes(filtro.toLowerCase())
      );
    }
    return [];
  };

  const loadingData = () => {
    if (isDataLoaded) return;
    Swal.fire({
      title: "Cargando datos!",
      html: "Se va a cerrar en <b></b> segundos",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => Swal.showLoading(),
      willClose: () => setIsDataLoaded(true),
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilteredItems = filtrarDatos()
    .reverse()
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtrarDatos().length / itemsPerPage);

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
        <select
          className="sc-filter"
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="nombre">Nombre</option>
          <option value="empresa">Empresa</option>
          <option value="cedula">Cédula</option>
        </select>
      </div>

      <table id="tabla-clientes" className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Completo</th>
            <th>Cédula</th>
            <th>Empresa</th>
            <th>Departamento</th>
          </tr>
        </thead>
        <tbody>
          {currentFilteredItems.length > 0 ? (
            currentFilteredItems.map((dato, index) => (
              <tr key={index}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>
                  <Link className="link-nombre" to={`/clientes/${dato.id}`}>
                    {`${dato.nombre} ${dato.apellido1} ${dato.apellido2}`}
                  </Link>
                </td>
                <td>{dato.cedula}</td>
                <td>{dato.empresa || "Sin empresa"}</td>
                <td>{dato.departamento || "Sin departamento"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No se encontraron resultados</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`pagination-btn ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </React.Fragment>
  );
};

export default FiltroClientes;
