import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const FilterSuppliers = ({ datos }) => {
  const [filtro, setFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Número de mediciones por página

  useEffect(() => {
    setFiltro(""); // Resetear el filtro cuando los datos cambian
    setCurrentPage(1); // Resetear la página cuando los datos cambian
    loadingData()
  }, []);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    setCurrentPage(1); 
  };

  const filtrarDatos = () => {
    const datosFiltrados = datos.filter((dato) => {
      const nombreProveedor = `${dato.nombre_proveedor}`;
      return nombreProveedor.toLowerCase().includes(filtro.toLowerCase());
    });
    return datosFiltrados;
  };

  const loadingData = () => {
    let timerInterval;
    Swal.fire({
      title: "Cargando datos!",
      html: "Se va a cerrar en <b></b> segundo",
      timer: 3000, // Cambiar a la duración en segundos (por ejemplo, 2 segundos)
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          const timerLeftInSeconds = Math.ceil(Swal.getTimerLeft() / 1000); // Convertir milisegundos a segundos y redondear hacia arriba
          b.textContent = timerLeftInSeconds;
        }, 1000); // Actualizar cada segundo
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        // El temporizador ha expirado
      }
    });
  };

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
          placeholder="Buscar proveedor"
        />
      </div>

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Proveedor</th>
            <th>Email</th>
            <th>Contacto</th>
          </tr>
        </thead>
        <tbody>
          {currentFilteredItems.map((dato, index) => (
            <tr key={index}>
              <td>{iterador + index + 1}</td>
              <td>
                <Link
                  className="link-nombre"
                  to={`/proveedores/${dato.id}`}
                >{`${dato.nombre}`}</Link>
              </td>
              <td>{dato.email}</td>
              <td>{dato.telefono}</td>
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

export default FilterSuppliers;
