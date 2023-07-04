import React, { useEffect } from "react";
import logo from "../../Images/Logos/Isologo.jpg";


export default function Encabezado () {

    useEffect(() => {
        if(window.innerWidth > 600){
            mostrarMenu();
        }
    },[])

    const ocultarMenu = () => {
        const menu = document.getElementById('menuVertical');
        if (menu) {
          menu.style.display = 'none';
        }
      };
      
      const mostrarMenu = () => {
        const menu = document.getElementById('menuVertical');
        if (menu) {
          menu.style.display = 'block';
        }
      };
      
      const menu = () => {
        const menu = document.getElementById('menuVertical');
        if (menu) {
          if (window.innerWidth < 600) {
            if (menu.style.display === 'none') {
              mostrarMenu();
            } else {
              ocultarMenu();
            }
          }
          else{
            mostrarMenu();
          }
        }
      };
      
    return(
        <React.Fragment>
            <div className="encabezado">
                <button onClick={menu} className="btn-transparente">
                <img className="logo" src={logo}  alt="Logo de la empresa"/>
                </button>
                
            </div>
        </React.Fragment>
    )

}