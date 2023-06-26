import React from "react";
import { Link } from 'react-router-dom';

import Filtro from "../../components/filtro-clientes/Filtro-clientes";


const mediciones = () => {
    const datos = [
        {
          nombre: "Massiel Ponce Chavarria",
          cedula: "603030996",
          identificador: "1",
          empresa: "Condo's Vista al Volcán",
          departamento : 'Administración'
        },
        {
          nombre: "Anibal Castro Miranda",
          cedula: "204310766",
          identificador: "2",
          empresa: "Arenal Fitness Gym",
          departamento : 'Administración'
        },
        {
          nombre: "Allison Brenes Ledezma",
          cedula: "	208500333",
          identificador: "4",
          empresa: "Maddison DDB",
          departamento : 'Administración'
        },
        {
            nombre: "Carmen Ledezma Castro",
            cedula: "204450787",
            identificador: "5",
            empresa: "Virtual Outlet",
            departamento : 'Administración'
          },
          {
            nombre: "Fabricio Castro Ponce",
            cedula: "20850811",
            identificador: "6",
            empresa: "Independiente",
            departamento : 'Administración'
          },
          {
            nombre: "Roberto Brenes Garcia",
            cedula: "204970519",
            identificador: "7",
            empresa: "Independiente",
            departamento : 'Administración'
          },
          {
            nombre: "Josue Castro Ponce",
            cedula: "20850811",
            identificador: "8",
            empresa: "Textech",
            departamento : 'Administración'
          },
          {
            nombre: "Shannon Obregon Castro",
            cedula: "101110350",
            identificador: "9",
            empresa: "Fotos Oscar Obregon",
            departamento : 'Administración'
          },
          {
            nombre: "Anibal Jafeth Castro Ponce",
            cedula: "208110305",
            identificador: "10",
            empresa: "Soluciones Industriales AC",
            departamento : 'Administración'
          },

      ];
      

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

                <Filtro datos={datos} />


            </div>
        </React.Fragment>
    )
}

export default mediciones;