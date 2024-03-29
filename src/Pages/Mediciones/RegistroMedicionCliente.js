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

  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const userId = useParams();

  useEffect(() => {
    alertInvalidatePermission();
    obtenerInformacionCliente(userId);
    let data = obtenerMediciones();
    validarExistenciaProducto(idCliente, prenda, data);
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

  const obtenerInformacionCliente = (parametro) => {
    let datos = localStorage.getItem("data");
    datos = JSON.parse(datos);

    //console.log(parametro.userId);

    let encontrado = false;

    datos.forEach((item, i) => {
      //console.log(parseInt(item.id));
      if (parseInt(item.id) === parseInt(parametro.userId)) {
        setIdCliente(parseInt(item.id));
        setCliente(item);
        encontrado = true;
      }
    });

    if (!encontrado) {
      //console.log('No se ha encontrado');
    }
  };

  /**
   * Funcion para limpiar los estados de registro mediciones.
   */
  const limpiarEstados = () => {
    setPrenda("");
    setArrayMediciones([]);
  };

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

    let dataMediciones = obtenerMediciones();
    if (
      !validarExistenciaProducto(idCliente, prendaSeleccionada, dataMediciones)
    ) {
      setPrenda(prendaSeleccionada);
    } else {
      limpiarCampos();
    }
  };

  const validarExistenciaProducto = (
    idCliente,
    seleccionPrenda,
    dataMediciones
  ) => {
    const medicionesExisten = dataMediciones.find(
      (item) =>
        parseInt(item.id_cliente) == idCliente &&
        item.articulo == seleccionPrenda
    );

    if (medicionesExisten) {
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
   * Obtiene mediciones almacenadas en el LS
   */
  const obtenerMediciones = () => {
    let mediciones = localStorage.getItem("medidas");
    return JSON.parse(mediciones);
  };

  /**
   * Funcion para enviar las peticiones al API
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    agregarOtraMedida();
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

  //Registrar nuevas mediciones
  const registrarMedicion = () => {
    Swal.fire({
      title: "Las mediciones se están guardando...",
      icon: "info",
      showConfirmButton: false,
      timer: 5000, // Duración en milisegundos (5 segundos)
    });

    let totalRegistros = arrayMediciones.length;
    let registrosEnviados = 0;
    let registrosFallidos = [];

    const enviarMedicion = (nuevoRegistro) => {
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

      if (medicionesSuperior.includes(nuevoRegistro.prenda)) {
        formdata.append(
          "espalda_superior",
          nuevoRegistro.mediciones.espalda || 0
        );
        formdata.append(
          "talle_espalda_superior",
          nuevoRegistro.mediciones.talle_espalda || 0
        );
        formdata.append(
          "talle_frente_superior",
          nuevoRegistro.mediciones.talle_frente || 0
        );
        formdata.append("busto_superior", nuevoRegistro.mediciones.busto || 0);
        formdata.append(
          "cintura_superior",
          nuevoRegistro.mediciones.cintura || 0
        );
        formdata.append(
          "cadera_superior",
          nuevoRegistro.mediciones.cadera || 0
        );
        formdata.append(
          "ancho_manga_corta_superior",
          nuevoRegistro.mediciones.ancho_manga_corta || 0
        );
        formdata.append(
          "ancho_manga_larga_superior",
          nuevoRegistro.mediciones.ancho_manga_larga || 0
        );
        formdata.append(
          "largo_manga_corta_superior",
          nuevoRegistro.mediciones.largo_manga_corta || 0
        );
        formdata.append(
          "largo_manga_larga_superior",
          nuevoRegistro.mediciones.largo_manga_larga || 0
        );
        formdata.append(
          "largo_total_superior",
          nuevoRegistro.mediciones.largo_total || 0
        );
        formdata.append(
          "alto_pinza_superior",
          nuevoRegistro.mediciones.alto_pinza || 0
        );
      } else {
        formdata.append("largo_inferior", nuevoRegistro.mediciones.largo || 0);
        formdata.append(
          "cintura_inferior",
          nuevoRegistro.mediciones.cintura || 0
        );
        formdata.append(
          "cadera_inferior",
          nuevoRegistro.mediciones.cadera || 0
        );
        formdata.append(
          "pierna_inferior",
          nuevoRegistro.mediciones.pierna || 0
        );
        formdata.append(
          "rodilla_inferior",
          nuevoRegistro.mediciones.rodilla || 0
        );
        formdata.append("ruedo_inferior", nuevoRegistro.mediciones.ruedo || 0);
        formdata.append("tiro_inferior", nuevoRegistro.mediciones.tiro || 0);
      }

      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
        redirect: "follow",
      };

      return fetch(
        "https://api.textechsolutionscr.com/api/v1/mediciones/registrar",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          const status = result.status;
          if (parseInt(status) === 200) {
            registrosEnviados++;
          } else {
            registrosFallidos.push(nuevoRegistro);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    try {
      arrayMediciones.forEach((nuevoRegistro) => {
        enviarMedicion(nuevoRegistro).then(() => {
          // Comprobación después de enviar cada medición (opcional)
          if (registrosEnviados === totalRegistros) {
            // Hacer algo después de enviar todas las mediciones
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
                navigate(`/mediciones/cliente/${idCliente}`);
              } else {
                localStorage.removeItem("nuevosRegistros");
                limpiarEstados();
                setMediciones([]);
                limpiarCampos();
                navigate(`/mediciones/cliente/${idCliente}`);
              }
            });
          } else {
            // Formatear los objetos en registrosFallidos a cadenas JSON
            const registrosFallidosString = registrosFallidos.map(
              JSON.stringify
            );

            Swal.fire(
              "Hubo errores al crear las mediciones!",
              `Las mediciones que no se registraron ${registrosFallidosString}`,
              "error"
            ).then((result) => {
              if (result.isConfirmed) {
                localStorage.removeItem("nuevosRegistros");
                limpiarEstados();
                setMediciones([]);
                limpiarCampos();
              }
            });
          }
        });
      });
    } catch (error) {
      console.log("error", error);
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

    console.log(nuevasMediciones);

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

          {prendaSuperior && (
            <FormMedicionesSuperior handleInputChange={handleInputChange} />
          )}

          {prendaInferior && (
            <FormMedicionesInferior handleInputChange={handleInputChange} />
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
