import React from "react";
import { Link } from 'react-router-dom';

import Filtro from "../components/filtro-mediciones/Filtro-mediciones";


const mediciones = () => {
    const datos = [
        {
          nombre: "Massiel Ponce Chavarria",
          cedula: "603030996",
          identificador: "1",
          prenda: "Camisa"
        },
        {
          nombre: "Anibal Castro Miranda",
          cedula: "204310766",
          identificador: "2",
          prenda: "Pantalón"
        },
        {
          nombre: "Allison Brenes Ledezma",
          cedula: "	208500333",
          identificador: "4",
          prenda: "Blusa"
        },
        {
            nombre: "Carmen Ledezma Castro",
            cedula: "204450787",
            identificador: "5",
            prenda: "Pantalón"
          },
          {
            nombre: "Fabricio Castro Ponce",
            cedula: "20850811",
            identificador: "6",
            prenda: "Camisa"
          },
          {
            nombre: "Roberto Brenes Garcia",
            cedula: "204970519",
            identificador: "7",
            prenda: "Camisa"
          },
          {
            nombre: "Fabricio Castro Ponce",
            cedula: "20850811",
            identificador: "8",
            prenda: "Camisa"
          },
          {
            nombre: "Shannon Obregon Castro",
            cedula: "101110350",
            identificador: "9",
            prenda: "Camisa"
          },
          {
            nombre: "Anibal Jafeth Castro Ponce",
            cedula: "20850811",
            identificador: "10",
            prenda: "Camisa"
          },

      ];
      

    return (
        <React.Fragment>
            <div className="container mediciones">
                <h2 className="titulo-encabezado">Mediciones</h2>
                <hr className="division"></hr>

                <div className="container mediciones-filtro">
                    <Link to='/mediciones/registrar'>
                        <button className="btn-registrar">Registrar</button>
                    </Link>
                </div>

                <Filtro datos={datos} />


            </div>
        </React.Fragment>
    )
}

export default mediciones;