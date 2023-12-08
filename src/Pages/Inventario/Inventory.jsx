import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import FilterInventory from "../../components/Filters/Filter-inventory";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const navigate = useNavigate();

  useEffect(() => {
    alertInvalidatePermission();
    const fetchInventory = () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "https://api.textechsolutionscr.com/api/v1/inventario/info",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.hasOwnProperty("data")) {
            const { data, status } = result;
            setInventory(data);
            if (status === 200) {
              Swal.close();
            }
          }
        })
        .catch((error) => console.log("error", error));
    };

    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Validate role
  const validateUserPermission = () => {
    if (role !== "Visor") {
      return true;
    }

    return false;
  };

  //Show alert if validateUserPermission is false
  const alertInvalidatePermission = () => {
    if (!validateUserPermission()) {
      Swal.fire(
        "Acceso denegado",
        "No tienes los permisos necesarios para realizar esta acción.",
        "info"
      ).then((result) => {
        if (result.isConfirmed) {
          navigate("/inicio");
        } else {
          navigate("/inicio");
        }
      });
    }
  };

  const validarPermisos = () => {
    if (role === "Admin" || role === "Colaborador") {
      return true;
    }

    return false;
  };

  const notifyAdmin = () => {

    generateInventory();


    Swal.fire({
      title: "¿Cómo desea notificar al administrador?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "WhatsApp",
      confirmButtonColor: 'black',
      cancelButtonText: "Correo electrónico",
      reverseButtons: true,
    }).then((result) => {
      
      const mensaje = 'Estimado administrador, espero que este mensaje le encuentre bien. Adjunto link: https://api.textechsolutionscr.com/storage/reportes/Inventario.pdf, para que pueda observar el inventario actualizado. Quedo a la espera de su pronta respuesta. ¡Gracias!';

      if (result.isConfirmed) {
        // Acción si el usuario elige WhatsApp
        const phoneNumber = "+50685424471"; // Número de teléfono de destino
        const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
          mensaje
        )}`;
        window.open(url, "_blank");
      } else if (result.dismiss === Swal.DismissReason.cancel) {        
        const email = 'anibalcastro1515@gmail.com';
        sendEmail(email, mensaje);
      }
    });
  };

  const sendEmail = (email, body) => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${token}`
    );

    var formdata = new FormData();
    formdata.append("email", email);
    formdata.append(
      "body", body
    );

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://api.textechsolutionscr.com/api/v1/email/notificacion", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const {mensaje} = result;

        if (mensaje === "Correo electrónico enviado con éxito"){
          Swal.fire(
            "¡Email enviado con éxito!",
            `Se ha enviado un email a ${email}!`,
            "success"
          );
        }
        else{
          Swal.fire(
            "¡Error!",
            `Ocurrio un error al enviar el email, intente luego!`,
            "error"
          );
        }
      })
      .catch((error) => console.log("Error durante la petición:", error));
  };

  const generateInventory = () => {
 
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer  ${token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`https://api.textechsolutionscr.com/api/v1/reporte-inventario`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
        })
        .catch(error => console.log('error', error));
  }

  const permisosColaborador = validarPermisos();

  return (
    <React.Fragment>
      <Header title="Inventario" />


      <FilterInventory datos={inventory} />

      <div className="container cbtn_inven">
        {permisosColaborador && (
          <Link to="/inventario/entrada">
            <button className="btn-registrar">Entradas</button>
          </Link>
        )}

        {permisosColaborador && (
          <Link to="/inventario/salida">
            <button className="btn-registrar">Salidas</button>
          </Link>
        )}

        {permisosColaborador && (
          <Link to="/categorias">
            <button className="btn-registrar">Categorias</button>
          </Link>
        )}

        {permisosColaborador && (
          
            <button className="btn-registrar" onClick={() => notifyAdmin()}>Notificar</button>
        
        )}
      </div>
    </React.Fragment>
  );
};

export default Inventory;
