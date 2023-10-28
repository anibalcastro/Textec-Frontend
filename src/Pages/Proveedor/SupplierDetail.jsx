import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header/Header";
import ProductSupplierTable from "../../components/Tables/ProductSupplier";

const SupplierDetail = () => {
  const [supplier, setSupplier] = useState([]);
  const [productSupplier, setProductSupplier] = useState([]);

  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const { supplierId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    clearState();
    loadingData();
    getInformationSupplier(supplierId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInformationSupplier = (supplierId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/proveedores",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          for (let x in data) {
            // eslint-disable-next-line eqeqeq
            if (data[x].id == supplierId) {
              setSupplier(data[x]);
              setProductSupplier(data[x].productos);
              break;
            }
          }
        }
      })
      .catch((error) => console.log("error", error));
  };

  const clearState = () => {
    setSupplier([]);
    setProductSupplier([]);
  };

  const requestDeleteSupplier = (supplierId) => {};

  const deleteSupplier = () => {
    Swal.fire({
      title: "¿Desea eliminar el producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        requestDeleteSupplier(supplierId);
      } else {
        Swal.fire({
          title: "Se ha cancelado!",
          text: "No se eliminará el producto",
          icon: "info",
        });
      }
    });
  };

  const validatePermissions = () => {
    if (role === "Admin" || role === "Colaborador") {
      return true;
    }

    return false;
  };

  const contactByWhatsApp = () => {
    const phoneNumber = supplier.telefono.replace(/[\s-]+/g, ""); // Número de teléfono de destino
    const message = "¡Hola! ¿Cómo estás?, Quiero realizarte un pedido de ..."; // Mensaje personalizado

    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  const handleRedirect = (data) => {
    navigate(`/proveedor/editar/${supplierId}`, { state: { supplier: data } });
  };

  const validateRole = (role) => {
    return role === "Admin";
  };

  const loadingData = () => {
    let timerInterval;
    Swal.fire({
      title: "Cargando datos!",
      html: "Se va a cerrar en <b></b> segundo",
      timer: 3000, // Cambiar a la duración en segundos (por ejemplo, 2 segundos)
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          const timerLeftInSeconds = Math.ceil(Swal.getTimerLeft() / 1000); // Convertir milisegundos a segundos y redondear hacia arriba
          b.textContent = timerLeftInSeconds;
        }, 1000); // Actualizar cada segundo
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        // El temporizador ha expirado
      }
    });
  };

  const permissions = validateRole(role);
  const collaboratorPermissions = validatePermissions();

  return (
    <React.Fragment>
      <Header title={"Detalle del proveedor"} />

      <div className="container form-contenedor">
        <form className="form-registro-clientes">
          <div className="div-inp">
            <label htmlFor="nombre">Proveedor:</label>
            <input
              value={supplier.nombre}
              type="text"
              name="nombre_proveedor"
              id="nombre_proveedor"
              disabled
            ></input>
          </div>

          <div className="div-inp">
            <label htmlFor="nombre">Dirección:</label>
            <textarea
              value={supplier.direccion}
              id="txtArea"
              name="observaciones"
              rows="5"
              cols="60"
              disabled
            ></textarea>
          </div>

          <div className="div-inp">
            <label htmlFor="nombre">Email:</label>
            <input
              value={supplier.email}
              type="text"
              name="email"
              id="email"
              disabled
            ></input>
          </div>

          <div className="div-inp">
            <label htmlFor="nombre">Vendedor:</label>
            <input
              value={supplier.vendedor}
              type="text"
              name="nombre_proveedor"
              id="nombre_proveedor"
              disabled
            ></input>
          </div>

          <div className="div-inp">
            <label htmlFor="nombre">Teléfono:</label>
            <input
              value={supplier.telefono}
              type="text"
              name="telefono"
              id="telefono"
              disabled
            ></input>
          </div>
        </form>
      </div>
      <hr />
      {/**Productos del proveedor */}
      <ProductSupplierTable productSupplier={productSupplier} />

      <div className="container botones-contenedor">
        <Link to="/proveedores">
          <button className="btn">Regresar</button>
        </Link>

        {collaboratorPermissions && (
          <button className="btn" onClick={() => handleRedirect(supplier)}>
            Editar
          </button>
        )}

        {permissions && (
          <button className="btn" onClick={() => deleteSupplier()}>
            Eliminar
          </button>
        )}

        {collaboratorPermissions && (
          <button className="btn" onClick={() => contactByWhatsApp()}>
            Contactar
          </button>
        )}

        {collaboratorPermissions && (
          <Link to={`/proveedor/productos/registrar/${supplierId}`}>
            <button className="btn">Producto</button>
          </Link>
        )}
      </div>
    </React.Fragment>
  );
};

export default SupplierDetail;
