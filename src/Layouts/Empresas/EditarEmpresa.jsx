import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate, Link, useParams } from "react-router-dom";
import Logo from "../../Images/Logos/Icono.jpg";

const EditarEmpresa = () => {
  const [empresa, setEmpresa] = useState([]);
  const [todasEmpresas, setTodasEmpresas] = useState([]);
  const { idEmpresa } = useParams();

  useEffect(() => {
    limpiarEstado();
    obtenerEmpresas(idEmpresa)
  }, []);

  const navigate = useNavigate();

  const token = Cookies.get("jwtToken");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  const obtenerEmpresas = (parametro) => {
    let empresaId = parseInt(parametro)
    let datosEmpresas = JSON.parse(localStorage.getItem("empresas"));
    setTodasEmpresas(datosEmpresas);

    if (datosEmpresas.length > 0) {
        datosEmpresas.forEach((item) => {
          if (parseInt(item.id) === empresaId) {
              setEmpresa(item);
          }
        });
    }
  };


  const handleInputChangeCedula = (event) => {
    const valorCedula = event.target.value;

    const usuarioExistente = todasEmpresas.find(
      (usuario) => usuario.cedula == valorCedula
    );

    if (usuarioExistente) {
      const inputElement = document.getElementById("cedula");
      if (inputElement) {
        inputElement.value = "";
      }

      Swal.fire(
        "Error!",
        "La cédula que dijitaste ya existe en la base de datos",
        "error"
      );
    } else {
      const { name, value } = event.target;
      setEmpresa({ ...empresa, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    peticionApi();
    limpiarEstado();
  };

  const limpiarEstado = () => {
    setEmpresa([]);
  };

  const peticionApi = () => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${token}`
    );

    var formdata = new FormData();
    formdata.append("nombre_empresa", empresa.nombre_empresa);
    formdata.append("razon_social", empresa.razon_social || 'NA');
    formdata.append("cedula", empresa.cedula);
    formdata.append("email", empresa.email);
    formdata.append("nombre_encargado", empresa.nombre_encargado);
    formdata.append("telefono_encargado", empresa.telefono_encargado);
    formdata.append("direccion", empresa.direccion || 'NA');
    formdata.append("comentarios", empresa.comentarios || 'NA');

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/empresas/editar/${idEmpresa}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status, error } = result;
          if (parseInt(status) === 200) {
            // Empresa creada con éxito
            Swal.fire(
              "Empresa modificada con éxito!",
              `Se ha a modificado información de ${empresa.nombre_empresa}!`,
              "success"
            ).then((result) => {
              if (result.isConfirmed) {
                // El usuario hizo clic en el botón "OK"
                navigate("/empresas");
              } else {
                // El usuario cerró el cuadro de diálogo sin hacer clic en el botón "OK"
                // Realiza alguna otra acción o maneja el caso en consecuencia
              }
            });
  
          } else {
            // Error al crear el cliente
            let mensajeError = '';
            for (const mensaje of error) {
              mensajeError += mensaje + "\n";
            }
            Swal.fire(
              "Error al modificar la empresa!",
              `${mensajeError}`,
              "error"
            );
          }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <React.Fragment>
      <div className="container registro">
        <h2 className="titulo-encabezado">Editar empresa</h2>
        <hr className="division"></hr>

        <div className="container form-contenedor">
          <form className="form-registro-clientes" onSubmit={handleSubmit}>
            <div className="div-inp">
              <label htmlFor="username">Empresa:</label>
              <input
                onChange={handleInputChange}
                defaultValue={empresa.nombre_empresa}
                type="text"
                name="nombre_empresa"
                id="nombre"
                autoComplete="nombre"
                required
              />
            </div>
            <div className="div-inp">
              <label htmlFor="username">Razón Social:</label>
              <input
                onChange={handleInputChange}
                defaultValue={empresa.razon_social}
                type="text"
                name="razon_social"
                id="razon_social"
                autoComplete="razon_social"
                required
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Cédula:</label>
              <input
                onChange={handleInputChangeCedula}
                value={empresa.cedula}
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
                defaultValue={empresa.email}
                type="text"
                name="email"
                id="cedula"
                autoComplete="current-password"
                required
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Nombre del Encargado:</label>
              <input
                onChange={handleInputChange}
                value={empresa.nombre_encargado}
                type="text"
                name="nombre_encargado"
                id="cedula"
                autoComplete="current-password"
                required
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Telefono:</label>
              <input
                onChange={handleInputChange}
                defaultValue={empresa.telefono_encargado}
                type="text"
                name="telefono_encargado"
                id="cedula"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="div-inp">
              <label htmlFor="password">Dirección:</label>
              <textarea
                onChange={handleInputChange}
                value={empresa.direccion}
                id="txtArea"
                name="direccion"
                rows="5"
                cols="60"
              ></textarea>
            </div>

            <div className="div-inp">
              <label htmlFor="password">Observaciones:</label>
              <textarea
                onChange={handleInputChange}
                defaultValue={empresa.comentarios}
                id="txtArea"
                name="comentarios"
                rows="5"
                cols="60"
              ></textarea>
            </div>

            <div className="container botones-contenedor">
              <button className="btn-registrar" type="submit">
                Guardar
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
      </div>
    </React.Fragment>
  );
};

export default EditarEmpresa;
