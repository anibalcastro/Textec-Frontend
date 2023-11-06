import React, { useState, useEffect } from "react";
import Detail from "../../components/OrderDetail/Detail";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { Link, useParams, useNavigate } from "react-router-dom";
import PaymentsTable from "../../components/OrderDetail/Payments";

const DetailPayment = () => {
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
  const [payment, setPayment] = useState([]);

  const { tipo, id } = useParams();

  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  useEffect(() => {
    if (tipo === "orden"){
      fetchOrder();
    }
    else if (tipo === "reparaciones"){
      fetchRepair();
    }
    else{
      Swal.fire("Error", "La ruta que elegiste no es la correcta.", "error").then((result) => {
        if (result.isConfirmed){
          navigate('/pagos')
        }
        else{
          navigate('/pagos')
        }
      }) ;
    }

    clearState();
    getCompany();
    getProducts();
    loadingData();
  }, []);

  const formatCurrencyCRC = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  });

  const fetchOrder = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/ordenes/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { orden, detalles, facturas, status } = result;
        if (status === 200) {
          setOrder(orden);
          setDetail(detalles);
          setInvoice(facturas);
          getPaymentsByOrder(facturas[0].id);
        } else {
          Swal.fire("Error, intentelo más tarde!", "error");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const fetchRepair = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/reparacion/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const {reparacion,factura, status} = result;
        if (status === 200) {
          setOrder(reparacion);
          setDetail(reparacion.detalle_reparacion);
          setInvoice(factura);
          getPaymentsByOrder(factura[0].id);
        } else {
          Swal.fire("Error, intentelo más tarde!");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const clearState = () => {
    setOrder([]);
  };

  const downloadOrder = () => {
    console.log("Descargar orden");
  };

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

  const getPaymentsByOrder = (idInvoice) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/pagos/${idInvoice}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setPayment(data);
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

  const fetchAddPayment = (monto, metodo_pago, comentarios, cajero) => {
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var formdata = new FormData();
      formdata.append("factura_id", invoice[0].id);
      formdata.append("monto", monto);
      formdata.append("metodo_pago", metodo_pago);
      formdata.append(
        "comentarios",
        comentarios || "Muchas gracias por tu compra."
      );
      formdata.append("estado", "Aceptado");
      formdata.append("cajero", cajero);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch(
        "https://api.textechsolutionscr.com/api/v1/pagos/registrar",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          const { status } = result;
          const bool = parseInt(status) === 200;
          resolve(bool); // Resuelve la promesa con el valor bool
        })
        .catch((error) => {
          console.log("error", error);
          reject(error); // Rechaza la promesa en caso de error
        });
    });
  };

  const addPayment = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "Ingrese los Datos",
      html: `
          <input id="monto" type="number" class="swal2-input-payment" placeholder="Monto" min="0">
          <select id="metodo_pago" class="swal2-select-payment">
            <option disabled selected>Seleccione un método de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Cheque">Cheque</option>
          </select>
          <textarea id="comentarios" class="swal2-textarea-payment" placeholder="Comentarios"></textarea>
          <input id="cajero" class="swal2-input-payment" placeholder="Cajero">
        `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const monto = parseFloat(document.getElementById("monto").value);
        const metodo_pago = document.getElementById("metodo_pago").value;
        const comentarios = document.getElementById("comentarios").value;
        const cajero = document.getElementById("cajero").value;

        if (monto <= 0) {
          Swal.showValidationMessage("El monto ingresado debe ser mayor que 0");
        }

        return { monto, metodo_pago, comentarios, cajero };
      },
    });

    if (isConfirmed) {
      const { monto, metodo_pago, comentarios, cajero } = formValues;

      if (Array.isArray(invoice)) {
        // Calcula el saldo total
        let saldo_restante;
        invoice.forEach((item) => {
          saldo_restante = item.saldo_restante;
        });

        if (metodo_pago === "Efectivo") {
          if (parseFloat(monto) > saldo_restante) {
            // Solicitud Api
            fetchAddPayment(
              saldo_restante,
              metodo_pago,
              comentarios,
              cajero
            ).then((resultado) => {
              if (resultado) {
                Swal.fire(
                  `El cambio es de: ${formatCurrencyCRC.format(
                    monto - saldo_restante
                  )}`,
                  "",
                  "info"
                ).then(() => {
                  // Recargar la página después de que se cierre la alerta
                  const saldo_restante = invoice.saldo_restante - monto;
                  setInvoice({ ...invoice, saldo_restante });
                });
              } else {
                Swal.fire(
                  `Error, no se pudo agregar el pago, intentelo de nuevo.`,
                  "",
                  "info"
                );
              }
            });
          } else {
            fetchAddPayment(monto, metodo_pago, comentarios, cajero).then(
              (resultado) => {
                if (resultado) {
                  Swal.fire(
                    `El saldo pendiente es de: ${formatCurrencyCRC.format(
                      saldo_restante - monto
                    )}`,
                    "",
                    "info"
                  ).then(() => {
                    // Recargar la página después de que se cierre la alerta
                    if (tipo === "orden"){
                      fetchOrder();
                    }
                    else if (tipo === "reparaciones"){
                      fetchRepair();
                    }
                    const saldo_restante = invoice.saldo_restante - monto;
                    setInvoice({ ...invoice, saldo_restante });
                  });
                } else {
                  Swal.fire(
                    `Error, no se pudo agregar el pago, intentelo de nuevo.`,
                    "",
                    "info"
                  );
                }
              }
            );
          }
        } else {
          if (parseFloat(monto) <= saldo_restante) {
            fetchAddPayment(monto, metodo_pago, comentarios, cajero).then(
              (resultado) => {
                if (resultado) {
                  Swal.fire(
                    `El pago de ${monto} se ha aplicado correctamente`,
                    "",
                    "info"
                  ).then(() => {
                    // Recargar la página después de que se cierre la alerta
                    const saldo_restante = invoice.saldo_restante - monto;
                    setInvoice({ ...invoice, saldo_restante });
                  });
                } else {
                  Swal.fire(
                    `El monto no puede ser mayor al saldo pendiente ${formatCurrencyCRC.format(
                      saldo_restante
                    )}`,
                    "",
                    "info"
                  );
                }
              }
            );
          }
        }
      }
    }
  };

  const collaboratorPermissions = validatePermissions();

  return (
    <React.Fragment>
      <Detail
        order={order}
        detail={detail}
        invoice={invoice}
        company={company}
        product={product}
      />

      <PaymentsTable payments={payment} orderId={id} />

      <div className="container botones-contenedor">
        <Link to="/pagos">
          <button className="btn">Regresar</button>
        </Link>

        {collaboratorPermissions && invoice && invoice[0] && parseInt(invoice[0].saldo_restante) !== 0 && (
          <button className="btn" onClick={() => addPayment()}>
            Agregar pago
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

export default DetailPayment;
