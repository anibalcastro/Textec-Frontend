import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const FiltroEmpresa = ({ datos }) => {
  const [filtro, setFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFiltro("");
    setCurrentPage(1); // Resetear la página cuando los datos cambian
  }, [datos]);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    setCurrentPage(1); // Resetear la página cuando se aplica un filtro
  };

  const filtrarDatos = () => {
    const datosFiltrados = datos.filter((dato) => {
      const nombreEmpresa = `${dato.nombre_empresa}`;
      return nombreEmpresa.toLowerCase().includes(filtro.toLowerCase());
    });
    return datosFiltrados;
  };

  if (!datos || datos.length === 0) {
    Swal.fire({
      title: "Cargando los datos...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
  }

  const itemsPerPage = 20; // Número de empresas por página
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilteredItems = filtrarDatos().slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtrarDatos().length / itemsPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  let iterador = indexOfFirstItem;

  return (
    <React.Fragment>
      <div className="container-filtro">
        <input
          className="filtro-mediciones"
          type="text"
          value={filtro}
          onChange={handleFiltroChange}
          placeholder="Buscar empresa"
        />
      </div>

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Empresa</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {currentFilteredItems.reverse().map((dato, index) => (
            <tr key={index}>
              <td>{(iterador += 1)}</td>
              <td>
                <Link className="link-nombre" to={`/empresa/${dato.id}`}>
                  {`${dato.nombre_empresa}`}
                </Link>
              </td>
              <td>{dato.email}</td>
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

export default FiltroEmpresa;
