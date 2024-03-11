import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Header from "../../components/Header/Header";

const CreatePerson = () => {
    const { ordenId } = useParams();

    const [customer, setCustomer] = useState({
        prenda: "",
        nombre: "",
        cantidad: "",
    });

    const [arrayPerson, setArrayPerson] = useState([]);
    const [products, setProducts] = useState([]);

    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");

    const navigate = useNavigate();

    useEffect(() => {
        alertInvalidatePermission();
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateUserPermission = () => {
        if (role !== "Visor") {
            return true;
        }

        return false;
    };

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

    const handleSubmit = (event) => {
        event.preventDefault();
        let array = [];
        array.push(arrayPerson);
        array.push(customer);

        let flattenedArray = array
            .flat(Infinity)
            .filter(
                (item) => typeof item === "object" && Object.keys(item).length > 0
            );

        setArrayPerson(flattenedArray);

        // Restablece el estado 'customer' para limpiar los campos del formulario
        setCustomer({
            prenda: "",
            nombre: "",
            cantidad: 0,
        });
    };

    const handleInputChangeCustomers = (event) => {
        const { name, value } = event.target;
        let updatedCustomer = { ...customer };

        if (name === "nombre") {
            updatedCustomer.nombre = value;
        } else if (name === "cantidad") {
            updatedCustomer.cantidad = value;
        } else if (name === "prenda") {
            updatedCustomer.prenda = value;
        }

        updatedCustomer.id_orden = ordenId;

        // Agregar orderDetail.nombre_producto al estado si está presente
        setCustomer(updatedCustomer);
    };

    const deleteCustomers = (nombre, prenda, cantidad) => {
        // Filtrar el array de clientes para excluir el objeto con los valores dados
        const nuevoArray = arrayPerson.filter((cliente) => {
            return (
                cliente.nombre !== nombre ||
                cliente.prenda !== prenda ||
                cliente.cantidad !== cantidad
            );
        });

        setArrayPerson(nuevoArray);
    };

    const fetchProducts = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch("https://api.textechsolutionscr.com/api/v1/productos", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.hasOwnProperty("data")) {
                    const { data } = result;
                    setProducts(data);
                }
            })
            .catch((error) => console.log("error", error));
    };

    const addPerson = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify(arrayPerson);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch(
            "https://api.textechsolutionscr.com/api/v1/personas/crear",
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                const { status } = result;

                if (status === 200) {
                    Swal.fire(
                        "Notificación",
                        "Personas agregadas correctamente.",
                        "success"
                    ).then((result) => {
                        if (result.isConfirmed) {
                            navigate(`/orden/${ordenId}`);
                        } else {
                            navigate(`/orden/${ordenId}`);
                        }
                    });
                }
            })
            .catch((error) => console.error(error));
    };

    return (
        <React.Fragment>
            <div>
                <Header title="Registrar personas" />
                <div className="form-contenedor">
                    <form className="form-registro-clientes" onSubmit={handleSubmit}>
                        <div className="div-inp">
                            <label htmlFor="empresa">Producto:</label>
                            <select
                                onChange={handleInputChangeCustomers}
                                name="prenda"
                                id="prenda"
                                required
                            >
                                <option value="">Selecciona un producto</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.nombre_producto}>
                                        {product.nombre_producto}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="div-inp">
                            <label htmlFor="name">Nombre</label>
                            <input
                                onChange={handleInputChangeCustomers}
                                type="text"
                                name="nombre"
                                id="nombre"
                                defaultValue={customer.nombre}
                            ></input>
                        </div>

                        <div className="div-inp">
                            <label htmlFor="count">Cantidad</label>
                            <input
                                onChange={handleInputChangeCustomers}
                                type="number"
                                name="cantidad"
                                id="cantidad"
                                min={0}
                                value={customer.cantidad}
                            ></input>
                        </div>

                        <button className="btn-agregar-detalle">Agregar</button>
                    </form>
                </div>

                <hr className="division"></hr>

                <Header title="Personas" />

                <table className="tabla-medidas">
                    <thead>
                        <tr>
                            <th>Prenda</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Array.isArray(arrayPerson) &&
                            arrayPerson.map((item) => (
                                <tr key={item.prenda}>
                                    <td>{item.prenda}</td>
                                    <td>{item.nombre}</td>
                                    <td>{item.cantidad}</td>
                                    <td>
                                        <button
                                            className="btn-eliminar"
                                            onClick={() =>
                                                deleteCustomers(
                                                    item.nombre,
                                                    item.prenda,
                                                    item.cantidad
                                                )
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <hr className="division"></hr>

                <div className="container botones-contenedor">
                    <button
                        className="btn-agregar-detalle"
                        type="submit"
                        onClick={() => addPerson()}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CreatePerson;
