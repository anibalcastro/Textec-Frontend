import React, { useState } from "react";
import Header from "../../components/Header/Header";

const ReportSales = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const downloadPDF = () => {};

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

      </div>
    </React.Fragment>
  );
};

export default ReportSales;
