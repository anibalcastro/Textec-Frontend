import React, { useState } from "react";
import Swal from "sweetalert2";

const TableCategories = ({ datos, token }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Número de mediciones por página

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(datos.length / itemsPerPage);

  let iterador = indexOfFirstItem;

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const requestDeleteCategory = (id) => {
    Swal.fire({
      title: "¿Desea eliminar la categoria?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory(id);
      } else {
        Swal.fire({
          title: "Se ha cancelado!",
          text: "No se anulará la orden",
          icon: "info",
        });
      }
    });
  };

  const deleteCategory = (id) => {
    console.log(id);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("nombre_categoria", "Huesos");

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/categorias/eliminar/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status, error } = result;
        if (parseInt(status) === 200) {
          Swal.fire(
            "Categoria eliminada",
            `Se ha eliminado la categoria!`,
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
              window.location.reload();
            } else {
              window.location.reload();
            }
          });
        } else {
          let errorMessage = "";
          for (const message of error) {
            errorMessage += message + "\n";
          }
          Swal.fire(
            "Error al eliminar la categoria!",
            `${errorMessage}`,
            "error"
          );
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <React.Fragment>
      <table id="tabla-reparacion" className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre categoria</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((dato, index) => (
            <tr key={index}>
              <td>{iterador + index + 1}</td>
              <td>{dato.nombre_categoria}</td>
              <td>
                <button
                  className="btn-eliminar"
                  onClick={() => requestDeleteCategory(dato.id)}
                >
                  Eliminar
                </button>
              </td>
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

export default TableCategories;
