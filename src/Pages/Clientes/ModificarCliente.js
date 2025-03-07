import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Logo from '../../Images/Logos/Icono (1).webp'
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const ModificarCliente = () => {

  const [cliente, setCliente] = useState([]); //Estado donde se almacena la informacion del cliente.
  const [empresas, setEmpresas] = useState([]); //Estado donde se almacenan las empresas.
  let { userId } = useParams(); //Capturar el identificador de la URL.
  const token = Cookies.get("jwtToken"); //Obtiene el token del cliente.
  const navigate = useNavigate();

  useEffect(() => {
    alertInvalidatePermission(); //Confirma si el usuario es permitido.
    informacionCliente(userId)  //Llenar la infrmacion del cliente por mediio de identificador
    obtenerEmpresas(); //Obtiene la informacion de las empresas
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const role = Cookies.get("role"); //Obtiene las cookies, especificamente el role.

  const validateUserPermission = () => {
    if (role !== "Visor"){
      return true
    }

    return false
  }

  const alertInvalidatePermission = () => {
    if (!validateUserPermission()){
      Swal.fire(
        "Acceso denegado",
        "No tienes los permisos necesarios para realizar esta acción.",
        "info"
      ).then((result) => {
        if(result.isConfirmed){
          navigate("/inicio")
        }
        else{
          navigate("/inicio")
        }
      })

    }

  }

  const informacionCliente = (clienteId) => {
     const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
      
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };
      
        fetch(`https://api.textechsolutionscr.com/api/v1/info/cliente/${clienteId}`, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Error en la respuesta: ${response.statusText}`);
            }
            return response.json();
          })
          .then((result) => {
            const { data } = result;
            setCliente(data);
            if (!data) {
              Swal.fire({
                title: "Cliente no encontrado",
                text: "Hay un problema en la red, por favor inténtelo más tarde",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            console.error("Error al obtener la información del cliente:", error);
            Swal.fire({
              title: "Error",
              text: "No se pudo conectar con el servidor. Por favor, inténtelo más tarde.",
              icon: "error",
            });
          });
  }

  /**
   * Cuando se realicen cambios en los input se almacenan en el estado.
   * */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCliente({ ...cliente, [name]: value });
  };

  /**
   * Cuando el usuario le de click al boton de guardar, se hara la solicitud al API
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    //console.log(cliente);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("nombre", cliente.nombre);
    formdata.append("apellido1", cliente.apellido1);
    formdata.append("apellido2", cliente.apellido2);
    formdata.append("cedula", cliente.cedula);
    formdata.append("email", cliente.email);
    formdata.append("telefono", cliente.telefono);
    formdata.append("empresa", cliente.empresa);
    formdata.append("departamento", cliente.departamento);
    formdata.append("comentarios", cliente.comentarios);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(`https://api.textechsolutionscr.com/api/v1/clientes/editar/${userId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        let status = result.status;

        if (parseInt(status) === 200) {

          const nombreCompleto =
            cliente.nombre + " " + cliente.apellido1 + " " + cliente.apellido2;

          Swal.fire(
            "Cliente modificado con éxito!",
            `Se ha modificado la información de ${nombreCompleto}!`,
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




        }
        else {
          Swal.fire(
            "Error!",
            `No se ha podido modificar el usuario, intentelo mas tarde.`,
            "success"
          );
        }

        console.log(result)
      })
      .catch(error => console.log('error', error));




    // Aquí puedes realizar la lógica de autenticación con los datos del formulario
    // por ejemplo, enviar una solicitud al servidor para verificar las credenciales

    // Restablecer los campos del formulario después de enviar
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

  return (
    <React.Fragment>
        <h2 className="titulo-encabezado">Editar cliente</h2>
        <hr className="division"></hr>

        <div className="container form-contenedor">
          <form className="form-registro-clientes" onSubmit={handleSubmit}>
            <div className="div-inp">
              <label htmlFor="nombre">Nombre:</label>
              <input type="text" id="nombre" name="nombre" autoComplete="nombre" defaultValue={cliente.nombre ?? ''} onChange={handleInputChange} />
            </div>
            <div className="div-inp">
              <label htmlFor="apellido1">Apellido1:</label>
              <input type="text" id="apellido1" name="apellido1" autoComplete="apellido1" defaultValue={cliente.apellido1 ?? ''} onChange={handleInputChange} />
            </div>
            <div className="div-inp">
              <label htmlFor="apellido2">Apellido2:</label>
              <input type="text" id="apellido2" name="apellido2" autoComplete="apellido2" defaultValue={cliente.apellido2 ?? ''} onChange={handleInputChange} />
            </div>
            <div className="div-inp">
              <label htmlFor="cedula">Cédula:</label>
              <input type="text" id="cedula" name="cedula" autoComplete="cedula" defaultValue={cliente.cedula ?? ''} onChange={handleInputChange} />
            </div>
            <div className="div-inp">
              <label htmlFor="correo">Correo electrónico:</label>
              <input type="text" id="correo" name="email" autoComplete="correo" defaultValue={cliente.email ?? ''} onChange={handleInputChange} />
            </div>
            <div className="div-inp">
              <label htmlFor="telefono">Teléfono:</label>
              <input type="text" id="telefono" name="telefono" autoComplete="telefono" defaultValue={cliente.telefono ?? ''} onChange={handleInputChange} />
            </div>
            <div className="div-inp">
              <label htmlFor="empresa">Empresa:</label>
              <select
                onChange={handleInputChange}
                name="empresa"
                id="empresa"
                defaultValue={cliente.nombre_empresa || ''}
                required
              >
                {empresas.map((iterador) => (
                  <option
                    key={iterador.id}
                    value={iterador.nombre_empresa}
                    selected={iterador.nombre_empresa === cliente.empresa}
                  >
                    {iterador.nombre_empresa}
                  </option>
))}

              </select>
            </div>
            <div className="div-inp">
              <label htmlFor="departamento">Departamento:</label>
              <input type="text" id="departamento" name="departamento" autoComplete="departamento" defaultValue={cliente.departamento ?? ''} onChange={handleInputChange} />
            </div>

            <div className="div-inp">
              <label htmlFor="observaciones">Observaciones:</label>
              <textarea id="observaciones" rows="5" cols="60" name="comentarios" defaultValue={cliente.comentarios ?? ''} onChange={handleInputChange}></textarea>
            </div>

            <div className="container botones-contenedor">
              <button className="btn-registrar" type="submit">
                Guardar
              </button>
              <Link to='/clientes'>
                <button className="btn-registrar">
                  Regresar
                </button>
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

export default ModificarCliente;
