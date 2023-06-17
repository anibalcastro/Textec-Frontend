import React, { useState } from "react";
import { Link } from "react-router-dom";

const Filtro = ({ datos }) => {
  const [filtro, setFiltro] = useState("");

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const filtrarDatos = () => {
    // Aplica el filtro a los datos
    const datosFiltrados = datos.filter((dato) =>
      dato.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
    return datosFiltrados;
  };

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
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filtrarDatos().map((dato, index) => (
            <tr key={index}>
              <td>{dato.identificador}</td>
              <td>{dato.nombre}</td>
              <td>{dato.cedula}</td>
              <td>{dato.prenda}</td>
              <td><Link to={`/mediciones/${dato.identificador}`}>
                <button className="btn-observar">Observar</button>  
              </Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default Filtro;
