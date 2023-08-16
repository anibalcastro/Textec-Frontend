import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const FiltroClientes = ({ datos }) => {
  const [filtro, setFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Número de clientes por página

  useEffect(() => {
    setFiltro(""); // Resetear el filtro cuando los datos cambian
    setCurrentPage(1); // Resetear la página cuando los datos cambian
  }, [datos]);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    setCurrentPage(1); // Resetear la página cuando se aplica un filtro
  };

  const filtrarDatos = () => {
    const datosFiltrados = datos.filter(dato => {
      const nombreCompleto = `${dato.nombre} ${dato.apellido1} ${dato.apellido2}`;
      return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
    });
    return datosFiltrados;
  };

  if (!datos || datos.length === 0) {
    Swal.fire({
      title: 'Cargando los datos...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilteredItems = filtrarDatos().reverse().slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtrarDatos().length / itemsPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <React.Fragment>
      <div className="container-filtro">
        <input
          className="filtro-mediciones"
          type="text"
          value={filtro}
          onChange={handleFiltroChange}
          placeholder="Buscar Cliente"
        />
      </div>

      <table className="tabla-medidas">
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
          {currentFilteredItems.map((dato, index) => (
            <tr key={index}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>
                <Link className="link-nombre" to={`/clientes/${dato.id}`}>
                  {`${dato.nombre} ${dato.apellido1} ${dato.apellido2}`}
                </Link>
              </td>
              <td>{dato.cedula}</td>
              <td>{dato.empresa}</td>
              <td>{dato.departamento}</td>
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

export default FiltroClientes;
