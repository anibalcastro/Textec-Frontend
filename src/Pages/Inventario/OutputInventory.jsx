import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Cookies from "js-cookie";
import Logo from "../../Images/Logos/Icono (1).webp";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const OutputInventory = () => {
  //Estados
  const [data, setData] = useState({
    nombre_producto: "",
    cantidad: 0,
    color: "#000000",
    id_categoria: null,
    id_proveedor: null,
    comentario: "Unidades",
  });
  const [inputInventory, setInputInventory] = useState([]);
  const [category, setCategory] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [inventory, setInventory] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [filterCategory, setFilterCategory] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterInventory, setFilterInventory] = useState("");
  const [consecutive, setConsecutive] = useState(1);

  //Cookies
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  //Navigate
  const navigate = useNavigate();

  useEffect(() => {
    alertInvalidatePermission();

    getInventory();
    getCategory();
    getSupplier();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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


  const handleInputChangeFilterInventory = (event) => {
    setFilterInventory(event.target.value);
  };

  const handleInputChangeSelectInventory = (event) => {
    const id_inventario = event.target.value;

    const datos = Array.isArray(inventory)
      ? inventory.filter((dato) =>
          dato.id === parseInt(id_inventario))
      : [];

    const newData =
      datos.length > 0
        ? {
            nombre_producto: datos[0].nombre_producto,
            cantidad: 0,
            color: datos[0].color,
            id_categoria: datos[0].id_categoria,
            id_proveedor: datos[0].id_proveedor,
            comentario: datos[0].comentario,
          }
        : [];

    setData(newData);
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

  const filterDataInventory = () => {
    const datos = Array.isArray(inventory)
      ? inventory.filter((dato) =>
          dato.nombre_producto
            .toLowerCase()
            .includes(filterInventory.toLowerCase())
        )
      : [];

    return datos;
  };

  //Peticion de agregar entradas de inventario
  const fetchOutInventory = () => {
    Swal.fire({
      title: "El inventario se está actualizando...",
      icon: "info",
      showConfirmButton: false,
      timer: 3000, // Duración en milisegundos (5 segundos)
    });

    const inputInventoryJSON = inputInventory.map((item) => ({
      nombre_producto: item.nombre_producto,
      cantidad: item.cantidad,
    }));


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw = JSON.stringify(inputInventoryJSON);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/inventario/registrar/salida",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status, mensaje, error } = result;

        if (parseInt(status) === 200) {
          Swal.fire(
            "Inventario actualizado con éxito!",
            `Las salidas se han registrado exitosamente!`,
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
              navigate("/inventario");
            } else {
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
      .catch((error) => console.log("error", error));
  };

  //Agregar a la lista un nuevo inventario
  const handleSubmit = (event) => {
    event.preventDefault();

    const id = consecutive; // Puedes crear una función para generar un nuevo id
    const dataConId = { ...data, id };

    let nuevoConsecutivo = parseInt(id) + 1;
    setConsecutive(nuevoConsecutivo);

    const nuevoInventario = [...inputInventory, dataConId];
    setInputInventory(nuevoInventario);

    const resetearEstado = {
      nombre_producto: "",
      cantidad: 0,
      color: "#000000",
      id_categoria: 0,
      id_proveedor: 0,
      comentario: "",
    }


    setData(resetearEstado);
  };

  //Retorno de nombres por medio de id
  const returnNameCategory = (id_category) => {
    const datos = category.filter((dato) => {
      return dato.id === parseInt(id_category);
    });

    // Si hay algún objeto en datos, devuelve su nombre; de lo contrario, devuelve null o un valor predeterminado.
    const nombreResultado = datos.length > 0 ? datos[0].nombre_categoria : null;

    return nombreResultado;
  };

  const returnNameSupplier = (id_supplier) => {
    const datos = supplier.filter((dato) => {
      return dato.id === parseInt(id_supplier);
    });

    // Si hay algún objeto en datos, devuelve su nombre; de lo contrario, devuelve null o un valor predeterminado.
    const nombreResultado = datos.length > 0 ? datos[0].nombre : null;

    return nombreResultado;
  };

  //Eliminar inventario de la lista por agregar
  const deleteItemInventory = (id) => {
    const updateInventory = inputInventory.filter(
      (item) => item.id !== parseInt(id)
    );

    setInputInventory(updateInventory);
  };

  return (
    <React.Fragment>
      <Header title="Salida de Inventario" />

      <div className="container form-contenedor">
        <form className="form-registro-clientes" onSubmit={handleSubmit}>
          <div className="div-inp">
            <label htmlFor="password">Buscar Inventario:</label>
            <input
              onChange={handleInputChangeFilterInventory}
              type="text"
              name="titulo"
              id="titulo"
              autoComplete="current-password"
            />
          </div>

          <div className="div-inp">
            <label htmlFor="empresa">Inventario:</label>
            <select
              onChange={handleInputChangeSelectInventory}
              name="inventario"
              id="inventario"
            >
              <option value="">Selecciona un inventario</option>
              {Array.isArray(filterDataInventory()) &&
                filterDataInventory().map((inventory) => (
                  <option key={inventory.id} value={inventory.id}>
                    {inventory.nombre_producto}
                  </option>
                ))}
            </select>
          </div>

          <div className="div-inp">
            <label htmlFor="label">Cantidad:</label>
            <input
              onChange={handleInputChange}
              type="number"
              name="cantidad"
              id="cantidad"
              value={data.cantidad}
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
              disabled
            />
          </div>


          <div className="div-inp">
            <label htmlFor="empresa">Categoria:</label>
            <select
              onChange={handleInputChange}
              name="id_categoria"
              id="id_categoria"
              disabled
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
            <label htmlFor="empresa">Proveedor:</label>
            <select
              onChange={handleInputChange}
              name="id_proveedor"
              id="id_proveedor"
              disabled
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
              disabled
            ></textarea>
          </div>
          <button className="btn-agregar-detalle">Agregar</button>
        </form>
        <div className="container img-contenedor">
          <img className="isologo" src={Logo} alt="imagen" />
        </div>
      </div>

      <hr className="division"></hr>

      <Header title="Inventario por salir" />
      <table className="tabla-medidas">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Color</th>
            <th>Categoria</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(inputInventory) &&
            inputInventory.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre_producto}</td>
                <td>{item.cantidad}</td>
                <td>{item.color}</td>
                <td>{returnNameCategory(item.id_categoria)}</td>
                <td>{returnNameSupplier(item.id_proveedor)}</td>
                <td>
                  {" "}
                  <button
                    className="btn-eliminar"
                    onClick={() => deleteItemInventory(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <hr className="division"></hr>

      <div className="container botones-contenedor">
        <button
          className="btn-agregar-detalle"
          type="submit"
          onClick={fetchOutInventory}
        >
          Guardar
        </button>
      </div>
    </React.Fragment>
  );
};

export default OutputInventory;
