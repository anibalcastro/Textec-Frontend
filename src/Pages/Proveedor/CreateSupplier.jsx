import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../Images/Logos/Icono (1).webp";
import Header from "../../components/Header/Header";

const CreateSupplier = () => {
  const [supplier, setSupplier] = useState([]);

  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  useEffect(() => {
    validateRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateRole = () => {
    if (!role === "Admin" || !role === "Colaborador") {
      Swal.fire(
        "Acceso denegado",
        "Esta sección está restringida para su rol",
        "warning"
      ).then((result) => {
        if (result.isConfirmed) {
          navigate("/proveedores");
        } else {
          navigate("/proveedores");
        }
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createSupplier();
  };

  const createSupplier = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("nombre", supplier.nombre);
    formdata.append("direccion", supplier.direccion || 'NA');
    formdata.append("vendedor", supplier.vendedor || 'NA');
    formdata.append("telefono", supplier.telefono || '88888888');
    formdata.append("email", supplier.email || 'NA');
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };
    
    fetch(
      "https://api.textechsolutionscr.com/api/v1/proveedores/registrar",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status, error } = result;
        if (parseInt(status) === 200) {
          Swal.fire(
            "¡Proveedor creado con éxito!",
            `Se ha a registrado el proveedor ${supplier.nombre}!`,
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
              navigate("/proveedores");
            } else {
              navigate("/proveedores")
            }
          });
        } else {
          let errorMessage = "";
          for (const message of error) {
            errorMessage += message + "\n";
          }
          Swal.fire("Error al crear el proveedor!", `${errorMessage}`, "error");
        }
      })
      .catch((error) => {Swal.fire("Error al crear el proveedor.", `${error}`, "error")
      console.log(error);});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSupplier({ ...supplier, [name]: value });
  };


  return (
    <React.Fragment>
      <Header title="Registrar proveedor" />

      <div className="container form-contenedor">
        <form className="form-registro-clientes" onSubmit={handleSubmit}>
          <div className="div-inp">
            <label htmlFor="nombre">Proveedor:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="nombre"
              id="nombre_proveedor"
              required
            ></input>
          </div>

          <div className="div-inp">
            <label htmlFor="nombre">Dirección:</label>
            <textarea
                onChange={handleInputChange}
                id="txtArea"
                name="direccion"
                rows="5"
                cols="60"
              ></textarea>
          </div>
          
          <div className="div-inp">
            <label htmlFor="nombre">Vendedor:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="vendedor"
              id="nombre_proveedor"
              required
            ></input>
          </div>

          <div className="div-inp">
            <label htmlFor="nombre">Email:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="email"
              id="email"
              required
            ></input>
          </div>


          <div className="div-inp">
            <label htmlFor="nombre">Teléfono:</label>
            <input
              onChange={handleInputChange}
              type="number"
              name="telefono"
              id="telefono"
              required
            ></input>
          </div>

          <div className="container botones-contenedor">
            <button type="submit" className="btn-registrar">Guardar</button>

            <Link to={"/proveedores"}>
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

export default CreateSupplier;
