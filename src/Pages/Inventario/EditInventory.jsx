import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Cookies from "js-cookie";
import Logo from "../../Images/Logos/Icono (1).webp";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditInventory = () => {
  //Estados
  const [data, setData] = useState({
    nombre_producto: "",
    cantidad: 0,
    color: "#000000",
    id_categoria: null,
    id_proveedor: null,
    comentario: "Unidades",
  });
  const [category, setCategory] = useState([]);
  const [supplier, setSupplier] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [inventory, setInventory] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");

  //Cookies
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  //Navigate
  const navigate = useNavigate();

  //Params
  const { inventarioId } = useParams();

  useEffect(() => {
    alertInvalidatePermission();

    getInventory();
    getCategory();
    getSupplier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (datos) => {
    const datosFiltrados = datos.find(
      (dato) => parseInt(dato.id) === parseInt(inventarioId)
    );

    if (datosFiltrados) {
      const nombreProducto = datosFiltrados.nombre_producto;
      const cantidad = datosFiltrados.cantidad;
      const color = datosFiltrados.color;
      const categoria = datosFiltrados.id_categoria;
      const proveedor = datosFiltrados.id_proveedor;
      const comentario = datosFiltrados.comentario;

      const fillState = {
        nombre_producto: nombreProducto,
        cantidad: cantidad,
        color: color,
        id_categoria: categoria,
        id_proveedor: proveedor,
        comentario: comentario,
      };

      setData(fillState);
    } else {
      alert("No se encontraron datos para el ID proporcionado.");
    }
  };

  //Valida permisos de usuario
  const validateUserPermission = () => {
    if (role !== "Visor") {
      return true;
    }

    return false;
  };

  //Muestra aleta
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

  //Obtiene todas las categorias
  const getCategory = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/categorias",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setCategory(data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  //Obtiene todos los proveedores
  const getSupplier = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/proveedores/info",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setSupplier(data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  //Obtiene todos los proveedores
  const getInventory = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/inventario",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setInventory(data);
          getData(data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  //Acciones en los input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleInputChangeFilterCategory = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleInputChangeFilterSupplier = (event) => {
    setFilterSupplier(event.target.value);
  };

  //Filtros de datos
  const filterDataCategory = () => {
    const datos = category.filter((dato) => {
      return dato.nombre_categoria
        .toLowerCase()
        .includes(filterCategory.toLowerCase());
    });

    return datos;
  };

  const filterDataSupplier = () => {
    const datos = Array.isArray(supplier)
      ? supplier.filter((dato) =>
        dato.nombre.toLowerCase().includes(filterSupplier.toLowerCase())
      )
      : [];

    return datos;
  };

  const updateInventory = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
  
    var formdata = new FormData();
    formdata.append("nombre_producto", data.nombre_producto);
    formdata.append("cantidad", data.cantidad);
    formdata.append("color", data.color);
    formdata.append("id_categoria", data.id_categoria);
    formdata.append("id_proveedor", data.id_proveedor);
    formdata.append("comentario", data.comentario);
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };
  
    fetch(`https://api.textechsolutionscr.com/api/v1/inventario/modificar/${inventarioId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const { status, mensaje, error } = result;
  
        if (parseInt(status) === 200) {
          Swal.fire(
            "Inventario editado",
            "Se ha modificado con éxito!",
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              clearInputs();
              // El usuario hizo clic en el botón "OK"
              navigate("/inventario");
            } else {
              clearInputs();
              navigate("/inventario");
            }
          });
        } else {
          let errorMessage = "";
  
          // Verificar si 'error' está definido y es iterable
          if (error && typeof error[Symbol.iterator] === "function") {
            for (const message of error) {
              errorMessage += message + "\n";
            }
          }
  
          // Verificar si 'mensaje' está definido y es iterable
          if (mensaje && typeof mensaje[Symbol.iterator] === "function") {
            for (const message of mensaje) {
              errorMessage += message + "\n";
            }
          }
  
          Swal.fire(
            "Error al registrar el inventario!",
            `${errorMessage}`,
            "error"
          );
        }
      })
      .catch(error => console.log('error', error));
  };
  


  //Agregar a la lista un nuevo inventario
  const handleSubmit = (event) => {
    event.preventDefault();
    updateInventory();
  };

  const clearInputs = () => {
    const resetearEstado = {
      nombre_producto: "",
      cantidad: 0,
      color: "#000000",
      id_categoria: 0,
      id_proveedor: 0,
      comentario: "",
    };

    setData(resetearEstado);
  };


  return (
    <React.Fragment>
      <Header title="Editar Inventario" />

      <div className="container form-contenedor">
        <form className="form-registro-clientes" onSubmit={handleSubmit}>
          <div className="div-inp">
            <label htmlFor="label">Nombre Producto:</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="nombre_producto"
              id="nombre_producto"
              value={data.nombre_producto}
              required
            />
          </div>

          <div className="div-inp">
            <label htmlFor="label">Color:</label>
            <input
              onChange={handleInputChange}
              type="color"
              name="color"
              id="color"
              value={data.color}
            />
          </div>

          <div className="div-inp">
            <label htmlFor="label">Buscar Categoria:</label>
            <input
              onChange={handleInputChangeFilterCategory}
              type="text"
              name="titulo"
              id="titulo"
              autoComplete="current-password"
            />
          </div>

          <div className="div-inp">
            <label htmlFor="empresa">Categoria:</label>
            <select
              onChange={handleInputChange}
              name="id_categoria"
              id="id_categoria"
            >
              <option value="">Selecciona la categoria</option>
              {Array.isArray(filterDataCategory()) &&
                filterDataCategory().map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    selected={category.id === data.id_categoria}
                  >
                    {category.nombre_categoria}
                  </option>
                ))}
            </select>
          </div>

          <div className="div-inp">
            <label htmlFor="label">Buscar Proveedor:</label>
            <input
              onChange={handleInputChangeFilterSupplier}
              type="text"
              name="proveedor"
              id="titulo"
              autoComplete="current-password"
            />
          </div>

          <div className="div-inp">
            <label htmlFor="empresa">Proveedor:</label>
            <select
              onChange={handleInputChange}
              name="id_proveedor"
              id="id_proveedor"
              required
            >
              <option value="">Selecciona el proveedor</option>
              {Array.isArray(filterDataSupplier()) &&
                filterDataSupplier().map((supplier) => (
                  <option
                    key={supplier.id}
                    value={supplier.id}
                    selected={supplier.id === data.id_proveedor}
                  >
                    {supplier.nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="div-inp">
            <label htmlFor="password">Comentario:</label>
            <textarea
              onChange={handleInputChange}
              id="txtArea"
              name="comentario"
              rows="5"
              cols="60"
              value={data.comentario}
            ></textarea>
          </div>
          <button className="btn-agregar-detalle">Guardar</button>
        </form>
        <div className="container img-contenedor">
          <img className="isologo" src={Logo} alt="imagen" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default EditInventory;
