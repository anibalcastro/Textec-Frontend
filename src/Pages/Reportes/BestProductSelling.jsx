import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Cookies from "js-cookie";
import TableProducts from "../../components/Tables/TableProducts";
import Swal from "sweetalert2";

const BestProductSelling = () => {
  const [products, setProducts] = useState([]);
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    getProducts();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const getProducts = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://api.textechsolutionscr.com/api/v1/vista/mejores-productos", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setProducts(data);
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

      fetch(`https://api.textechsolutionscr.com/api/v1/pdf/mejores-productos`, requestOptions)
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
      <Header title="Productos más vendidos" />

      <div className="container mediciones-filtro">
        <button className="btn-registrar" onClick={() => downloadPDF()}>
          Descargar
        </button>
      </div>

      <hr className="division" />

      <TableProducts datos={products} />

    </React.Fragment>
  );
};

export default BestProductSelling;
