import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Filtro = ({ datos }) => {
  const [filtro, setFiltro] = useState("");

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const filtrarDatos = () => {
    const datosFiltrados = datos.filter(dato => {
      const nombreCompleto = `${dato.nombre} ${dato.apellido1} ${dato.apellido2}`;
      return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
    });
    return datosFiltrados;
  };


  if (!datos || datos.length === 0) {
    Swal.fire({
      title: 'Cargando los datos...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
  }

  let iterador = 0; 

  return (
    <React.Fragment>
      <div className="container-filtro">
        <input
          className="filtro-mediciones"
          type="text"
          value={filtro}
          onChange={handleFiltroChange}
          placeholder="Buscar medición"
        />
      </div>

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Completo</th>
            <th>Cédula</th>
            <th>Prenda</th>
          </tr>
        </thead>
        <tbody>
          {filtrarDatos().map((dato, index) => (
            <tr key={index}>
              <td>{iterador+=1}</td>
              <td >
                <Link className="link-nombre" to={`/mediciones/${dato.id}`}>{`${dato.nombre} ${dato.apellido1} ${dato.apellido2}`}</Link>
              </td>
              <td>{dato.cedula}</td>
              <td>{dato.articulo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default Filtro;
