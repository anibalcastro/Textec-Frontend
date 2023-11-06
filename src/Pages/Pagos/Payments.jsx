import React, {useEffect, useState} from "react";
import Header from '../../components/Header/Header';
import FilterInvoice from "../../components/Filters/Filter-invoice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Payments = () => {
      // State to store products
  const [invoice, setInvoices] = useState([]);
  //Token activo
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const navigate = useNavigate();

  useEffect(() => {

    validateRole();
    
    const fetchInvoices = () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
    
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
    
      fetch("https://api.textechsolutionscr.com/api/v1/facturas", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.hasOwnProperty("data")) {
            const { data } = result;
            setInvoices(data);
          }
        })
        .catch((error) => console.log("error", error));
    };
    


    

    fetchInvoices();
    
  }, []);

  const validateRole = () => {
    if (!role === "Admin" || !role === "Colaborador") {
      navigate("/inicio");
    }
  }


    return (
        <React.Fragment>
            <Header title="Facturas" />

            <FilterInvoice datos={invoice} showMonto={true}/>

        </React.Fragment>
    )
}

export default Payments;