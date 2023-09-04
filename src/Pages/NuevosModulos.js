import React from "react";
import { Link } from "react-router-dom";

const NuevosModulos = () => {


    return(
        <React.Fragment>
            <div className="modulos">
            <h2 className="titulo-encabezado">Nuevos modulos</h2>
                <hr className="division"></hr>
                <div className="container modulos-nuevos">
                <p className="textech">Estamos trabajando en nuevos módulos de la aplicación Textech.</p>
                <Link to='/inicio'>
                    <button className="btn-regresar">
                        Regresar
                    </button>
                </Link>

                </div> 
            </div>
        </React.Fragment>
    )
}

export default NuevosModulos;