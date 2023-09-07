import React,{useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Orders = () => {
    // State to store products
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        
    },[])

    //Token activo
    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");

    const validatePermissions = () => {
        if (role === 'Admin' || role === 'Colaborador') {
          return true;
        }
    
        return false
    }
    
    const contributorPermissions  = validatePermissions();


    return(
        <React.Fragment>
             <div className="container mediciones">
                <h2 className="titulo-encabezado">Orden de pedidos</h2>
                <hr className="division"></hr>

                <div className="container mediciones-filtro">
                    {contributorPermissions && (  <Link to='/ordenpedido/crear'>
                        <button className="btn-registrar">Crear Orden</button>
                    </Link>)}
                </div>
            </div>

        </React.Fragment>
    )
}

export default Orders;