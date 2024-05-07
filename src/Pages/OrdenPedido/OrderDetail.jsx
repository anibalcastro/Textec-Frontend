import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Detail from "../../components/OrderDetail/Detail";

const OrderDetail = () => {
  const [order, setOrder] = useState({
    id: 0,
    titulo: "",
    id_empresa: 0,
    estado: "Taller",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const states = ["Taller", "Entrega Tienda", "Entregada al cliente"];

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
      `https://api.textechsolutionscr.com/api/v1/pdf/orden_pedido/${ordenId}`,
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

  const addFile = () => {
    // Utilizar SweetAlert para mostrar el formulario
    Swal.fire({
      title: "Adjuntar archivo",
      html: `
          <form id="adjuntar-archivo-form">
              <input type="file" id="archivo" name="archivo" required>
          </form>
      `,
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const form = document.getElementById("adjuntar-archivo-form");
        // Aquí puedes agregar validaciones personalizadas si es necesario
        if (!form.checkValidity()) {
          Swal.showValidationMessage("Por favor, completa todos los campos.");
          return false;
        }
        const archivo = form.querySelector('input[type="file"]').files[0];
        return { archivo };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const archivo = result.value.archivo;
        if (!archivo) {
          Swal.fire(
            "Error",
            "Por favor, selecciona un archivo válido.",
            "error"
          );
          return;
        }

        // Crear un FormData para enviar el archivo y el ID de la orden
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const formData = new FormData();
        formData.append("order_id", ordenId);
        formData.append("file", archivo);

        // Realizar la solicitud de API con fetch
        fetch("https://api.textechsolutionscr.com/api/v1/files/upload-file", {
          method: "POST",
          headers: myHeaders,
          body: formData,
          redirect: "follow",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // Verificar si la respuesta contiene un código de estado
            if (data.message === 'Archivo subido y almacenado con éxito.') {
              Swal.fire(
                "Éxito",
                "El archivo ha sido guardado con éxito.",
                "success"
              );
              window.location.reload();
            } else {
              Swal.fire(
                "Error",
                "Hubo un problema al guardar el archivo.",
                "error"
              );
            }
          })
          .catch((error) => {
            // Manejar errores de la solicitud
            Swal.fire(
              "Error",
              `Hubo un problema en la solicitud al servidor: ${error}`,
              "error"
            );
          });
      }
    });
  };

  const redirectPayments = () => {
    navigate(`/orden/${ordenId}/pagos`);
  };
  const redirectAddPerson = () => {
    navigate(`/orden/${ordenId}/registrar/persona`);
  };

  const permissions = validateRole(role);
  const collaboratorPermissions = validatePermissions();

  return (
    <React.Fragment>
      <Detail
        order={order}
        detail={detail}
        invoice={invoice}
        company={company}
        product={product}
        title={"Detalle de la orden"}
        subtitle={"Detalle de la orden"}
      />

      <div className="container botones-contenedor">
        <Link to="/orden">
          <button className="btn">Regresar</button>
        </Link>

        {collaboratorPermissions && (
          <Link to={`/orden/editar/${order.id}`}>
            <button className="btn">Editar</button>
          </Link>
        )}

        {collaboratorPermissions && order.estado !== "Entregada al cliente" && (
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
        {collaboratorPermissions && (
          <button className="btn" onClick={() => redirectPayments()}>
            Pagos
          </button>
        )}
        {collaboratorPermissions && (
          <button className="btn" onClick={() => redirectAddPerson()}>
            Agregar persona
          </button>
        )}

        {collaboratorPermissions && (
          <button className="btn" onClick={() => addFile()}>
            Añadir archivo
          </button>
        )}
      </div>
    </React.Fragment>
  );
};

export default OrderDetail;
