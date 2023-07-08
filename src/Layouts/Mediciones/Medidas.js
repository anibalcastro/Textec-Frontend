import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

import Filtro from "../../components/filtro-mediciones/Filtro-mediciones";

const Mediciones = () => {
  const [listaClientes, setListaClientes] = useState([]);
  const token = Cookies.get("jwtToken");
  
  useEffect(() => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
    const solicitudClientesApi = async () => {
      try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
  
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
  
        const response = await fetch("https://api.textechsolutionscr.com/api/v1/clientes", requestOptions);
        const result = await response.json();
  
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setListaClientes(data);
          localStorage.setItem('data', JSON.stringify(data));
        } else {
          //console.log("La respuesta de la API no contiene la propiedad 'data'");
          // Mostrar mensaje de error o realizar otra acción
        }
      } catch (error) {
        console.log('error', error);
      }
    };

 
    const fetchData = async () => {
      await delay(1000);
      await solicitudClientesApi();
    };
  
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
   

  return (
    <React.Fragment>
      <div className="container mediciones">
        <h2 className="titulo-encabezado">Mediciones</h2>
        <hr className="division"></hr>

        <div className="container mediciones-filtro">
          <Link to='/mediciones/registro'>
            <button className="btn-registrar">Registrar</button>
          </Link>
        </div>

        <Filtro datos={listaClientes} /> {/* Utilizando el nombre actualizado del estado */}

      </div>
    </React.Fragment>
  )
}


export default Mediciones;