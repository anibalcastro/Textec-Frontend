import React from "react";
import { Link } from "react-router-dom";

const NoEncontrada = () => {


    return(
        <React.Fragment>
            <div className="modulos">
            <h2 className="titulo-encabezado">Página Incorrecta</h2>
                <hr className="division"></hr>
                <div className="container modulos-nuevos">
                <p className="textech">La dirección que proporcionaste, no esta definida en nuestra aplicación web, por favor dirijase al inicio.</p>
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

export default NoEncontrada;