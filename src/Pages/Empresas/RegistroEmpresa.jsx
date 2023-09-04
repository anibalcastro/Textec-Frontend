import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import Logo from '../../Images/Logos/Icono.png'

const RegistroEmpresa = () => {

    const [input, setInput] = useState([]);
    const [empresas, setEmpresas] = useState([]);
  
    useEffect(() => {
      setEmpresas(obtenerEmpresas());
    },[])
  
    const navigate = useNavigate();
  
    const token = Cookies.get("jwtToken");
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setInput({ ...input, [name]: value });
    };
  
    const obtenerEmpresas = () => {
      let datosUsuarios = localStorage.getItem('data');
      return JSON.parse(datosUsuarios);
    }
   
    const handleInputChangeCedula = (event) => {
      const valorCedula = event.target.value;
      
      const usuarioExistente = empresas.find(usuario => usuario.cedula == valorCedula);
  
      if (usuarioExistente) {
        const inputElement = document.getElementById('cedula');
        if (inputElement) {
          inputElement.value = '';
        }
  
        Swal.fire(
          "Error!",
          "La céedula ya esta asignada a una empresa",
          "error"
        );
      } else {
        const { name, value } = event.target;
        setInput({ ...input, [name]: value });
      }
  
  
    }
  
    const handleSubmit = (event) => {
      event.preventDefault();
        peticionApi();
        limpiarEstado();
      
    };
      
    const limpiarEstado = () => {
      setInput("");
    }
  
    const peticionApi = () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
  
      var formdata = new FormData();

      formdata.append("nombre_empresa",input.nombre || 'Nombre empresa');
      formdata.append("razon_social",input.razon_social || 'Razon social');
      formdata.append("cedula", input.cedula || 'cedula');
      formdata.append("email", input.correo || 'NA');
      formdata.append("nombre_encargado", input.encargado);
      formdata.append("telefono_encargado",input.telefono_encargado );
      formdata.append("direccion", input.direccion || 'NA');
      formdata.append("comentarios", input.observaciones || 'NA');
  
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };
  
      fetch("https://api.textechsolutionscr.com/api/v1/empresas/registrar", requestOptions)
        .then((response) => response.json())
        .then((responseData) => {
          const { status, error } = responseData;
           
  
          if (parseInt(status) === 200) {
            // Empresa creada con éxito
            Swal.fire(
              "Empresa creada con éxito!",
              `Se ha a registrado a ${input.nombre}!`,
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
              "Error al crear la empresa!",
              `${mensajeError}`,
              "error"
            );
          }
        })
        .catch((error) => console.log("error", error));
    }

    return(
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
                name="nombre"
                id="nombre"
                autoComplete="nombre"
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
                autoComplete="razon_social"
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
              <label htmlFor="password">Nombre del Encargado:</label>
              <input
                onChange={handleInputChange}
                type="text"
                name="encargado"
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
    )
}

export default RegistroEmpresa