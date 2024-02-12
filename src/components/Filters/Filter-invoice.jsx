import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const FilterOrders = ({ datos, showMonto }) => {
  const [filter, setFilter] = useState("");
  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Número de ordenes por página
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
  }, []);

  const formatCurrencyCRC = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  });

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

  const handleFiltroChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const filterData = () => {
    // Comprobar si datos está definido antes de filtrar
    if (!datos) {
      return [];
    }

    if (typeFilter ==="Titulo"){
      const datosFiltrados = datos.filter((dato) => {
        const nombreOrden = `${dato.titulo}`;
        return nombreOrden.toLowerCase().includes(filter.toLowerCase());
      });
      return datosFiltrados;
    }
    else if (typeFilter === "Estado"){
      const datosFiltrados = datos.filter((dato) => {
        const estado = `${dato.estado}`;
        return estado.toLowerCase().includes(filter.toLowerCase());
      });
      return datosFiltrados;
    }
    else if (typeFilter === "Empresa"){
      const datosFiltrados = datos.filter((dato) => {
        const empresa = `${dato.nombre_empresa}`;
        return empresa.toLowerCase().includes(filter.toLowerCase());
      });
      return datosFiltrados;
    }
    else {
      const datosFiltrados = datos.filter((dato) => {
        const nombreOrden = `${dato.titulo}`;
        return nombreOrden.toLowerCase().includes(filter.toLowerCase());
      });
      return datosFiltrados;
    }
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

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

const handleInputFilterSelect = (event) => {
  setTypeFilter(event.target.value);
}


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
          placeholder="Buscar"
        />

        <div className="d-flex align-items-center">
          {" "}
          {/* Añade la clase 'align-items-center' para centrar verticalmente */}
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
              {showMonto && ( <th>Monto</th>)}
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
          {filterData().map((dato, index) => (
  <tr key={index}>
    <td>{iterador + index + 1}</td>
    <td>
      {showMonto ? (
        dato.orden_id ? (
          <Link
            className="link-nombre"
            to={`/orden/${dato.orden_id}/pagos`}
          >
            {`${dato.titulo} - Orden`}
          </Link>
        ) : (
          <Link
            className="link-nombre"
            to={`/reparaciones/${dato.reparacion_id}/pagos`}
          >
            {`${dato.titulo} - Reparación`}
          </Link>
        )
      ) : (
        dato.orden_id ? (
          <Link
            className="link-nombre"
            to={`/orden/${dato.id}`}
          >
            {`${dato.titulo}`}
          </Link>
        ) : (
          <Link
            className="link-nombre"
            to={`/reparacion/${dato.id}`}
          >
            {`${dato.titulo}`}
          </Link>
        )
      )}
    </td>
    <td>{dato.nombre_empresa}</td>
    <td>{dato.estado}</td>
    {showMonto && <td>{formatCurrencyCRC.format(dato.monto)}</td>}
    <td>{dato.fecha_orden ? formatDate(dato.fecha_orden) : formatDate(dato.fecha)}</td>
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
