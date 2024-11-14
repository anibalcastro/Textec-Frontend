import React, {useEffect, useState} from "react";
import Header from '../../components/Header/Header';
import FilterInvoice from "../../components/Filters/Filter-invoice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Payments = () => {
      // State to store products
  const [invoice, setInvoices] = useState([]);
  //Token activo
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const navigate = useNavigate();

  useEffect(() => {
    alertInvalidatePermission();
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
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  const validateUserPermission = () => {
    if (role !== "Visor"){
      return true
    }

    return false
  }

  const alertInvalidatePermission = () => {
    if (!validateUserPermission()){
      Swal.fire(
        "Acceso denegado",
        "No tienes los permisos necesarios para realizar esta acción.",
        "info"
      ).then((result) => {
        if(result.isConfirmed){
          navigate("/inicio")
        }
        else{
          navigate("/inicio")
        }
      })

    }

  }

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