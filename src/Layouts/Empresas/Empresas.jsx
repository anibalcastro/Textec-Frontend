import React from "react";
import { Link } from "react-router-dom";
import FiltroEmpresa from "../../components/filtro-empresas/Filtro-empresas";

const Empresas = () => {

    let listaEmpresa = [{'id':1, 'nombre':'Arenal Fitness Gym'},{'id':2, 'nombre':'Condos Vista al Volcán'}];

    return (
        <React.Fragment>
            <div className="container mediciones">
                <h2 className="titulo-encabezado">Empresas</h2>
                <hr className="division"></hr>

                <div className="container mediciones-filtro">
                    <Link to='/empresas/registro'>
                        <button className="btn-registrar">Registrar</button>
                    </Link>
                </div>

                <FiltroEmpresa datos={listaEmpresa} /> {/* Utilizando el nombre actualizado del estado */}

            </div>
        </React.Fragment>
    )
}

export default Empresas;