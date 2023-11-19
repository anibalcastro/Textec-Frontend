import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductFilter  from "../../components/Filters/Filtro-productos";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Productos = () => {
    // State to store products
    const [productList, setProducts] = useState([]);

    //Token activo
    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");
    const navigate = useNavigate();

    useEffect(() => {
        alertInvalidatePermission();
        const fetchProducts = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://api.textechsolutionscr.com/api/v1/productos", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.hasOwnProperty("data")) {
                        const { data } = result;
                        setProducts(data);
                        localStorage.setItem('productos', JSON.stringify(data));
                      } 
                })
                .catch(error => console.log('error', error));
        }

        fetchProducts();
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


    const validatePermissions = () => {
        if (role === 'Admin' || role === 'Colaborador') {
          return true;
        }
    
        return false
    }
    
    const contributorPermissions  = validatePermissions();

    return (
        <React.Fragment>
            
                <h2 className="titulo-encabezado">Productos</h2>
                <hr className="division"></hr>

                <div className="container mediciones-filtro">
                    {contributorPermissions  && (  <Link to='/productos/registro'>
                        <button className="btn-registrar">Registrar</button>
                    </Link>)}
                </div>

                <ProductFilter  datos={productList} /> {/* Usar la lista de elementos actuales */}
           
        </React.Fragment>
    )
}

export default Productos;