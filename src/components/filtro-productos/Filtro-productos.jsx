import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const FiltroProductos = ({ datos }) => {
  const [filtro, setFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Número de mediciones por página

  useEffect(() => {
    setFiltro(""); // Resetear el filtro cuando los datos cambian
    setCurrentPage(1); // Resetear la página cuando los datos cambian
  }, [datos]);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    setCurrentPage(1); 
  };

  const filtrarDatos = () => {
    const datosFiltrados = datos.filter((dato) => {
      const nombreProducto = `${dato.nombre_producto}`;
      return nombreProducto.toLowerCase().includes(filtro.toLowerCase());
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilteredItems = filtrarDatos().reverse().slice(indexOfFirstItem, indexOfLastItem);

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
          placeholder="Buscar medición"
        />
      </div>

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Precio con IVA</th>
          </tr>
        </thead>
        <tbody>
          {currentFilteredItems.map((dato, index) => (
            <tr key={index}>
              <td>{iterador + index + 1}</td>
              <td>
                <Link
                  className="link-nombre"
                  to={`/producto/${dato.id}`}
                >{`${dato.nombre_producto}`}</Link>
              </td>
              <td>{dato.descripcion}</td>
              <td>₡{dato.precio_unitario}</td>
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

export default FiltroProductos;
