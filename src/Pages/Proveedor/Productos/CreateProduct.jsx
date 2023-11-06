import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate, Link, useParams } from "react-router-dom";

const CreateProduct = () => {
  const [product, setProduct] = useState([]);
  const [arrayProducts, setArrayProducts] = useState([]);
  const [idProduct, setIdProduct] = useState(0);

  const { supplierId } = useParams();

  useEffect(() => {
    validateRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  const validateRole = () => {
    if (!role === "Admin" || !role === "Colaborador") {
      navigate(`/proveedores/${supplierId}`);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    AddOtherProduct();
  };

  const createProduct = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const productFilter = [];

    for (let i = 0; i < arrayProducts.length; i++) {
      const { proveedor_id, nombre_producto, descripcion, precio } =
        arrayProducts[i];
      productFilter.push({
        proveedor_id,
        nombre_producto,
        descripcion,
        precio,
      });
    }

    const jsonProducts = { productos: productFilter };
    console.log(JSON.stringify(jsonProducts));

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(jsonProducts),
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/productos/proveedores",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status, error } = result;
        if (parseInt(status) === 200) {
          Swal.fire(
            "Producto creado con éxito!",
            `Se han registrado los productos!`,
            "success"
          ).then((result) => {

            if (result.isConfirmed) {
              navigate(`/proveedores/${supplierId}`);
            } else {
              navigate(`/proveedores/${supplierId}`);
            }
          });
        } else {
          let errorMessage = "";
          if (error && typeof error === "object" && !Array.isArray(error)) {
            errorMessage = error.toString();
          } else if (Array.isArray(error)) {
            errorMessage = error.join("\n");
          } else {
            errorMessage = "Error desconocido al crear el producto.";
          }
          Swal.fire("Error al crear el producto!", `${errorMessage}`, "error");
        }
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const AddOtherProduct = () => {
    let id = idProduct;
    let newProduct = {
      id: id++,
      proveedor_id: supplierId,
      nombre_producto: product.nombre_producto,
      descripcion: product.descripcion,
      precio: product.precio,
    };

    setArrayProducts(arrayProducts.concat(newProduct));
    setProduct("");
    setIdProduct(id++);
    clearInputs();
  };

  const clearInputs = () => {
    const inputs = document.getElementsByTagName("input");
    const textareas = document.getElementsByTagName("textarea");

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (input.type === "text" || input.type === "number") {
        input.value = "";
      }
    }

    // Limpiar textareas
    for (let i = 0; i < textareas.length; i++) {
      const textarea = textareas[i];
      textarea.value = "";
    }
  };

  const deleteProduct = (idProduct) => {
    const filterProducts = arrayProducts.filter(
      (product) => parseInt(product.id) !== parseInt(idProduct)
    );

    setArrayProducts(filterProducts);
  };

  return (
    <React.Fragment>
      <h2 className="titulo-encabezado">Registro de producto</h2>
      <hr className="division"></hr>

      <div className="container form-contenedor">
        <form className="form-registro-clientes" onSubmit={handleSubmit}>
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
              name="precio"
              id="precio"
              autoComplete="precio_unitario"
              required
            />
          </div>

          <div className="container botones-contenedor">
            <button type="submit" className="btn-registrar">
              Agregar
            </button>
          </div>
        </form>
      </div>

      <hr className="division"></hr>
      <h2 className="titulo-encabezado">Productos por agregar</h2>

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {arrayProducts.map((datos) => (
            <tr key={datos.id}>
              <td>{datos.nombre_producto}</td>
              <td>{datos.descripcion}</td>
              <td>{datos.precio}</td>
              <td className="table-button-content">
                <button
                  onClick={() => deleteProduct(datos.id)}
                  className="btnEdit"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="container botones-contenedor">
        <button onClick={() => createProduct()} className="btn-registrar">
          Guardar
        </button>

        <Link to={`/proveedores/${supplierId}`}>
          <button className="btn-registrar">Regresar</button>
        </Link>
      </div>
    </React.Fragment>
  );
};

export default CreateProduct;
