import React, { useState } from "react";
import {
  FaHome,
  FaBars,
  FaCity,
  FaUserAlt,
  FaCashRegister,
  FaClipboardList,
  FaCropAlt,
  FaChartLine,
  FaCube,
  FaCalendar,
} from "react-icons/fa";
import { BsTools } from "react-icons/bs";
import { GiRolledCloth, GiClothes } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";

import logo from "../../Images/Logos/Icono.webp";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { NavLink } from "react-router-dom";

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const role = Cookies.get("role");
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const menuItemAdmin = [
    {
      path: "/",
      name: "Inicio",
      icon: <FaHome />,
    },
    {
      path: "/clientes",
      name: "Clientes",
      icon: <FaUserAlt />,
    },
    {
      path: "/empresas",
      name: "Empresas",
      icon: <FaCity />,
    },
    {
      path: "/mediciones",
      name: "Mediciones",
      icon: <FaCropAlt />,
    },
    {
      path: "/productos",
      name: "Productos",
      icon: <GiClothes />,
    },
    {
      path: "/orden",
      name: "Pedidos",
      icon: <FaClipboardList />,
    },
    {
      path: "/pagos",
      name: "Pagos",
      icon: <FaCashRegister />,
    },
    {
      path: "/reparaciones",
      name: "Reparar",
      icon: <BsTools />,
    },
    {
      path: "/proveedores",
      name: "Proveedores",
      icon: <FaCube />,
    },
    {
      path: "/inventario",
      name: "Inventario",
      icon: <GiRolledCloth />,
    },
    {
      path: "/reportes",
      name: "Reportes",
      icon: <FaChartLine />,
    },
    {
      path: "/calendario",
      name: "Calendario",
      icon: <FaCalendar />,
    },
  ];
  const menuItemColaborator = [
    {
      path: "/",
      name: "Inicio",
      icon: <FaHome />,
    },
    {
      path: "/clientes",
      name: "Clientes",
      icon: <FaUserAlt />,
    },
    {
      path: "/empresas",
      name: "Empresas",
      icon: <FaCity />,
    },
    {
      path: "/mediciones",
      name: "Mediciones",
      icon: <FaCropAlt />,
    },
    {
      path: "/productos",
      name: "Productos",
      icon: <GiClothes />,
    },
    {
      path: "/orden",
      name: "Pedidos",
      icon: <FaClipboardList />,
    },
    {
      path: "/pagos",
      name: "Pagos",
      icon: <FaCashRegister />,
    },
    {
      path: "/reparaciones",
      name: "Reparar",
      icon: <BsTools />,
    },
    {
      path: "/proveedores",
      name: "Proveedores",
      icon: <FaCube />,
    },
    {
      path: "/inventario",
      name: "Inventario",
      icon: <GiRolledCloth />,
    },
    {
      path: "/calendario",
      name: "Calendario",
      icon: <FaCalendar />,
    },
  ];

  const menuItemExpect = [
    {
      path: "/",
      name: "Inicio",
      icon: <FaHome />,
    },
    {
      path: "/clientes",
      name: "Clientes",
      icon: <FaUserAlt />,
    },
    {
      path: "/empresas",
      name: "Empresas",
      icon: <FaCity />,
    },
    {
      path: "/mediciones",
      name: "Mediciones",
      icon: <FaCropAlt />,
    },
    {
      path: "/orden",
      name: "Pedidos",
      icon: <FaClipboardList />,
    },
    {
      path: "/reparaciones",
      name: "Reparar",
      icon: <BsTools />,
    },
    {
      path: "/inventario",
      name: "Inventario",
      icon: <GiRolledCloth />,
    },
    {
      path: "/calendario",
      name: "Calendario",
      icon: <FaCalendar />,
    },
  ];

  const exit = () => {
    Cookies.remove("jwtToken");
    localStorage.clear();
    navigate("/");
    window.location.replace("/");
  };

  const isAdmin = role === "Admin";
  const isColaborator = role === "Colaborador";
  const isEspectador = role === "Visor";

  return (
    <div className="container">
      <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            <img className="logo-menu" src={logo} alt="logo" />
          </h1>
          <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {isAdmin
          && menuItemAdmin.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className="link"
               
              >
                <div className="icon">{item.icon}</div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  {item.name}
                </div>
              </NavLink>
            )) }
            
          {isColaborator && menuItemColaborator.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className="link"
                activeclassname="active"
               
              >
                <div className="icon">{item.icon}</div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                  activeclassname="active"
                >
                  {item.name}
                </div>
              </NavLink>
            ))}

            {isEspectador && menuItemExpect.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className="link"
                activeclassname="active"
               
              >
                <div className="icon">{item.icon}</div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                  activeclassname="active"
                >
                  {item.name}
                </div>
              </NavLink>))}


        <NavLink
          to="#"
          key={1}
          className="link"
          activeclassname="active"
          onClick={() => exit()}
        >
          <div className="icon">
            <FiLogOut />
          </div>
          <div
            style={{ display: isOpen ? "block" : "none" }}
            className="link_text"
          >
            Salir
          </div>
        </NavLink>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
