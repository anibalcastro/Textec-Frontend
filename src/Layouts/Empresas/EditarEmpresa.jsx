import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import Logo from '../../Images/Logos/Icono.jpg'

const EditarEmpresa = () => {

    const [empresa, setEmpresa] = useState([]);
    const [todasEmpresas, setTodasEmpresas] = useState([]);


    useEffect(() => {
        setTodasEmpresas(obtenerEmpresas());
    }, [])

    const navigate = useNavigate();

    const token = Cookies.get("jwtToken");

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEmpresa({ ...empresa, [name]: value });
    };

    const obtenerEmpresas = () => {
        let datosEmpresas = localStorage.getItem('empresas');
        return JSON.parse(datosEmpresas);
    }

    const handleInputChangeCedula = (event) => {
        const valorCedula = event.target.value;

        const usuarioExistente = todasEmpresas.find(usuario => usuario.cedula == valorCedula);

        if (usuarioExistente) {
            const inputElement = document.getElementById('cedula');
            if (inputElement) {
                inputElement.value = '';
            }

            Swal.fire(
                "Error!",
                "La cédula que dijitaste ya existe en la base de datos",
                "error"
            );
        } else {
            const { name, value } = event.target;
            setEmpresa({ ...empresa, [name]: value });
        }


    }

    const handleSubmit = (event) => {
        event.preventDefault();


        peticionApi();
        limpiarEstado();

    };

    const limpiarEstado = () => {
        setEmpresa([]);
    }

    const peticionApi = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var formdata = new FormData();
        formdata.append("comentarios", empresa.observaciones || 'NA');

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        fetch("https://api.textechsolutionscr.com/api/v1/clientes/registrar", requestOptions)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                const { status } = responseData;
                if (parseInt(status) === 200) {
                    // empresa creado con éxito

                    Swal.fire(
                        "Cliente creado con éxito!",
                        `Se ha a registrado a ${empresa.nombre}!`,
                        "success"
                    ).then((result) => {
                        if (result.isConfirmed) {
                            // El usuario hizo clic en el botón "OK"
                            navigate("/empresas");
                        } else {
                            // El usuario cerró el cuadro de diálogo sin hacer clic en el botón "OK"
                            // Realiza alguna otra acción o maneja el caso en consecuencia
                        }
                    });

                } else {
                    // Error al crear el cliente
                    Swal.fire(
                        "Error al crear empresa!",
                        "Verificar que todos los campos estén llenos",
                        "error"
                    );
                }
            })
            .catch((error) => console.log("error", error));

    }

    return (
        <React.Fragment>
            <div className="container registro">
                <h2 className="titulo-encabezado">Registro de empresa</h2>
                <hr className="division"></hr>

                <div className="container form-contenedor">
                    <form className="form-registro-clientes" onSubmit={handleSubmit}>
                        <div className="div-inp">
                            <label htmlFor="username">Empresa:</label>
                            <input
                                onChange={handleInputChange}
                                value={empresa.nombre}
                                type="text"
                                name="nombre"
                                id="nombre"
                                autoComplete="nombre"
                                required
                            />
                        </div>
                        <div className="div-inp">
                            <label htmlFor="password">Cédula:</label>
                            <input
                                onChange={handleInputChangeCedula}
                                value={empresa.cedula}
                                type="text"
                                name="cedula"
                                id="cedula"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <div className="div-inp">
                            <label htmlFor="password">Correo electronico:</label>
                            <input
                                onChange={handleInputChange}
                                value={empresa.correo}
                                type="text"
                                name="correo"
                                id="cedula"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <div className="div-inp">
                            <label htmlFor="password">Nombre del Encargado:</label>
                            <input
                                onChange={handleInputChange}
                                value={empresa.nombre_encargado}
                                type="text"
                                name="encargado"
                                id="cedula"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <div className="div-inp">
                            <label htmlFor="password">Telefono:</label>
                            <input
                                onChange={handleInputChange}
                                value={empresa.telefono_encargado}
                                type="text"
                                name="telefono_encargado"
                                id="cedula"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <div className="div-inp">
                            <label htmlFor="password">Dirección:</label>
                            <textarea
                                onChange={handleInputChange}
                                value={empresa.direccion}
                                id="txtArea"
                                name="direccion"
                                rows="5"
                                cols="60"
                            ></textarea>
                        </div>

                        <div className="div-inp">
                            <label htmlFor="password">Observaciones:</label>
                            <textarea
                                onChange={handleInputChange}
                                value={empresa.comentarios}
                                id="txtArea"
                                name="observaciones"
                                rows="5"
                                cols="60"
                            ></textarea>
                        </div>

                        <div className="container botones-contenedor">
                            <button className="btn-registrar" type="submit">
                                Guardar
                            </button>
                            <Link to="/empresas">
                                <button className="btn-registrar">Regresar</button>
                            </Link>
                        </div>
                    </form>

                    <div className="container img-contenedor">
                        <img className="isologo" src={Logo} alt="imagen" />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default EditarEmpresa;