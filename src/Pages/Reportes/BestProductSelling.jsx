import React, { useState } from "react";
import Header from "../../components/Header/Header";

const BestProductSelling = () => {
  

  const downloadPDF = () => {};

  return (
    <React.Fragment>
      <Header title="Saldos pendientes" />

      <div className="container mediciones-filtro">
        <button className="btn-registrar" onClick={() => downloadPDF()}>
          Descargar
        </button>
      </div>

    </React.Fragment>
  );
};

export default BestProductSelling;
