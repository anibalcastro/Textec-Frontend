import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import TableCategories from "../../components/Tables/TableCategories";
import 'sweetalert2/dist/sweetalert2.min.css';

const Categories = () => {
    const [category, setCategory] = useState([]);

    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");
    const navigate = useNavigate();

    useEffect(() => {
        alertInvalidatePermission();
        const fetchCategory = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://api.textechsolutionscr.com/api/v1/categorias", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.hasOwnProperty("data")) {
                        const { data, status } = result;
                        setCategory(data);
                        if (status === 200) {
                            Swal.close();
                        }
                    }
                })
                .catch(error => console.log('error', error));
        };

        fetchCategory();
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
        if (role === 'Admin' || role === 'Colaborador') {
            return true;
        }

        return false
    }

    const crearNuevaCategoria = () => {
        Swal.fire({
            title: 'Crear nueva categoría',
            input: 'text',
            inputLabel: 'Nombre de la categoría',
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Debes ingresar un nombre para la categoría';
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // Aquí puedes enviar el nombre de la categoría al backend o realizar otras acciones
                const nombreCategoria = result.value;
                console.log('Nombre de la nueva categoría:', nombreCategoria);

                // Agrega lógica adicional aquí según tus necesidades
                fetchNewCategory(nombreCategoria);
            }
        });
    };

    const fetchNewCategory = (nombre_categoria) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var formdata = new FormData();
        formdata.append("nombre_categoria", nombre_categoria || 'NA');

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://api.textechsolutionscr.com/api/v1/categoria/registrar", requestOptions)
            .then(response => response.json())
            .then(result => {
                const { status, error } = result;

                if (parseInt(status) === 200) {
                    Swal.fire(
                        "Categoria creada con éxito",
                        "Se ha registrado la nueva categoria.",
                        "success"
                    ).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                        else {
                            window.location.reload();
                        }
                    });
                }
                else {
                    let errorMessage = "";

                    for (const message of error) {
                        errorMessage += message + "\n";
                    }

                    Swal.fire("Error al crear la categoria!", `${errorMessage}`, "error");
                }
                
            })
            .catch(error => console.log('error', error));
    }



    const permisosColaborador = validarPermisos();

    return (
        <React.Fragment>
            <Header title="Categorias" />

            <div className="container cbtn_inven">
                {permisosColaborador && (
                    <button className="btn-registrar" onClick={crearNuevaCategoria}>
                        Crear categoría
                    </button>
                )}
            </div>

            <TableCategories datos={category} token={token}/>
        </React.Fragment>
    );
};

export default Categories;
