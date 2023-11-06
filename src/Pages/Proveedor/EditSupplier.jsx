import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Logo from "../../Images/Logos/Icono (1).webp";
import { useNavigate,useLocation, Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const EditSupplier = () => {
  const [editSupplier, setEditSupplier] = useState([]);
  const token = Cookies.get("jwtToken");
  const location = useLocation();
  const { supplier } = location.state;
  const { supplierId } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    setEditSupplier(supplier);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchEditSupplier();
  };

  const fetchEditSupplier = () => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${token}`
    );

    var formdata = new FormData();
    formdata.append("nombre", editSupplier.nombre);
    formdata.append("direccion", editSupplier.direccion || 'NA');
    formdata.append("vendedor", editSupplier.vendedor || 'NA');
    formdata.append("telefono", editSupplier.telefono || '88888888');
    formdata.append("email", editSupplier.email || 'NA');

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`https://api.textechsolutionscr.com/api/v1/proveedor/${supplierId}` , requestOptions)
      .then((response) => response.json())
      .then((result) => {
        
        const { status, error } = result;
        if (parseInt(status) === 200) {
            Swal.fire(
                "¡Proveedor editado con éxito!",
                `¡Se ha editado el proveedor ${editSupplier.nombre}!`,
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
            Swal.fire("Error al editar el producto!", `${errorMessage}`, "error");
        }
    })
    .catch((error) => console.log("error", error));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditSupplier({ ...editSupplier, [name]: value });
  };

  return (
    <React.Fragment>
      <Header title="Editar proveedor" />

      <div className="container form-contenedor">
        <form className="form-registro-clientes" onSubmit={handleSubmit}>
          <div className="div-inp">
            <label htmlFor="nombre">Proveedor:</label>
            <input
              onChange={handleInputChange}
              defaultValue={supplier.nombre}
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
              defaultValue={supplier.direccion}
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
              defaultValue={supplier.vendedor}
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
              defaultValue={supplier.email}
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
              defaultValue={supplier.telefono}
              type="text"
              name="telefono"
              id="telefono"
              required
            ></input>
          </div>

          <div className="container botones-contenedor">
            <button className="btn-registrar">Guardar</button>

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

export default EditSupplier;
