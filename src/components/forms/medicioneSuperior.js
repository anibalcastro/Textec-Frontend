import React from "react";

const MedicionesSuperior = ({handleInputChange}) => {
    
    return(
        <div className="container opciones-medidas">
                <div className="div-inp">
                  <label htmlFor="text">Espalda:</label>
                  <input
                    type="number"
                    id="espalda"
                    name="espalda"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Talle de espalda:</label>
                  <input
                    type="number"
                    id="cedula"
                    name="talle_espalda"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Talle de frente:</label>
                  <input
                    type="number"
                    id="cedula"
                    name="talle_frente"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Busto:</label>
                  <input
                    type="number"
                    id="cedula"
                    name="busto"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Cintura:</label>
                  <input
                    type="number"
                    id="cedula"
                    name="cintura"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
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
                    required
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Largo Manga Corta:</label>
                  <input
                    type="number"
                    id="largo_manga_corta"
                    name="largo_manga_corta"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Largo Manga Larga:</label>
                  <input
                    type="number"
                    id="largo_manga_larga"
                    name="largo_manga_larga"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Ancho Manga Corta:</label>
                  <input
                    type="number"
                    id="ancho_manga_corta"
                    name="ancho_manga_corta"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Ancho Manga Larga:</label>
                  <input
                    type="number"
                    id="ancho_manga_larga"
                    name="ancho_manga_larga"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Largo total:</label>
                  <input
                    type="number"
                    id="largo_total"
                    name="largo_total"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Alto de pinza:</label>
                  <input
                    type="number"
                    id="alto_pinza"
                    name="alto_pinza"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
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

                <div className="div-inp">
                  <label htmlFor="text">Observaciones:</label>
                  <textarea
                    id="txtArea"
                    name="observaciones"
                    rows="5"
                    cols="60"
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

    )
}

export default MedicionesSuperior;