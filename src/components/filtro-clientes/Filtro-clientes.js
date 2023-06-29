import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';


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

  let contador = 0

  if (!datos || datos.length === 0) {
    Swal.fire({
      title: 'Cargando los datos...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
  }
  

  return (
    <React.Fragment>
      <div className="container-filtro">
        <input
          className="filtro-mediciones"
          type="text"
          value={filtro}
          onChange={handleFiltroChange}
          placeholder="Buscar Cliente"
        />
      </div>

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Completo</th>
            <th>Cédula</th>
            <th>Empresa</th>
            <th>Departamento</th>
          </tr>
        </thead>
        <tbody>
          {filtrarDatos().map((dato, index) => (
            
            <tr key={index}>
              <td>{contador+=1}</td>
              <td >
                <Link className="link-nombre" to={`/clientes/${dato.id}`}>{`${dato.nombre} ${dato.apellido1} ${dato.apellido2}`}</Link>
              </td>

              <td>{dato.cedula}</td>
              <td>{dato.empresa}</td>
              <td>{dato.departamento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default Filtro;
