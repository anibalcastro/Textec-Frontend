import React from "react";
import Header from "../Header/Header";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ProductSupplierTable = ({ productSupplier }) => {
  const role = Cookies.get("role");
  const token = Cookies.get("jwtToken");
  const navigate = useNavigate();

  const formatCurrencyCRC = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  });

  const deleteProduct = (productId) => {
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
  };

  const requestDeleteProduct = (productId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", ` Bearer ${token} `);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/producto/eliminar/${productId}/proveedores`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status } = result;

        if (status === 200) {
          Swal.fire({
            title: "Producto eliminado!",
            text: "Se ha eliminado permanentemente",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            } else {
              window.location.reload();
            }
          });
        } else {
          Swal.fire({
            title: "Ha ocurrido un error!",
            text: "Por favor intentarlo luego",
            icon: "error",
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  const handleRedirect = (data) => {
    navigate(`/proveedor/productos/editar`, { state: { product: data } });
  };

  const validateRole = (role) => {
    return role === "Admin";
  };

  const permissions = validateRole(role);

  let count = 1;

  return (
    <React.Fragment>
      {productSupplier.length > 0 ? (
        <>
          <Header title="Productos del proveedor" />
          <table className="tabla-medidas">
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Precio</th>
                {permissions && <th>Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {Array.isArray(productSupplier) &&
                productSupplier.map((item) => (
                  <tr key={count + 1}>
                    <td>{count++}</td>
                    <td>{item.nombre_producto}</td>
                    <td>{item.descripcion}</td>
                    <td>{formatCurrencyCRC.format(item.precio)}</td>
                    {permissions && (
                      <td className="table-button-content">
                        <button
                          className="btnEdit"
                          onClick={() => deleteProduct(item.id)}
                        >
                          Eliminar
                        </button>

                        <button
                          className="btnEdit"
                          onClick={() => handleRedirect(item)}
                        >
                          Editar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>

          <hr></hr>
        </>
      ) : (
        <>
          <hr></hr>
          <span>No se han registrado productos...</span>
        </>
      )}
    </React.Fragment>
  );
};

export default ProductSupplierTable;
