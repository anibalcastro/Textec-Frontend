import React, { useEffect, useState } from "react";
import Logo from "../../Images/Logos/Icono.jpg";
import { useParams, Link } from "react-router-dom";

const DetalleMedicion = () => {

  const [prenda, setPrenda] = useState('');
  const [medicion, setMedicion] = useState([])

  let idDetalle = useParams();

  const medicionesSuperior = [
    "Camisa",
    "Gabacha",
    "Camiseta",
    "Jacket",
    "Chaleco",
    "Gabacha medica"];

  /**Lista de mediciones inferiores */
  const medicionesInferior = ["Short", "Pantalon", "Enagua"];

  useEffect(() => {
    obtenetInformacionMedidas(idDetalle)
  },[idDetalle])

  /**Validaciones si el estado prenda existe en alguna de las listas */
  const prendaSuperior = medicionesSuperior.includes(prenda);
  const prendaInferior = medicionesInferior.includes(prenda);


  const obtenetInformacionMedidas = (parametro) => {
    let mediciones = localStorage.getItem('medidas');
    mediciones = JSON.parse(mediciones);

    mediciones.forEach((item, i) => {
      if (parseInt(item.id) === parseInt(parametro.idDetalle)) {
        console.log(item);
        setPrenda(item.articulo);
        setMedicion(item);
      }
    });

  }


  return (
    <React.Fragment>
      <div className="container registro-medicion">
        <h2 className="titulo-encabezado">{`${medicion.nombre} ${medicion.apellido1} ${medicion.apellido2} - ${medicion.articulo}`}</h2>
        <hr className="division"></hr>
        <div className="container form-contenedor">
          <form className="form-registro-clientes" id="form-registro-medicion" >

            {prendaSuperior && (
              <div className="container opciones-medidas">
                <div className="div-inp">
                  <label htmlFor="text">Espalda:</label>
                  <input
                    type="text"
                    id="espalda"
                    name="espalda"
                    autoComplete="current-text"
                    value={`${medicion.espalda_superior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Talle de espalda:</label>
                  <input
                    type="text"
                    id="cedula"
                    name="talle_espalda"
                    autoComplete="current-text"
                    value={`${medicion.talle_espalda_superior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Talle de frente:</label>
                  <input
                    type="text"
                    id="cedula"
                    name="talle_frente"
                    autoComplete="current-text"
                    value={`${medicion.talle_frente_superior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Busto:</label>
                  <input
                    type="text"
                    id="cedula"
                    name="busto"
                    autoComplete="current-text"
                    value={`${medicion.busto_superior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Cintura:</label>
                  <input
                    type="text"
                    id="cedula"
                    name="cintura"
                    autoComplete="current-text"
                    value={`${medicion.cintura_superior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Cadera:</label>
                  <input
                    type="text"
                    id="cadera"
                    name="cadera"
                    autoComplete="current-text"
                    value={`${medicion.cadera_superior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Largo Manga Corta:</label>
                  <input
                    type="text"
                    id="largo_manga_corta"
                    name="largo_manga_corta"
                    autoComplete="current-text"
                    value={`${medicion.largo_manga_corta_superior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Largo Manga Larga:</label>
                  <input
                    type="text"
                    id="largo_manga_larga"
                    name="largo_manga_larga"
                    autoComplete="current-text"
                    value={`${medicion.largo_manga_larga_superior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Ancho Manga Corta:</label>
                  <input
                    type="text"
                    id="ancho_manga_corta"
                    name="ancho_manga_corta"
                    autoComplete="current-text"
                    value={`${medicion.ancho_manga_corta_superior}`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Ancho Manga Larga:</label>
                  <input
                    type="text"
                    id="ancho_manga_larga"
                    name="ancho_manga_larga"
                    autoComplete="current-text"
                    value={`${medicion.ancho_manga_larga_superior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Largo total:</label>
                  <input
                    type="text"
                    id="largo_total"
                    name="largo_total"
                    autoComplete="current-text"
                    value={`${medicion.largo_total_superior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Alto de pinza:</label>
                  <input
                    type="text"
                    id="alto_pinza"
                    name="alto_pinza"
                    autoComplete="current-text"
                    value={`${medicion.alto_pinza_superior} cm`}
                    disabled
                  />
                </div>

                <div className="div-inp">
                  <label htmlFor="text">Talla:</label>
                  <input
                    type="text"
                    id="talla"
                    name="talla"
                    autoComplete="current-text"
                    value={medicion.talla}
                    disabled
                  />
                </div>

                <div className="div-inp">
                  <label htmlFor="text">Observaciones:</label>
                  <textarea
                    id="txtArea"
                    name="observaciones"
                    rows="5"
                    cols="60"
                    value={medicion.observaciones}
                    disabled
                  ></textarea>
                </div>
              </div>
            )}

            {prendaInferior && (
              <div className="container opciones-medidas">
                <div className="div-inp">
                  <label htmlFor="text">Largo:</label>
                  <input
                    type="text"
                    id="largo"
                    name="largo"
                    autoComplete="current-text"
                    value={`${medicion.largo_inferior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Cintura:</label>
                  <input
                    type="text"
                    id="cintura"
                    name="cintura"
                    autoComplete="current-text"
                    value={`${medicion.cintura_inferior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Cadera:</label>
                  <input
                    type="text"
                    id="cadera"
                    name="cadera"
                    autoComplete="current-text"
                    value={`${medicion.cadera_inferior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Pierna:</label>
                  <input
                    type="text"
                    id="pierna"
                    name="pierna"
                    autoComplete="current-text"
                    value={`${medicion.pierna_inferior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Rodilla:</label>
                  <input
                    type="text"
                    id="rodilla"
                    name="rodilla"
                    autoComplete="current-text"
                    value={`${medicion.rodilla_inferior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Ruedo:</label>
                  <input
                    type="text"
                    id="ruedo"
                    name="ruedo"
                    autoComplete="current-text"
                    value={`${medicion.ruedo_inferior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Tiro:</label>
                  <input
                    type="text"
                    id="tiro"
                    name="tiro"
                    autoComplete="current-text"
                    value={`${medicion.tiro_inferior} cm`}
                    disabled
                  />
                </div>
                <div className="div-inp">
                  <label htmlFor="text">Talla:</label>
                  <input
                    type="text"
                    id="talla"
                    name="talla"
                    autoComplete="current-text"
                    value={`${medicion.talla}`}
                    disabled
                  />
                </div>

                <div className="div-inp">
                  <label htmlFor="text">Observaciones:</label>
                  <textarea
                    name="observaciones"
                    id="txtArea"
                    rows="5"
                    cols="60"
                    value={medicion.observaciones}
                    disabled
                  ></textarea>
                </div>
              </div>
            )}
          </form>

          <div className="container img-contenedor">
            <img className="isologo" src={Logo} alt="imagen" />
          </div>
        </div>

                <div className="container botones-contenedor">
          <Link to="/mediciones">
            <button className="btn-registrar">Regresar</button>
          </Link>

          <Link to={`/mediciones/editar/${medicion.id}`}>
            <button className="btn-registrar">Editar</button>
          </Link>
        </div>
      
      </div>

      

    </React.Fragment>
  );
};

export default DetalleMedicion;
