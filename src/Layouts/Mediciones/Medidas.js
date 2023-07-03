import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

import Filtro from "../../components/filtro-mediciones/Filtro-mediciones";

const Mediciones = () => {
  const [medidas, setMedidas] = useState([]);
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    setTimeout(() => {
      solicitudMedidasApi();
    }, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const solicitudMedidasApi = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}` );

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://api.textechsolutionscr.com/api/v1/mediciones/clientes", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setMedidas(data);
          localStorage.setItem('medidas', JSON.stringify(data));
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
        <h2 className="titulo-encabezado">Mediciones</h2>
        <hr className="division"></hr>

        <div className="container mediciones-filtro">
          <Link to='/mediciones/registro'>
            <button className="btn-registrar">Registrar</button>
          </Link>
        </div>

        <Filtro datos={medidas} />


      </div>
    </React.Fragment>
  )
}

export default Mediciones;