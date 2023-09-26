import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../Images/Logos/Icono.png";

const CreateProduct = () => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    validateRole();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  const validateRole = () => {
    if (!role === "Admin" || !role === "Colaborador") {
      navigate("/productos");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createProduct();
  };

  const createProduct = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

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

    fetch(
      "https://api.textechsolutionscr.com/api/v1/productos/registrar",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        //console.log(result);
        const { status, error } = result;
        if (parseInt(status) === 200) {
          Swal.fire(
            "Producto creado con éxito!",
            `Se ha a registrado el producto ${product.nombre_producto}!`,
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
          Swal.fire("Error al crear el producto!", `${errorMessage}`, "error");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  return (
    <React.Fragment>
    
        <h2 className="titulo-encabezado">Registro de producto</h2>
        <hr className="division"></hr>

        <div className="container form-contenedor">
          <form className="form-registro-clientes"  onSubmit={handleSubmit}>
            <div className="div-inp">
              <label htmlFor="username">Nombre:</label>
              <input
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
                Registrar
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
     
    </React.Fragment>
  );
};

export default CreateProduct;
