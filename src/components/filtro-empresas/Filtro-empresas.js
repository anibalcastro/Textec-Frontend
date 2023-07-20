import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const FiltroEmpresa = ({ datos }) => {
  const [filtro, setFiltro] = useState("");

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const filtrarDatos = () => {
    const datosFiltrados = datos.filter((dato) => {
      const nombreCompleto = `${dato.nombre} ${dato.apellido1} ${dato.apellido2}`;
      return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
    });
    return datosFiltrados;
  };

  if (!datos || datos.length === 0) {
    Swal.fire({
      title: "Cargando los datos...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
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
          placeholder="Buscar empresa"
        />
      </div>

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Empresa</th>
          </tr>
        </thead>
        <tbody>
          {filtrarDatos()
            .reverse()
            .map((dato, index) => (
              <tr key={index}>
                <td>{(iterador += 1)}</td>
                <td>
                  <Link
                    className="link-nombre"
                    to={`/empresa/${dato.id}`}
                  >{`${dato.nombre}`}</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default FiltroEmpresa;
