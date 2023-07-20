import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FiltroEmpresa from "../../components/filtro-empresas/Filtro-empresas";
import Cookies from "js-cookie";

const Empresas = () => {
    //Estado donde se almacenan las empresas
    const [listaEmpresa, setEmpresas] = useState([]);

    //Token activo
    const token = Cookies.get("jwtToken");

    useEffect(() => {
        const obtenerEmpresas = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://api.textechsolutionscr.com/api/v1/empresas", requestOptions)
                .then(response => response.json())
                .then(result => {
                    const {data} = result;
                    //console.log(data);
                    window.localStorage.setItem('empresas', data);
                    setEmpresas(data);
                })
                .catch(error => console.log('error', error));
        }

        obtenerEmpresas();
    }, [])



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