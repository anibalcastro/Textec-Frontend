import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const FilterRepair = ({ datos }) => {
  const [filtro, setFiltro] = useState("");
  const [company, setCompany] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("Titulo");
  const itemsPerPage = 80; // Número de mediciones por página
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    setFiltro(""); // Resetear el filtro cuando los datos cambian
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
    setFiltro(event.target.value);
    setCurrentPage(1);
  };

  const handleInputFilterSelect = (event) => {
    setTypeFilter(event.target.value);
  };

  const formatDate = (inputDate) => {
    if (inputDate) {
      const date = new Date(inputDate);
      const day = date.getDate();
      const month = date.getMonth() + 1; // Sumamos 1 para ajustar el índice del mes
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }
    return ""; // O cualquier valor predeterminado que desees en caso de que la fecha no sea válida
  };

  const filtrarDatos = () => {
    // Comprobar si datos está definido antes de filtrar
    if (!datos) {
      return [];
    }

    //Titulo
    if (typeFilter === "Titulo") {
      const datosFiltrados = datos.filter((dato) => {
        const titulo = `${dato.titulo}`;
        return titulo.toLowerCase().includes(filtro.toLowerCase());
      });
      return datosFiltrados;
    }
    //Estado
    else if (typeFilter === "Estado") {
      const datosFiltrados = datos.filter((dato) => {
        const estado = `${dato.estado}`;
        return estado.toLowerCase().includes(filtro.toLowerCase());
      });
      return datosFiltrados;
    }
    //Empresa
    else if (typeFilter === "Empresa") {
      const datosConNombreEmpresa = datos.map((dato) => {
        // Obten el nombre de la empresa basado en id_empresa (asumiendo que tienes una función para esto)
        const nombreEmpresa = nameCompany(dato.id_empresa);

        // Retorna un nuevo objeto con el nombre de la empresa agregado
        return { ...dato, nombre_empresa: nombreEmpresa };
      });

      const datosFiltrados = datosConNombreEmpresa.filter((dato) => {
        const nombreEmpresa = `${dato.nombre_empresa}`;
        return nombreEmpresa.toLowerCase().includes(filtro.toLowerCase());
      });
      return datosFiltrados;
    } else {
      const datosFiltrados = datos.filter((dato) => {
        const nombreOrden = `${dato.titulo}`;
        return nombreOrden.toLowerCase().includes(filtro.toLowerCase());
      });
      return datosFiltrados;
    }
  };

  const loadingData = () => {
    let timerInterval;

    const showLoadingAlert = () => {
      Swal.fire({
        title: "Cargando datos!",
        html: "Se va a cerrar en <b></b> segundo",
        timer: 3000, // Cambiar a la duración en milisegundos (por ejemplo, 3000 milisegundos)
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
          const tablaReparacion = document.getElementById("tabla-reparacion");
          if (tablaReparacion) {
            const estaLlena = tablaReparacion.rows.length > 0; // Verificar si la tabla tiene alguna fila
            if (!estaLlena) {
              showLoadingAlert(); // Mostrar la alerta si la tabla no está llena
            }
          }
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          // El temporizador ha expirado
        }
      });
    };

    showLoadingAlert(); // Mostrar la primera alerta
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
  const currentFilteredItems = filtrarDatos()
    .reverse()
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtrarDatos().length / itemsPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  let iterador = indexOfFirstItem;

  return (
    <React.Fragment>
      <div className="container-filtro-ordenes">
        <input
          className="filtro-mediciones"
          type="text"
          value={filtro}
          onChange={handleFiltroChange}
          placeholder="Buscar reparaciones"
        />

        <div className="d-flex align-items-center">
          <label>Buscar por: </label>
          <select className="sc-filter" onChange={handleInputFilterSelect}>
            <option value="Titulo">Titulo</option>
            <option value="Estado">Estado</option>
            <option value="Empresa">Empresa</option>
          </select>
        </div>
      </div>

      <table id="tabla-reparacion" className="tabla-medidas">
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
          {currentFilteredItems
            .slice() // Crear una copia para no modificar el array original
            .sort((a, b) => {
              // Si ambos tienen estado "Taller", ordenar por fecha de manera descendente
              if (a.estado === "Taller" && b.estado === "Taller") {
                return new Date(b.fecha) - new Date(a.fecha);
              }

              // Si uno de los estados es "Taller", ese debe ir antes
              if (a.estado === "Taller") return -1;
              if (b.estado === "Taller") return 1;

              // Si ambos tienen estado "Entregado" o "Anulada", mantener el orden original
              if (
                (a.estado === "Entregado" && b.estado === "Entregado") ||
                (a.estado === "Anulada" && b.estado === "Anulada")
              ) {
                return 0;
              }

              // Si uno de los estados es "Entregado" o "Anulada", ese debe ir al final
              if (a.estado === "Entregado" || a.estado === "Anulada") return 1;
              if (b.estado === "Entregado" || b.estado === "Anulada") return -1;

              // En cualquier otro caso, no cambia el orden
              return 0;
            })
            .map((dato, index) => (
              <tr key={index}>
                <td>{iterador + index + 1}</td>
                <td>
                  <Link className="link-nombre" to={`/reparacion/${dato.id}`}>
                    {`${dato.titulo}`}
                  </Link>
                </td>
                <td>{nameCompany(dato.id_empresa)}</td>
                <td>{dato.estado}</td>
                <td>{formatDate(dato.fecha)}</td>
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

export default FilterRepair;
