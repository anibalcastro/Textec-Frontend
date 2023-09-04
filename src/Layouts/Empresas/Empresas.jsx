import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FiltroEmpresa from "../../components/Filtros/Filtro-empresas";
import Cookies from "js-cookie";

const Empresas = () => {
    //Estado donde se almacenan las empresas
    const [listaEmpresa, setEmpresas] = useState([]);

    //Token activo
    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");

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
                    if (result.hasOwnProperty("data")) {
                        const { data } = result;
                        setEmpresas(data);
                        localStorage.setItem('empresas', JSON.stringify(data));
                      } 
                })
                .catch(error => console.log('error', error));
        }

        obtenerEmpresas();
    }, [])


    const validarPermisos = () => {
        if (role === 'Admin' || role === 'Colaborador') {
          return true;
        }
    
        return false
    }
    
    const permisosColaborador = validarPermisos();

    return (
        <React.Fragment>
      
                <h2 className="titulo-encabezado">Empresas</h2>
                <hr className="division"></hr>

                <div className="container mediciones-filtro">
                    {permisosColaborador && (  <Link to='/empresas/registro'>
                        <button className="btn-registrar">Registrar</button>
                    </Link>)}
                </div>

                <FiltroEmpresa datos={listaEmpresa} /> {/* Usar la lista de elementos actuales */}
       
        </React.Fragment>
    )
}

export default Empresas;