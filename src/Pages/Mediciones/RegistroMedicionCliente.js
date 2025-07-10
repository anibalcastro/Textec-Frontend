import React, { useEffect, useState } from "react";
import Logo from "../../Images/Logos/Icono (1).webp";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import FormMedicionesInferior from "../../components/forms/medicionesInferior";
import FormMedicionesSuperior from "../../components/forms/medicioneSuperior";

const RegistroMedicionCliente = ({ clientes }) => {
  const [prenda, setPrenda] = useState(""); //Almacena la prenda seleccionada
  const [idCliente, setIdCliente] = useState(""); //Almacena el id del cliente a quien se le asignará la medición.
  const [mediciones, setMediciones] = useState({}); //Almacena las mediciones
  const [cliente, setCliente] = useState([]);
  const [arrayMediciones, setArrayMediciones] = useState([]); //Almacena las mediciones que se encuentran en cola.
  const [medicionesDB, setMedicionesDB] = useState([]); //Almacena las mediciones del usuario registradas en la base de datos.

  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const userId = useParams();

  useEffect(() => {
    alertInvalidatePermission();
    obtenerInformacionCliente(userId);
    obtenerMedicionesCliente(userId);
    // Solo validamos existencia después de haber obtenido el cliente y la prenda.
    if (idCliente && prenda) {
      validarExistenciaProducto(prenda);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCliente, prenda]);

  /*******************************VALIDACIONES DE ACCESO A LA PAGINA*/

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

  /******************* LISTA DE MEDICIONES TREN SUPERIOR E INFERIOR*/

  /**Lista de mediciones superiores */
  const medicionesSuperior = [
    "Camisa",
    "Gabacha",
    "Camiseta",
    "Jacket",
    "Chaleco",
    "Gabacha medica",
    "Filipinas",
    "Vestido",
  ];

  /**Lista de mediciones inferiores */
  const medicionesInferior = ["Short"];

  /*****************OBTENER INFORMACION DEL CLIENTE */

  const obtenerInformacionCliente = (parametro) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/cliente/${parametro.userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result && result.hasOwnProperty("data") && result.data) {
          const { data } = result;
          setIdCliente(parametro.userId);
          setCliente(data);
        } else {
          const mensajeError = result?.mensaje || "No se encontró el cliente";
          Swal.fire("Info", mensajeError, "info");
        }
      })
      .catch((error) => console.error(error));
  };

  const obtenerMedicionesCliente = (identificador) => {
    const myHeaders = new Headers({
      Authorization: `Bearer ${token}`,
    });

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/medicion/${identificador.userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result && result.hasOwnProperty("data")) {
          const { data } = result;
          //console.log(data);

          // Actualizamos el estado con las mediciones del cliente
          setMedicionesDB(data);
        } else {
          // Muestra un mensaje de información con un valor por defecto si `mensaje` no está definido
          //const mensajeError = result?.mensaje || "No se encontró información";
          //Swal.fire("Info", mensajeError, "info");
        }
      });
  };

  /************************LIMPIAR ESTADOS E INPUTS */

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
   * Funcion para limpiar los estados de registro mediciones.
   */
  const limpiarEstados = () => {
    setPrenda("");
    setArrayMediciones([]);
  };

  /************************** ACCIONES CON LOS INPUTS */
  /**
   * Captura y almacena en el estado mediciones, el nombre del input y su valor respectivo.
   * @param {*} event
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMediciones({ ...mediciones, [name]: value });
  };

  /**
   * Obtiene y almacena la prenda del cliente seleccionado en estado {prenda}.
   * @param {*} event
   */
  const handleOptionChange = (event) => {
    let prendaSeleccionada = event.target.value;

    if (!validarExistenciaProducto(prendaSeleccionada)) {
      setPrenda(prendaSeleccionada);
    } else {
      Swal.fire({
        title: "Prenda duplicada",
        text: "Ya has registrado esta prenda. Por favor, selecciona otra.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      limpiarCampos();
    }
  };
  /**
   * Funcion para enviar las peticiones al API
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    agregarOtraMedida();
  };

  /**************************** VALIDACIONES */

  const validarExistenciaProducto = (seleccionPrenda) => {
    // Asegurar que ambos arrays sean válidos
    const medicionesDBArray = Array.isArray(medicionesDB) ? medicionesDB : [];
    const arrayMedicionesArray = Array.isArray(arrayMediciones)
      ? arrayMediciones
      : [];

    //console.log(arrayMediciones);

    // Buscar si la prenda ya existe en alguno de los dos arrays
    const existeEnDB = medicionesDBArray.some(
      (medicion) => medicion.articulo === seleccionPrenda
    );
    const existeEnArray = arrayMedicionesArray.some(
      (medicion) => medicion.prenda === seleccionPrenda
    );

    return existeEnDB || existeEnArray;
  };

  /**Validaciones si el estado prenda existe en alguna de las listas */
  const prendaSuperior = medicionesSuperior.includes(prenda);
  const prendaInferior = medicionesInferior.includes(prenda);

  /*****************************OBTENER FECHA */

  /**
   * Obtiene fecha actual
   */
  const obtenerFecha = () => {
    const date = new Date();
    const anno = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");

    const fecha = `${anno}-${mes}-${dia}`;

    return fecha;
  };

  /********************************REGISTRO */
  const registrarMedicion = async () => {
    let totalRegistros = arrayMediciones.length;
    let registrosEnviados = 0;
    let registrosFallidos = [];

    Swal.fire({
      title: "Iniciando el registro de mediciones...",
      icon: "info",
      showConfirmButton: false,
      timer: 1500,
    });

    const enviarMedicion = async (nuevoRegistro) => {
      let valoresCero = [];

      let fecha = obtenerFecha();
      let formdata = new FormData();
      formdata.append("id_cliente", nuevoRegistro.idCliente);
      formdata.append("articulo", nuevoRegistro.prenda);
      formdata.append("fecha", fecha);
      formdata.append(
        "observaciones",
        nuevoRegistro.mediciones.observaciones || "NA"
      );
      formdata.append("talla", nuevoRegistro.mediciones.talla);
      formdata.append("sastre", nuevoRegistro.mediciones.colaborador);

      // Función auxiliar para agregar valores y detectar ceros
      const agregarValor = (campo, valor) => {
        let numero = parseFloat(valor) || 0;
        if (numero === 0 && campo !== "tiro_largo_ya_inferior") {
          valoresCero.push(campo);
        }
        formdata.append(campo, numero);
      };

      // Verifica si pertenece a mediciones inferiores
      // Medicion del short
      if (medicionesInferior.includes(nuevoRegistro.prenda)) {
        agregarValor("largo_inferior", nuevoRegistro.mediciones.largo);
        agregarValor(
          "largo_entrepierna_inferior",
          nuevoRegistro.mediciones.largo_entrepierna_inferior
        );
        agregarValor("cintura_inferior", nuevoRegistro.mediciones.cintura);
        agregarValor("cadera_inferior", nuevoRegistro.mediciones.cadera);
        agregarValor(
          "altura_cadera_inferior",
          nuevoRegistro.mediciones.altura_cadera
        );
        agregarValor("pierna_inferior", nuevoRegistro.mediciones.pierna);
        agregarValor("ruedo_inferior", nuevoRegistro.mediciones.ruedo);
        agregarValor("tiro_inferior", nuevoRegistro.mediciones.tiro);
        agregarValor(
          "contorno_tiro_inferior",
          nuevoRegistro.mediciones.contorno_tiro
        );
      }

      // Verifica si pertence a mediciones superiores.
      // Camisa, Gabacha, Camiseta, Jackets, Chaleco, Gabacha Médica, Filipina, Vestido
      if (medicionesSuperior.includes(nuevoRegistro.prenda)) {
        agregarValor("espalda_superior", nuevoRegistro.mediciones.espalda);
        agregarValor(
          "talle_espalda_superior",
          nuevoRegistro.mediciones.talle_espalda
        );
        agregarValor(
          "ancho_espalda_superior",
          nuevoRegistro.mediciones.ancho_espalda
        );
        agregarValor("hombros_superior", nuevoRegistro.mediciones.hombros);
        agregarValor(
          "talle_frente_superior",
          nuevoRegistro.mediciones.talle_frente
        );
        agregarValor(
          "alto_pinza_superior",
          nuevoRegistro.mediciones.alto_pinza
        );
        agregarValor(
          "alto_cadera_superior",
          nuevoRegistro.mediciones.alto_cadera_superior
        );
        agregarValor(
          "separacion_busto_superior",
          nuevoRegistro.mediciones.separacion_busto
        );
        agregarValor(
          "ancho_pecho_superior",
          nuevoRegistro.mediciones.ancho_pecho_superior
        );
        agregarValor(
          "boca_manga_superior",
          nuevoRegistro.mediciones.boca_manga_superior
        );
        agregarValor(
          "largo_costado_superior",
          nuevoRegistro.mediciones.largo_costado_superior
        );
        agregarValor("busto_superior", nuevoRegistro.mediciones.busto);
        agregarValor("cintura_superior", nuevoRegistro.mediciones.cintura);
        agregarValor("cadera_superior", nuevoRegistro.mediciones.cadera);
        agregarValor(
          "contorno_cuello_superior",
          nuevoRegistro.mediciones.contorno_cuello_superior
        );
        agregarValor(
          "escote_superior",
          nuevoRegistro.mediciones.escote_superior
        );
        agregarValor(
          "largo_total_espalda_superior",
          nuevoRegistro.mediciones.largo_total_espalda
        );
        agregarValor(
          "largo_total_superior",
          nuevoRegistro.mediciones.largo_total_frente
        );
        agregarValor(
          "largo_manga_corta_superior",
          nuevoRegistro.mediciones.largo_manga_corta
        );
        agregarValor(
          "ancho_manga_corta_superior",
          nuevoRegistro.mediciones.ancho_manga_corta
        );
        agregarValor(
          "largo_manga_larga_superior",
          nuevoRegistro.mediciones.largo_manga_larga
        );
        agregarValor(
          "ancho_manga_larga_superior",
          nuevoRegistro.mediciones.ancho_manga_larga
        );
        agregarValor("puno_superior", nuevoRegistro.mediciones.puno);
      }

      // Medicion de enagua
      if (nuevoRegistro.prenda === "Enagua") {
        agregarValor(
          "separacion_busto_superior",
          nuevoRegistro.mediciones.separacion_busto_superior
        );
        agregarValor("largo_inferior", nuevoRegistro.mediciones.largo);
        agregarValor("cintura_inferior", nuevoRegistro.mediciones.cintura);
        agregarValor("cadera_inferior", nuevoRegistro.mediciones.cadera);
        agregarValor(
          "altura_cadera_inferior",
          nuevoRegistro.mediciones.altura_cadera
        );
      }

      if (nuevoRegistro.prenda === "Pantalon") {
        agregarValor("largo_inferior", nuevoRegistro.mediciones.largo);
        agregarValor("largo_entrepierna_inferior",nuevoRegistro.mediciones.largo_entrepierna_inferior);
        agregarValor("cintura_inferior", nuevoRegistro.mediciones.cintura);
        agregarValor("cadera_inferior", nuevoRegistro.mediciones.cadera);
        agregarValor("altura_cadera_inferior",nuevoRegistro.mediciones.altura_cadera);
        agregarValor("altura_rodilla_inferior",nuevoRegistro.mediciones.altura_rodilla);
        agregarValor("pierna_inferior", nuevoRegistro.mediciones.pierna);
        agregarValor("rodilla_inferior", nuevoRegistro.mediciones.rodilla);
        agregarValor("ruedo_inferior", nuevoRegistro.mediciones.ruedo);
        agregarValor("tiro_inferior", nuevoRegistro.mediciones.tiro);
        agregarValor("contorno_tiro_inferior",nuevoRegistro.mediciones.contorno_tiro);

        if (nuevoRegistro.mediciones.tiroLargo === "on") {
          agregarValor("tiro_largo_ya_inferior", 0);
        }
        else{
          agregarValor("tiro_largo_ya_inferior", 1);
        }
      }

      let debugData = {};
      formdata.forEach((value, key) => {
        debugData[key] = value;
      });
      console.log("FormData:", debugData);

      // Verificar si hay valores en 0 y mostrar alerta
      if (valoresCero.length > 0) {
        let confirmar = await Swal.fire({
          title: "⚠️ Hay valores en 0",
          text: `Los siguientes campos tienen 0: ${valoresCero.join(
            ", "
          )}. ¿Deseas continuar?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, continuar",
          cancelButtonText: "No, revisar",
        });

        if (!confirmar.isConfirmed) {
          registrosFallidos = +1;
          Swal.fire("INFO", "Mediciones canceladas, llenelas de nuevo", "info");
          return;
        }
      }

      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      };

      await Swal.fire({
        title: `Guardando la medición de ${nuevoRegistro.prenda}...`,
        icon: "info",
        showConfirmButton: false,
        timer: 1500,
      });

      try {
        const response = await fetch(
          "https://api.textechsolutionscr.com/api/v1/mediciones/agregar",
          requestOptions
        );
        const result = await response.json();

        if (result.success) {
          registrosEnviados++;
          await Swal.fire({
            title: `✅ ${nuevoRegistro.prenda} guardada con éxito!`,
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          throw new Error(result.message || "Error desconocido");
        }
      } catch (error) {
        registrosFallidos.push(nuevoRegistro);
        await Swal.fire({
          title: `❌ Error al guardar ${nuevoRegistro.prenda}`,
          text: error.message,
          icon: "error",
          showConfirmButton: false,
          timer: 2500,
        });
      }
    };

    for (const nuevoRegistro of arrayMediciones) {
      await enviarMedicion(nuevoRegistro);
    }

    if (Array.isArray(registrosFallidos) && registrosFallidos.length === 0) {
      Swal.fire({
        title: "🎉 Todas las mediciones se guardaron con éxito!",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        localStorage.removeItem("nuevosRegistros");
        limpiarEstados();
        setMediciones([]);
        limpiarCampos();
        navigate("/mediciones");
      });
    } else if (registrosFallidos.length > 0) {
      let fallos = registrosFallidos.map((r) => r.prenda).join(", ");
      Swal.fire({
        title: "⚠️ Algunas mediciones no se guardaron",
        text: `Las siguientes mediciones fallaron: ${fallos}`,
        icon: "warning",
        timer: 5000,
        showConfirmButton: true,
      });
    }
  };

  /**
   * Funcion para agregar una medida
   */
  const agregarOtraMedida = () => {
    const nombreCliente = `${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2}`;
    let nuevoRegistro = {
      idCliente: idCliente,
      nombre: nombreCliente,
      prenda: prenda,
      mediciones: mediciones,
    };

    let datos = JSON.parse(localStorage.getItem("nuevosRegistros"));

    if (!datos) {
      //console.log(arrayMediciones);
      localStorage.setItem("nuevosRegistros", JSON.stringify([nuevoRegistro]));
      //console.log(arrayMediciones);
      setArrayMediciones(arrayMediciones.concat(nuevoRegistro));
      setPrenda("");
    } else {
      datos.push(nuevoRegistro);
      //console.log(arrayMediciones);
      setArrayMediciones(arrayMediciones.concat(nuevoRegistro));
      //console.log(arrayMediciones);
      setPrenda("");

      localStorage.setItem("nuevosRegistros", JSON.stringify(datos));
    }

    limpiarCampos();
    // Add nuevoRegistro to the queue or perform any other action
  };

  const eliminarMedicion = (idCliente, prenda) => {
    console.log(idCliente);
    // Obtener el array de mediciones almacenado en localStorage
    let medicionesLocalStorage = JSON.parse(
      localStorage.getItem("nuevosRegistros")
    );

    // Filtrar el array de mediciones y mantener solo los elementos que no coinciden con los parámetros
    const nuevasMediciones = medicionesLocalStorage.filter(
      (medicion) =>
        parseInt(medicion.idCliente) !== parseInt(idCliente) ||
        medicion.prenda !== prenda
    );

    //console.log(nuevasMediciones);

    // Actualizar el array de mediciones en localStorage
    localStorage.setItem("nuevosRegistros", JSON.stringify(nuevasMediciones));

    // Actualizar el estado arrayMediciones si es necesario
    setArrayMediciones(nuevasMediciones);
  };

  return (
    <React.Fragment>
      <h2 className="titulo-encabezado">
        Registrar mediciones a {cliente.nombre} {cliente.apellido1}{" "}
        {cliente.apellido2}
      </h2>
      <hr className="division"></hr>
      <div className="container form-contenedor">
        <form
          className="form-registro-clientes"
          id="form-registro-medicion"
          onSubmit={handleSubmit}
        >
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
              <option value="Filipinas">Filipinas</option>

              <option value="Pantalon">Pantalon</option>
              <option value="Enagua">Enagua</option>
              <option value="Short">Short</option>
            </select>
          </div>

          <hr className="division"></hr>

          {prenda === "Enagua" && (
            <>
              <div className="div-inp">
                <label htmlFor="text">Separacion busto:</label>
                <input
                  type="number"
                  min={0}
                  id="separacion_busto_superior"
                  name="separacion_busto_superior"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo:</label>
                <input
                  type="number"
                  id="largo"
                  name="largo"
                  min={0}
                  autoComplete="current-text"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Cintura:</label>
                <input
                  type="number"
                  min={0}
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
                  min={0}
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
                  min={0}
                  id="altura_cadera"
                  name="altura_cadera"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="talla">Talla:</label>
                <input
                  type="text"
                  id="talla"
                  name="talla"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="div-inp">
                <label htmlFor="observaciones">Observaciones:</label>
                <textarea
                  id="txtArea"
                  name="observaciones"
                  rows="5"
                  cols="60"
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="div-inp">
                <label htmlFor="colaborador">Sastre:</label>
                <input
                  type="text"
                  id="colaborador"
                  name="colaborador"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {prenda === "Pantalon" && (
            <div className="container opciones-medidas">
              <div className="div-inp">
                <label htmlFor="text">Largo:</label>
                <input
                  type="number"
                  id="largo"
                  name="largo"
                  min={0}
                  autoComplete="current-text"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Largo entrepierna:</label>
                <input
                  type="number"
                  id="largo_entrepierna_inferior"
                  name="largo_entrepierna_inferior"
                  min={0}
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
                  min={0}
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Cadera:</label>
                <input
                  type="number"
                  id="cadera"
                  name="cadera"
                  min={0}
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
                  min={0}
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
                  min={0}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="text">Pierna:</label>
                <input
                  type="number"
                  id="pierna"
                  name="pierna"
                  min={0}
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
                  min={0}
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
                  min={0}
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
                  min={0}
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
                  required
                />
              </div>

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
          )}

          {prendaSuperior && (
            <FormMedicionesSuperior handleInputChange={handleInputChange} />
          )}

          {prendaInferior && (
            <FormMedicionesInferior
              seleccionPrenda={prenda}
              handleInputChange={handleInputChange}
            />
          )}

          <div className="container botones-contenedor">
            <button className="btn-registrar" type="submit">
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {arrayMediciones.map((datos) => (
            <tr key={datos.idCliente}>
              <td>{datos.nombre}</td>
              <td>{datos.prenda}</td>
              <td>
                <button
                  className="btn-eliminar"
                  onClick={() =>
                    eliminarMedicion(datos.idCliente, datos.prenda)
                  }
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="container botones-contenedor">
        <button
          className="btn-registrar"
          type="submit"
          onClick={registrarMedicion}
        >
          Guardar
        </button>
      </div>
    </React.Fragment>
  );
};

export default RegistroMedicionCliente;
