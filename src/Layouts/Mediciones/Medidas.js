import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

import Filtro from "../../components/filtro-clientes/Filtro-clientes";

const Mediciones = () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const [clientes, setClientes] = useState([]);
  const token = Cookies.get("jwtToken");
  
  useEffect(() => {
    const solicitudMedidasApi = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
  
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
  
      try {
        const response = await fetch("https://api.textechsolutionscr.com/api/v1/mediciones/clientes", requestOptions);
        const result = await response.json();
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          localStorage.setItem('medidas', JSON.stringify(data));
        } else {
          //console.log("La respuesta de la API no contiene la propiedad 'data'");
          // Mostrar mensaje de error o realizar otra acción
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    const solicitudClientesApi = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
  
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
  
      try {
        const response = await fetch("https://api.textechsolutionscr.com/api/v1/clientes", requestOptions);
        const result = await response.json();
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setClientes(data);
        } else {
          //console.log("La respuesta de la API no contiene la propiedad 'data'");
          // Mostrar mensaje de error o realizar otra acción
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    const fetchData = async () => {
      await Promise.all([
        solicitudMedidasApi(),
        solicitudClientesApi()
      ]);
    }
  
    const fetchDataWithDelay = async () => {
      await delay(500);
      await fetchData();
    }
  
    fetchDataWithDelay();
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

        <Filtro datos={clientes} />


      </div>
    </React.Fragment>
  )
}

export default Mediciones;