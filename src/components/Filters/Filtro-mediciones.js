import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const FiltroMediciones = ({ datos }) => {
  const [filtro, setFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40; // Número de mediciones por página
  const [typeFilter, setTypeFilter] = useState("Nombre");


  useEffect(() => {
    setFiltro(""); // Resetear el filtro cuando los datos cambian
    setCurrentPage(1); // Resetear la página cuando los datos cambian
    loadingData()
  }, []);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    setCurrentPage(1); // Resetear la página cuando se aplica un filtro
  };

  const filtrarDatos = () => {
    if (!datos){
      return [];
    }

    if (typeFilter === "Nombre"){
      const datosFiltrados = datos.filter((dato) => {
        const nombreCompleto = `${dato.nombre} ${dato.apellido1} ${dato.apellido2}`;
        return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
      });
      return datosFiltrados;
    }
    else if (typeFilter === "Empresa"){
      const datosFiltrados = datos.filter((dato) => {
        const nombreEmpresa = `${dato.empresa}`;
        return nombreEmpresa.toLowerCase().includes(filtro.toLowerCase());
      });
      return datosFiltrados;
    }
    else if (typeFilter === "Cedula"){
      const datosFiltrados = datos.filter((dato) => {
        const numeroCedula = `${dato.cedula}`;
        return numeroCedula.toLowerCase().includes(filtro.toLowerCase());
      });
      return datosFiltrados;
    }
  };

  const handleInputFilterSelect = (event) => {
    setTypeFilter(event.target.value);
  }
  

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
           <div className="container-filtro-ordenes">
        <input
          className="filtro-pedidos"
          type="text"
          value={filtro}
          onChange={handleFiltroChange}
          placeholder="Buscar"
        />

        <div className="d-flex align-items-center">
          {" "}
          {/* Añade la clase 'align-items-center' para centrar verticalmente */}
          <label>Buscar por: </label>
          <select className="sc-filter" onChange={handleInputFilterSelect}>
            <option value={"Nombre"}>Nombre</option>
            <option value={"Empresa"}>Empresa</option>
            <option value={"Cedula"}>Cédula</option>
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
                >{`${dato.nombre} ${dato.apellido1} ${dato.apellido2}`}</Link>
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
