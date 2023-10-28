import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Cookies from "js-cookie";
import Header from '../../components/Header/Header';
import FilterSuppliers from '../../components/Filters/Filter-suppliers';

const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);

    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");

    useEffect(() => {
        const fetchSupplier = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://api.textechsolutionscr.com/api/v1/proveedores", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.hasOwnProperty("data")) {
                        const { data } = result;
                        setSuppliers(data);
                      } 
                })
                .catch(error => console.log('error', error));
        }


        fetchSupplier();
    },[]);

    const validatePermissions = () => {
        if (role === 'Admin' || role === 'Colaborador') {
          return true;
        }
    
        return false
    }

    const contributorPermissions  = validatePermissions();

    return (
        <React.Fragment>
            <Header title="Proveedores" />

            <div className='container mediciones-filtro'>
                {contributorPermissions && (<Link to="/proveedores/registrar"><button className='btn-registrar'>Registrar</button></Link>)}
            </div>

            <FilterSuppliers datos={suppliers} /> {/**Se pasa la lista de datos que se extrajo del API */}

        </React.Fragment>
    )
}

export default Supplier;