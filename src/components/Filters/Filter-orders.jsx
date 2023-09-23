import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const FilterOrders = ({ datos }) => {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Número de mediciones por página
  const [company, setCompany] = useState([]);

  const token = Cookies.get("jwtToken");

  useEffect(() => {
    setFilter(""); // Resetear el filtro cuando los datos cambian
    setCurrentPage(1); // Resetear la página cuando los datos cambian

    const fetchCompany = () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "https://api.textechsolutionscr.com/api/v1/empresas",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.hasOwnProperty("data")) {
            const { data } = result;
            setCompany(data);
          }
        })
        .catch((error) => console.log("error", error));
    };

    fetchCompany();
    loadingData();
  }, []);

  const handleFiltroChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const filterData = () => {
    // Comprobar si datos está definido antes de filtrar
    if (!datos) {
      return [];
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

  const nameCompany = (companyId) => {
    const empresaEncontrada = company.find(
        (item) => parseInt(item.id) == parseInt(companyId)
    );

    if (empresaEncontrada) {
        return empresaEncontrada.nombre_empresa;
    } else {
        return "Empresa no encontrada";
    }
};


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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

        <div className="d-flex align-items-center">
          {" "}
          {/* Añade la clase 'align-items-center' para centrar verticalmente */}
          <label>Buscar por: </label>
        </div>

        <table className="tabla-medidas">
          <thead>
            <tr>
              <th>#</th>
              <th>Titulo</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filterData().map((dato, index) => (
              <tr key={index}>
                <td>{iterador + index + 1}</td>
                <td>
                  <Link
                    className="link-nombre"
                    to={`/orden/${dato.id}`}
                  >{`${dato.titulo}`}</Link>
                </td>
                <td>{nameCompany(dato.id_empresa)}</td>
                <td>{dato.estado}</td>
                <td>{dato.fecha_orden}</td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>

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

export default FilterOrders;
