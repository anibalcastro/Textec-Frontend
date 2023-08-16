import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Logo from "../../Images/Logos/Icono.png";
import Cookies from "js-cookie";
import Swal from "sweetalert2";



const DetalleEmpresa = () => {
  const [empresa, setEmpresas] = useState([]);
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const { idEmpresa } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    limpiarEstado();
    obtenerInformacionEmpresa(idEmpresa);
    //console.log(empresa);
  }, []);

  const obtenerInformacionEmpresa = (parametro) => {
    let empresaId = parseInt(parametro);

    let empresas = JSON.parse(localStorage.getItem("empresas"));

    if (empresas.length > 0) {
      empresas.forEach((item) => {
        if (parseInt(item.id) === empresaId) {
          setEmpresas(item);
        }
      });
    }
  };

  const limpiarEstado = () => {
    setEmpresas([]);
  };


  const peticionEliminarEmpresa = (empresaId) => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${token}`
    );

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/empresas/eliminar/${empresaId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status } = result;
        console.log(status);

        if (status === 200) {
          Swal.fire({
            title: "Empresa eliminada!",
            text: "Se ha eliminado permanentemente",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/empresas");
            } else {
              navigate("/empresas");
            }
          });
        } else {
          Swal.fire({
            title: "Ha ocurrido un error!",
            text: "Por favor intentarlo luego",
            icon: "error",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/empresas");
            } else {
              navigate("/empresas");
            }
          });
        }
      })
      .catch((error) => console.log("error", error));
  };





  const eliminarEmpresa = () => {
    Swal.fire({
      title: "¿Desea eliminar la empresa?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        peticionEliminarEmpresa(idEmpresa);
      } else {
        Swal.fire({
          title: "Se ha cancelado!",
          text: "No se eliminará la empresa",
          icon: "info",
        });
      }
    });
  }

  const validarPermisos = () => {
    if (role === 'Admin' || role === 'Colaborador') {
      return true;
    }

    return false
  }

  const permisosColaborador = validarPermisos();

  const validarRol = (role) => {
    return role === "Admin";
  };

  const permisos = validarRol(role);

  return (
    <React.Fragment>
      <div className="container registro">
        <h2 className="titulo-encabezado">Detalle de empresa</h2>
        <hr className="division"></hr>

        <div className="container form-contenedor">
          <form className="form-registro-clientes">
            <div className="div-inp">
              <label htmlFor="username">Empresa:</label>
              <input
                value={empresa.nombre_empresa}
                type="text"
                name="nombre"
                id="nombre"
                autoComplete="nombre"
                required
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="username">Razón social:</label>
              <input
                value={empresa.razon_social}
                type="text"
                name="razon_social"
                id="razon_social"
                autoComplete="razon_social"
                required
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Cédula:</label>
              <input
                value={empresa.cedula}
                type="text"
                name="cedula"
                id="cedula"
                autoComplete="current-password"
                required
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Correo electronico:</label>
              <input
                value={empresa.email}
                type="text"
                name="correo"
                id="cedula"
                autoComplete="current-password"
                required
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Nombre del Encargado:</label>
              <input
                value={empresa.nombre_encargado}
                type="text"
                name="encargado"
                id="cedula"
                autoComplete="current-password"
                required
                disabled
              />
            </div>
            <div className="div-inp">
              <label htmlFor="password">Telefono:</label>
              <input
                value={empresa.telefono_encargado}
                type="text"
                name="telefono_encargado"
                id="cedula"
                autoComplete="current-password"
                required
                disabled
              />
            </div>

            <div className="div-inp">
              <label htmlFor="password">Dirección:</label>
              <textarea
                value={empresa.direccion}
                id="txtArea"
                name="direccion"
                rows="5"
                cols="60"
                disabled
              ></textarea>
            </div>

            <div className="div-inp">
              <label htmlFor="password">Observaciones:</label>
              <textarea
                value={empresa.comentarios}
                id="txtArea"
                name="observaciones"
                rows="5"
                cols="60"
                disabled
              ></textarea>
            </div>

          </form>

          <div className="container img-contenedor">
            <img className="isologo" src={Logo} alt="imagen" />
          </div>

          <hr className="division" />


            </div>
            <div className="container botones-contenedor">
              <Link to="/empresas">
                <button className="btn-registrar">Regresar</button>
              </Link>

              {permisosColaborador && (<Link to={`/empresa/editar/${empresa.id}`}>
                <button className="btn-registrar">Editar</button>
              </Link>)}
              

              {permisos && (
                <button className="btn-registrar" onClick={() => eliminarEmpresa()}>
                  Eliminar
                </button>
              )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default DetalleEmpresa;
