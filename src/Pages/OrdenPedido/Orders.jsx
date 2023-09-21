import React,{useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import FilterOrders from "../../components/Filters/Filter-orders";

const Orders = () => {
    // State to store products
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("http://127.0.0.1:8000/api/v1/ordenes", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.hasOwnProperty("data")) {
                        const { data } = result;
                        setOrders(data);
                        localStorage.setItem('ordenes', JSON.stringify(data));
                      } 
                })
                .catch(error => console.log('error', error));
        }



        fetchOrders();
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
           
                <h2 className="titulo-encabezado">Orden de pedidos</h2>
                <hr className="division"></hr>

                <div className="container mediciones-filtro">
                    {contributorPermissions && (  <Link to='/orden/registro'>
                        <button className="btn-registrar">Crear Orden</button>
                    </Link>)}
                </div>
          
            <FilterOrders datos={orders} />

        </React.Fragment>
    )
}

export default Orders;