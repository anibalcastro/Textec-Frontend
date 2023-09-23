import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Cookies from "js-cookie";
import Logo from "../../Images/Logos/Icono.png";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditOrder = () => {
  const [order, setOrder] = useState({
    id: 1,
    titulo: "Título de la Orden",
    id_empresa: 2,
    estado: "Pendiente",
    fecha_orden: "Fecha de la Orden",
    cajero: "Nombre del Vendedor",
    descripcion : "NA"
  });

  const [orderDetail, setOrderDetail] = useState({
    nombre_producto: "",
    IdProducto: 0,
    cantidad: 0,
    descripcion: "",
    precio_unitario: 0,
    subtotal: 0,
  });

  const [invoice, setInvoice] = useState({
    id_empresa: "",
    subtotal: 0,
    iva: 0,
    monto: 0,
    saldo_restante: 0,
    comentario: "",
    cajero: "",
  });

  const [company, setCompany] = useState([]);
  const [detail, setDetail] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const { orderId } = useParams();
  const token = Cookies.get("jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!dataLoaded) {
      const detallesObtenidos = [
        {
          IdProducto: 7,
          nombre_producto: "Vestido",
          descripcion: "Descripción del Producto 1",
          cantidad: 2,
          subtotal: 11300,
        },
        {
          IdProducto: 2,
          nombre_producto: "Gabacha Médica",
          descripcion: "Descripción del Producto 2",
          cantidad: 2,
          subtotal: 11300,
        },
        // Agregar más elementos de detalle según sea necesario
      ];

      const facturaObtenida = [
        {
          subtotal: 20000,
          iva: 2600,
          monto: 22600,
          saldo_restante: 5000,
        },
        // Agregar más elementos de factura según sea necesario
      ];

      // Actualiza el estado detail con los datos obtenidos
      setDetail(detallesObtenidos);

      // Actualiza el estado invoice con los datos obtenidos
      setInvoice(facturaObtenida);

      setDataLoaded(true); // Marca los datos como cargados
      // El resto de tu useEffect
      fetchProducts();
      getCompany();
    }

    getTotalDetail();
  }, [dataLoaded]);

  const getTotalDetail = () => {
    let sumaSubtotales = 0;

    for (const item of detail) {
      sumaSubtotales += item.subtotal;
    }

    setTotal(sumaSubtotales);
    calculateTaxAndSubt(sumaSubtotales);
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

  const handleInputChangeDetail = (event) => {
    const { name, value } = event.target;

    setOrderDetail({
      ...orderDetail,
      [name]: value,
    });
  };

  const handleInputChangeProduct = (event) => {
    const selectedProductId = event.target.value;
    const selectedProduct = products.find(
      (product) => product.id == selectedProductId
    );

    setOrderDetail({
      ...orderDetail,
      IdProducto: selectedProductId || "",
      nombre_producto: selectedProduct.nombre_producto || "",
    });
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
  const deleteDetail = (descripcion, IdProducto, cantidad, subtotal) => {
    const updatedDetail = detail.filter(
      (item) =>
        item.descripcion !== descripcion ||
        item.IdProducto !== IdProducto ||
        item.cantidad !== cantidad
    );

    let newAmountTotal = total - subtotal;

    console.log(subtotal);
    console.log(newAmountTotal);

    setTotal(newAmountTotal);
    calculateTaxAndSubt(newAmountTotal);
    setDetail(updatedDetail);
  };

  /**
   *
   */
  const fetchUptadeOrder = () => {
    fillStateInvoice();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const orden = {
      id_empresa: order.id_empresa,
      fecha_orden: order.fecha_orden,
      IVA: tax,
      subtotal: subtotal,
      precio_total: total,
      estado: "Pendiente",
      detalles: detail.map((detalle) => ({
        id_producto: detalle.id_producto,
        precio_unitario: detalle.precio_unitario,
        cantidad: detalle.cantidad,
        subtotal: detalle.subtotal,
        descripcion: detalle.descripcion,
      })),
      factura: invoice,
    };

    const raw = JSON.stringify({ orden });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`http://127.0.0.1:8000/api/v1/ordenes/editar/${orderId}`, requestOptions)
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

          for (const message of error) {
            errorMessage += message + "\n";
          }

          Swal.fire("Error al modificar la orden!", `${errorMessage}`, "error");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const fillStateInvoice = () => {
    setInvoice({
      id_empresa: order.id_empresa,
      subtotal: subtotal,
      iva: tax,
      monto: total,
      saldo_restante: total,
      comentario: "Muchas gracias por su compra",
      cajero: invoice.cajero,
    });
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

  const editDetailProduct = (
    nombre_producto,
    IdProduct,
    cantidad,
    descripcion,
    subtotal
  ) => {
    // Crea un nuevo objeto de detalle con los valores proporcionados

    const precio_unitario = subtotal / cantidad;

    const updatedDetail = {
      nombre_producto: nombre_producto,
      IdProducto: IdProduct,
      cantidad: cantidad,
      descripcion: descripcion,
      precio_unitario: precio_unitario,
    };

    let amountTotal = total;

    amountTotal = amountTotal - subtotal;

    calculateTaxAndSubt(amountTotal);
    setTotal(amountTotal);

    // Actualiza el estado orderDetail con el nuevo detalle
    setOrderDetail(updatedDetail);
    deleteDetail(descripcion, IdProduct, cantidad, subtotal);
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
              value={order.descripcion}
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
            <input
              type="text"
              name="cajero"
              id="titulo"
              autoComplete="current-password"
              disabled
              value={order.cajero}
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
                <option
                  key={product.id}
                  value={product.id}
                  selected={product.id === orderDetail.IdProducto}
                >
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
        <div className="container img-contenedor">
          <img className="isologo" src={Logo} alt="imagen" />
        </div>
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
              <tr key={item.IdProducto}>
                <td>{item.nombre_producto}</td>
                <td>{item.cantidad}</td>
                <td>{item.descripcion}</td>
                <td>{formatCurrencyCRC.format(item.subtotal)}</td>
                <td className="table-button-content">
                  <button
                    className="btnEdit"
                    onClick={() =>
                      editDetailProduct(
                        item.nombre_producto,
                        item.IdProducto,
                        item.cantidad,
                        item.descripcion,
                        item.subtotal
                      )
                    }
                  >
                    Editar
                  </button>

                  <button
                    className="btnEdit-eliminar"
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
