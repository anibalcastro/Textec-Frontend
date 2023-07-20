import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Logo from '../../Images/Logos/Icono.jpg'

const EditarEmpresa = () => {
    const [empresa, setEmpresas] = useState([]);
  
    useEffect(() => {
      setEmpresas(obtenerInformacionEmpresa());
    },[])
  
    const obtenerInformacionEmpresa = () => {
        //console.log
    }
  
    const limpiarEstado = () => {
      setEmpresas([]);
    }


    return(
        <React.Fragment>
            <div className="container registro">
        <h2 className="titulo-encabezado">Registro de empresa</h2>
        <hr className="division"></hr>

        <div className="container form-contenedor">
          <form className="form-registro-clientes">
            <div className="div-inp">
              <label htmlFor="username">Empresa:</label>
              <input
                value={empresa.nombre}
                type="text"
                name="nombre"
                id="nombre"
                autoComplete="nombre"
                required
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Cédula:</label>
              <input
                value={empresa.cedula}
                type="text"
                name="cedula"
                id="cedula"
                autoComplete="current-password"
                required
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Correo electronico:</label>
              <input
                value={empresa.correo}
                type="text"
                name="correo"
                id="cedula"
                autoComplete="current-password"
                required
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Nombre del Encargado:</label>
              <input
                value={empresa.encargado}
                type="text"
                name="encargado"
                id="cedula"
                autoComplete="current-password"
                required
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Telefono:</label>
              <input
                value={empresa.telefono_encargado}
                type="text"
                name="telefono_encargado"
                id="cedula"
                autoComplete="current-password"
                required
                disabled
              />
            </div>

            <div className="div-inp">
              <label htmlFor="password">Dirección:</label>
              <textarea
                value={empresa.direccion}
                id="txtArea"
                name="direccion"
                rows="5"
                cols="60"
                disabled
              ></textarea>
            </div>

            <div className="div-inp">
              <label htmlFor="password">Observaciones:</label>
              <textarea
                value={empresa.observaciones}
                id="txtArea"
                name="observaciones"
                rows="5"
                cols="60"
                disabled
              ></textarea>
            </div>

            <div className="container botones-contenedor">
              <Link to="/empresas">
                <button className="btn-registrar">Regresar</button>
              </Link>
            </div>
          </form>

          <div className="container img-contenedor">
            <img className="isologo" src={Logo} alt="imagen" />
          </div>
        </div>
      </div>
        </React.Fragment>
    )
}

export default EditarEmpresa;