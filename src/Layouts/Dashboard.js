import React from "react";
import Logo from "../Images/Logos/Logo Textech.jpg";
import Card from "../components/card-information/card";

export default function dashboard() {
  
  return (
    <React.Fragment>
      <div className="container dashboard">
        <h2 className="titulo-encabezado">Inicio</h2>

        <div className="information">
          <Card titulo="Pedidos" numero="10" color="#6d949c" />

          <Card titulo="Pendientes" numero="5" color="#94744C" />

          <Card titulo="En Proceso" numero="5" color="#6d949c" />

          <Card titulo="Entregados" numero="5" color="#94744C" />

          <Card titulo="Medidas" numero="20" color="#6d949c" />

          <Card titulo="Clientes" numero="20" color="#94744C" />
        </div>
        <div className="container-logo">
        <img src={Logo} className="logo-textec" alt="Logo" />
        </div>
      </div>
    </React.Fragment>
  );
}
