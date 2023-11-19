import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Cookies from "js-cookie";
import Logo from "../../Images/Logos/Icono (1).webp";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditRepair = () => {
  const [order, setOrder] = useState({
    id: 0,
    titulo: "",
    id_empresa: 0,
    estado: "Pendiente",
    fecha: "",
    cajero: "",
    descripcion: "NA",
  });

  const [orderDetail, setOrderDetail] = useState({
    id_producto: 0,
    cantidad: 0,
    descripcion: "",
    precio_unitario: 0,
    subtotal: 0,
  });

  const [invoice, setInvoice] = useState([]);

  const [company, setCompany] = useState([]);
  const [detail, setDetail] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);


  const { repairId } = useParams();
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const navigate = useNavigate();

  useEffect(() => {
    alertInvalidatePermission();
    fetchOrder();
    fetchProducts();
    getCompany();
    loadingData();
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateUserPermission = () => {
    if (role !== "Visor"){
      return true
    }

    return false
  }

  const alertInvalidatePermission = () => {
    if (!validateUserPermission()){
      Swal.fire(
        "Acceso denegado",
        "No tienes los permisos necesarios para realizar esta acción.",
        "info"
      ).then((result) => {
        if(result.isConfirmed){
          navigate("/inicio")
        }
        else{
          navigate("/inicio")
        }
      })

    }

  }

  const fetchOrder = () => {
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
          setTotal(parseFloat(factura[0].monto));
          setTax(parseFloat(factura[0].iva));
          setSubtotal(parseFloat(factura[0].subtotal));
        } else {
          Swal.fire("Error, intentelo más tarde!", "error");
        }
      })
      .catch((error) => console.log("error", error));
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

    setDetail([...detail, { ...orderDetail, subtotal }]);

    subtotal += total;

    setTotal(subtotal);

    // Reinicia el estado de detalleProducto para el próximo detalle
    setOrderDetail({
      id_producto: "",
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


    setOrderDetail({
      ...orderDetail,
      id_producto: selectedProductId || ""
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
        item.id_producto !== IdProducto ||
        item.cantidad !== cantidad
    );

    let newAmountTotal = total - subtotal;

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

    const reparacion = {
      titulo: order.titulo,
      id_empresa: order.id_empresa,
      fecha: order.fecha,
      precio: total,
      estado: "Pendiente",
      comentario: order.comentario,
      detalles: detail.map((detalle) => ({
        id_producto: detalle.id_producto,
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
          comentario: "Muchas gracias por su compra",
          cajero: invoice[0].cajero,
        },
      ],
    };

    const raw = JSON.stringify({ reparacion });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/reparacion/editar/${repairId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {

        const { status, error } = result;

        if (parseInt(status) === 200) {
          Swal.fire(
            "Reparación modificada con éxito",
            "Se ha modificado la reparación y se ha actualizado la factura.",
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              navigate("/reparaciones");
            } else {
              navigate("/reparaciones");
            }
          });
        } else {
          let errorMessage = "";

          for (const message of error) {
            errorMessage += message + "\n";
          }

          Swal.fire("Error al modificar la reparación!", `${errorMessage}`, "error");
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

  const editDetailProduct = (
    nombre_producto,
    id_producto,
    cantidad,
    descripcion,
    subtotal
  ) => {
    // Crea un nuevo objeto de detalle con los valores proporcionados

    const precio_unitario = subtotal / cantidad;

    const updatedDetail = {
      nombre_producto: nombre_producto,
      id_producto: id_producto,
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
    deleteDetail(descripcion, id_producto, cantidad, subtotal);
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


  return (
    <React.Fragment>
      <Header title="Editar reparación" />

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
              value={order.fecha}
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
                  selected={product.id === orderDetail.id_producto}
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

      <Header title="Detalle de la reparación" />

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
                <td>{nameProduct(item.id_producto)}</td>
                <td>{item.cantidad}</td>
                <td>{item.descripcion}</td>
                <td>{formatCurrencyCRC.format(item.subtotal)}</td>
                <td className="table-button-content">
                  <button
                    className="btnEdit"
                    onClick={() =>
                      editDetailProduct(
                        item.nombre_producto,
                        item.id_producto,
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
                        item.id_producto,
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

export default EditRepair;
