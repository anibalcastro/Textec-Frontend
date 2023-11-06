import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../../../Images/Logos/Icono (1).webp";

const EditProduct = () => {
    const [editProduct, setEditProduct] = useState([]);
    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");
    const location = useLocation();
    const { product } = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        console.log(editProduct)
        clearState();
        setEditProduct(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearState = () => {
        setEditProduct([]);
    };


    const requestEditProduct = () => {
        var myHeaders = new Headers();
        myHeaders.append(
            "Authorization",
            `Bearer ${token}`
        );

        var formdata = new FormData();
        formdata.append("proveedor_id", editProduct.proveedor_id);
        formdata.append("nombre_producto", editProduct.nombre_producto);
        formdata.append("descripcion", editProduct.descripcion || "NA");
        formdata.append("precio", editProduct.precio || "0");

        
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        fetch(`https://api.textechsolutionscr.com/api/v1/producto/${editProduct.id}/proveedores`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                const { status, error } = result;
                if (parseInt(status) === 200) {
                    Swal.fire(
                        "Producto modificado con éxito!",
                        `Se ha editado el producto ${editProduct.nombre_producto}!`,
                        "success"
                    ).then((result) => {
                        if (result.isConfirmed) {
                            navigate(`/proveedores/${editProduct.proveedor_id}`);
                        } else {
                            navigate(`/proveedores/${editProduct.proveedor_id}`)
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
        setEditProduct({ ...editProduct, [name]: value });
    };

    const validateRole = () => {
        if (!(role === "Admin" || role === "Colaborador")) {
            navigate("/proveedores")
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
                            defaultValue={product.precio}
                            onChange={handleInputChange}
                            type="number"
                            name="precio"
                            id="precio"
                            autoComplete="precio"
                            required
                        />
                    </div>

                    <div className="container botones-contenedor">
                        <button
                            type="submit"
                            className="btn-registrar"
                        >
                            Guardar
                        </button>
                        <Link to={`/proveedores/${product.proveedor_id}`}>
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