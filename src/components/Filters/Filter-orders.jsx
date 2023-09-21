import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const FilterOrders = ({ datos }) => {
  const [filter, setFilter] = useState("");
  const [isCheckedCompany, setIsCheckedCompany] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Número de mediciones por página

  useEffect(() => {
    setFilter(""); // Resetear el filtro cuando los datos cambian
    setCurrentPage(1); // Resetear la página cuando los datos cambian
    loadingData();
  

  }, []);

  const handleSwitchCompanyChange = () => {
    setIsCheckedCompany(!isCheckedCompany);
  };

  const handleFiltroChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const filterData = () => {
    if (isCheckedCompany) {
      const datosFiltrados = datos.filter((dato) => {
        const nombreProducto = `${dato.empresa}`;
        return nombreProducto.toLowerCase().includes(filter.toLowerCase());
      });
      return datosFiltrados;
    }

    const datosFiltrados = datos.filter((dato) => {
      const nombreProducto = `${dato.titulo}`;
      return nombreProducto.toLowerCase().includes(filter.toLowerCase());
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
  const currentFilteredItems = filterData()
    .reverse()
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filterData().length / itemsPerPage);

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
          value={filter}
          onChange={handleFiltroChange}
          placeholder="Buscar Orden"
        />

        <div className="d-flex align-items-center"> {/* Añade la clase 'align-items-center' para centrar verticalmente */}
          <label>Buscar por: </label>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              onChange={handleSwitchCompanyChange}
              value={isCheckedCompany}
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckDefault"
            >
              Empresa
            </label>
          </div>
        </div>

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Titulo</th>
            <th>Empresa</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {currentFilteredItems.map((dato, index) => (
            <tr key={index}>
              <td>{iterador + index + 1}</td>
              <td>
                <Link
                  className="link-nombre"
                  to={`/orden/${dato.id}`}
                >{`${dato.titulo}`}</Link>
              </td>
              <td>{dato.empresa}</td>
              <td>₡{dato.fecha}</td>
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
      </div>
    </React.Fragment>
  );
};

export default FilterOrders;
