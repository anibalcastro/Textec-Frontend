import React from "react";

const Header = (props) =>{
    

    return (
        <React.Fragment>
            <h2 className="titulo-encabezado">{props.title}</h2>
            <hr className="division"></hr>
        </React.Fragment>
    )
}

export default Header;