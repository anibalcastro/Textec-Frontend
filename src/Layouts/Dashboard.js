import React, { useEffect, useState } from "react";
import Logo from "../Images/Logos/Logo Textech.jpg";
import Card from "../components/card-information/card";
import Cookies from "js-cookie";

export default function Dashboard() {
  const token = Cookies.get("jwtToken");
  const [cantidadClientes, setCantidadCliente] = useState("");
  const [cantidadMedidas, setCantidadMedidas] = useState("");

  useEffect(() => {
    const consultaCantidadClientes = () => {
      let dataClientes = localStorage.getItem("data");
      dataClientes = JSON.parse(dataClientes);

      if (dataClientes) {
        setCantidadCliente(dataClientes.length);
      } else {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch("https://api.textechsolutionscr.com/api/v1/clientes", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.hasOwnProperty("data")) {
              const { data } = result;
              let cantidad = data.length;
              setCantidadCliente(cantidad);
              console.log(cantidadClientes);
            } else {
              //console.log("La respuesta de la API no contiene la propiedad 'data'");
              // Mostrar mensaje de error o realizar otra acción
            }
          })
          .catch((error) => console.log("error", error));
      }
    };

    const consultaCantidadMedidas = () => {
      let dataMedidas = localStorage.getItem("medidas");
      dataMedidas = JSON.parse(dataMedidas);

      if (dataMedidas) {
        setCantidadMedidas(dataMedidas.length);
      } else {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(
          "https://api.textechsolutionscr.com/api/v1/mediciones/clientes",
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            //console.log(result);
            if (result.hasOwnProperty("data")) {
              const { data } = result;
              setCantidadMedidas(data.length);
            } else {
              //console.log("La respuesta de la API no contiene la propiedad 'data'");
              // Mostrar mensaje de error o realizar otra acción
            }
          })
          .catch((error) => console.log("error", error));
      }
    };

    consultaCantidadClientes();
    consultaCantidadMedidas();
  }, [cantidadClientes, cantidadMedidas, token]);

  return (
    <React.Fragment>
      <div className="container dashboard">
        <h2 className="titulo-encabezado">Inicio</h2>

        <div className="information">
          <Card titulo="Pedidos" numero="10" color="#6d949c" />

          <Card titulo="Pendientes" numero="5" color="#94744C" />

          <Card titulo="En Proceso" numero="5" color="#6d949c" />

          <Card titulo="Entregados" numero="5" color="#94744C" />

          <Card titulo="Medidas" numero={cantidadMedidas} color="#6d949c" />

          <Card titulo="Clientes" numero={cantidadClientes} color="#94744C" />

          <Card titulo="Empresas" numero="50" color="#6d949c" />
        </div>
        <div className="container-logo">
          <img src={Logo} className="logo-textec" alt="Logo" />
        </div>
      </div>
    </React.Fragment>
  );
}
