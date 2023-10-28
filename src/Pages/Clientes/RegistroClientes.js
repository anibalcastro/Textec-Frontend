import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../Images/Logos/Icono.png";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const RegistroCliente = () => {
  const [cliente, setCliente] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState("");

  useEffect(() => {
    obtenerEmpresas();
    setUsuarios(obtenerUsuarios());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  const token = Cookies.get("jwtToken");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCliente({ ...cliente, [name]: value });
  };

  const obtenerUsuarios = () => {
    let datosUsuarios = localStorage.getItem("data");
    return JSON.parse(datosUsuarios);
  };

  const handleInputChangeCedula = (event) => {
    const valorCedula = event.target.value;
  
    if (valorCedula === "NA" || valorCedula === "na" || valorCedula === "Na" || valorCedula === "nA") {
      // El usuario ingresó "NA", actualiza el estado con ese valor
      setCliente({ ...cliente, cedula: valorCedula });
    } else {
      const usuarioExistente = usuarios.find(
        (usuario) => usuario.cedula === valorCedula
      );
  
      if (usuarioExistente) {
        // Usuario con la misma cédula ya existe
        Swal.fire(
          "Error!",
          "La cédula que ingresaste ya existe en la base de datos",
          "error"
        );
      } else {
        // Usuario no existe, actualiza el estado
        const { name, value } = event.target;
        setCliente({ ...cliente, [name]: value });
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
      peticionApi();
      limpiarEstado();
  };

  const limpiarEstado = () => {
    setCliente("");
  };

  const peticionApi = () => {

    if (cliente.nombre !== undefined && cliente.nombre.toLowerCase() !== "undefined"){
      
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
  
      var formdata = new FormData();
      formdata.append("nombre", cliente.nombre);
      formdata.append("apellido1", cliente.apellido1);
      formdata.append("apellido2", cliente.apellido2);
      formdata.append("cedula", cliente.cedula || "NA");
      formdata.append("email", cliente.correo || "NA");
      formdata.append("telefono", cliente.telefono || "NA");
      formdata.append("empresa", cliente.empresa || "NA");
      formdata.append("departamento", cliente.departamento || "NA");
      formdata.append("comentarios", cliente.observaciones || "NA");
  
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };
  
      fetch(
        "https://api.textechsolutionscr.com/api/v1/clientes/registrar",
        requestOptions
      )
        .then((response) => response.json())
        .then((responseData) => {
          const { status } = responseData;
          const nombreCompleto =
            cliente.nombre + " " + cliente.apellido1 + " " + cliente.apellido2;
  
          if (parseInt(status) === 200) {
            // Cliente creado con éxito
  
            Swal.fire(
              "Cliente creado con éxito!",
              `Se ha a registrado a ${nombreCompleto}!`,
              "success"
            ).then((result) => {
              if (result.isConfirmed) {
                // El usuario hizo clic en el botón "OK"
                navigate("/clientes");
              } else {
                // El usuario cerró el cuadro de diálogo sin hacer clic en el botón "OK"
                // Realiza alguna otra acción o maneja el caso en consecuencia
              }
            });
          } else {
            // Error al crear el cliente
            Swal.fire(
              "Error al crear cliente!",
              "Verificar que todos los campos estén llenos",
              "error"
            );
          }
        })
        .catch((error) => console.log("error", error));

    }
    else{
      Swal.fire(
        "Error al crear cliente!",
        `El nombre del cliente no puede ser ${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2}`,
        "error"
      );
    }

  };

  /**
   * Obtener información de empresas
   */
  const obtenerEmpresas = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://api.textechsolutionscr.com/api/v1/empresas", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setEmpresas(data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const handleInputChangeFiltroEmpresa = (event) => {
    setFiltroEmpresa(event.target.value);
  }

  const filtrarEmpresas = () => {
    const datosFiltrados = empresas.filter(dato => {
      return dato.nombre_empresa.toLowerCase().includes(filtroEmpresa.toLowerCase());
    });

    return datosFiltrados;
  }

  return (
    <React.Fragment>
      
        <h2 className="titulo-encabezado">Registro de clientes</h2>
        <hr className="division"></hr>

        <div className="container form-contenedor">
          <form className="form-registro-clientes" onSubmit={handleSubmit}>
            <div className="div-inp">
              <label htmlFor="username">Nombre:</label>
              <input
                onChange={handleInputChange}
                type="text"
                name="nombre"
                id="nombre"
                autoComplete="nombre"
                required
              />
            </div>
            <div className="div-inp">
              <label htmlFor="username">Apellido1:</label>
              <input
                onChange={handleInputChange}
                type="text"
                name="apellido1"
                id="nombre"
                autoComplete="nombre"
                required
              />
            </div>
            <div className="div-inp">
              <label htmlFor="username">Apellido2:</label>
              <input
                onChange={handleInputChange}
                type="text"
                name="apellido2"
                id="nombre"
                autoComplete="nombre"
                required
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Cédula:</label>
              <input
                onChange={handleInputChangeCedula}
                type="text"
                name="cedula"
                id="cedula"
                autoComplete="current-password"
                required
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Correo electronico:</label>
              <input
                onChange={handleInputChange}
                type="text"
                name="correo"
                id="cedula"
                autoComplete="current-password"
                required
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Telefono:</label>
              <input
                onChange={handleInputChange}
                type="text"
                name="telefono"
                id="cedula"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="div-inp">
              <label htmlFor="password">Buscar empresa:</label>
              <input
                onChange={handleInputChangeFiltroEmpresa}
                type="text"
                name="buscarEmpresa"
                id="cedula"
                autoComplete="current-password"
              />
            </div>

            <div className="div-inp">
              <label htmlFor="empresa">Empresa:</label>
              <select
                onChange={handleInputChange}
                name="empresa"
                id="empresa"
                required
              >
                <option value="">Selecciona una empresa</option>
                {filtrarEmpresas().map((empresa) => (
                  <option key={empresa.id} value={empresa.nombre_empresa}>
                    {empresa.nombre_empresa}
                  </option>
                ))}
              </select>
            </div>
            <div className="div-inp">
              <label htmlFor="password">Departamento:</label>
              <input
                onChange={handleInputChange}
                type="text"
                name="departamento"
                id="cedula"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="div-inp">
              <label htmlFor="password">Observaciones:</label>
              <textarea
                onChange={handleInputChange}
                id="txtArea"
                name="observaciones"
                rows="5"
                cols="60"
              ></textarea>
            </div>

            <div className="container botones-contenedor">
              <button className="btn-registrar" type="submit">
                Registrar
              </button>
              <Link to="/clientes">
                <button className="btn-registrar">Regresar</button>
              </Link>
            </div>
          </form>

          <div className="container img-contenedor">
            <img className="isologo" src={Logo} alt="imagen" />
          </div>
        </div>
     
    </React.Fragment>
  );
};

export default RegistroCliente;
