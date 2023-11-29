import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import TableCustomers from "../../components/Tables/TableCustomer";

const ReportCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    getCustomer();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const getCustomer = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://api.textechsolutionscr.com/api/v1/vista/clientes", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setCustomers(data);
        }
      })
      .catch((error) => console.log("error", error));
  }


  

  const downloadPDF = () => {
    //Arreglar la reparación...
    Swal.fire({
      title: 'Generando el PDF',
      text: 'Espere un momento...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer  ${token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`https://api.textechsolutionscr.com/api/v1/reporte-clientes`, requestOptions)
        .then(response => response.json())
        .then(result => {
          const download_url = decodeURIComponent(result.download_url);
          const downloadLink = document.createElement("a");
          downloadLink.href = download_url;
          downloadLink.target = "_self"; // Abrir en una nueva pestaña
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          Swal.close();
        })
        .catch(error => console.log('error', error));
  };

  return (
    <React.Fragment>
      <Header title="Reporte de clientes" />

      <div className="container mediciones-filtro">
        <button className="btn-registrar" onClick={() => downloadPDF()}>
          Descargar
        </button>
      </div>

      <TableCustomers datos={customers} />

    </React.Fragment>
  );
};

export default ReportCustomers;
