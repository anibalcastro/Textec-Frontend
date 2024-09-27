import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const FilterOrders = ({ datos, showMonto }) => {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 80; // Número de ordenes por página
  const [company, setCompany] = useState([]);
  const [typeFilter, setTypeFilter] = useState("Titulo");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltroChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const filterData = () => {
    if (!datos) return [];

    if (typeFilter === "Titulo") {
      return datos.filter((dato) =>
        dato.titulo.toLowerCase().includes(filter.toLowerCase())
      );
    } else if (typeFilter === "Estado") {
      return datos.filter((dato) =>
        dato.estado.toLowerCase().includes(filter.toLowerCase())
      );
    } else if (typeFilter === "Empresa") {
      const datosConNombreEmpresa = datos.map((dato) => {
        const nombreEmpresa = nameCompany(dato.id_empresa);
        return { ...dato, nombre_empresa: nombreEmpresa };
      });

      return datosConNombreEmpresa.filter((dato) =>
        dato.nombre_empresa.toLowerCase().includes(filter.toLowerCase())
      );
    } else {
      return datos.filter((dato) =>
        dato.titulo.toLowerCase().includes(filter.toLowerCase())
      );
    }
  };

  const loadingData = () => {
    let timerInterval;
    Swal.fire({
      title: "Cargando datos!",
      html: "Se va a cerrar en <b></b> segundo",
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          const timerLeftInSeconds = Math.ceil(Swal.getTimerLeft() / 1000);
          b.textContent = timerLeftInSeconds;
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    });
  };

  const nameCompany = (companyId) => {
    const empresaEncontrada = company.find(
      (item) => parseInt(item.id) === parseInt(companyId)
    );

    return empresaEncontrada
      ? empresaEncontrada.nombre_empresa
      : "Empresa no encontrada";
  };

  const handleInputFilterSelect = (event) => {
    setTypeFilter(event.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filterData().length / itemsPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
          <label>Buscar por: </label>
          <select className="sc-filter" onChange={handleInputFilterSelect}>
            <option value={"Titulo"}>Titulo</option>
            <option value={"Estado"}>Estado</option>
            <option value={"Empresa"}>Empresa</option>
          </select>
        </div>

        <table className="tabla-medidas">
          <thead>
            <tr>
              <th>#</th>
              <th>Titulo</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Pizarra</th>
              <th>Telas</th>
              {showMonto && <th>Monto</th>}
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filterData()
              .filter((dato) => dato.estado !== "Anulada") // Filtra las órdenes que no están anuladas
              .slice(indexOfFirstItem, indexOfLastItem)
              .sort((a, b) => b.id - a.id) // Ordena las órdenes por id
              .map((dato, index) => (
                <tr key={index}>
                  <td>{dato.id}</td>
                  <td>
                    {showMonto ? (
                      <Link
                        className="link-nombre"
                        to={`/orden/${dato.id}/pagos`}
                      >
                        {dato.titulo}
                      </Link>
                    ) : (
                      <Link className="link-nombre" to={`/orden/${dato.id}`}>
                        {dato.titulo}
                      </Link>
                    )}
                  </td>
                  <td>{nameCompany(dato.id_empresa)}</td>
                  <td>{dato.estado}</td>
                  <td>{dato.pizarra ? "SI" : "NO"}</td>
                  <td>{dato.tela ? "SI" : "NO"}</td>
                  {showMonto && <td>{dato.precio_total}</td>}
                  <td>{formatDate(dato.fecha_orden)}</td>
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
