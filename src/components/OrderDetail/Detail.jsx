import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

const Detail = ({
  order,
  detail,
  invoice,
  company,
  product,
  title,
  subtitle,
}) => {
  const role = Cookies.get("role");
  const token = Cookies.get("jwtToken");
  const { ordenId } = useParams();

  const [inputPizarraDisabled, setInputPizarraDisabled] = useState(false);
  const [inputTelasDisabled, setInputTelasDisabled] = useState(false);
  const [customerOrder, setCustomerOrder] = useState([]);

  useEffect(() => {
    getCustomersOrder();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    const statePizarra = updateStateInputPizarra(order);
    const stateTela = updateStateInputTela(order);

    setInputPizarraDisabled(statePizarra);
    setInputTelasDisabled(stateTela)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCustomersOrder = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    let idOrden = 0;

    if (ordenId === undefined){
      const currentURL = window.location.href;
      //console.log(currentURL);
  
      const regex = /\/orden\/(\d+)\/pagos/;
      const match = currentURL.match(regex);
      if (match) {
        const numero = match[1];
        //console.log(numero); // Esto imprimirá "30" en la consola
        idOrden = numero;
      } 
    }
    else{
      idOrden = ordenId;
    }

    fetch(
      `https://api.textechsolutionscr.com/api/v1/personas/orden/${idOrden}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        //console.log(result);
        const { data } = result;
        setCustomerOrder(data);
      })
      .catch((error) => console.error(error));
  };

  const updateStateInputPizarra = (orderDetail) => {
    if (parseInt(orderDetail.pizarra) === 1) {
      return true;
    }

    return false;
  }

  const updateStateInputTela = (orderDetail) => {
    if (parseInt(orderDetail.tela) === 1) {
      return true;
    }

    return false;
  }

  const handleDeliveryChange = (itemId) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/personas/modificar/estado/${itemId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status } = result;

        if (status === 200) {
          Swal.fire(
            "Notificación",
            "Se ha marcado que fue entregado correctamente",
            "success"
          );

          // Actualiza el estado de customerOrder solo si la solicitud fue exitosa
          const updatedCustomerOrder = customerOrder.map((item) => {
            if (item.id === itemId) {
              // Si el ID del elemento coincide, cambia el estado de entrega
              return {
                ...item,
                entregado: item.entregado === 1 ? 0 : 1, // Si estaba entregado, cambia a no entregado; si no estaba entregado, cambia a entregado
              };
            }
            return item;
          });

          // Actualiza el estado de customerOrder con el nuevo estado de entrega
          setCustomerOrder(updatedCustomerOrder);
        }
      })
      .catch((error) => console.error(error));
  };

  /**Format of currency CRC */
  const formatCurrencyCRC = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  });

  /**Method for check pizzarra, and change true in the database */
  const handleCheckboxPizarraChange = (event) => {
    setInputPizarraDisabled(event.target.checked);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/orden/pizarra/${order.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status } = result;

        if (status === 200) {
          const checkboxPizarra = document.getElementById('cbPizarra');
          checkboxPizarra.disabled = true;
          checkboxPizarra.checked = true;

          Swal.fire(
            "Notificación",
            "Tu solicitud de pizarra ha sido procesada correctamente.",
            "success"
          );
        }
      })
      .catch((error) => console.error(error));

  };

  /**Method for check Telas, and change true in the database */
  const handleCheckboxTelasChange = (event) => {
    setInputTelasDisabled(event.target.checked);
    //console.log("entra");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/orden/tela/${order.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status } = result;

        if (status === 200) {
          const checkboxTela = document.getElementById('cbTela');
          checkboxTela.disabled = true;
          checkboxTela.checked = true;
          Swal.fire(
            "Notificación",
            "Tu solicitud de tela ha sido procesada correctamente.",
            "success"
          );
        }
      })
      .catch((error) => console.error(error));

  };

  /**Format date */
  const formatDate = (inputDate) => {
    if (inputDate) {
      const date = new Date(inputDate);
      const day = date.getDate();
      const month = date.getMonth() + 1; // Sumamos 1 para ajustar el índice del mes
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }
    return ""; // O cualquier valor predeterminado que desees en caso de que la fecha no sea válida
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

  /**Return name of product */
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

  /**Function to validate role is diferent that visor */
  const validateRole = () => {
    if (role !== "Visor") {
      return true;
    }

    return false;
  };

  //Const showAmount
  const showAmount = validateRole();

  return (
    <React.Fragment>
      <Header title={title} />

      <div className="container form-contenedor">
        <form className="form-registro-clientes">
          <div className="div-inp">
            <label htmlFor="password">Consecutivo:</label>
            <input
              type="text"
              name="titulo"
              id="titulo"
              autoComplete="current-password"
              value={order.id}
              disabled
            />
          </div>

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
              value={formatDate(order.fecha_orden) || formatDate(order.fecha)}
              required
            />
          </div>

          <div className="div-inp">
            <label htmlFor="password">Vendedor:</label>
            {Array.isArray(invoice) && invoice && invoice.length > 0 ? (
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
          <div className="checkboxContainer">
            <div className="form-check">
              <input
                id="cbPizarra"
                className="form-check-input"
                type="checkbox"
                checked={inputPizarraDisabled || order.pizarra === 1}
                disabled={inputPizarraDisabled || order.pizarra === 1}
                onChange={handleCheckboxPizarraChange}
              />
              <label className="form-check-label" htmlFor="cbPizarra">
                <strong>Pizarra</strong>
                <span className="custom-checkbox"></span>
              </label>
            </div>

            <div className="form-check">
              <input
                id="cbTela"
                className="form-check-input"
                type="checkbox"
                checked={inputTelasDisabled || order.tela === 1}
                disabled={inputTelasDisabled || order.tela === 1}
                onChange={handleCheckboxTelasChange}
              />
              <label className="form-check-label" htmlFor="cbTela">
                <strong>Tela</strong>
                <span className="custom-checkbox"></span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <hr></hr>

      <Header title={subtitle} />

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            {showAmount ? (
              <>
                <th>Precio unitario</th> <th>Precio total</th>
              </>
            ) : null}
          </tr>
        </thead>

        <tbody>
          {Array.isArray(detail) &&
            detail.map((item) => (
              <tr key={item.id_producto}>
                <td>{nameProduct(item.id_producto)}</td>
                <td>{item.descripcion}</td>
                <td>{item.cantidad}</td>
                {showAmount ? (
                  <>
                    {" "}
                    <td>
                      {formatCurrencyCRC.format(item.subtotal / item.cantidad)}
                    </td>
                    <td>{formatCurrencyCRC.format(item.subtotal)}</td>
                  </>
                ) : null}
              </tr>
            ))}
        </tbody>
      </table>
      <hr></hr>

      {customerOrder ? 
      (<>
      <Header title={"Clientes"} />

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>Prenda</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Entregado</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(customerOrder) &&
            customerOrder.map((item) => (
              <tr key={item.id}>
                <td>{item.prenda}</td>
                <td>{item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      name="cantidad"
                      value="1"
                      checked={item.entregado === 1}
                      disabled={item.entregado === 1}
                      onChange={() => handleDeliveryChange(item.id)}
                    />
                    {item.entregado === 1 ? "Entregado" : "No entregado"}
                  </label>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      </>) : null}



      <hr></hr>
      {showAmount ? (
        <>
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
        </>
      ) : null}

      <hr></hr>
    </React.Fragment>
  );
};

export default Detail;
