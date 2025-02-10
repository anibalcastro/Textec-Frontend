import React, { useEffect, useState } from "react";
import Logo from "../../Images/Logos/Icono (1).webp";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormMedicionesInferior from "../../components/forms/medicionesInferior";
import FormMedicionesSuperior from "../../components/forms/medicioneSuperior";

const RegistroMedicion = ({ clientes }) => {
  const [prenda, setPrenda] = useState(""); //Almacena la prenda seleccionada
  const [idCliente, setIdCliente] = useState(""); //Almacena el id del cliente a quien se le asignará la medición.
  const [mediciones, setMediciones] = useState({}); //Almacena las mediciones
  const [cliente, setCliente] = useState([]);
  const [arrayMediciones, setArrayMediciones] = useState([]); //Almacena las mediciones que se encuentran en cola.
  const [filtro, setFiltro] = useState(""); //Almacena el valor ingresado en el campo filtro.

  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  /**Lista de mediciones inferiores */
  const medicionesInferior = ["Short"];
  const medicionesSuperior = [
    "Camisa",
    "Gabacha",
    "Camiseta",
    "Jacket",
    "Chaleco",
    "Gabacha medica",
    "Filipinas",
  ];

  const prendaSuperior = medicionesSuperior.includes(prenda);
  const prendaInferior = medicionesInferior.includes(prenda);

  useEffect(() => {
    alertInvalidatePermission();
    obtenerDatosClientes();
    obtenerMedidasAgregar();
    obtenerMediciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const guardarEnLocalStorage = () => {
      setArrayMediciones((prevArray) => [...prevArray, mediciones]);

      guardarMedicionesEnLocalStorage(arrayMediciones);
    };

    // Agregar el listener para el evento beforeunload
    window.addEventListener("beforeunload", guardarEnLocalStorage);

    return () => {
      window.removeEventListener("beforeunload", guardarEnLocalStorage);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediciones]);

  const guardarMedicionesEnLocalStorage = (nuevasMediciones) => {
    localStorage.setItem(
      "medicionesNoGuardadas",
      JSON.stringify(nuevasMediciones)
    );
  };

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

  /**
   *
   * @param {*} idCliente
   * @param {*} seleccionPrenda
   * @returns
   */
  const validarExistenciaMedicion = (seleccionPrenda) => {
    const medicionExistente = mediciones.find((item) => {
      return (
        parseInt(item.id_cliente) === parseInt(idCliente) &&
        String(item.articulo) === String(seleccionPrenda)
      );
    });

    if (medicionExistente) {
      Swal.fire({
        title: "Error!",
        text: `Ya existe la medición de ${seleccionPrenda} para el cliente seleccionado`,
        icon: "error",
      });

      return true;
    } else {
      return false;
    }
  };

  /**
   *
   * @param {*} event
   */
  const handleOptionChangeCloth = (event) => {
    const prendaSeleccionada = event.target.value;

    if (!validarExistenciaMedicion(prendaSeleccionada)) {
      setPrenda(prendaSeleccionada);
    } else {
      limpiarCampos();
    }
  };

  /**
   * Captura y almacena en el estado mediciones, el nombre del input y su valor respectivo.
   * @param {*} event
   */
  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;

    // Si el input es de tipo checkbox, usamos el valor de "checked", de lo contrario usamos "value"
  const inputValue = type === "checkbox" ? checked : value;

  setMediciones((prevState) => ({
    ...prevState,
    [name]: inputValue,
  }));
  };

  /**
   * Obtiene y almacena el id del cliente seleccionado en estado {idCliente}.
   * @param {*} event
   */
  const handleNameChange = (event) => {
    setIdCliente(event.target.value);
  };

  /**
   * Captura lo que el usuario ingresó en el filtro.
   * @param {text} event
   */
  const handleInputFiltroClientes = (event) => {
    setFiltro(event.target.value);
  };

  /**
   * Funcion para enviar las peticiones al API
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    agregarOtraMedida();
  };

  /**
   * Funcion para limpiar los estados de registro mediciones.
   */
  const limpiarEstados = () => {
    setPrenda("");
    setIdCliente("");
    setArrayMediciones([]);
  };

  /**
   * Obtiene mediciones almacenadas en el LS
   */
  const obtenerMediciones = () => {
    let mediciones = JSON.parse(localStorage.getItem("medidas"));

    if (mediciones === null) {
      const myHeaders = new Headers({
        Authorization: `Bearer ${token}`,
      });

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "https://api.textechsolutionscr.com/api/v1/mediciones/clientes",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.hasOwnProperty("data")) {
            const { data } = result;

            localStorage.setItem("medidas", JSON.stringify(data));
            setMediciones(data);
          } else {
            // Mostrar mensaje de error o realizar otra acción
          }
        })
        .catch((error) => console.log("error", error));
    } else {
      setMediciones(mediciones);
    }
  };

  /**
   * Obtiene fecha actusal
   */
  const obtenerFecha = () => {
    const date = new Date();
    const anno = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");

    const fecha = `${anno}-${mes}-${dia}`;

    return fecha;
  };

  const obtenerMedidasAgregar = () => {
    let medidasPorAgregar = JSON.parse(localStorage.getItem("nuevosRegistros"));

    if (medidasPorAgregar) {
      setArrayMediciones(medidasPorAgregar);
    }
  };

  /**
   * Obtiene los clientes que estan registrados en las bases de datos.
   */
  const obtenerDatosClientes = () => {
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

  const registrarMedicion = async () => {
    let totalRegistros = arrayMediciones.length;
    let registrosEnviados = 0;
    let registrosFallidos = [];
  
    Swal.fire({
      title: "Iniciando el registro de mediciones...",
      icon: "info",
      showConfirmButton: false,
      timer: 1500, // Pequeña pausa antes de iniciar
    });
  
    const enviarMedicion = async (nuevoRegistro) => {
      let fecha = obtenerFecha();
      let formdata = new FormData();
      formdata.append("id_cliente", nuevoRegistro.idCliente);
      formdata.append("articulo", nuevoRegistro.prenda);
      formdata.append("fecha", fecha);
      formdata.append("observaciones", nuevoRegistro.mediciones.observaciones || "NA");
      formdata.append("talla", nuevoRegistro.mediciones.talla);
      formdata.append("sastre", nuevoRegistro.mediciones.colaborador);
  
      // Agregar las medidas específicas según la prenda
      if (medicionesSuperior.includes(nuevoRegistro.prenda) || nuevoRegistro.prenda === "Vestido") {
        formdata.append("espalda_superior", nuevoRegistro.mediciones.espalda || 0);
        formdata.append("busto_superior", nuevoRegistro.mediciones.busto || 0);
        formdata.append("cintura_superior", nuevoRegistro.mediciones.cintura || 0);
      } else if (medicionesInferior.includes(nuevoRegistro.prenda)) {
        formdata.append("largo_inferior", nuevoRegistro.mediciones.largo || 0);
        formdata.append("cintura_inferior", nuevoRegistro.mediciones.cintura || 0);
        formdata.append("cadera_inferior", nuevoRegistro.mediciones.cadera || 0);
      }
  
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      };
  
      // Mostrar alerta de progreso
      await Swal.fire({
        title: `Guardando la medición de ${nuevoRegistro.prenda}...`,
        icon: "info",
        showConfirmButton: false,
        timer: 1500,
      });
  
      try {
        const response = await fetch("https://api.textechsolutionscr.com/api/v1/mediciones/agregar", requestOptions);
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
  
    // Procesar cada medición en secuencia (esperando que cada una termine antes de continuar)
    for (const nuevoRegistro of arrayMediciones) {
      await enviarMedicion(nuevoRegistro);
    }
  
    // Al finalizar todas las mediciones, mostrar un resumen
    if (registrosFallidos.length === 0) {
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
    } else {
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
      localStorage.setItem("nuevosRegistros", JSON.stringify([nuevoRegistro]));
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
  };

  const eliminarMedicion = (idCliente, prenda) => {
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

    // Actualizar el array de mediciones en localStorage
    localStorage.setItem("nuevosRegistros", JSON.stringify(nuevasMediciones));

    // Actualizar el estado arrayMediciones si es necesario
    setArrayMediciones(nuevasMediciones);
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
   * Funcion para obtener los clientes segun el filtro.
   * @returns clientes filtrados
   */
  const filtrarClientes = () => {
    const datosFiltrados = clientes.filter((dato) => {
      const nombreCompleto = `${dato.nombre} ${dato.apellido1} ${dato.apellido2}`;
      return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
    });
    return datosFiltrados;
  };

  return (
    <React.Fragment>
      <h2 className="titulo-encabezado">Registro de mediciones</h2>
      <hr className="division"></hr>
      <div className="container form-contenedor">
        <form
          className="form-registro-clientes"
          id="form-registro-medicion"
          onSubmit={handleSubmit}
        >
          <div className="div-inp">
            <label htmlFor="text">Buscar cliente:</label>
            <input
              className="buscarTexto"
              onChange={handleInputFiltroClientes}
              name="filtro"
              type="text"
              placeholder="Escriba el nombre"
            ></input>
          </div>

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
              {filtrarClientes().map((cliente, index) => (
                <option key={index} value={cliente.id}>
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
              onChange={handleOptionChangeCloth}
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

          {prenda === "Vestido" && (
            <>
              <div className="div-inp">
                <label htmlFor="espalda">Espalda:</label>
                <input
                  type="number"
                  id="espalda"
                  name="espalda"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="talle_espalda">Talle de espalda:</label>
                <input
                  type="number"
                  id="talle_espalda"
                  name="talle_espalda"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="ancho_espalda">Ancho de espalda:</label>
                <input
                  type="number"
                  id="ancho_espalda"
                  name="ancho_espalda"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="largo_total_espalda">
                  Largo total espalda:
                </label>
                <input
                  type="number"
                  id="largo_total_espalda"
                  name="largo_total_espalda"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="talle_frente">Talle de frente:</label>
                <input
                  type="number"
                  id="talle_frente"
                  name="talle_frente"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="alto_pinza">Alto de pinza:</label>
                <input
                  type="number"
                  id="alto_pinza"
                  name="alto_pinza"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="busto">Busto:</label>
                <input
                  type="number"
                  id="busto"
                  name="busto"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="separacion_busto">Separación busto:</label>
                <input
                  type="number"
                  id="separacion_busto"
                  name="separacion_busto"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="cintura">Cintura:</label>
                <input
                  type="number"
                  id="cintura"
                  name="cintura"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="largo_total_frente">Largo total frente:</label>
                <input
                  type="number"
                  id="largo_total_frente"
                  name="largo_total_frente"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="cadera">Cadera:</label>
                <input
                  type="number"
                  id="cadera"
                  name="cadera"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="hombros">Hombros:</label>
                <input
                  type="number"
                  id="hombros"
                  name="hombros"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="largo_manga_corta">Largo Manga Corta:</label>
                <input
                  type="number"
                  id="largo_manga_corta"
                  name="largo_manga_corta"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="ancho_manga_corta">Ancho Manga Corta:</label>
                <input
                  type="number"
                  id="ancho_manga_corta"
                  name="ancho_manga_corta"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="largo_manga_larga">Largo Manga Larga:</label>
                <input
                  type="number"
                  id="largo_manga_larga"
                  name="largo_manga_larga"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="ancho_manga_larga">Ancho Manga Larga:</label>
                <input
                  type="number"
                  id="ancho_manga_larga"
                  name="ancho_manga_larga"
                  onChange={handleInputChange}
                />
              </div>

              <div className="div-inp">
                <label htmlFor="puno">Puño:</label>
                <input
                  type="number"
                  id="puno"
                  name="puno"
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
                <label htmlFor="altura_cadera">Altura Cadera:</label>
                <input
                  type="number"
                  id="altura_cadera"
                  name="altura_cadera"
                  onChange={handleInputChange}
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

          {prenda === "Enagua" && (
            <>
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
                <label htmlFor="text">Largo total:</label>
                <input
                  type="number"
                  id="largo_total"
                  name="largo_total"
                  autoComplete="current-text"
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {
            prenda === "Pantalon" && (
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

                <div className="checkboxContainer">
                  <div className="form-check">
                    <input
                      id="cbTiroLargo"
                      name="tiroLargo"
                      className="form-check-input"
                      type="checkbox"
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="cbTiroLargo">
                      <strong>Tiro Largo Ya:</strong>
                      <span className="custom-check"></span>
                    </label>
                  </div>
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
            <FormMedicionesInferior handleInputChange={handleInputChange}  />
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

export default RegistroMedicion;
