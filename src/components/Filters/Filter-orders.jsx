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
    // Comprobar si datos está definido antes de filtrar
    if (!datos) {
      return [];
    }

    if (typeFilter === "Titulo") {
      const datosFiltrados = datos.filter((dato) => {
        const nombreOrden = `${dato.titulo}`;
        return nombreOrden.toLowerCase().includes(filter.toLowerCase());
      });
      return datosFiltrados;
    } else if (typeFilter === "Estado") {
      const datosFiltrados = datos.filter((dato) => {
        const estado = `${dato.estado}`;
        return estado.toLowerCase().includes(filter.toLowerCase());
      });
      return datosFiltrados;
    } else if (typeFilter === "Empresa") {
      const datosConNombreEmpresa = datos.map((dato) => {
        // Obten el nombre de la empresa basado en id_empresa (asumiendo que tienes una función para esto)
        const nombreEmpresa = nameCompany(dato.id_empresa);

        // Retorna un nuevo objeto con el nombre de la empresa agregado
        return { ...dato, nombre_empresa: nombreEmpresa };
      });

      const datosFiltrados = datosConNombreEmpresa.filter((dato) => {
        const nombreEmpresa = `${dato.nombre_empresa}`;
        return nombreEmpresa.toLowerCase().includes(filter.toLowerCase());
      });
      return datosFiltrados;
    } else {
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
              <th>Pizarra</th>
              <th>Telas</th>
              {showMonto && <th>Monto</th>}
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filterData()
              .slice() // Crear una copia para no modificar el array original
              .sort((a, b) => {
                const order = {
                  Taller: 1,
                  "Entrega tienda": 2,
                  "Entregada al cliente": 3,
                  "Anulada":4
                };

                // Ordenar por estado
                const estadoOrderA = order[a.estado] || 0;
                const estadoOrderB = order[b.estado] || 0;
                if (estadoOrderA !== estadoOrderB) {
                  return estadoOrderA - estadoOrderB;
                }

                // Si el estado es "Taller" o "Entrega tienda", ordenar por fecha en orden descendente
                if (a.estado === "Taller" || a.estado === "Entrega tienda") {
                  return new Date(b.fecha_orden) - new Date(a.fecha_orden);
                }

                return 0; // Si el estado es "Entregada al cliente" o no está definido en el orden, mantener el orden original
              })
              .map((dato, index) => (
                <tr key={index}>
                  <td>{iterador + index + 1}</td>
                  <td>
                    {showMonto ? (
                      <Link
                        className="link-nombre"
                        to={`/orden/${dato.id}/pagos`}
                      >{`${dato.titulo}`}</Link>
                    ) : (
                      <Link
                        className="link-nombre"
                        to={`/orden/${dato.id}`}
                      >{`${dato.titulo}`}</Link>
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
