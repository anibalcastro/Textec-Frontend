import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CardMediciones from "../../components/card-mediciones/Card-Mediciones";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const DetalleClienteMediciones = () => {
    let [cliente, setCliente] = useState([]);
    let [mediciones, setMediciones] = useState([]);
    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");
    let userId = useParams();

    useEffect(() => {
        obtenerInformacionCliente(userId);
        obtenerMediciones(userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const obtenerInformacionCliente = (parametro) => {
        let datos = localStorage.getItem('data');
        datos = JSON.parse(datos);

        //console.log(parametro.userId);

        let encontrado = false;

        datos.forEach((item, i) => {
            //console.log(parseInt(item.id));
            if (parseInt(item.id) === parseInt(parametro.userId)) {
                setCliente(item);
                encontrado = true;
            }
        });

        if (!encontrado) {
            //console.log('No se ha encontrado');
        }
    }

    const obtenerMediciones = (parametro) => {
        const myHeaders = new Headers({
            "Authorization": `Bearer ${token}`
        });

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://api.textechsolutionscr.com/api/v1/mediciones/clientes", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.hasOwnProperty("data")) {
                    const { data } = result;
                    localStorage.setItem('medidas', JSON.stringify(data));
                    const arrayMedicionesUsuario = data.filter(item => item.id_cliente == parametro.userId);
                    setMediciones(arrayMedicionesUsuario);
                    //console.log(mediciones);
                } else {
                    // Mostrar mensaje de error o realizar otra acción
                }
            })
            .catch(error => console.log('error', error));
    }

    const randomColores = () => {
        let listaColores = ['#94744C', '#6d949c'];
        let randomIndex = Math.floor(Math.random() * listaColores.length);
        return listaColores[randomIndex];
    }

    if (!mediciones || mediciones.length === 0) {
        Swal.fire({
        title: "Cargando los datos...",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 1000 // Duración en milisegundos (10 segundos),
        });
    }

  const validarPermisos = () => {
    if (role === 'Admin' || role === 'Colaborador') {
      return true;
    }
    return false
  }

  const permisosColaborador = validarPermisos();

return (
    <React.Fragment>
        <div className="container detalle-cliente-contenedor">
            <h2 className="titulo-encabezado">{`${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2} - Mediciones`}</h2>
            <hr className="division"></hr>
        </div>

        <div className="container mediciones-cliente-contenedor">
            <div className="container mediciones-card">

                {Object.entries(mediciones).length === 0 ? (
                    <p>No hay mediciones registradas para este cliente.</p>
                ) : (
                    Object.entries(mediciones).map(([key, value]) => (
                        <CardMediciones
                            key={key}
                            articulo={value.articulo}
                            fecha={value.fecha}
                            color={randomColores()}
                            id={value.id}
                        />
                    ))
                )}

            </div>
        </div>

        <hr className="division"></hr>

        <div className="container botones-contenedor">
            <Link to="/mediciones">
                <button className="btn-registrar">Regresar</button>
            </Link>
            
            {permisosColaborador && (<Link to={`/mediciones/registro/cliente/${cliente.id}`}>
                <button className="btn-registrar">Agregar</button>
            </Link>)}
            
        </div>
    </React.Fragment>
);
};

export default DetalleClienteMediciones;
