import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditOrder = () => {
  const [order, setOrder] = useState({
    id: 0,
    titulo: "",
    proforma : 0,
    id_empresa: 0,
    telefono: "",
    estado: "Taller",
    fecha_orden: "",
    cajero: "",
    descripcion: "NA",
  });

  const [orderDetail, setOrderDetail] = useState({
    id: 0,
    id_producto: 0,
    cantidad: 0,
    descripcion: "",
    precio_unitario: 0,
    subtotal: 0,
  });

  const [invoice, setInvoice] = useState([]);
  const [customer, setCustomer] = useState({
    prenda: "",
    nombre_cliente: "",
    cantidad: "",
  });
  const [newCustomer, setNewCustomer] = useState({
    prenda: "",
    nombre_cliente: "",
    cantidad: "",
  })
  const [arrayCustomer, setArrayCustomer] = useState([]);
  const [company, setCompany] = useState([]);
  const [detail, setDetail] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);

  const { ordenId } = useParams();
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const navigate = useNavigate();

  useEffect(() => {
    alertInvalidatePermission();
    fetchOrder();
    fetchProducts();
    getCompany();
    getCustomersOrder()
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
        const { orden, detalles, facturas, status,  } = result;
        if (status === 200) {
          setOrder(orden);
          setDetail(detalles);
          setInvoice(facturas);
          setTotal(parseFloat(facturas[0].monto));
          setTax(parseFloat(facturas[0].iva));
          setSubtotal(parseFloat(facturas[0].subtotal));
        } else {
          Swal.fire("Error, intentelo más tarde!", "error");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const getCustomersOrder = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    let idOrden = 0;

    if (ordenId === undefined) {
      const currentURL = window.location.href;
      //console.log(currentURL);

      const regex = /\/orden\/(\d+)\/pagos/;
      const match = currentURL.match(regex);
      if (match) {
        const numero = match[1];
        //console.log(numero); // Esto imprimirá "30" en la consola
        idOrden = numero;
      }
    } else {
      idOrden = ordenId;
    }

    fetch(
      `https://api.textechsolutionscr.com/api/v1/personas/orden/${idOrden}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { data } = result;
        setCustomer(data);
        setArrayCustomer(data);
      })
      .catch((error) => console.error(error));
  };

  const formatCurrencyCRC = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  });

  const nameProduct = (productId) => {
    const productFind = products.find(
      // eslint-disable-next-line eqeqeq
      (item) => parseInt(item.id) == parseInt(productId)
    );

    if (productFind) {
      return productFind.nombre_producto;
    } else {
      return "Producto no encontrado";
    }
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (orderDetail.cantidad <= 0 || isNaN(orderDetail.cantidad)) {
      alert("La cantidad debe ser un número positivo");
      return;
    }

    let subtotal = orderDetail.cantidad * orderDetail.precio_unitario;

    console.log(orderDetail);

    setDetail([...detail, { ...orderDetail, subtotal }]);

    subtotal += total;

    setTotal(subtotal);

    // Reinicia el estado de detalleProducto para el próximo detalle
    setOrderDetail({
      id: 0,
      id_producto: 0,
      cantidad: 0,
      descripcion: "",
      precio_unitario: 0,
      subtotal: 0,
    });

    calculateTaxAndSubt(subtotal);
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
    console.log("Nuevo ID de producto seleccionado:", selectedProductId);

    // Actualiza el estado de orderDetail con el nuevo id_producto
    setOrderDetail((prevDetail) => ({
      ...prevDetail,
      id_producto: selectedProductId,
    }));
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
   * Delete specific detail.
   * @param {*} IdProduct
   * @param {*} count
   */
  const deleteDetail = (id) => {
    const updatedDetail = detail.filter(
      (item) => parseInt(item.id) !== parseInt(id)
    );

    const dataFilter = detail.filter((x) => parseInt(x.id) === parseInt(id));

    let newAmountTotal = total - dataFilter[0].subtotal;

    setTotal(newAmountTotal);
    calculateTaxAndSubt(newAmountTotal);
    setDetail(updatedDetail);
  };

  /**
   *
   */
  const fetchUptadeOrder = () => {
    Swal.fire({
      title: "La orden se está modificando...",
      icon: "info",
      showConfirmButton: false,
      timer: 5000, // Duración en milisegundos (5 segundos)
    });
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
  
    const orden = {
      titulo: order.titulo,
      proforma: order.proforma,
      proforma2: order.proforma2,
      proforma3: order.proforma3,
      id_empresa: order.id_empresa,
      telefono: order.telefono,
      fecha_orden: order.fecha_orden,
      precio_total: total,
      estado: order.estado,
      comentario: order.comentario,
      detalles: detail.map((detalle) => ({
        id: detalle.id,
        id_producto: detalle.id_producto,
        nombre_producto: detalle.nombre_producto,
        precio_unitario: detalle.precio_unitario,
        cantidad: detalle.cantidad,
        subtotal: detalle.subtotal,
        descripcion: detalle.descripcion,
      })),
      factura: [
        {
          id_empresa: parseInt(order.id_empresa),
          subtotal: parseFloat(subtotal),
          iva: parseFloat(tax),
          monto: parseFloat(total),
          saldo_restante: parseFloat(total),
          comentario: invoice[0].comentario,
          cajero: invoice[0].cajero,
        },
      ],
      personas: Array.isArray(newCustomer) ? newCustomer.map((item) => ({
        nombre: item.nombre_cliente,
        prenda: item.prenda,
        cantidad: item.cantidad,
      })) : [{
        nombre: newCustomer.nombre_cliente,
        prenda: newCustomer.prenda,
        cantidad: newCustomer.cantidad,
      }],
    };
  
    const raw = JSON.stringify({ orden });
    //console.log(raw);
  
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    fetch(
      `https://api.textechsolutionscr.com/api/v1/ordenes/editar/${ordenId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status, error } = result;
  
        if (parseInt(status) === 200) {
          Swal.fire(
            "Orden modificada con éxito",
            "Se ha modificado la orden y se ha actualizado la factura.",
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              navigate("/orden");
            } else {
              navigate("/orden");
            }
          });
        } else {
          let errorMessage = "";
          //console.log(error);
  
          if (Array.isArray(error)) {
            for (const message of error) {
              errorMessage += message + "\n";
            }
          } else {
            errorMessage = "Ha ocurrido un error inesperado.";
          }
  
          Swal.fire("Error al modificar la orden!", `${errorMessage}`, "error");
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
      // eslint-disable-next-line eqeqeq
      (item) => parseInt(item.id) == parseInt(companyId)
    );

    if (empresaEncontrada) {
      return empresaEncontrada.nombre_empresa;
    } else {
      return "Empresa no encontrada";
    }
  };

  const editDetailProduct = (id) => {
    // Crea un nuevo objeto de detalle con los valores proporcionados
    const dataDetail = detail.filter(
      (item) => parseInt(item.id) === parseInt(id)
    );

    //const precio_unitario = subtotal / cantidad;

    const updatedDetail = {
      id: id,
      nombre_producto: nameProduct(dataDetail[0].id_producto),
      id_producto: dataDetail[0].id_producto,
      cantidad: dataDetail[0].cantidad,
      descripcion: dataDetail[0].descripcion,
      precio_unitario: dataDetail[0].precio_unitario,
    };

    let amountTotal = total;


    const subtotalDetalle = dataDetail[0].precio_unitario * dataDetail[0].cantidad;
 
    amountTotal = amountTotal - subtotalDetalle

    calculateTaxAndSubt(amountTotal);
    setTotal(amountTotal);

    // Actualiza el estado orderDetail con el nuevo detalle
    setOrderDetail(updatedDetail);
    deleteDetail(id);
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setOrder({
      ...order,
      [name]: value,
    });
  };

  const deleteCustomers = (id, nombre_cliente) => {
    // Filtrar el array de clientes para excluir el objeto con los valores dados
    const nuevoArray = arrayCustomer.filter((cliente, index) => index !== id);
    setArrayCustomer(nuevoArray);

    // Actualizar la descripción del pedido eliminando el nombre del cliente
    let nuevaDescripcion = orderDetail.descripcion;

    // Buscar y reemplazar el nombre del cliente en la descripción
   // Reemplazar el nombre del cliente en la descripción con una cadena vacía
    nuevaDescripcion = nuevaDescripcion.replace(new RegExp(`${nombre_cliente},?\\s*`, 'g'), '');


    // Actualizar el estado 'orderDetail' con la nueva descripción
    setOrderDetail((prevState) => ({
      ...prevState,
      descripcion: nuevaDescripcion,
    }));
  };

  const handleSubmitCustomer = (event) => {
    event.preventDefault();

    // Acceder al valor del campo 'nombre_cliente' del formulario
    const nombre_cliente = event.target.elements.nombre_cliente.value;

    // Obtener la descripción actual
    let descripcionActual = orderDetail.descripcion;

    // Agregar el nombre del cliente a la descripción actual, separado por comas
    descripcionActual = descripcionActual
      ? `${descripcionActual}, ${nombre_cliente}`
      : `Para: ${nombre_cliente}`;

    // Actualizar el estado 'orderDetail' con la nueva descripción
    setOrderDetail((prevState) => ({
      ...prevState,
      descripcion: descripcionActual,
    }));

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
    setNewCustomer(updatedCustomer);
  };

  return (
    <React.Fragment>
      <Header title="Editar orden" />

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
              onChange={handleInputChange}
            />
          </div>

          <div className="div-inp">
            <label htmlFor="password">Proforma:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="proforma"
              id="proforma"
              autoComplete="current-password"
              value={order.proforma}
            />
          </div>

          <div className="div-inp">
            <label htmlFor="password">Proforma2:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="proforma2"
              id="proforma2"
              autoComplete="current-password"
              value={order.proforma2}
            />
          </div>

          <div className="div-inp">
            <label htmlFor="password">Proforma3:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="proforma3"
              id="proforma3"
              autoComplete="current-password"
              value={order.proforma3}
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
            <label htmlFor="password">Teléfono:</label>
            {invoice && invoice.length > 0 ? (
              <input
                type="text"
                name="telefono"
                id="telefono"
                autoComplete="current-password"
                disabled={role !== 'Admin'}
                value={order.telefono}
                required
              />
            ) : (
              <span>No hay datos teléfono registrado.</span>
            )}
          </div>

          <div className="div-inp">
            <label htmlFor="password">Vendedor:</label>
            {invoice && invoice.length > 0 ? (
              <input
                type="text"
                name="cajero"
                id="titulo"
                autoComplete="current-password"
                disabled={role !== 'Admin'}
                value={invoice[0].cajero}
                required
              />
            ) : (
              <span>No hay datos de vendedor disponibles.</span>
            )}
          </div>
        </form>
      </div>

      <hr className="division"></hr>

      <div className="form-contenedor">
        <form className="form-registro-clientes" onSubmit={handleSubmit}>
          <div className="div-inp">
            <input
              onChange={handleInputChangeDetail}
              type="hidden"
              name="id"
              id="id"
              value={orderDetail.id}
            ></input>

            <label htmlFor="empresa">Producto:</label>
            <select
              name="producto"
              id="producto"
              required
              value={orderDetail.id_producto} // El valor actual de orderDetail.id_producto selecciona la opción correspondiente
              onChange={handleInputChangeProduct} // Manejador de cambio
            >
              <option value="">Selecciona un producto</option>
              {products.map((product) => (
                // eslint-disable-next-line eqeqeq
                <option key={product.id} value={product.id} selected={orderDetail.id_producto == product.id}>
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
            <th style={{ display: "none" }}>ID</th>
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
              <tr key={item.id}>
                <td style={{ display: "none" }}>{item.id}</td>
                <td>{nameProduct(item.id_producto)}</td>
                <td>{item.cantidad}</td>
                <td>{item.descripcion}</td>
                <td>{formatCurrencyCRC.format(item.subtotal)}</td>
                <td className="table-button-content">
                  <button
                    className="btnEdit"
                    onClick={() => editDetailProduct(item.id)}
                  >
                    Editar
                  </button>

                  <button
                    className="btnEdit-eliminar"
                    onClick={() => deleteDetail(item.id)}
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
            arrayCustomer.map((item, index) => (
              <tr key={index}>
                <td>{item.prenda}</td>
                <td>{item.nombre_cliente || item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>
                  <button
                    className="btn-eliminar"
                    onClick={() => deleteCustomers(index, item.nombre_cliente)}
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
          onClick={() => fetchUptadeOrder()}
        >
          Guardar
        </button>
      </div>
    </React.Fragment>
  );
};

export default EditOrder;
