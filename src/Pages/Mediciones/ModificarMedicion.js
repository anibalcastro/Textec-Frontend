import React, { useEffect, useState } from "react";
import Logo from "../../Images/Logos/Icono (1).webp";
import {  useNavigate } from "react-router-dom";
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
    setIdMedicion(idDetalle)
    
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
  const medicionesInferior = ["Short", "Pantalon", "Enagua"];

  /**Validaciones si el estado prenda existe en alguna de las listas */
  const prendaSuperior = medicionesSuperior.includes(prenda);
  const prendaInferior = medicionesInferior.includes(prenda);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMediciones({ ...mediciones, [name]: value });
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
    formdata.append("observaciones", mediciones.observaciones || "NA");
    formdata.append("espalda_superior", mediciones.espalda_superior);
    formdata.append(
      "talle_espalda_superior",
      mediciones.talle_espalda_superior
    );
    formdata.append("talle_frente_superior", mediciones.talle_frente_superior);
    formdata.append("busto_superior", mediciones.busto_superior);
    formdata.append("cintura_superior", mediciones.cintura_superior);
    formdata.append("cadera_superior", mediciones.cadera_superior);
    formdata.append("alto_pinza_superior", mediciones.alto_pinza_superior);
    formdata.append(
      "largo_manga_corta_superior",
      mediciones.largo_manga_corta_superior
    );
    formdata.append(
      "largo_manga_larga_superior",
      mediciones.largo_manga_larga_superior
    );
    formdata.append(
      "ancho_manga_corta_superior",
      mediciones.ancho_manga_corta_superior
    );
    formdata.append(
      "ancho_manga_larga_superior",
      mediciones.ancho_manga_larga_superior
    );
    formdata.append("largo_total_superior", mediciones.largo_total_superior);
    formdata.append("talla", mediciones.talla);
    formdata.append("largo_inferior", mediciones.largo_inferior);
    formdata.append("cintura_inferior", mediciones.cintura_inferior);
    formdata.append("cadera_inferior", mediciones.cadera_inferior);
    formdata.append("pierna_inferior", mediciones.pierna_inferior);
    formdata.append("rodilla_inferior", mediciones.rodilla_inferior);
    formdata.append("ruedo_inferior", mediciones.ruedo_inferior);
    formdata.append("tiro_inferior", mediciones.tiro_inferior);

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

          setNombre(data.nombre)
          setApellido1(data.apellido1);
          setApellido2(data.apellido2)
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
          obtenerNombreCliente(data[0].id_cliente)
          
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
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo total frente:</label>
                <input
                  type="number"
                  id="largo_total_frente_superior"
                  name="largo_total_frente_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.largo_total_frente_superior}
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
                />
              </div>
              <div className="div-inp">
                <label htmlFor="text">Rodilla:</label>
                <input
                  type="number"
                  id="rodilla"
                  name="rodilla_inferior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                  defaultValue={mediciones.rodilla_inferior}
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
            </div>
          )}

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
