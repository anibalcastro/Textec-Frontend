import React, { useEffect, useState } from "react";
import Logo from "../../Images/Logos/Icono (1).webp";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const ModificarMedicion = () => {
  const [idMedicion, setIdMedicion] = useState("");
  const [prenda, setPrenda] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [mediciones, setMediciones] = useState([]);

  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const idDetalle = pathParts[pathParts.length - 1]; // Último segmento de la URL
    //console.log("ID extraído manualmente:", idDetalle);
    setIdMedicion(idDetalle);

    alertInvalidatePermission();
    obtenerInformacionMedidas(idDetalle);

    //console.log(nombre)
    //console.log(apellido1);
    //console.log(apellido2)

    return () => {
      // Restablecer los estados a sus valores iniciales
      setPrenda("");
      setNombre("");
      setApellido1("");
      setApellido2("");
      setMediciones([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateUserPermission = () => {
    if (role !== "Visor") {
      return true;
    }

    return false;
  };

  const alertInvalidatePermission = () => {
    if (!validateUserPermission()) {
      Swal.fire(
        "Acceso denegado",
        "No tienes los permisos necesarios para realizar esta acción.",
        "info"
      ).then((result) => {
        if (result.isConfirmed) {
          navigate("/inicio");
        } else {
          navigate("/inicio");
        }
      });
    }
  };

  /**Lista de mediciones superiores */
  const medicionesSuperior = [
    "Camisa",
    "Gabacha",
    "Camiseta",
    "Jacket",
    "Chaleco",
    "Gabacha medica",
    "Vestido",
    "Filipinas",
  ];

  /**Lista de mediciones inferiores */
  const medicionesInferior = ["Short"];

  /**Validaciones si el estado prenda existe en alguna de las listas */
  const prendaSuperior = medicionesSuperior.includes(prenda);
  const prendaInferior = medicionesInferior.includes(prenda);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMediciones({ ...mediciones, [name]: value });

    console.log(name);
    console.log(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes realizar la lógica de autenticación con los datos del formulario
    // por ejemplo, enviar una solicitud al servidor para verificar las credenciales
    //console.log(mediciones);

    // Restablecer los campos del formulario después de enviar
    modificarMedicion();
  };

  const modificarMedicion = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    var formdata = new FormData();

    formdata.append("id_cliente", mediciones.id_cliente);
    formdata.append("articulo", mediciones.articulo);
    formdata.append("fecha", mediciones.fecha);
    formdata.append("sastre", mediciones.sastre);
    formdata.append("observaciones", mediciones.observaciones || "NA");
    formdata.append("espalda_superior", mediciones.espalda_superior);
    formdata.append("talle_espalda_superior", mediciones.talle_espalda_superior);
    formdata.append("talle_frente_superior", mediciones.talle_frente_superior);
    formdata.append("busto_superior", mediciones.busto_superior);
    formdata.append("cintura_superior", mediciones.cintura_superior);
    formdata.append("cadera_superior", mediciones.cadera_superior);
    formdata.append("alto_pinza_superior", mediciones.alto_pinza_superior);
    formdata.append("largo_manga_corta_superior", mediciones.largo_manga_corta_superior);
    formdata.append("largo_manga_larga_superior",mediciones.largo_manga_larga_superior);
    formdata.append("ancho_manga_corta_superior",mediciones.ancho_manga_corta_superior);
    formdata.append("ancho_manga_larga_superior",mediciones.ancho_manga_larga_superior);
    formdata.append("largo_total_superior", mediciones.largo_total_superior);
    formdata.append("talla", mediciones.talla);
    formdata.append("largo_inferior", mediciones.largo_inferior);
    formdata.append("cintura_inferior", mediciones.cintura_inferior);
    formdata.append("cadera_inferior", mediciones.cadera_inferior);
    formdata.append("pierna_inferior", mediciones.pierna_inferior);
    formdata.append("rodilla_inferior", mediciones.rodilla_inferior);
    formdata.append("ruedo_inferior", mediciones.ruedo_inferior);
    formdata.append("altura_cadera_inferior", mediciones.altura_cadera_inferior);
    formdata.append("altura_rodilla_inferior", mediciones.altura_rodilla_inferior);
    formdata.append("contorno_tiro_inferior", mediciones.contorno_tiro_inferior);
    formdata.append("largo_total_espalda_superior", mediciones.largo_total_espalda_superior);
    formdata.append("ancho_espalda_superior", mediciones.largo_total_espalda_superior);
    formdata.append("separacion_busto_superior", mediciones.separacion_busto_superior);
    formdata.append("largo_entrepierna_inferior", mediciones.largo_entrepierna_inferior);
    formdata.append("alto_cadera_superior", mediciones.alto_cadera_superior || 0);
    formdata.append("ancho_pecho_superior", mediciones.ancho_pecho_superior || 0);
    formdata.append("boca_manga_superior", mediciones.boca_manga_superior || 0);
    formdata.append("largo_costado_superior", mediciones.largo_costado_superior || 0);
    formdata.append("contorno_cuello_superior", mediciones.contorno_cuello_superior || 0);
    formdata.append("escote_superior", mediciones.escote_superior || 0);
    formdata.append("hombros_superior", mediciones.hombros_superior || 0);
    formdata.append("largo_total_superior", mediciones.largo_total_superior || 0);
    formdata.append("puno_superior", mediciones.puno_superior || 0);
    formdata.append("tiro_inferior", mediciones.tiro_inferior || 0);


    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/mediciones/editar/${idMedicion}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const status = result.status;
        console.log(status);

        if (status === 200) {
          //console.log()

          // Cliente creado con éxito
          Swal.fire(
            "Medición modificada con éxito!",
            `Se ha a registrado!`,
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
              navigate("/mediciones");
            } else {
              // El usuario cerró el cuadro de diálogo sin hacer clic en el botón "OK"
              // Realiza alguna otra acción o maneja el caso en consecuencia
              navigate("/mediciones");
            }
          });
        } else {
          // Error al crear
          Swal.fire(
            "Error al modificar la medición!",
            "Vuelva a intentarlo luego!",
            "error"
          );
        }
      })
      .catch((error) => console.log("error", error));
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

    fetch(
      `https://api.textechsolutionscr.com/api/v1/cliente/${idCliente}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result && result.hasOwnProperty("data") && result.data) {
          const { data } = result;
          //console.log(data.nombre)

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

  const obtenerInformacionMedidas = (idDetalle) => {
    //console.log(idDetalle);

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

          //console.log(data[0]);

          setPrenda(data[0].articulo);
          setMediciones(data[0]);
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

  return (
    <React.Fragment>
      <h2 className="titulo-encabezado">Registro de mediciones</h2>
      <hr className="division"></hr>
      <div className="container form-contenedor">
        <form className="form-registro-clientes" onSubmit={handleSubmit}>
          <div className="div-inp">
            <label htmlFor="text">Cliente:</label>
            <input
              name="nombre"
              type="text"
              value={`${nombre} ${apellido1} ${apellido2}`}
              disabled
            ></input>
          </div>

          <div className="div-inp">
            <label htmlFor="text">Prenda:</label>
            <input
              name="nombre"
              type="text"
              defaultValue={prenda}
              disabled
            ></input>
          </div>

          <hr className="division"></hr>

          {prenda === "Enagua" && (
            <div className="container opciones-medidas">

              <div className="div-inp">
                <label htmlFor="text">Separacion busto:</label>
                <input
                  type="number"
                  id="separacion_busto_superior"
                  name="separacion_busto_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.separacion_busto_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo:</label>
                <input
                  type="number"
                  id="largo_inferior"
                  name="largo_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.largo_inferior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Cintura:</label>
                <input
                  type="number"
                  id="cintura_inferior"
                  name="cintura_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.cintura_inferior}
                  min={0}
                />
              </div>
              
              <div className="div-inp">
                <label htmlFor="text">Cadera:</label>
                <input
                  type="number"
                  id="cadera_inferior"
                  name="cadera_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.cadera_inferior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Altura cadera:</label>
                <input
                  type="number"
                  id="altura_cadera_inferior"
                  name="altura_cadera_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.altura_cadera_inferior}
                  min={0}
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
                  defaultValue={mediciones.talla}
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
                  defaultValue={mediciones.observaciones}
                ></textarea>
              </div>

              <div className="div-inp">
                <label htmlFor="text">Sastre:</label>
                <input
                  type="text"
                  id="sastre"
                  name="sastre"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.sastre}
                />
              </div>


            </div>

          )}

          {prenda === "Pantalon" && (
            <div className="container opciones-medidas">

              <div className="div-inp">
                <label htmlFor="text">Largo:</label>
                <input
                  type="number"
                  id="largo"
                  name="largo_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.largo_inferior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo entrepierna:</label>
                <input
                  type="number"
                  id="largo"
                  name="largo_entrepierna_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.largo_entrepierna_inferior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Cintura:</label>
                <input
                  type="number"
                  id="cintura"
                  name="cintura_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.cintura_inferior}
                  min={0}
                />
              </div>
              <div className="div-inp">
                <label htmlFor="text">Cadera:</label>
                <input
                  type="number"
                  id="cadera"
                  name="cadera_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.cadera_inferior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Altura cadera:</label>
                <input
                  type="number"
                  id="cadera"
                  name="altura_cadera_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.altura_cadera_inferior}
                  min={0}
                />
              </div>
              
              <div className="div-inp">
                <label htmlFor="text">Altura rodilla:</label>
                <input
                  type="number"
                  id="cadera"
                  name="altura_rodilla_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.altura_rodilla_inferior}
                  min={0}
                />
              </div>



              <div className="div-inp">
                <label htmlFor="text">Pierna:</label>
                <input
                  type="number"
                  id="pierna"
                  name="pierna_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.pierna_inferior}
                  min={0}
                />
              </div>
              
              <div className="div-inp">
                <label htmlFor="text">Rodilla:</label>
                <input
                  type="number"
                  id="rodilla_inferior"
                  name="rodilla_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.rodilla_inferior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Ruedo:</label>
                <input
                  type="number"
                  id="ruedo"
                  name="ruedo_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.ruedo_inferior}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Tiro:</label>
                <input
                  type="number"
                  id="tiro_inferior"
                  name="tiro_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.tiro_inferior}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Contorno tiro:</label>
                <input
                  type="number"
                  id="tiro"
                  name="contorno_tiro_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.contorno_tiro_inferior}
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
                  defaultValue={mediciones.talla}
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
                  defaultValue={mediciones.observaciones}
                ></textarea>
              </div>

              <div className="div-inp">
                <label htmlFor="text">Sastre:</label>
                <input
                  type="text"
                  id="sastre"
                  name="sastre"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.sastre}
                />
              </div>


            </div>
          )}

          {prendaSuperior && (
            <div className="container opciones-medidas">
              <div className="div-inp">
                <label htmlFor="text">Espalda:</label>
                <input
                  type="number"
                  id="espalda"
                  name="espalda_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.espalda_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Talle de espalda:</label>
                <input
                  type="number"
                  id="cedula"
                  name="talle_espalda_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.talle_espalda_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Ancho de espalda:</label>
                <input
                  type="number"
                  id="ancho_espalda_superior"
                  name="ancho_espalda_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.ancho_espalda_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Hombros:</label>
                <input
                  type="number"
                  id="hombros_superior"
                  name="hombros_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.hombros_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Talle de frente:</label>
                <input
                  type="number"
                  id="cedula"
                  name="talle_frente_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.talle_frente_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Alto pinza:</label>
                <input
                  type="number"
                  id="alto_pinza_superior"
                  name="alto_pinza_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.alto_pinza_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Alto de cadera:</label>
                <input
                  type="number"
                  id="alto_cadera_superior"
                  name="alto_cadera_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.alto_cadera_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Separación de busto:</label>
                <input
                  type="number"
                  id="separacion_busto_superior"
                  name="separacion_busto_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.separacion_busto_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Ancho de pecho:</label>
                <input
                  type="number"
                  id="ancho_pecho_superior"
                  name="ancho_pecho_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.ancho_pecho_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Boca manga:</label>
                <input
                  type="number"
                  id="boca_manga_superior"
                  name="boca_manga_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.boca_manga_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo costado:</label>
                <input
                  type="number"
                  id="largo_costado_superior"
                  name="largo_costado_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.largo_costado_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Busto:</label>
                <input
                  type="number"
                  id="cedula"
                  name="busto_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.busto_superior}
                  min={0}
                />
              </div>
              <div className="div-inp">
                <label htmlFor="text">Cintura:</label>
                <input
                  type="number"
                  id="cedula"
                  name="cintura_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.cintura_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Cadera:</label>
                <input
                  type="number"
                  id="cadera"
                  name="cadera_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.cadera_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Contorno cuello:</label>
                <input
                  type="number"
                  id="contorno_cuello_superior"
                  name="contorno_cuello_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.contorno_cuello_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Escote:</label>
                <input
                  type="number"
                  id="escote_superior"
                  name="escote_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.escote_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo total espalda:</label>
                <input
                  type="number"
                  id="largo_total_espalda_superior"
                  name="largo_total_espalda_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.largo_total_espalda_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo total frente:</label>
                <input
                  type="number"
                  id="largo_total_superior"
                  name="largo_total_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.largo_total_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo Manga Corta:</label>
                <input
                  type="number"
                  id="largo_manga_corta"
                  name="largo_manga_corta_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.largo_manga_corta_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Ancho Manga Corta:</label>
                <input
                  type="number"
                  id="ancho_manga_corta"
                  name="ancho_manga_corta_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.ancho_manga_corta_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo Manga Larga:</label>
                <input
                  type="number"
                  id="largo_manga_larga"
                  name="largo_manga_larga_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.largo_manga_larga_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Ancho Manga Larga:</label>
                <input
                  type="number"
                  id="ancho_manga_larga"
                  name="ancho_manga_larga_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.ancho_manga_larga_superior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Puño:</label>
                <input
                  type="number"
                  id="puno_superior"
                  name="puno_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.puno_superior}
                  min={0}
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
                  defaultValue={mediciones.talla}
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
                  defaultValue={mediciones.observaciones}
                ></textarea>
              </div>

              <div className="div-inp">
                <label htmlFor="text">Sastre:</label>
                <input
                  type="text"
                  id="sastre"
                  name="sastre"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.sastre}
                />
              </div>
            </div>
          )}

          {prendaInferior && (
            <div className="container opciones-medidas">

              <div className="div-inp">
                <label htmlFor="text">Largo:</label>
                <input
                  type="number"
                  id="largo"
                  name="largo_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.largo_inferior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo entrepierna:</label>
                <input
                  type="number"
                  id="largo"
                  name="largo_entrepierna_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.largo_entrepierna_inferior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Cintura:</label>
                <input
                  type="number"
                  id="cintura"
                  name="cintura_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.cintura_inferior}
                  min={0}
                />
              </div>
              <div className="div-inp">
                <label htmlFor="text">Cadera:</label>
                <input
                  type="number"
                  id="cadera"
                  name="cadera_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.cadera_inferior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Altura cadera:</label>
                <input
                  type="number"
                  id="cadera"
                  name="altura_cadera_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.altura_cadera_inferior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Pierna:</label>
                <input
                  type="number"
                  id="pierna"
                  name="pierna_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.pierna_inferior}
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Ruedo:</label>
                <input
                  type="number"
                  id="ruedo"
                  name="ruedo_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.ruedo_inferior}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Tiro:</label>
                <input
                  type="number"
                  id="tiro"
                  name="tiro_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.tiro_inferior}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Contorno tiro:</label>
                <input
                  type="number"
                  id="tiro"
                  name="contorno_tiro_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.contorno_tiro_inferior}
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
                  defaultValue={mediciones.talla}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Observaciones:</label>
                <textarea
                  name="observaciones"
                  id="txtArea"
                  rows="5"
                  cols="60"
                  onChange={handleInputChange}
                  defaultValue={mediciones.observaciones}
                ></textarea>
              </div>

              <div className="div-inp">
                <label htmlFor="text">Sastre:</label>
                <input
                  type="text"
                  id="sastre"
                  name="sastre"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.sastre}
                />
              </div>
            </div>            
          )}

          {}

          <button className="btn-registrar" type="submit">
            Guardar
          </button>
        </form>

        <div className="container img-contenedor">
          <img className="isologo" src={Logo} alt="imagen" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ModificarMedicion;
