import React from "react";
import Header from "../Header/Header";
import { format } from "date-fns";
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
                <td>{format(new Date(item.created_at), "yyyy-MM-dd")}</td>
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
                    Anular
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