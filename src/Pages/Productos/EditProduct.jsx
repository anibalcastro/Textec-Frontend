import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../../Images/Logos/Icono.png";

const EditProduct = () => {
    const [product, setProduct] = useState([]);
    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");
    const { productId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        clearState();
        getInformationProduct(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearState = () => {
        setProduct([]);
    };

    const getInformationProduct = (productId) => {
        let IDProduct = parseInt(productId);

        let productos = JSON.parse(localStorage.getItem("productos"));

        if (productos.length > 0) {
            productos.forEach((item) => {
                if (parseInt(item.id) === IDProduct) {
                    setProduct(item);
                }
            });
        }
    };

    const requestEditProduct = () => {
        var myHeaders = new Headers();
        myHeaders.append(
            "Authorization",
            `Bearer ${token}`
        );

        console.log(product);

        var formdata = new FormData();
        formdata.append("nombre_producto", product.nombre_producto);
        formdata.append("descripcion", product.descripcion || "NA");
        formdata.append("precio_unitario", product.precio_unitario || "1500");
        formdata.append("categoria", product.categoria);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        fetch(`https://api.textechsolutionscr.com/api/v1/productos/editar/${productId}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                const { status, error } = result;
                if (parseInt(status) === 200) {
                    Swal.fire(
                        "Producto modificado con éxito!",
                        `Se ha editado el producto ${product.nombre_producto}!`,
                        "success"
                    ).then((result) => {
                        if (result.isConfirmed) {
                            // El usuario hizo clic en el botón "OK"
                            navigate("/productos");
                        } else {
                            navigate("/productos")
                        }
                    });
                } else {
                    let errorMessage = "";
                    for (const message of error) {
                        errorMessage += message + "\n";
                    }
                    Swal.fire("Error al editar el producto!", `${errorMessage}`, "error");
                }
            })
            .catch((error) => console.log("error", error));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduct({ ...product, [name]: value });
    };

    const validateRole = () => {
        if (!(role === "Admin" || role === "Colaborador")) {
            navigate("/productos")
        }

    };

    const handleSubmit = (event) => {
        event.preventDefault();
        validateRole();
        requestEditProduct();
    }

    return <React.Fragment>
            <h2 className="titulo-encabezado">Editar producto</h2>
            <hr className="division"></hr>

            <div className="container form-contenedor">
                <form className="form-registro-clientes" onSubmit={handleSubmit}>
                    <div className="div-inp">
                        <label htmlFor="username">Nombre:</label>
                        <input
                            defaultValue={product.nombre_producto}
                            onChange={handleInputChange}
                            type="text"
                            name="nombre_producto"
                            id="nombre_producto"
                            autoComplete="nombre_producto"
                            required
                        />
                    </div>

                    <div className="div-inp">
                        <label htmlFor="password">Descripción:</label>
                        <textarea
                            defaultValue={product.descripcion}
                            onChange={handleInputChange}
                            id="txtArea"
                            name="descripcion"
                            rows="5"
                            cols="60"
                        ></textarea>
                    </div>

                    <div className="div-inp">
                        <label htmlFor="username">Precio unitario:</label>
                        <input
                            defaultValue={product.precio_unitario}
                            onChange={handleInputChange}
                            type="number"
                            name="precio_unitario"
                            id="precio_unitario"
                            autoComplete="precio_unitario"
                            required
                        />
                    </div>

                    <div className="div-inp">
                        <label htmlFor="username">Categoria:</label>

                        <select
                            value={product.categoria}
                            onChange={handleInputChange}
                            name="categoria"
                            id="categoria"
                            required
                        >
                            <option value="">Selecciona una categoria</option>
                            <option value="Superior">Parte superior</option>
                            <option value="Inferior">Parte inferior</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div className="container botones-contenedor">
                        <button
                            type="submit"
                            className="btn-registrar"
                        >
                            Modificar
                        </button>
                        <Link to="/productos">
                            <button className="btn-registrar">Regresar</button>
                        </Link>
                    </div>
                </form>

                <div className="container img-contenedor">
                    <img className="isologo" src={Logo} alt="imagen" />
                </div>
            </div>
        

    </React.Fragment>;
};

export default EditProduct;