const MedicionesInferior = ({ seleccionPrenda = "", handleInputChange }) => {

  return (
    <div className="container opciones-medidas">
      <div className="div-inp">
        <label htmlFor="text">Largo:</label>
        <input
          type="number"
          id="largo"
          name="largo"
          autoComplete="current-text"
          onChange={handleInputChange}
        />
      </div>
      <div className="div-inp">
        <label htmlFor="text">Cintura:</label>
        <input
          type="number"
          id="cintura"
          name="cintura"
          autoComplete="current-text"
          onChange={handleInputChange}
        />
      </div>

      <div className="div-inp">
        <label htmlFor="text">Cadera:</label>
        <input
          type="number"
          id="cadera"
          name="cadera"
          autoComplete="current-text"
          onChange={handleInputChange}
        />
      </div>

      <div className="div-inp">
        <label htmlFor="text">Altura cadera:</label>
        <input
          type="number"
          id="altura_cadera"
          name="altura_cadera"
          autoComplete="current-text"
          onChange={handleInputChange}
        />
      </div>

      <div className="div-inp">
        <label htmlFor="text">Pierna:</label>
        <input
          type="number"
          id="pierna"
          name="pierna"
          autoComplete="current-text"
          onChange={handleInputChange}
        />
      </div>

      <div className="div-inp">
        <label htmlFor="text">Rodilla:</label>
        <input
          type="number"
          id="rodilla"
          name="rodilla"
          autoComplete="current-text"
          onChange={handleInputChange}
        />
      </div>

      <div className="div-inp">
        <label htmlFor="text">Altura rodilla:</label>
        <input
          type="number"
          id="altura_rodilla"
          name="altura_rodilla"
          autoComplete="current-text"
          onChange={handleInputChange}
        />
      </div>

      <div className="div-inp">
        <label htmlFor="text">Ruedo:</label>
        <input
          type="number"
          id="ruedo"
          name="ruedo"
          autoComplete="current-text"
          onChange={handleInputChange}
        />
      </div>

      <div className="div-inp">
        <label htmlFor="text">Tiro:</label>
        <input
          type="number"
          id="tiro"
          name="tiro"
          autoComplete="current-text"
          onChange={handleInputChange}
        />
      </div>

      <div className="div-inp">
        <label htmlFor="text">Contorno tiro:</label>
        <input
          type="number"
          id="contorno_tiro"
          name="contorno_tiro"
          autoComplete="current-text"
          onChange={handleInputChange}
        />
      </div>

      <div className="div-inp">
        <label htmlFor="text">Talla:</label>
        <input
          type="text"
          id="talla"
          name="talla"
          autoComplete="current-text"
          onChange={handleInputChange}
          required
        />
      </div>

      {seleccionPrenda === "Pantalon" && (
        <div className="form-check">
          <input
            id="cbTela"
            className="form-check-input"
            name="tiroLargo"
            type="checkbox"
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="cbTela">
            <strong>Tiro largo ya:</strong>
            <span className="custom-checkbox cbTiroLargoYa"></span>
          </label>
        </div>
      )}

      <div className="div-inp">
        <label htmlFor="text">Observaciones:</label>
        <textarea
          name="observaciones"
          id="txtArea"
          rows="5"
          cols="10"
          onChange={handleInputChange}
        ></textarea>
      </div>

      <div className="div-inp">
        <label htmlFor="text">Sastre:</label>
        <input
          type="text"
          id="colaborador"
          name="colaborador"
          autoComplete="current-text"
          onChange={handleInputChange}
          required
        />
      </div>
    </div>
  );
};

export default MedicionesInferior;
