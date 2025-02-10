import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../Images/Logos/Icono (1).webp";

const RegistroEmpresa = () => {
  const [input, setInput] = useState({
    nombre_empresa: '',
    razon_social: '',
    cedula: '',
    email: '',
    nombre_encargado: '',
    telefono_encargado: '',
    direccion: '',
    comentarios: 'NA',
  });
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    alertInvalidatePermission();
    obtenerEmpresas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

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

  const handleInputChangeCedula = (event) => {
    const valorCedula = event.target.value;

    if (valorCedula.length >= 10) {
      const empresaExiste =
        empresas &&
        empresas.find(
          (item) => parseInt(item.cedula) === parseInt(valorCedula)
        );

      if (empresaExiste) {
        // Mostrar un mensaje de error
        Swal.fire(
          "Error!",
          "La cédula ya está asignada a una empresa",
          "error"
        );

        const resetearEstado = {
          nombre_empresa: '',
          razon_social: '',
          cedula: '',
          email: '',
          nombre_encargado: '',
          telefono_encargado: '',
          direccion: '',
          comentarios: 'NA',
        }

        setInput(resetearEstado)
      } else {
        // La empresa no existe, actualizar el estado
        setInput((prevInput) => ({ ...prevInput, cedula: valorCedula }));
      }
    } else {
      // Asegurarnos de manejar el caso cuando la longitud es menor a 10
      setInput((prevInput) => ({ ...prevInput, cedula: valorCedula }));
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    let resultado = peticionApi();

    if(resultado){
      limpiarEstado();
    }
  };

  const limpiarEstado = () => {
    const resetearEstado = {
      nombre_empresa: '',
      razon_social: '',
      cedula: '',
      email: '',
      nombre_encargado: '',
      telefono_encargado: '',
      direccion: '',
      comentarios: 'NA',
    }

    setInput(resetearEstado)
  };

  const peticionApi = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    //console.log(input);

    var formdata = new FormData();

    formdata.append("nombre_empresa", input.nombre_empresa || "Nombre empresa");
    formdata.append("razon_social", input.razon_social || "Razon social");
    formdata.append("cedula", input.cedula || "cedula");
    formdata.append("email", input.email || "na@gmail.com");
    formdata.append("nombre_encargado", input.nombre_encargado || "NA");
    formdata.append(
      "telefono_encargado",
      input.telefono_encargado || "88888888"
    );
    formdata.append("direccion", input.direccion || "NA");
    formdata.append("comentarios", input.comentarios || "NA");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/empresas/registrar",
      requestOptions
    )
      .then((response) => response.json())
      .then((responseData) => {
        const { status, error } = responseData;

        console.log(status);

        if (parseInt(status) === 200) {
          Swal.fire(
            "Empresa creada con éxito!",
            `Se ha a registrado a ${input.nombre_empresa}!`,
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              navigate("/empresas");
            } else {
              navigate("/empresas");
            }
          });

          return true;
        } else {
          // Error al crear el cliente
          let mensajeError = "";
          for (const mensaje of error) {
            mensajeError += mensaje + "\n";
          }
          Swal.fire("Error al crear la empresa!", `${mensajeError}`, "error");

          return false;
        }
      })
      .catch((error) => {
        Swal.fire("Error", `${error}`, "error")
        console.log("error", error)});

  };

  return (
    <React.Fragment>
      <h2 className="titulo-encabezado">Registro de empresa</h2>
      <hr className="division"></hr>

      <div className="container form-contenedor">
        <form className="form-registro-clientes" onSubmit={handleSubmit}>
          <div className="div-inp">
            <label htmlFor="username">Empresa:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="nombre_empresa"
              id="nombre_empresa"
              value={input.nombre_empresa}
              required
            />
          </div>
          <div className="div-inp">
            <label htmlFor="username">Razón social:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="razon_social"
              id="razon_social"
              value={input.razon_social}
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
              value={input.cedula}
              required
            />
          </div>
          <div className="div-inp">
            <label htmlFor="password">Correo electronico:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="email"
              id="email"
              value={input.email}
              required
            />
          </div>
          <div className="div-inp">
            <label htmlFor="password">Nombre del Encargado:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="nombre_encargado"
              id="nombre_encargado"
              value={input.nombre_encargado}
              required
            />
          </div>
          <div className="div-inp">
            <label htmlFor="password">Telefono:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="telefono_encargado"
              id="cedula"
              value={input.telefono_encargado}
              required
            />
          </div>

          <div className="div-inp">
            <label htmlFor="password">Dirección:</label>
            <textarea
              onChange={handleInputChange}
              id="txtArea"
              name="direccion"
              rows="5"
              cols="60"
              value={input.direccion}
            ></textarea>
          </div>

          <div className="div-inp">
            <label htmlFor="password">Observaciones:</label>
            <textarea
              onChange={handleInputChange}
              id="txtArea"
              name="comentarios"
              rows="5"
              cols="60"
              value={input.comentarios}
            ></textarea>
          </div>

          <div className="container botones-contenedor">
            <button className="btn-registrar" type="submit">
              Registrar
            </button>
            <Link to="/empresas">
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

export default RegistroEmpresa;
