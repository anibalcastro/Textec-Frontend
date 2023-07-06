import React, { useEffect, useState } from "react";
import Logo from "../../Images/Logos/Icono.jpg";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegistroMedicion = () => {
  const [prenda, setPrenda] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [mediciones, setMediciones] = useState({});
  const [cliente, setCliente] = useState([]);
  const [arrayMediciones, setArrayMediciones] = useState([]);

  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    obtenerInformacion();
    console.log(arrayMediciones);
  }, [mediciones]);

  /**Lista de mediciones superiores */
  const medicionesSuperior = [
    "Camisa",
    "Gabacha",
    "Camiseta",
    "Jacket",
    "Chaleco",
    "Gabacha medica",
    "Vestido",
  ];

  /**Lista de mediciones inferiores */
  const medicionesInferior = ["Short", "Pantalon", "Enagua"];

  /**Validaciones si el estado prenda existe en alguna de las listas */
  const prendaSuperior = medicionesSuperior.includes(prenda);
  const prendaInferior = medicionesInferior.includes(prenda);

  const limpiarEstados = () => {
    setPrenda("");
    setIdCliente("");
    setArrayMediciones([]);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMediciones({ ...mediciones, [name]: value });
  };

  const handleOptionChange = (event) => {
    let prendaSeleccionada = event.target.value;

    let dataMediciones = obtenerMediciones();
    const medicionesExisten = dataMediciones.find(
      (item) =>
        parseInt(item.id_cliente) == idCliente &&
        item.articulo == prendaSeleccionada
    );

    if (medicionesExisten) {
      Swal.fire({
        title: "Error!",
        text: `Ya existe la medición de ${prendaSeleccionada} para el cliente seleccionado`,
        icon: "error",
      });
    } else {
      setPrenda(prendaSeleccionada);
    }
  };

  const obtenerMediciones = () => {
    let mediciones = localStorage.getItem("medidas");
    return JSON.parse(mediciones);
  };

  const handleNameChange = (event) => {
    setIdCliente(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    registrarMedicion();
  };

  const obtenerFecha = () => {
    const date = new Date();
    const anno = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");

    const fecha = `${anno}-${mes}-${dia}`;

    return fecha;
  };

  /**
   * Registra las mediciones y hace las solicitudes al api
   */
  const registrarMedicion = () => {
    let datos = JSON.parse(localStorage.getItem("nuevosRegistros"));
    let registrosEnviados = 0;

    if (datos) {
      let totalRegistros = datos.length;

      if (idCliente !== "") {
        let nuevoRegistro = {
          idCliente: idCliente,
          prenda: prenda,
          mediciones: mediciones,
        };

        datos.push(nuevoRegistro);
      }

      datos.forEach((registro) => {
        let nuevoRegistro = registro;

        //console.log(nuevoRegistro);

        let fecha = obtenerFecha();

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        var formdata = new FormData();

        formdata.append("id_cliente", nuevoRegistro.idCliente);
        formdata.append("articulo", nuevoRegistro.prenda);
        formdata.append("fecha", fecha);
        formdata.append(
          "observaciones",
          nuevoRegistro.mediciones.observaciones || "NA"
        );
        formdata.append("talla", nuevoRegistro.mediciones.talla);

        if (medicionesSuperior.includes(nuevoRegistro.prenda)) {
          // Agregar las demás append() correspondientes a las mediciones superiores
          formdata.append("espalda_superior", nuevoRegistro.mediciones.espalda);
          formdata.append(
            "talle_espalda_superior",
            nuevoRegistro.mediciones.talle_espalda
          );
          formdata.append(
            "talle_frente_superior",
            nuevoRegistro.mediciones.talle_frente
          );
          formdata.append("busto_superior", nuevoRegistro.mediciones.busto);
          formdata.append("cintura_superior", nuevoRegistro.mediciones.cintura);
          formdata.append("cadera_superior", nuevoRegistro.mediciones.cadera);
          formdata.append(
            "ancho_manga_corta_superior",
            nuevoRegistro.mediciones.ancho_manga_corta
          );
          formdata.append(
            "ancho_manga_larga_superior",
            nuevoRegistro.mediciones.ancho_manga_larga
          );
          formdata.append(
            "largo_manga_corta_superior",
            nuevoRegistro.mediciones.largo_manga_corta
          );
          formdata.append(
            "largo_manga_larga_superior",
            nuevoRegistro.mediciones.largo_manga_larga
          );
          formdata.append(
            "largo_total_superior",
            nuevoRegistro.mediciones.largo_total
          );
          formdata.append(
            "alto_pinza_superior",
            nuevoRegistro.mediciones.alto_pinza
          );
        } else {
          // Agregar las demás append() correspondientes a las mediciones inferiores
          formdata.append("largo_inferior", nuevoRegistro.mediciones.largo);
          formdata.append("cintura_inferior", nuevoRegistro.mediciones.cintura);
          formdata.append("cadera_inferior", nuevoRegistro.mediciones.cadera);
          formdata.append("pierna_inferior", nuevoRegistro.mediciones.pierna);
          formdata.append("rodilla_inferior", nuevoRegistro.mediciones.rodilla);
          formdata.append("ruedo_inferior", nuevoRegistro.mediciones.ruedo);
          formdata.append("tiro_inferior", nuevoRegistro.mediciones.tiro);
        }

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        };

        fetch(
          "https://api.textechsolutionscr.com/api/v1/mediciones/registrar",
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            //console.log(result);
            const status = result.status;

            if (parseInt(status) === 200) {
              registrosEnviados++;
            }

            // Verificar si todos los registros han sido enviados
            if (registrosEnviados === totalRegistros) {
              if (registrosEnviados === totalRegistros) {
                Swal.fire(
                  "Mediciones creadas con éxito!",
                  `Se han registrado todas las mediciones.`,
                  "success"
                ).then((result) => {
                  if (result.isConfirmed) {
                    localStorage.removeItem("nuevosRegistros");
                    limpiarEstados();
                    setMediciones([]);
                    limpiarCampos();
                    navigate("/mediciones");
                  }
                  else{
                    localStorage.removeItem("nuevosRegistros");
                    limpiarEstados();
                    setMediciones([]);
                    limpiarCampos();
                    navigate("/mediciones");
                  }
                });
              } else {
                Swal.fire(
                  "Error al registrar las mediciones!",
                  "Ha ocurrido un error al enviar las mediciones.",
                  "error"
                );
              }
            }
          })
          .catch((error) => console.log("error", error));
      });
    } else {
      let fecha = obtenerFecha();

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      var formdata = new FormData();

      formdata.append("id_cliente", idCliente);
      formdata.append("articulo", prenda);
      formdata.append("fecha", fecha);
      formdata.append("observaciones", mediciones.observaciones || "NA");
      formdata.append("talla", mediciones.talla);

      if (medicionesSuperior.includes(prenda)) {
        // Agregar las demás append() correspondientes a las mediciones superiores
        formdata.append("espalda_superior", mediciones.espalda);
        formdata.append("talle_espalda_superior", mediciones.talle_espalda);
        formdata.append("talle_frente_superior", mediciones.talle_frente);
        formdata.append("busto_superior", mediciones.busto);
        formdata.append("cintura_superior", mediciones.cintura);
        formdata.append("cadera_superior", mediciones.cadera);
        formdata.append(
          "ancho_manga_corta_superior",
          mediciones.ancho_manga_corta
        );
        formdata.append(
          "ancho_manga_larga_superior",
          mediciones.ancho_manga_larga
        );
        formdata.append(
          "largo_manga_corta_superior",
          mediciones.largo_manga_corta
        );
        formdata.append(
          "largo_manga_larga_superior",
          mediciones.largo_manga_larga
        );
        formdata.append("largo_total_superior", mediciones.largo_total);
        formdata.append("alto_pinza_superior", mediciones.alto_pinza);
      } else {
        // Agregar las demás append() correspondientes a las mediciones inferiores
        formdata.append("largo_inferior", mediciones.largo);
        formdata.append("cintura_inferior", mediciones.cintura);
        formdata.append("cadera_inferior", mediciones.cadera);
        formdata.append("pierna_inferior", mediciones.pierna);
        formdata.append("rodilla_inferior", mediciones.rodilla);
        formdata.append("ruedo_inferior", mediciones.ruedo);
        formdata.append("tiro_inferior", mediciones.tiro);
      }

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch(
        "https://api.textechsolutionscr.com/api/v1/mediciones/registrar",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          //console.log(result);
          const status = result.status;

          if (parseInt(status) === 200) {
            Swal.fire(
              "Mediciones creadas con éxito!",
              `Se han registrado todas las mediciones.`,
              "success"
            ).then((result) => {
              if (result.isConfirmed) {
                localStorage.removeItem("nuevosRegistros");
                limpiarEstados();
                setMediciones([]);
                limpiarCampos();
                navigate("/mediciones");
              }
              else{
                localStorage.removeItem("nuevosRegistros");
                limpiarEstados();
                setMediciones([]);
                limpiarCampos();
                navigate("/mediciones");
              }
            });
          } else {
            Swal.fire(
              "Error al registrar las mediciones!",
              "Ha ocurrido un error al enviar las mediciones.",
              "error"
            );
          }
        });
    }
  };

  /**
   * Funcion para agregar una medida
   */
  const agregarOtraMedida = () => {
    const datosCliente = cliente.find(
      (cliente) => parseInt(cliente.id) === parseInt(idCliente)
    );
    const nombreCliente = `${datosCliente.nombre} ${datosCliente.apellido1} ${datosCliente.apellido2}`;
    let nuevoRegistro = {
      idCliente: idCliente,
      nombre: nombreCliente,
      prenda: prenda,
      mediciones: mediciones,
    };

    let datos = JSON.parse(localStorage.getItem("nuevosRegistros"));

    if (!datos) {
      console.log(arrayMediciones);
      localStorage.setItem("nuevosRegistros", JSON.stringify([nuevoRegistro]));
      console.log(arrayMediciones);
      setArrayMediciones(arrayMediciones.concat(nuevoRegistro));


    } else {
      datos.push(nuevoRegistro);
      console.log(arrayMediciones);
      setArrayMediciones(arrayMediciones.concat(nuevoRegistro));
      console.log(arrayMediciones);

      
      localStorage.setItem("nuevosRegistros", JSON.stringify(datos));
    }

    limpiarCampos();
  };

  /**
   * Limpia todos los campos de los input
   */
  const limpiarCampos = () => {
    const inputs = document.getElementsByTagName("input");
    const textareas = document.getElementsByTagName("textarea");
    const selects = document.getElementsByTagName("select");

    // Limpiar inputs tipo 'text', 'number' y 'textarea'
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (input.type === "text" || input.type === "number") {
        input.value = "";
      }
    }

    // Limpiar textareas
    for (let i = 0; i < textareas.length; i++) {
      const textarea = textareas[i];
      textarea.value = "";
    }

    // Limpiar selects
    for (let i = 0; i < selects.length; i++) {
      const select = selects[i];
      select.selectedIndex = 0;
    }
  };

  /**
   * Obtiene los clientes que estan registrados en las bases de datos.
   */
  const obtenerInformacion = () => {
    let datos = localStorage.getItem("data");
    datos = JSON.parse(datos);

    if (!datos) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "https://api.textechsolutionscr.com/api/v1/clientes",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          //console.log(result);
          if (result.hasOwnProperty("data")) {
            const { data } = result;
            setCliente(data);
          } else {
            //console.log("La respuesta de la API no contiene la propiedad 'data'");
            // Mostrar mensaje de error o realizar otra acción
          }
        })
        .catch((error) => console.log("error", error));
    } else {
      setCliente(datos);
    }
  };

  return (
    <React.Fragment>
      <div className="container registro-medicion">
        <h2 className="titulo-encabezado">Registro de mediciones</h2>
        <hr className="division"></hr>
        <div className="container form-contenedor">
          <form
            className="form-registro-clientes"
            id="form-registro-medicion"
            onSubmit={handleSubmit}
          >
            <div className="div-inp">
              <label htmlFor="text">Cliente:</label>
              <select
                id="nombre"
                name="id_cliente"
                autoComplete="nombre"
                onChange={handleNameChange}
                required
              >
                <option value="" hidden>
                  Selecione una opción
                </option>
                {cliente.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {`${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="div-inp">
              <label htmlFor="text">Prenda:</label>
              <select
                value={prenda}
                id="prenda"
                autoComplete="prenda"
                onChange={handleOptionChange}
                required
              >
                <option value="" disabled hidden>
                  Selecione una opción
                </option>
                <option value="Camisa">Camisa</option>
                <option value="Gabacha">Gabacha</option>
                <option value="Camiseta">Camiseta</option>
                <option value="Jacket">Jacket</option>
                <option value="Chaleco">Chaleco</option>
                <option value="Gabacha medica">Gabacha medica</option>
                <option value="Vestido">Vestido</option>

                <option value="Pantalon">Pantalon</option>
                <option value="Enagua">Enagua</option>
                <option value="Short">Short</option>
              </select>
            </div>

            <hr className="division"></hr>

            {prendaSuperior && (
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
                    required
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
                    name="largo"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
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
                  <label htmlFor="text">Pierna:</label>
                  <input
                    type="number"
                    id="pierna"
                    name="pierna"
                    autoComplete="current-text"
                    onChange={handleInputChange}
                    required
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
                    required
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
                    required
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
                    name="observaciones"
                    id="txtArea"
                    rows="5"
                    cols="60"
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
              </div>
            )}

            <div className="container botones-contenedor">
              <button className="btn-registrar" onClick={agregarOtraMedida}>
                Agregar medida
              </button>
            </div>
          </form>

          <div className="container img-contenedor">
            <img className="isologo" src={Logo} alt="imagen" />
          </div>
        </div>

        <hr className="division"></hr>
        <h2 className="titulo-encabezado">Lista de medidas por agregar</h2>

        <table className="tabla-medidas">
          <thead>
            <tr>
              <th>Nombre del Cliente</th>
              <th>Prenda</th>
            </tr>
          </thead>
          <tbody>
            {arrayMediciones.map((datos) => (
              <tr key={datos.idCliente}>
                <td>{datos.nombre}</td>
                <td>{datos.prenda}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="container botones-contenedor">
              <button className="btn-registrar" type="submit" onClick={handleSubmit}>
                Guardar
              </button>
            </div>
      </div>
    </React.Fragment>
  );
};

export default RegistroMedicion;
