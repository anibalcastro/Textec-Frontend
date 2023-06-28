import React from "react";
import Swal from "sweetalert2";


const Alerta = (props) => {
    const [tipo, titulo, descripcion] = props;
    return(
        Swal.fire(
            {titulo},
            {descripcion},
            {tipo}
          )
    )

}

export default Alerta;