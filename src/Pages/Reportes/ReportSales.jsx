import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import LineChart from "../../components/Graphics/LineChart";
import Cookies from "js-cookie";
import TableSales from "../../components/Tables/TableSales";
import Swal from "sweetalert2";

const ReportSales = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sales, setSales] = useState([]);
  const [dates, setDates] = useState([]);
  const [amounts, setAmount] = useState([]);

  const token = Cookies.get("jwtToken");

  useEffect(() => {
    getSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSales = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/vista/ventas",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;

          const fechasExtraidas = data.map((item) => item.fecha);
          const montosExtraidos = data.map((item) => item.monto_total);
          // Almacenar en estados correspondientes
          setDates(fechasExtraidas);
          setAmount(montosExtraidos);
          setSales(data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  // Filtrar datos según las fechas seleccionadas
  const filteredSales = sales.filter((item) => {
    const itemDate = new Date(item.fecha);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return itemDate >= start && itemDate <= end;
    } else if (start) {
      return itemDate >= start;
    } else if (end) {
      return itemDate <= end;
    }

    return true; // Si no se selecciona ninguna fecha, devuelve true para mostrar todos los elementos
  });

  const oldestDate = sales.reduce((oldest, current) => {
    const currentDate = new Date(current.fecha);
    return oldest === null || currentDate < oldest ? currentDate : oldest;
  }, null);

  const downloadPDF = () => {
    // Formatear la fecha más antigua en formato año-mes-día
    const currentDate = new Date();
    const formattedEndDate = currentDate.toISOString().split("T")[0];

    if (!startDate) {
      // Formatear la fecha más antigua en formato año-mes-día
      const formattedOldestDate = oldestDate.toISOString().split("T")[0];
      setStartDate(formattedOldestDate);
    }

    // Si endDate está vacío, asigna la fecha actual
    if (!endDate) {
      setEndDate(formattedEndDate);
    }

    if (new Date(endDate) < new Date(startDate)) {
      setStartDate(oldestDate);
      setEndDate(formattedEndDate);
    }

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

      var formdata = new FormData();
      formdata.append("fechaInicio", startDate);
      formdata.append("fechaFinal", endDate);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(`https://api.textechsolutionscr.com/api/v1/pdf/ventas`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          const download_url = decodeURIComponent(result.download_url);
          const downloadLink = document.createElement("a");
          downloadLink.href = download_url;
          downloadLink.target = "_self"; // Abrir en una nueva pestaña
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          Swal.close();
        })
        .catch(error => console.log(error));
  };

  return (
    <React.Fragment>
      <Header title="Reporte ventas" />

      <div className="container mediciones-filtro">
        <button className="btn-registrar" onClick={() => downloadPDF()}>
          Descargar
        </button>
      </div>

      <div className="inpDates">
        <div className="date-filter">
          <label htmlFor="startDate">Desde:</label>
          <input
            className="filtro-pedidos"
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>

        <div className="date-filter">
          <label htmlFor="endDate">Hasta:</label>
          <input
            className="filtro-pedidos"
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>

        <hr className="division"></hr>
        <div className="container tabla-ventas">
          <TableSales datos={filteredSales} />
        </div>

        <hr className="division"></hr>

        <LineChart fechas={dates} datosVentas={amounts} />
      </div>
    </React.Fragment>
  );
};

export default ReportSales;
