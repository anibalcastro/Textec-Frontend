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
    estado: "taller",
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
    alertInvalidatePermission();

    if (tipo === "orden") {
      fetchOrder();
    } else if (tipo === "reparaciones") {
      fetchRepair();
    } else {
      Swal.fire(
        "Error",
        "La ruta que elegiste no es la correcta.",
        "error"
      ).then((result) => {
        if (result.isConfirmed) {
          navigate("/pagos");
        } else {
          navigate("/pagos");
        }
      });

     // console.log(invoice);
    }

    clearState();
    getCompany();
    getProducts();
    loadingData();
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
          getPaymentsByOrder(facturas.id);
          //console.log(facturas);
          //console.log(facturas.id);
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
        const { reparacion, factura, status } = result;
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
    //Arreglar pagos...
    Swal.fire({
      title: "Generando el PDF",
      text: "Espere un momento...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer  ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/pdf/pagos/${tipo}/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const download_url = decodeURIComponent(result.download_url);
        const downloadLink = document.createElement("a");
        downloadLink.href = download_url;
        downloadLink.target = "_self"; // Abrir en una nueva pestaña
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        Swal.close();
      })
      .catch((error) => console.log("error", error));
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

    //console.log(order.estado);
   // console.log(role);

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

    const factura = Array.isArray(invoice) ? invoice[0] : invoice;

    if (!factura || !factura.id) {
      console.error("Factura no válida:", factura);
      Swal.fire("No se pudo encontrar la factura", "", "error");
      reject("Factura inválida");
      return;
    }

    var formdata = new FormData();
    formdata.append("factura_id", factura.id);
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
        resolve(bool);
      })
      .catch((error) => {
        console.log("error", error);
        reject(error);
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

      if (!monto || monto <= 0) {
        Swal.showValidationMessage("El monto ingresado debe ser mayor que 0");
        return false;
      }

      if (!metodo_pago) {
        Swal.showValidationMessage("Debe seleccionar un método de pago");
        return false;
      }

      return { monto, metodo_pago, comentarios, cajero };
    },
  });

  if (!isConfirmed || !formValues) return;

  const { monto, metodo_pago, comentarios, cajero } = formValues;
  const factura = Array.isArray(invoice) ? invoice[0] : invoice;

  if (!factura || !factura.saldo_restante) {
    Swal.fire("No se pudo obtener la factura", "", "error");
    return;
  }

  const saldo = parseFloat(factura.saldo_restante);

  // Validación especial para efectivo
  let pagoFinal = monto;
  let mostrarCambio = false;
  let cambio = 0;

  if (metodo_pago === "Efectivo" && monto > saldo) {
    pagoFinal = saldo;
    cambio = monto - saldo;
    mostrarCambio = true;
  } else if (monto > saldo) {
    Swal.fire(
      `El monto no puede ser mayor al saldo pendiente (${formatCurrencyCRC.format(saldo)})`,
      "",
      "info"
    );
    return;
  }

  const resultado = await fetchAddPayment(pagoFinal, metodo_pago, comentarios, cajero);

  if (resultado) {
    if (mostrarCambio) {
      await Swal.fire(`El cambio es de: ${formatCurrencyCRC.format(cambio)}`, "", "info");
    } else {
      await Swal.fire(`Pago registrado correctamente`, "", "success");
    }

    // Recargar data
    if (tipo === "orden") {
      fetchOrder();
    } else if (tipo === "reparaciones") {
      fetchRepair();
    }

    // Refrescar saldo
    const nuevoSaldo = saldo - pagoFinal;
    setInvoice([{ ...factura, saldo_restante: nuevoSaldo }]);
    window.location.reload();
  } else {
    Swal.fire("Error al registrar el pago", "", "error");
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
        ordenIdentity={id}
      />

      <PaymentsTable payments={payment} orderId={id} />

      <div className="container botones-contenedor">
        <Link to="/pagos">
          <button className="btn">Regresar</button>
        </Link>

        {collaboratorPermissions &&
          invoice &&
          typeof invoice === "object" &&
          parseFloat(invoice.saldo_restante) !== 0 && (
            <button className="btn" onClick={addPayment}>
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
