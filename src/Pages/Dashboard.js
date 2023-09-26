import React, { useEffect, useState } from "react";
import Logo from "../Images/Logos/Logo Textech.png";
import Card from "../components/card-information/card";
import Cookies from "js-cookie";

export default function Dashboard() {
  const token = Cookies.get("jwtToken");
  const [cantidadClientes, setCantidadCliente] = useState("");
  const [cantidadMedidas, setCantidadMedidas] = useState("");
  const [cantidadEmpresas, setCantidadEmpresas] = useState("");
  const [cantidadOrdenes, setCantidadOrdenes] = useState("");
  const [ordenesProceso, setOrdenesProceso] = useState("");
  const [ordenesEntregadas, setOrdenesEntregadas] = useState("");
  const [ordenesListas, setOrdenesListas] = useState("");
  const [ordenesPendientes, setOrdenesPendientes] = useState("");

  useEffect(() => {
    const consultaCantidadClientes = async () => {
      let dataClientes = localStorage.getItem("data");
      dataClientes = JSON.parse(dataClientes);

      if (dataClientes) {
        setCantidadCliente(dataClientes.length);
      } else {
        try {
          var myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);

          var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };

          const response = await fetch(
            "https://api.textechsolutionscr.com/api/v1/clientes",
            requestOptions
          );
          const result = await response.json();

          if (result.hasOwnProperty("data")) {
            const { data } = result;
            let cantidad = data.length;
            setCantidadCliente(cantidad);
            //console.log(cantidadClientes);
          } else {
            //console.log("La respuesta de la API no contiene la propiedad 'data'");
            // Mostrar mensaje de error o realizar otra acción
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    };

    const consultaCantidadMedidas = async () => {
      let dataMedidas = localStorage.getItem("medidas");
      dataMedidas = JSON.parse(dataMedidas);

      if (dataMedidas) {
        setCantidadMedidas(dataMedidas.length);
      } else {
        try {
          var myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);

          var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };

          const response = await fetch(
            "https://api.textechsolutionscr.com/api/v1/mediciones/clientes",
            requestOptions
          );
          const result = await response.json();

          if (result.hasOwnProperty("data")) {
            const { data } = result;
            setCantidadMedidas(data.length);
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    };

    const consultaCantidadEmpresa = () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "https://api.textechsolutionscr.com/api/v1/empresas/cantidad",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          let cantidad = result.cant_empresas;
          setCantidadEmpresas(cantidad);
        })
        .catch((error) => console.log("error", error));
    };

    const consultaCantidadPedidos = () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
    

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://api.textechsolutionscr.com/api/v1/ordenes/cantidad", requestOptions)
        .then((response) => response.json())
        .then((result) => {
      
          setOrdenesPendientes(result.cantidad_pendientes);
          setOrdenesProceso(result.cantidad_enproceso);
          setOrdenesListas(result.cantidad_listos);
          setOrdenesEntregadas(result.cantidad_entragados);

          const sumaTotal = parseInt(result.cantidad_pendientes) + parseInt(result.cantidad_enproceso) + parseInt(result.cantidad_listos) + parseInt(result.cantidad_entragados);

          setCantidadOrdenes(sumaTotal);

        })
        .catch((error) => console.log("error", error));
    };

    consultaCantidadEmpresa();
    consultaCantidadClientes();
    consultaCantidadMedidas();
    consultaCantidadPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <h2 className="titulo-encabezado">Inicio</h2>

      <div className="information">
        <Card titulo="Orden de Pedidos" numero={cantidadOrdenes} color="#6d949c" />

        <Card titulo="Orden de Pedidos Pendientes" numero={ordenesPendientes} color="#94744C" />

        <Card titulo="Orden de Pedidos En Proceso" numero={ordenesProceso} color="#6d949c" />

        <Card titulo="Orden de Pedidos Listos" numero={ordenesListas} color="#94744C" />

        <Card titulo="Orden de Pedidos Entregados" numero={ordenesEntregadas} color="#6d949c" />

        <Card titulo="Medidas" numero={cantidadMedidas} color="#94744C" />

        <Card titulo="Clientes" numero={cantidadClientes} color="#6d949c" />

        <Card titulo="Empresas" numero={cantidadEmpresas} color="#94744C" />
      </div>
      <div className="container-logo">
        <img src={Logo} className="logo-textec" alt="Logo" />
      </div>
    </React.Fragment>
  );
}
