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

  const downloadInventory = () => {
    Swal.fire({
      title: 'Generando el PDF',
      text: 'Espere un momento...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

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
          const download_url = decodeURIComponent(result.download_url);
          const downloadLink = document.createElement("a");
          downloadLink.href = download_url;
          downloadLink.target = "_self"; // Abrir en una nueva pestaña
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          Swal.close();
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
          
            <button className="btn-registrar" onClick={() => downloadInventory()}>Descargar Inventario</button>
        
        )}
      </div>
    </React.Fragment>
  );
};

export default Inventory;
