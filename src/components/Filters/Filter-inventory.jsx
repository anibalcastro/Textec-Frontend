import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";



const FilterInventory = ({datos}) => {

    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25; // Número de mediciones por página

    useEffect(() => {
        setFilter("");
        setCurrentPage(1);

        loadingData();
    },[]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    }

    const filterData = () => {
        const datosFiltrados = datos.filter((dato) => {
            const nombreProveedor = `${dato.nomb}`;
            return nombreProveedor.toLowerCase().includes(filter.toLowerCase());
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

    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFilteredItems = filterData().reverse().slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filterData().length / itemsPerPage);
  
    const handleClick = (page) => {
      setCurrentPage(page);
    };
  
    let iterador = indexOfFirstItem;

    return(
        <React.Fragment>
            <div className="container-filtro">
        <input
          className="filtro-mediciones"
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Buscar producto de inventario"
        />
      </div>

      <table id="tabla-reparacion" className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre producto</th>
            <th>Cantidad</th>
            <th>Color</th>
            <th>Categoria</th>
            <th>Proveedor</th>
            <th>Comentario</th>
          </tr>
        </thead>
        <tbody>
          {currentFilteredItems.map((dato, index) => (
            <tr key={index}>
              <td>{iterador + index + 1}</td>
              <td>{dato.nombre_producto}</td>
              <td>{dato.cantidad}</td>
              <td><input type="color" value={dato.color} disabled></input></td>
              <td>{dato.nombre_categoria}</td>
              <td>{dato.nombre_proveedor}</td>
              <td>{dato.comentario}</td>
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
    )
}

export default FilterInventory;