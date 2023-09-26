import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const OrderDetail = () => {
  const [order, setOrder] = useState({
    id: 0,
    titulo: "",
    id_empresa: 0,
    estado: "Pendiente",
    fecha_orden: "",
    cajero: "",
  });
  const [detail, setDetail] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [company, setCompany] = useState([]);
  const [product, setProduct] = useState([]);

  const { ordenId } = useParams();

  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  const navigate = useNavigate();

  useEffect(() => {
    clearState();
    fetchOrder();
    getCompany();
    getProducts();
    loadingData();
  }, []);

  const fetchOrder = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/ordenes/${ordenId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { orden, detalles, facturas, status } = result;
        if (status === 200) {
          setOrder(orden);
          setDetail(detalles);
          setInvoice(facturas);
        } else {
          Swal.fire("Error, intentelo más tarde!", "error");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const clearState = () => {
    setOrder([]);
  };

  const cancelOrder = (orderId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/ordenes/anular/${orderId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status, error } = result;
        if (parseInt(status) === 200) {
          Swal.fire(
            "Orden anulada!",
            `Se ha a anulado la orden de ${order.titulo}!`,
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
              navigate("/orden");
            } else {
              navigate("/orden");
            }
          });
        } else {
          let errorMessage = "";
          for (const message of error) {
            errorMessage += message + "\n";
          }
          Swal.fire("Error al anular la orden!", `${errorMessage}`, "error");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const requestCancelOrder = () => {
    Swal.fire({
      title: "¿Desea anular la orden?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelOrder(ordenId);
      } else {
        Swal.fire({
          title: "Se ha cancelado!",
          text: "No se anulará la orden",
          icon: "info",
        });
      }
    });
  };

  const changeStateOrder = () => {
    let actualStateOrder = order.estado;
    const states = ["Pendiente", "En Proceso", "Listo", "Entregado"];

    // Encuentra la posición del estado actual en el array
    const currentPosition = states.indexOf(actualStateOrder);

    // Verifica si el estado actual no es el último estado en el array
    if (currentPosition !== -1 && currentPosition < states.length - 1) {
      // Encuentra el estado siguiente
      const nextState = states[currentPosition + 1];

      // Cambia el estado actual por el siguiente estado
      setOrder({ ...order, estado: nextState });

      //Actualizar el estado en la base de datos
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var formdata = new FormData();
      formdata.append("estado", nextState);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch(
        `https://api.textechsolutionscr.com/api/v1/ordenes/editar/estado/${order.id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          const { status, error } = result;
          if (parseInt(status) === 200) {
            Swal.fire(
              "Estado modificado!",
              `Se ha a modificado el estado de la orden a ${nextState}!`,
              "success"
            );
          } else {
            let errorMessage = "";
            for (const message of error) {
              errorMessage += message + "\n";
            }
            Swal.fire(
              "Error al modificar el estado!",
              `${errorMessage}`,
              "error"
            );
          }
        })
        .catch((error) => console.log("error", error));
    } else {
      console.log(
        "No hay un estado siguiente o el estado actual no se encuentra en el array de estados."
      );
    }
  };

  const downloadOrder = () => {
    console.log("Descargar orden");
  };

  /**
   * Format input at currency CRC
   */
  const formatCurrencyCRC = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  });

  const getProducts = () => {
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
          setProduct(data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  /**
   * Fetches a list of all companies from the database and updates the 'company' state with the retrieved data.
   * Uses an authorization token to authenticate the request.
   */
  const getCompany = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://api.textechsolutionscr.com/api/v1/empresas", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setCompany(data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  /**
   * Returns name of the company by Id
   * @param {Integer} companyId
   * @returns {String}
   */
  const nameCompany = (companyId) => {
    const empresaEncontrada = company.find(
      (item) => parseInt(item.id) == parseInt(companyId)
    );

    if (empresaEncontrada) {
      return empresaEncontrada.nombre_empresa;
    } else {
      return "Empresa no encontrada";
    }
  };

  const nameProduct = (productId) => {
    const productFind = product.find(
      (item) => parseInt(item.id) == parseInt(productId)
    );

    if (productFind) {
      return productFind.nombre_producto;
    } else {
      return "Producto no encontrado";
    }
  };

  /**
   * Validates if the user role allows access to functions like edit, download, edit state, and others.
   * @returns {boolean} True if the user role is "Admin" or "Colaborador," otherwise false.
   */
  const validatePermissions = () => {
    if (order.estado === "Anulada") {
      return false;
    } else if (role === "Admin" || role === "Colaborador") {
      return true;
    }

    return false;
  };

  /**
   * Validates the user's role to determine if they have administrator privileges
   * in order to activate the cancel order function.
   */
  const validateRole = (role) => {
    if (role === "Admin" && order.estado !== "Anulada") {
      return true;
    }

    return false;
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
      <Header title="Detalle de la orden" />

      <div className="container form-contenedor">
        <form className="form-registro-clientes">
          <div className="div-inp">
            <label htmlFor="password">Titulo:</label>
            <input
              type="text"
              name="titulo"
              id="titulo"
              autoComplete="current-password"
              value={order.titulo}
              disabled
            />
          </div>

          <div className="div-inp">
            <label htmlFor="password">Empresa:</label>
            <input
              type="text"
              name="buscarEmpresa"
              id="cedula"
              autoComplete="current-password"
              value={nameCompany(order.id_empresa)}
              disabled
            />
          </div>

          <div className="div-inp">
                        <label htmlFor="password">Comentario:</label>
                        <textarea
                          
                            id="txtArea"
                            name="descripcion"
                            rows="5"
                            cols="60"
                            value={order.comentario}
                            disabled
                        ></textarea>
                    </div>

          <div className="div-inp">
            <label htmlFor="password">Estado:</label>
            <input
              type="text"
              name="cajero"
              id="titulo"
              autoComplete="current-password"
              disabled
              value={order.estado}
              required
            />
          </div>

          <div className="div-inp">
            <label htmlFor="password">Fecha:</label>
            <input
              type="text"
              name="cajero"
              id="titulo"
              autoComplete="current-password"
              disabled
              value={order.fecha_orden}
              required
            />
          </div>

          <div className="div-inp">
            <label htmlFor="password">Vendedor:</label>
            {invoice && invoice.length > 0 ? (
              <input
                type="text"
                name="cajero"
                id="titulo"
                autoComplete="current-password"
                disabled
                value={invoice[0].cajero}
                required
              />
            ) : (
              <span>No hay datos de vendedor disponibles.</span>
            )}
          </div>
        </form>
      </div>

      <hr></hr>

      <Header title="Detalle del pedido" />

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Precio total</th>
          </tr>
        </thead>

        <tbody>
          {detail.map((item) => (
            <tr key={item.id_producto}>
              <td>{nameProduct(item.id_producto)}</td>
              <td>{item.descripcion}</td>
              <td>{item.cantidad}</td>
              <td>{item.subtotal / item.cantidad}</td>
              <td>{formatCurrencyCRC.format(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr></hr>

      <Header title="Facturación" />
      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>Subtotal</th>
            <th>IVA 13%</th>
            <th>Total</th>
            <th>Monto pendiente</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(invoice) &&
            invoice.map((item) => (
              <tr key={item.subtotal}>
                <td>{formatCurrencyCRC.format(item.subtotal)}</td>
                <td>{formatCurrencyCRC.format(item.iva)}</td>
                <td>{formatCurrencyCRC.format(item.monto)}</td>
                <td>{formatCurrencyCRC.format(item.saldo_restante)}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <hr></hr>

      <div className="container botones-contenedor">
        <Link to="/orden">
          <button className="btn">Regresar</button>
        </Link>

        {collaboratorPermissions && (
          <Link to={`/orden/editar/${order.id}`}>
            <button className="btn">Editar</button>
          </Link>
        )}

        {collaboratorPermissions && order.estado !== "Entregado" && (
          <button className="btn" onClick={() => changeStateOrder()}>
            Modificar estado
          </button>
        )}

        {permissions && order.estado !== "Anulada" && (
          <button className="btn" onClick={() => requestCancelOrder()}>
            Anular
          </button>
        )}

        {collaboratorPermissions && (
          <button className="btn" onClick={() => downloadOrder()}>
            Descargar
          </button>
        )}
      </div>
    </React.Fragment>
  );
};

export default OrderDetail;
