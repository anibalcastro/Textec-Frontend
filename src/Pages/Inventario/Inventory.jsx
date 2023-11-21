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
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("https://api.textechsolutionscr.com/api/v1/inventario/info", requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.hasOwnProperty("data")){
                const { data, status } = result;
                setInventory(data);
                if(status === 200){
                    Swal.close();
                }
            }
        })
        .catch(error => console.log('error', error));
    };

    fetchInventory();
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
    if (role === 'Admin' || role === 'Colaborador') {
      return true;
    }

    return false
}

const permisosColaborador = validarPermisos();

  return <React.Fragment>
    <Header title="Inventario" />

    <div className="container cbtn_inven">
                    {permisosColaborador && (  <Link to='/categorias'>
                                        <button className="btn-registrar">Categorias</button>
                                    </Link>)}

                    {permisosColaborador && (  <Link to='/inventario/entrada'>
                        <button className="btn-registrar">Entradas</button>
                    </Link>)}

                    {permisosColaborador && (  <Link to='/inventario/salida'>
                        <button className="btn-registrar">Salidas</button>
                    </Link>)}
                </div>

    <FilterInventory datos={inventory} />


  </React.Fragment>;
};

export default Inventory;
