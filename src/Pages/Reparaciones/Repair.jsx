import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Cookies from "js-cookie";
import Header from '../../components/Header/Header';
import FilterRepair from '../../components/Filters/Filter-repair';

const Repairs = () => {
    const [repairs, setRepairs] = useState([]);

    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");

    useEffect(() => {

        const fetchRepair = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };

            fetch("https://api.textechsolutionscr.com/api/v1/reparaciones", requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.hasOwnProperty("reparaciones")) {
                    const { reparaciones } = result;
                    const reversedData = [...reparaciones].reverse(); // Create a reversed copy of the array
                    setRepairs(reversedData)
                }
            })
            .catch(error => console.log('error', error));
        }

        fetchRepair();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Header title="Reparaciones" />

            <div className='container mediciones-filtro'>
                {contributorPermissions && (<Link to="/reparaciones/registrar"><button className='btn-registrar'>Registrar</button></Link>)}
            </div>

            <FilterRepair datos={repairs} /> {/**Se pasa la lista de datos que se extrajo del API */}

        </React.Fragment>
    )
}

export default Repairs;