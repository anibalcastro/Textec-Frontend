import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import TableInventory from "../../components/Tables/TableInventory";

const ReportInventory = () => {
  const [inventory, setInventory] = useState([]);

  const token = Cookies.get("jwtToken");

  useEffect(() => {
    getInventory();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const getInventory = () => { 
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://api.textechsolutionscr.com/api/v1/vista/inventario", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setInventory(data);
        }
      })
      .catch((error) => console.log("error", error));

  }
  

  const downloadPDF = () => {
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

      fetch(`https://api.textechsolutionscr.com/api/v1/reporte-inventario`, requestOptions)
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
      <Header title="Reporte de inventario" />

      <div className="container mediciones-filtro">
        <button className="btn-registrar" onClick={() => downloadPDF()}>
          Descargar
        </button>
      </div>

      <TableInventory datos={inventory} />

    </React.Fragment>
  );
};

export default ReportInventory;
