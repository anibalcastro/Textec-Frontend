import React, { useEffect, useState } from "react";

const DetalleMedicion = () => {
  return (
    <React.Fragment>
      <div className="container detalle-medicion">
        <h2 className="titulo-encabezado">Massiel Ponce Chavarria - Camisa</h2>
        <hr className="division"></hr>

        <div className="container lista-mediciones">
          <div className="div-inp">
            <label htmlFor="text">Espalda:</label>
            <p className="resultado-medida">10 cm</p>
          </div>
          <div className="div-inp">
            <label htmlFor="text">Talle de espalda:</label>
            <p className="resultado-medida">10 cm</p>
          </div>
          <div className="div-inp">
            <label htmlFor="text">Talle de frente:</label>
            <p className="resultado-medida">10 cm</p>
          </div>

          <div className="div-inp">
            <label htmlFor="text">Busto:</label>
            <p className="resultado-medida">10 cm</p>
          </div>
          <div className="div-inp">
            <label htmlFor="text">Cintura:</label>
            <p className="resultado-medida">10 cm</p>
          </div>
          <div className="div-inp">
            <label htmlFor="text">Cadera:</label>
            <p className="resultado-medida">10 cm</p>
          </div>

          <div className="div-inp">
            <label htmlFor="text">Largo Manga Corta:</label>
            <p className="resultado-medida">10 cm</p>
          </div>
          <div className="div-inp">
            <label htmlFor="text">Largo Manga Larga:</label>
            <p className="resultado-medida">10 cm</p>
          </div>
          <div className="div-inp">
            <label htmlFor="text">Ancho Manga Corta:</label>
            <p className="resultado-medida">10 cm</p>
          </div>

          <div className="div-inp">
            <label htmlFor="text">Ancho Manga Larga:</label>
            <p className="resultado-medida">10 cm</p>
          </div>
          <div className="div-inp">
            <label htmlFor="text">Largo total:</label>
            <p className="resultado-medida">10 cm</p>
          </div>
          <div className="div-inp">
            <label htmlFor="text">Alto de pinza:</label>
            <p className="resultado-medida">10 cm</p>
          </div>

          <div className="div-inp">
            <label htmlFor="text">Talla:</label>
            <p className="resultado-medida">10 cm</p>
          </div>
          <div className="div-inp">
            <label htmlFor="text">Observaciones:</label>
            <p className="resultado-medida">Lorem nkonk csnkacnsa cnsanckoan nkcsa </p>
          </div>

        </div>

        
      </div>
    </React.Fragment>
  );
};

export default DetalleMedicion;
