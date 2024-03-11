import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CreateOrder = () => {
  const [orderCompany, setOrderCompany] = useState({
    titulo: "",
    id_empresa: 0,
    fecha_orden: "",
    precio_total: 0,
    estado: "",
    comentario: "NA",
  });
  const [orderDetail, setOrderDetail] = useState({
    nombre_producto: "",
    IdProducto: 0,
    cantidad: 0,
    descripcion: "",
    precio_unitario: 0,
    subtotal: 0,
  });
  const [customer, setCustomer] = useState({
    prenda: "",
    nombre_cliente: "",
    cantidad: "",
  });

  const [arrayCustomer, setArrayCustomer] = useState([]);
  const [detail, setDetail] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [company, setCompany] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterCompany, setFilterCompany] = useState("");
  const [dataLoad, setDataLoad] = useState(false);
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const navigate = useNavigate();

  useEffect(() => {
    alertInvalidatePermission();

    if (!dataLoad) {
      fetchCompany();
      fetchProducts();
      setDataLoad(true);
    }
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

  const calculateTaxAndSubt = (total) => {
    const taxRate = 13; // Tasa de impuesto (13% en este ejemplo)

    // Calcula el subtotal restando el impuesto del precio total
    const subtotal = total / (1 + taxRate / 100);

    // Calcula el impuesto
    const tax = total - subtotal;

    // Establece los valores en los estados correspondientes
    setSubtotal(subtotal.toFixed(2));
    setTax(tax.toFixed(2));
  };

  const handleSubmitCustomer = (event) => {
    event.preventDefault();

    let array = [];
    array.push(arrayCustomer);
    array.push(customer);

    let flattenedArray = array
      .flat(Infinity)
      .filter(
        (item) => typeof item === "object" && Object.keys(item).length > 0
      );

    setArrayCustomer(flattenedArray);

    //console.log(flattenedArray);

    // Restablece el estado 'customer' para limpiar los campos del formulario
    setCustomer({
      prenda: orderDetail.nombre_producto,
      nombre_cliente: "",
      cantidad: 0,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (orderDetail.cantidad <= 0 || isNaN(orderDetail.cantidad)) {
      alert("La cantidad debe ser un número positivo");
      return;
    }

    let subtotal = orderDetail.cantidad * orderDetail.precio_unitario;

    setDetail([...detail, { ...orderDetail, subtotal }]);

    subtotal += total;

    setTotal(subtotal);

    // Reinicia el estado de detalleProducto para el próximo detalle
    setOrderDetail({
      producto: "",
      cantidad: "",
      descripcion: "",
      precio_unitario: "",
      subtotal: 0,
    });

    calculateTaxAndSubt(subtotal);
  };

  const handleInputChangeCustomers = (event) => {
    const { name, value } = event.target;
    let updatedCustomer = { ...customer }; // Copiar el estado actual de customer

    if (name === "nombre_cliente") {
      updatedCustomer.nombre_cliente = value;
    } else if (name === "cantidad") {
      updatedCustomer.cantidad = value;
    }

    // Agregar orderDetail.nombre_producto al estado si está presente
    if (orderDetail.nombre_producto) {
      updatedCustomer.prenda = orderDetail.nombre_producto;
    }

    setCustomer(updatedCustomer); // Asignar el próximo ID al nuevo cliente
  };

  const deleteCustomers = (nombre, prenda, cantidad) => {
    // Filtrar el array de clientes para excluir el objeto con los valores dados
    const nuevoArray = arrayCustomer.filter(cliente => {
      return cliente.nombre_cliente !== nombre || cliente.prenda !== prenda || cliente.cantidad !== cantidad;
    });

    setArrayCustomer(nuevoArray);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setOrderCompany({
      ...orderCompany,
      [name]: value,
    });
  };

  const handleInputChangeDetail = (event) => {
    const { name, value } = event.target;

    setOrderDetail({
      ...orderDetail,
      [name]: value,
    });
  };

  const handleInputChangeProduct = (event) => {
    const selectedProductId = event.target.value;
    // eslint-disable-next-line eqeqeq
    const selectedProduct = products.find(
      (product) => product.id == selectedProductId
    );

    setOrderDetail({
      ...orderDetail,
      IdProducto: parseInt(selectedProductId),
      nombre_producto: selectedProduct.nombre_producto,
    });
  };

  /**
   * Obtener información de empresas
   */
  const fetchCompany = () => {
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

  const fetchProducts = () => {
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
          setProducts(data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  /**
   * Get text in input (Buscar empresa)
   * @param {*} event
   */
  const handleInputChangeFilterCompany = (event) => {
    setFilterCompany(event.target.value);
  };

  /**
   * Filter company with input (Buscar empresa)
   * @returns
   */
  const filterDataCompany = () => {
    const datosFiltrados = company.filter((dato) => {
      return dato.nombre_empresa
        .toLowerCase()
        .includes(filterCompany.toLowerCase());
    });

    return datosFiltrados;
  };

  /**
   * Delete specific detail.
   * @param {*} IdProduct
   * @param {*} count
   */
  const deleteDetail = (descripcion, IdProducto, cantidad, subtotal) => {
    const updatedDetail = detail.filter(
      (item) =>
        item.descripcion !== descripcion ||
        item.IdProducto !== IdProducto ||
        item.cantidad !== cantidad
    );

    let newAmountTotal = total - subtotal;

    setTotal(newAmountTotal);
    calculateTaxAndSubt(newAmountTotal);
    setDetail(updatedDetail);
  };

  const getDate = () => {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0"); // Agrega un 0 si el mes es de un solo dígito
    const day = String(fecha.getDate()).padStart(2, "0"); // Agrega un 0 si el día es de un solo dígito
    return `${year}-${month}-${day}`;
  };

  /**
   *
   */
  const fetchOrder = () => {
    Swal.fire({
      title: "La orden se están guardando...",
      icon: "info",
      showConfirmButton: false,
      timer: 5000, // Duración en milisegundos (5 segundos)
    });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const today = getDate();

    // Usar el nuevo array personasFormateadas en el objeto JSON ordenado
    const ordenJSON = {
      orden: {
        titulo: orderCompany.titulo,
        id_empresa: orderCompany.id_empresa,
        fecha_orden: today,
        precio_total: total,
        estado: "Taller",
        comentario: orderCompany.comentario,
        detalles: detail.map((detalle) => ({
          id_producto: detalle.IdProducto,
          nombre_producto: detalle.nombre_producto,
          precio_unitario: detalle.precio_unitario,
          cantidad: detalle.cantidad,
          subtotal: detalle.subtotal,
          descripcion: detalle.descripcion,
        })),
        factura: [
          {
            id_empresa: parseInt(orderCompany.id_empresa),
            subtotal: parseFloat(subtotal),
            iva: parseFloat(tax),
            monto: parseFloat(total),
            saldo_restante: parseFloat(total),
            comentario: "Muchas gracias por su compra",
            cajero: orderCompany.cajero,
          },
        ],
        persona: arrayCustomer.map((item) => ({
          nombre : item.nombre_cliente,
          prenda : item.prenda,
          cantidad : item.cantidad
        })), 
      },
    };

    //console.log(`Orden Json`, ordenJSON)

    const ordenJSONString = JSON.stringify(ordenJSON);

    //console.log(`Json String`, ordenJSONString);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: ordenJSONString,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/ordenes/registrar",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status, error } = result;

        //console.log(result);

        if (parseInt(status) === 200) {
          const sendNotification = notify();

          if (sendNotification) {
            Swal.fire(
              "Orden creada con éxito",
              "Se ha registrado la orden y se ha generado una factura.",
              "success"
            ).then((result) => {
              if (result.isConfirmed) {
                navigate("/orden");
              } else {
                navigate("/orden");
              }
            });
          }
        } else {
          let errorMessage = "";

          for (const message of error) {
            errorMessage += message + "\n";
          }

          Swal.fire("Error al crear la orden!", `${errorMessage}`, "error");
        }
      })
      .catch((error) => console.log("error", error));
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

  const notify = () => {
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
      const mensaje =
        "Estimado cliente, espero que se encuentre bien. Le informamos que su orden de pedido ha sido registrada en nuestro sistema. Estamos a su disposición para cualquier consulta o ajuste necesario. ¡Gracias por su preferencia!";

      if (result.isConfirmed) {
        // Acción si el usuario elige WhatsApp
        let phoneNumber = returnPhoneCompany(orderCompany.id_empresa);
        phoneNumber = phoneNumber.replace(/[\s-]+/g, ""); // Número de teléfono de destino
        const url = `https://api.whatsapp.com/send?phone=+506${phoneNumber}&text=${encodeURIComponent(
          mensaje
        )}`;

        Swal.fire(
          "Orden creada con éxito",
          "Se ha registrado la orden y se ha generado una factura. Se abrirá la aplicación de WhatsApp para notificar al cliente.",
          "success"
        ).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.open(url, "_blank");
            navigate("/orden");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        const email = returnEmailCompany(orderCompany.id_empresa);
        sendEmail(email, mensaje);
        navigate("/orden");
      } else if (result.dismiss === Swal.DismissReason.close) {
        Swal.fire(
          "Orden creada con éxito",
          "Se ha registrado la orden y se ha generado una factura.",
          "success"
        ).then((result) => {
          if (result.isConfirmed) {
            navigate("/orden");
          } else {
            navigate("/orden");
          }
        });
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
            "¡Orden creada con éxito!",
            `Se ha registrado la orden de pedido y se ha generado una factura, se ha notificado al correo,${email}!`,
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

  return (
    <React.Fragment>
      <Header title="Registrar orden" />

      <div className="container form-contenedor">
        <form className="form-registro-clientes" onSubmit={handleSubmit}>
          <div className="div-inp">
            <label htmlFor="password">Titulo:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="titulo"
              id="titulo"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="div-inp">
            <label htmlFor="password">Buscar empresa:</label>
            <input
              onChange={handleInputChangeFilterCompany}
              type="text"
              name="buscarEmpresa"
              id="cedula"
              autoComplete="current-password"
            />
          </div>

          <div className="div-inp">
            <label htmlFor="empresa">Empresa:</label>
            <select
              onChange={handleInputChange}
              name="id_empresa"
              id="empresa"
              required
            >
              <option value="">Selecciona una empresa</option>
              {filterDataCompany().map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre_empresa}
                </option>
              ))}
            </select>
          </div>

          <div className="div-inp">
            <label htmlFor="password">Vendedor:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="cajero"
              id="titulo"
              autoComplete="current-password"
              required
            />
          </div>
        </form>
      </div>

      <hr className="division"></hr>

      <div className="form-contenedor">
        <form className="form-registro-clientes" onSubmit={handleSubmit}>
          <div className="div-inp">
            <label htmlFor="empresa">Producto:</label>
            <select
              onChange={handleInputChangeProduct}
              name="producto"
              id="producto"
              required
            >
              <option value="">Selecciona un producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nombre_producto}
                </option>
              ))}
            </select>
          </div>
          <div className="div-inp">
            <label htmlFor="count">Cantidad:</label>
            <input
              onChange={handleInputChangeDetail}
              type="number"
              name="cantidad"
              id="cantidad"
              value={orderDetail.cantidad}
              required
            />
          </div>

          <div className="div-inp">
            <label htmlFor="password">Descripción:</label>
            <textarea
              onChange={handleInputChangeDetail}
              id="txtArea"
              name="descripcion"
              rows="5"
              cols="60"
              value={orderDetail.descripcion}
            ></textarea>
          </div>

          <div className="div-inp">
            <label htmlFor="count">Precio x unidad:</label>
            <input
              onChange={handleInputChangeDetail}
              type="number"
              name="precio_unitario"
              id="cantidad"
              value={orderDetail.precio_unitario}
            />
          </div>
          <button className="btn-agregar-detalle">Agregar</button>
        </form>
      </div>

      <hr className="division"></hr>

      <div className="form-contenedor">
        <form
          className="form-registro-clientes"
          onSubmit={handleSubmitCustomer}
        >
          <div className="div-inp">
            <label htmlFor="name">Nombre</label>
            <input
              onChange={handleInputChangeCustomers}
              type="text"
              name="nombre_cliente"
              id="nombre_cliente"
              value={customer.nombre_cliente}
            ></input>
          </div>

          <div className="div-inp">
            <label htmlFor="count">Cantidad</label>
            <input
              onChange={handleInputChangeCustomers}
              type="number"
              name="cantidad"
              id="cantidad"
              min={1}
              value={customer.cantidad}
            ></input>
          </div>
          <button className="btn-agregar-detalle">Agregar persona</button>
        </form>
      </div>

      <hr className="division"></hr>

      <Header title="Detalle del pedido" />

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Descripción</th>
            <th>Precio total</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(detail) &&
            detail.map((item) => (
              <tr key={item.id_producto}>
                <td>{item.nombre_producto}</td>
                <td>{item.cantidad}</td>
                <td>{item.descripcion}</td>
                <td>{formatCurrencyCRC.format(item.subtotal)}</td>
                <td>
                  <button
                    className="btn-eliminar"
                    onClick={() =>
                      deleteDetail(
                        item.descripcion,
                        item.IdProducto,
                        item.cantidad,
                        item.subtotal
                      )
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <hr className="division"></hr>

      <Header title="Clientes" />

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>Prenda</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(arrayCustomer) &&
            arrayCustomer.map((item) => (
              <tr key={item.prenda}>
                <td>{item.prenda}</td>
                <td>{item.nombre_cliente}</td>
                <td>{item.cantidad}</td>
                <td>
                  <button
                    className="btn-eliminar"
                    onClick={() => deleteCustomers(item.nombre_cliente, item.prenda, item.cantidad)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <hr className="division"></hr>

      <Header title="Facturación" />
      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>Subtotal</th>
            <th>IVA 13%</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          <td>{formatCurrencyCRC.format(subtotal)}</td>
          <td>{formatCurrencyCRC.format(tax)}</td>
          <td>{formatCurrencyCRC.format(total)}</td>
        </tbody>
      </table>

      <div className="container botones-contenedor">
        <button
          className="btn-agregar-detalle"
          type="submit"
          onClick={fetchOrder}
        >
          Guardar
        </button>
      </div>
    </React.Fragment>
  );
};

export default CreateOrder;
