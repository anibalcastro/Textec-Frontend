import React, {useEffect, useState} from "react";
import Header from '../../components/Header/Header';
import FilterOrders from "../../components/Filters/Filter-orders";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Payments = () => {
      // State to store products
  const [orders, setOrders] = useState([]);
  //Token activo
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const navigate = useNavigate();

  useEffect(() => {

    validateRole();
    const fetchOrders = () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://api.textechsolutionscr.com/api/v1/ordenes", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.hasOwnProperty("ordenes")) {
            const { ordenes } = result;
            setOrders(ordenes);
            localStorage.setItem("ordenes", JSON.stringify(ordenes));
          }
        })
        .catch((error) => console.log("error", error));
    };


    fetchOrders();
    
  }, []);

  const validateRole = () => {
    if (!role === "Admin" || !role === "Colaborador") {
      navigate("/inicio");
    }
  }


    return (
        <React.Fragment>
            <Header title="Facturas" />

            <FilterOrders datos={orders} showMonto={true}/>

        </React.Fragment>
    )
}

export default Payments;