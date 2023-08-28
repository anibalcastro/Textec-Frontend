import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductFilter  from "../../components/filtro-productos/Filtro-productos";
import Cookies from "js-cookie";

const Productos = () => {
    // State to store products
    const [productList, setProducts] = useState([]);

    //Token activo
    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");

    console.log(token);

    useEffect(() => {
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
    }, [])


    const validatePermissions = () => {
        if (role === 'Admin' || role === 'Colaborador') {
          return true;
        }
    
        return false
    }
    
    const contributorPermissions  = validatePermissions();

    return (
        <React.Fragment>
            <div className="container mediciones">
                <h2 className="titulo-encabezado">Productos</h2>
                <hr className="division"></hr>

                <div className="container mediciones-filtro">
                    {contributorPermissions  && (  <Link to='/productos/registro'>
                        <button className="btn-registrar">Registrar</button>
                    </Link>)}
                </div>

                <ProductFilter  datos={productList} /> {/* Usar la lista de elementos actuales */}
            </div>
        </React.Fragment>
    )
}

export default Productos;