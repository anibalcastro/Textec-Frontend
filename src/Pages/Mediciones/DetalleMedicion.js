import React, { useEffect, useState } from "react";
import Logo from "../../Images/Logos/Icono (1).webp";
import { useParams, Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const DetalleMedicion = () => {
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");

  const [prenda, setPrenda] = useState("");
  const [medicion, setMedicion] = useState([]);
  const role = Cookies.get("role");
  const token = Cookies.get("jwtToken");

  const { idDetalle } = useParams(); // Extrae idDetalle directamente
  const navigate = useNavigate();

  const medicionesSuperior = [
    "Camisa",
    "Gabacha",
    "Camiseta",
    "Jacket",
    "Chaleco",
    "Gabacha medica",
    "Filipinas",
  ];

  const medicionesInferior = ["Short"];

  useEffect(() => {
    if (token) {
      obtenerInformacionMedidas(idDetalle);
    } else {
      Swal.fire(
        "Error",
        "Token no encontrado. Por favor, inicia sesión.",
        "error"
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idDetalle]);

  const prendaSuperior = medicionesSuperior.includes(prenda);
  const prendaInferior = medicionesInferior.includes(prenda);

  const obtenerInformacionMedidas = (idDetalle) => {
    const myHeaders = new Headers({
      Authorization: `Bearer ${token}`,
    });

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/cliente/medicion/${idDetalle}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result && result.hasOwnProperty("data") && result.data) {
          const { data } = result;

          //console.log(data);
          setPrenda(data[0].articulo);
          setMedicion(data[0]);
          obtenerNombreCliente(data[0].id_cliente);
        } else {
          const mensajeError = result?.mensaje || "No se encontró información";
          Swal.fire("Info", mensajeError, "info");
        }
      })
      .catch((error) => {
        //console.error("Error al obtener la información:", error);
        Swal.fire(
          "Error",
          "Hubo un problema al obtener la información",
          "error"
        );
      });
  };

  const obtenerNombreCliente = (idCliente) => {
    //console.log(idCliente);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`https://api.textechsolutionscr.com/api/v1/cliente/${idCliente}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result && result.hasOwnProperty("data") && result.data) {
          const { data } = result;
          setNombre(data.nombre);
          setApellido1(data.apellido1);
          setApellido2(data.apellido2);
        } else {
          const mensajeError = result?.mensaje || "No se encontró el cliente";
          Swal.fire("Info", mensajeError, "info");
        }
      })
      .catch((error) => console.error(error));
};


  const validarRol = () => role === "Admin";

  const peticionEliminar = (idDetalle) => {
    const myHeaders = new Headers({
      Authorization: `Bearer ${token}`,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/mediciones/eliminar/${idDetalle}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          Swal.fire(
            "Medición eliminada!",
            "Se ha eliminado permanentemente",
            "success"
          ).then((result) => {
            navigate("/mediciones");
          });
        } else {
          Swal.fire(
            "Error!",
            "No se pudo eliminar. Inténtalo luego.",
            "error"
          ).then(() => {
            navigate("/mediciones");
          });
        }
      })
      .catch((error) => {
        console.error("Error al eliminar la medición:", error);
        Swal.fire("Error", "Hubo un problema al eliminar la medición", "error");
      });
  };

  const eliminarMedicion = () => {
    Swal.fire({
      title: "¿Desea eliminar la medición?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        peticionEliminar(idDetalle);
      } else {
        Swal.fire("Cancelado", "No se eliminó la medición", "info");
      }
    });
  };

  const validarPermisos = () => role === "Admin" || role === "Colaborador";

  const permisosColaborador = validarPermisos();
  const permisos = validarRol();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <React.Fragment>
      <h2 className="titulo-encabezado">{`${nombre} ${apellido1} ${apellido2} - ${prenda}`}</h2>
      <hr className="division"></hr>
      <div className="container form-contenedor">
        <form className="form-registro-clientes" id="form-registro-medicion">
          {prenda === "Vestido" && (
            <>
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
                  <label htmlFor="text">Ancho espalda:</label>
                  <input
                    type="text"
                    id="cedula"
                    name="ancho_espalda"
                    autoComplete="current-text"
                    value={`${medicion.ancho_espalda_superior} cm`}
                    disabled
                  />
                </div>

                <div className="div-inp">
                  <label htmlFor="text">Largo total espalda:</label>
                  <input
                    type="text"
                    id="cedula"
                    name="largo_total_espalda"
                    autoComplete="current-text"
                    value={`${medicion.largo_total_espalda_superior} cm`}
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
                  <label htmlFor="text">Separación busto:</label>
                  <input
                    type="text"
                    id="cedula"
                    name="busto"
                    autoComplete="current-text"
                    value={`${medicion.separacion_busto_superior} cm`}
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
                  <label htmlFor="text">Largo total frente:</label>
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
                  <label htmlFor="text">Hombros:</label>
                  <input
                    type="text"
                    id="cadera"
                    name="cadera"
                    autoComplete="current-text"
                    value={`${medicion.hombros_superior} cm`}
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
                  <label htmlFor="text">Ancho Manga Corta:</label>
                  <input
                    type="text"
                    id="ancho_manga_corta"
                    name="ancho_manga_corta"
                    autoComplete="current-text"
                    value={`${medicion.ancho_manga_corta_superior} cm`}
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
                  <label htmlFor="text">Puño:</label>
                  <input
                    type="text"
                    id="ancho_manga_larga"
                    name="ancho_manga_larga"
                    autoComplete="current-text"
                    value={`${medicion.puno_superior} cm`}
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
                  <label htmlFor="text">Altura de cadera:</label>
                  <input
                    type="text"
                    id="altura_cadera_superior"
                    name="altura_cadera_superior"
                    autoComplete="current-text"
                    value={`${medicion.altura_cadera_inferior} cm`}
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

                <div className="div-inp">
                  <label htmlFor="text">Sastre:</label>
                  <input
                    type="text"
                    id="sastre"
                    name="sastre"
                    autoComplete="current-text"
                    value={medicion.sastre}
                    disabled
                  />
                </div>
              </div>
            </>
          )}

          {prenda === "Enagua" && (
            <>
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
                  <label htmlFor="text">Altura cadera:</label>
                  <input
                    type="text"
                    id="cadera"
                    name="cadera"
                    autoComplete="current-text"
                    value={`${medicion.altura_cadera_inferior} cm`}
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

                <div className="div-inp">
                  <label htmlFor="text">Sastre:</label>
                  <input
                    type="text"
                    id="sastre"
                    name="sastre"
                    autoComplete="current-text"
                    value={medicion.sastre}
                    disabled
                  />
                </div>
              </div>
            </>
          )}

          {prenda === "Pantalon" && (
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
                <label htmlFor="text">Altura cadera:</label>
                <input
                  type="text"
                  id="cadera"
                  name="cadera"
                  autoComplete="current-text"
                  value={`${medicion.altura_cadera_inferior} cm`}
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
                  name="rodilla_inferior"
                  autoComplete="current-text"
                  value={`${medicion.rodilla_inferior} cm`}
                  disabled
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Altura rodilla:</label>
                <input
                  type="text"
                  id="rodilla"
                  name="altura_rodilla_inferior"
                  autoComplete="current-text"
                  value={`${medicion.altura_rodilla_inferior} cm`}
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
                <label htmlFor="text">Contorno tiro:</label>
                <input
                  type="text"
                  id="tiro"
                  name="contorno_tiro_inferior"
                  autoComplete="current-text"
                  value={`${medicion.contorno_tiro_inferior} cm`}
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

              <div className="form-check">
                <input
                  id="cbTela"
                  className="form-check-input"
                  name="tiroLargo"
                  type="checkbox"
                  checked={medicion.tiro_largo_ya_inferior === 0}
                  disabled
                />
                <label className="form-check-label" htmlFor="cbTela">
                  <strong>Tiro largo ya:</strong>
                  <span className="custom-checkbox cbTiroLargoYa"></span>
                </label>
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

              <div className="div-inp">
                <label htmlFor="text">Sastre:</label>
                <input
                  type="text"
                  id="sastre"
                  name="sastre"
                  autoComplete="current-text"
                  value={medicion.sastre}
                  disabled
                />
              </div>
            </div>
          )}

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
                <label htmlFor="text">Ancho espalda:</label>
                <input
                  type="text"
                  id="cedula"
                  name="ancho_espalda"
                  autoComplete="current-text"
                  value={`${medicion.ancho_espalda_superior} cm`}
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
                <label htmlFor="text">Separación busto:</label>
                <input
                  type="text"
                  id="cedula"
                  name="busto"
                  autoComplete="current-text"
                  value={`${medicion.separacion_busto_superior} cm`}
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
                <label htmlFor="text">Hombros:</label>
                <input
                  type="text"
                  id="cadera"
                  name="cadera"
                  autoComplete="current-text"
                  value={`${medicion.hombros_superior} cm`}
                  disabled
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo total espalda:</label>
                <input
                  type="text"
                  id="cedula"
                  name="largo_total_espalda"
                  autoComplete="current-text"
                  value={`${medicion.largo_total_espalda_superior} cm`}
                  disabled
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo total frente:</label>
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
                <label htmlFor="text">Ancho Manga Corta:</label>
                <input
                  type="text"
                  id="ancho_manga_corta"
                  name="ancho_manga_corta"
                  autoComplete="current-text"
                  value={`${medicion.ancho_manga_corta_superior} cm`}
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
                <label htmlFor="text">Puño:</label>
                <input
                  type="text"
                  id="ancho_manga_larga"
                  name="ancho_manga_larga"
                  autoComplete="current-text"
                  value={`${medicion.puno_superior} cm`}
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

              <div className="div-inp">
                <label htmlFor="text">Sastre:</label>
                <input
                  type="text"
                  id="sastre"
                  name="sastre"
                  autoComplete="current-text"
                  value={medicion.sastre}
                  disabled
                />
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
                <label htmlFor="text">Altura cadera:</label>
                <input
                  type="text"
                  id="cadera"
                  name="cadera"
                  autoComplete="current-text"
                  value={`${medicion.altura_cadera_inferior} cm`}
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
                  name="rodilla_inferior"
                  autoComplete="current-text"
                  value={`${medicion.rodilla_inferior} cm`}
                  disabled
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Altura rodilla:</label>
                <input
                  type="text"
                  id="rodilla"
                  name="altura_rodilla_inferior"
                  autoComplete="current-text"
                  value={`${medicion.altura_rodilla_inferior} cm`}
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
                <label htmlFor="text">Contorno tiro:</label>
                <input
                  type="text"
                  id="tiro"
                  name="contorno_tiro_inferior"
                  autoComplete="current-text"
                  value={`${medicion.contorno_tiro_inferior} cm`}
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

              <div className="div-inp">
                <label htmlFor="text">Sastre:</label>
                <input
                  type="text"
                  id="sastre"
                  name="sastre"
                  autoComplete="current-text"
                  value={medicion.sastre}
                  disabled
                />
              </div>
            </div>
          )}
        </form>

        <div className="container img-contenedor">
          <img className="isologo" src={Logo} alt="imagen" />
        </div>
      </div>

      <div className="container botones-contenedor">
        {/*
            <Link to="/mediciones">
              <button className="btn-registrar">Regresar</button>
            </Link>
            */}

        <button className="btn-registrar" onClick={() => goBack()}>
          Regresar
        </button>

        {permisosColaborador && (
          <Link to={`/mediciones/editar/${medicion.id}`}>
            <button className="btn-registrar">Editar</button>
          </Link>
        )}

        {permisos ? (
          <button className="btn-registrar" onClick={eliminarMedicion}>
            Eliminar
          </button>
        ) : (
          ""
        )}
      </div>
    </React.Fragment>
  );
};

export default DetalleMedicion;
