import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FiltroProductos from "../../components/filtro-productos/Filtro-productos";
import Cookies from "js-cookie";

const Productos = () => {
    //Estado donde se almacenan las empresas
    const [listaProductos, setProductos] = useState([]);

    //Token activo
    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");

    useEffect(() => {
        const obtenerProductos = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://api.textechsolutionscr.com/api/v1/productos", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.hasOwnProperty("data")) {
                        const { data } = result;
                        setProductos(data);
                        localStorage.setItem('productos', JSON.stringify(data));
                      } 
                })
                .catch(error => console.log('error', error));
        }

        obtenerProductos();
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
            <div className="container mediciones">
                <h2 className="titulo-encabezado">Productos</h2>
                <hr className="division"></hr>

                <div className="container mediciones-filtro">
                    {permisosColaborador && (  <Link to='/productos/registro'>
                        <button className="btn-registrar">Registrar</button>
                    </Link>)}
                </div>

                <FiltroProductos datos={listaProductos} /> {/* Usar la lista de elementos actuales */}
            </div>
        </React.Fragment>
    )
}

export default Productos;