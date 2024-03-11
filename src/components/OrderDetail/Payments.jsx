import React from "react";
import Header from "../Header/Header";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const PaymentsTable = ({ payments, orderId }) => {
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  const formatCurrencyCRC = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  });

  const questionCancelPayment = (idPayment) => {
    Swal.fire({
      title: "¿Desea anular el abono?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelPayment(idPayment);
      } else {
        Swal.fire({
          title: "Se ha cancelado!",
          text: "No se anulará el abono",
          icon: "info",
        });
      }
    });
  };

  const cancelPayment = (idPayment) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("abono_id", idPayment);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/pagos/anular",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status } = result;

        if (status == 200) {
          Swal.fire(
            `Info`,
            "Se ha anulado la factura de manera correcta.",
            "info"
          );

          window.location.reload();
        } else {
          Swal.fire(
            `Error`,
            "No se ha podido anular, intentelo de nuevo.",
            "error"
          );
        }
      })
      .catch((error) => console.log("error", error));
  };


  const validateRole = (role) => {
    return role === "Admin";
  };

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
  
  const permissions = validateRole(role);


  let count = 1;

  return (
    <React.Fragment>
      <Header title="Pagos" />
      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Método de pago</th>
            <th>Monto</th>
            <th>Cajero</th>
            {permissions && (<th>Acciones</th>)}
          </tr>
        </thead>

        <tbody>
          {Array.isArray(payments) &&
            payments.map((item) => (
              <tr key={count + 1}>
                <td>{count++}</td>
                <td>{formatDate(item.created_at)}</td>
                <td>{item.estado}</td>
                <td>{item.metodo_pago}</td>
                <td>{formatCurrencyCRC.format(item.monto)}</td>
                <td>{item.cajero}</td>
                {permissions && (<td className="table-button-content">
                  <button
                    className="btnEdit"
                    onClick={() => questionCancelPayment(item.id)}
                    disabled={item.estado === "Anulado"}
                  >
                    {item.estado === "Anulado" ? `Anulado` : 'Anular'}
                  </button>
                </td>)}
                
              </tr>
            ))}
        </tbody>
      </table>

      <hr></hr>
    </React.Fragment>
  );
};

export default PaymentsTable;
