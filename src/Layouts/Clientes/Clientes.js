import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

import Filtro from "../../components/filtro-clientes/Filtro-clientes";

const Clientes = () => {
  const [listaClientes, setListaClientes] = useState([]); // Cambiado el nombre de la variable del estado

  const token = Cookies.get("jwtToken");

  useEffect(() => {
    setTimeout(() => {
      solicitudClientesApi();
    }, 1000);
  }, []);

  const solicitudClientesApi = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://127.0.0.1:8000/api/v1/clientes", requestOptions)
      .then(response => response.json())
      .then(result => {
        //console.log(result);
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setListaClientes(data);
          localStorage.setItem('data', JSON.stringify(data));
        } else {
          //console.log("La respuesta de la API no contiene la propiedad 'data'");
          // Mostrar mensaje de error o realizar otra acción
        }
      })
      .catch(error => console.log('error', error));
  }

  return (
    <React.Fragment>
      <div className="container mediciones">
        <h2 className="titulo-encabezado">Clientes</h2>
        <hr className="division"></hr>

        <div className="container mediciones-filtro">
          <Link to='/clientes/registro'>
            <button className="btn-registrar">Registrar</button>
          </Link>
        </div>

        <Filtro datos={listaClientes} /> {/* Utilizando el nombre actualizado del estado */}

      </div>
    </React.Fragment>
  )
}

export default Clientes; // Cambiado el nombre del componente para que comience con mayúscula
