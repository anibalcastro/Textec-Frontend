import React from "react";
import logo from "../../Images/Logos/Isologo.jpg";


export default function encabezado () {


    return(
        <React.Fragment>
            <div className="encabezado">
                <img className="logo" src={logo}  alt="Logo de la empresa"/>
                
            </div>
        </React.Fragment>
    )

}