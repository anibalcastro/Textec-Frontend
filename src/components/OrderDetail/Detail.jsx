import React from "react";
import Header from "../Header/Header";

const Detail = ({ order, detail, invoice, company, product }) => {

  const formatCurrencyCRC = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  });

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


  return (
    <React.Fragment>
      <Header title="Detalle de la orden" />

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
              value={order.fecha_orden}
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

      <hr></hr>

      <Header title="Detalle del pedido" />

      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Precio total</th>
          </tr>
        </thead>

        <tbody>
          {detail.map((item) => (
            <tr key={item.id_producto}>
              <td>{nameProduct(item.id_producto)}</td>
              <td>{item.descripcion}</td>
              <td>{item.cantidad}</td>
              <td>{formatCurrencyCRC.format(item.subtotal / item.cantidad)}</td>
              <td>{formatCurrencyCRC.format(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr></hr>

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

      <hr></hr>
    </React.Fragment>
  );
};

export default Detail;
