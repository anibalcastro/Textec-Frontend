import React from "react";
import Header from "../Header/Header";
import Cookies from "js-cookie";

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

  const formatCurrencyCRC = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  });

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

  const validateRole = () => {
    console.log(role);
    if (role !== "Visor") {
      return true;
    }

    return false;
  };

  const showAmount = validateRole();

  return (
    <React.Fragment>
      <Header title={title} />

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
