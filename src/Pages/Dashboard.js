import React, { useEffect, useState } from "react";
import Logo from "../Images/Logos/Logo Textech.webp";
import Card from "../components/card-information/card";
import Cookies from "js-cookie";

export default function Dashboard() {
  const token = Cookies.get("jwtToken");
  const [cantidadClientes, setCantidadCliente] = useState("");
  const [cantidadMedidas, setCantidadMedidas] = useState("");
  const [cantidadEmpresas, setCantidadEmpresas] = useState("");
  const [cantidadOrdenes, setCantidadOrdenes] = useState("");
  const [ordenesTaller, setOrdenesTaller] = useState(0);
  const [ordenesEntregaTienda, setOrdenesEntregaTienda] = useState(0);
  const [ordenesEntregadaCliente, setOrdenesEntregadaCliente] = useState(0);

  useEffect(() => {
    const consultaCantidadClientes = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        "https://api.textechsolutionscr.com/api/v1/clientes/cantidad/cantidad",
        requestOptions
      );
      const result = await response.json();

      const { cantidad_clientes } = result;
      setCantidadCliente(cantidad_clientes);
    };

    const consultaCantidadMedidas = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        "https://api.textechsolutionscr.com/api/v1/mediciones/cantidad/cantidad",
        requestOptions
      );
      const result = await response.json();

      if (result.hasOwnProperty("cantidad_mediciones")) {
        const { cantidad_mediciones } = result;
        setCantidadMedidas(cantidad_mediciones);
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

      fetch(
        "https://api.textechsolutionscr.com/api/v1/ordenes/cantidad",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setOrdenesTaller(result.cantidad_taller);
          setOrdenesEntregaTienda(result.cantidad_entrega_tienda);
          setOrdenesEntregadaCliente(result.cantidad_entrega_cliente);

          const sumaTotal =
            parseInt(result.cantidad_taller) +
            parseInt(result.cantidad_entrega_tienda) +
            parseInt(result.cantidad_entrega_cliente);

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
        <Card
          titulo="Orden de Pedidos"
          numero={cantidadOrdenes}
          color="#6d949c"
        />

        <Card
          titulo="Orden de Pedidos Taller"
          numero={ordenesTaller}
          color="#94744C"
        />

        <Card
          titulo="Orden de Pedidos Entregada tienda"
          numero={ordenesEntregaTienda}
          color="#6d949c"
        />

        <Card
          titulo="Orden de Pedidos Entregada cliente"
          numero={ordenesEntregadaCliente}
          color="#94744C"
        />

        <Card titulo="Medidas" numero={cantidadMedidas} color="#6d949c" />

        <Card titulo="Clientes" numero={cantidadClientes} color="#94744C" />

        <Card titulo="Empresas" numero={cantidadEmpresas} color="#6d949c" />
      </div>
      <div className="container-logo">
        <img src={Logo} className="logo-textec" alt="Logo" />
      </div>
    </React.Fragment>
  );
}
