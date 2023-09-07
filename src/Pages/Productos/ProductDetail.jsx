import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Logo from "../../Images/Logos/Icono.png";
import Cookies from "js-cookie";
import Swal from "sweetalert2";



const ProductDetail = () => {
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

  const clearState = () => {
    setProduct([]);
  };

  const requestDeleteProduct = (productId) => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${token}`
    );

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/productos/eliminar/${productId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status } = result;
        console.log(status);

        if (status === 200) {
          Swal.fire({
            title: "Producto eliminado!",
            text: "Se ha eliminado permanentemente",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/productos");
            } else {
              navigate("/productos");
            }
          });
        } else {
          Swal.fire({
            title: "Ha ocurrido un error!",
            text: "Por favor intentarlo luego",
            icon: "error",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/productos");
            } else {
              navigate("/productos");
            }
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  const deleteProduct = () => {
    Swal.fire({
      title: "¿Desea eliminar el producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        requestDeleteProduct(productId);
      } else {
        Swal.fire({
          title: "Se ha cancelado!",
          text: "No se eliminará el producto",
          icon: "info",
        });
      }
    });
  }

  const validatePermissions = () => {
    if (role === 'Admin' || role === 'Colaborador') {
      return true;
    }

    return false
  }

  const validateRole = (role) => {
    return role === "Admin";
  };
  
  const permissions = validateRole(role);
  const collaboratorPermissions = validatePermissions();

  return (
    <React.Fragment>
     
        <h2 className="titulo-encabezado">Detalle de empresa</h2>
        <hr className="division"></hr>

        <div className="container form-contenedor">
          <form className="form-registro-clientes">
          <div className="div-inp">
              <label htmlFor="username">Nombre:</label>
              <input
                type="text"
                name="nombre_producto"
                id="nombre_producto"
                autoComplete="nombre_producto"
                value={product.nombre_producto}
                disabled
              />
            </div>

            <div className="div-inp">
              <label htmlFor="password">Descripción:</label>
              <textarea
                
                id="txtArea"
                name="descripcion"
                rows="5"
                cols="60"
                value={product.descripcion}
                disabled
              ></textarea>
            </div>

            <div className="div-inp">
              <label htmlFor="username">Precio unitario:</label>
              <input
                value={product.precio_unitario}
                type="number"
                name="precio_unitario"
                id="precio_unitario"
                autoComplete="precio_unitario"
                disabled
              />
            </div>

            <div className="div-inp">
              <label htmlFor="username">Categoria:</label>

              <input
                value={product.categoria}
                type="text"
                name="categoria"
                id="categoria"
                autoComplete="categoria"
                disabled
              /> 
            
            </div>

          </form>

          <div className="container img-contenedor">
            <img className="isologo" src={Logo} alt="imagen" />
          </div>

          <hr className="division" />


            </div>
            <div className="container botones-contenedor">
              <Link to="/productos">
                <button className="btn-registrar">Regresar</button>
              </Link>

              {collaboratorPermissions && (<Link to={`/producto/editar/${product.id}`}>
                <button className="btn-registrar">Editar</button>
              </Link>)}
              

              {permissions && (
                <button className="btn-registrar" onClick={() => deleteProduct()}>
                  Eliminar
                </button>
              )}
        </div>
     
    </React.Fragment>
  );
};

export default ProductDetail;
