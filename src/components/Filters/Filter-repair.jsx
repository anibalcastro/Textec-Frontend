import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const FilterRepair = ({ datos }) => {

  const [filtro, setFiltro] = useState("");
  const [company, setCompany] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Número de mediciones por página
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
  }, []);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    setCurrentPage(1); 
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
    const datosFiltrados = datos.filter((dato) => {
      const nombreProveedor = `${dato.nombre_proveedor}`;
      return nombreProveedor.toLowerCase().includes(filtro.toLowerCase());
    });
    return datosFiltrados;
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
          placeholder="Buscar reparaciones"
        />
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
          {currentFilteredItems.map((dato, index) => (
            <tr key={index}>
              <td>{iterador + index + 1}</td>
              <td>
                <Link
                  className="link-nombre"
                  to={`/reparacion/${dato.id}`}
                >{`${dato.titulo}`}</Link>
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
