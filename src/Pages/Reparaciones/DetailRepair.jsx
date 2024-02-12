import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Detail from "../../components/OrderDetail/Detail";

const RepairDetail = () => {
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

  const { repairId } = useParams();

  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  const navigate = useNavigate();

  useEffect(() => {
    clearState();
    fetchRepair();
    getCompany();
    getProducts();
    loadingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRepair = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/reparacion/${repairId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { reparacion, factura, status } = result;

        if (status === 200) {
          setOrder(reparacion);
          setDetail(reparacion.detalle_reparacion);
          setInvoice(factura);
        } else {
          Swal.fire("Error, intentelo más tarde!", "error");
        }
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

  /**Clear all states */
  const clearState = () => {
    setOrder([]);
  };

  /**
   * Validates if the user role allows access to functions like edit, download, edit state, and others.
   * @returns {boolean} True if the user role is "Admin" or "Colaborador," otherwise false.
   */
  const validatePermissions = () => {
    if (order && order.estado && order.estado === "Anulada") {
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
    if (
      role === "Admin" &&
      order &&
      order.estado &&
      order.estado !== "Anulada"
    ) {
      return true;
    }

    return false;
  };

  const permissions = validateRole(role);
  const collaboratorPermissions = validatePermissions();

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

  const cancelOrder = (repairId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/reparacion/anular/${repairId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status, error } = result;
        if (parseInt(status) === 200) {
          Swal.fire(
            "Reparación anulada!",
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
        cancelOrder(repairId);
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
        `https://api.textechsolutionscr.com/api/v1/reparacion/estado/editar/${repairId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          const { status, error } = result;
          if (parseInt(status) === 200) {
            const resultNotify = notify(nextState);

            if (resultNotify) {
              Swal.fire(
                "Estado modificado!",
                `Se ha a modificado el estado de la orden a ${nextState}!`,
                "success"
              );
            }
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

  const returnEmailCompany = (idCompany) => {
    const data = company.find((company) => company.id === idCompany);

    if (data) {
      return data.email;
    } else {
      return "anibalcastro1515@gmail.com"; // Puedes manejar el caso donde la compañía no existe
    }
  };

  const returnPhoneCompany = (idCompany) => {
    const data = company.find((company) => company.id === idCompany);

    if (data) {
      return data.telefono_encargado;
    } else {
      return "85424471"; // Puedes manejar el caso donde la compañía no existe
    }
  };

  const notify = (state) => {
    Swal.fire({
      title: "¿Cómo desea notificar a la empresa?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "WhatsApp",
      confirmButtonColor: "black",
      cancelButtonText: "Correo electrónico",
      showCloseButton: true,
      showCloseButtonText: "No notificar",
      showCloseButtonColor: "black",
      reverseButtons: true,
    }).then((result) => {
      const mensaje = `Estimado cliente, espero que se encuentre bien. Le informamos que su  pedido se encuentra en ${state}. Estamos a su disposición para cualquier consulta. ¡Gracias por su preferencia!`;

      if (result.isConfirmed) {
        // Acción si el usuario elige WhatsApp
        let phoneNumber = returnPhoneCompany(order.id_empresa);
        phoneNumber = phoneNumber.replace(/[\s-]+/g, ""); // Número de teléfono de destino
        const url = `https://api.whatsapp.com/send?phone=+506${phoneNumber}&text=${encodeURIComponent(
          mensaje
        )}`;

        Swal.fire(
          "Estado modificado!",
          `Se ha a modificado el estado de la orden a ${state}, se abrirá la aplicación de WhatsApp para notificar!`,
          "success"
        ).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.open(url, "_blank");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        const email = returnEmailCompany(order.id_empresa);
        sendEmail(email, mensaje);
        return true;
      } else if (result.dismiss === Swal.DismissReason.close) {
        Swal.fire(
          "Estado modificado!",
          `Se ha a modificado el estado de la orden a ${state}!`,
          "success"
        )
      }
    });
  };

  const sendEmail = (email, body) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("email", email);
    formdata.append("body", body);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/email/notificacion",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const { mensaje } = result;

        if (mensaje === "Correo electrónico enviado con éxito") {
          Swal.fire(
            "¡Estado modificado con éxito!",
            `Se ha cambiado el estado y se ha notificado por medio de email a ${email}!`,
            "success"
          );
        } else {
          Swal.fire(
            "¡Error!",
            `Ocurrio un error al enviar el email, intente luego!`,
            "error"
          );
        }
      })
      .catch((error) => console.log("Error durante la petición:", error));
  };

  const downloadOrder = () => {
    //Arreglar la reparación...
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
      `https://api.textechsolutionscr.com/api/v1/pdf/reparacion/${repairId}`,
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

  return (
    <React.Fragment>
      <Detail
        order={order}
        detail={detail}
        invoice={invoice}
        company={company}
        product={product}
        title="Reparación"
        subtitle={"Detalle"}
      />

      <div className="container botones-contenedor">
        <Link to="/reparaciones">
          <button className="btn">Regresar</button>
        </Link>

        {collaboratorPermissions && order && order.id && (
          <Link to={`/reparacion/editar/${order.id}`}>
            <button className="btn">Editar</button>
          </Link>
        )}

        {order &&
          order.estado &&
          collaboratorPermissions &&
          order.estado !== "Entregado" && (
            <button className="btn" onClick={() => changeStateOrder()}>
              Modificar estado
            </button>
          )}

        {order && order.estado && permissions && order.estado !== "Anulada" && (
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

export default RepairDetail;
