import React, { useEffect, useState } from "react";
import Logo from "../../Images/Logos/Icono.jpg";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegistroMedicion = () => {
    const [prenda, setPrenda] = useState("");
    const [idCliente, setIdCliente] = useState("");
    const [mediciones, setMediciones] = useState([]);
    const [cliente, setCliente] = useState([]);
    const navigate = useNavigate();
    const token = Cookies.get("jwtToken");

    useEffect(() => {
        obtenerInformacion();
        //console.log(mediciones);
    }, [mediciones]);

    /**Lista de mediciones superiores */
    const medicionesSuperior = [
        "Camisa",
        "Gabacha",
        "Camiseta",
        "Jacket",
        "Chaleco",
        "Gabacha medica",
    ];

    /**Lista de mediciones inferiores */
    const medicionesInferior = ["Short", "Pantalon", "Enagua"];

    /**Validaciones si el estado prenda existe en alguna de las listas */
    const prendaSuperior = medicionesSuperior.includes(prenda);
    const prendaInferior = medicionesInferior.includes(prenda);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMediciones({ ...mediciones, [name]: value });
    };

    const handleOptionChange = (event) => {
        setPrenda(event.target.value);
    };

    const handleNameChange = (event) => {
        setIdCliente(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        registrarMedicion();    
    };

    const registrarMedicion = () => {
        const date = new Date();
        const anno = date.getFullYear();
        const mes = String(date.getMonth() + 1).padStart(2, "0");
        const dia = String(date.getDate()).padStart(2, "0");

        const fecha = `${anno}-${mes}-${dia}`;

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        var formdata = new FormData();

        formdata.append("id_cliente", idCliente);
        formdata.append("articulo", prenda);
        formdata.append("fecha", fecha);
        formdata.append("observaciones", mediciones.observaciones);
        formdata.append("talla", mediciones.talla);

        if (medicionesSuperior.includes(prenda)) {
            formdata.append("espalda_superior", mediciones.espalda);
            formdata.append("talle_espalda_superior",mediciones.talle_espalda);
            formdata.append("talle_frente_superior",mediciones.talle_frente);
            formdata.append("busto_superior", mediciones.busto);
            formdata.append("cintura_superior", mediciones.cintura);
            formdata.append("cadera_superior", mediciones.cadera);
            formdata.append("ancho_manga_corta_superior", mediciones.ancho_manga_corta);
            formdata.append("ancho_manga_larga_superior", mediciones.ancho_manga_larga);
            formdata.append("largo_manga_corta_superior", mediciones.largo_manga_corta);
            formdata.append("largo_manga_larga_superior", mediciones.largo_manga_larga);
            formdata.append("largo_total_superior", mediciones.largo_total);
            formdata.append("alto_pinza_superior", mediciones.alto_pinza);
        } else {
            formdata.append("largo_inferior", mediciones.largo);
            formdata.append("cintura_inferior", mediciones.cintura)
            formdata.append("cadera_inferior", mediciones.cadera)
            formdata.append("pierna_inferior", mediciones.pierna);
            formdata.append("rodilla_inferior", mediciones.rodilla);
            formdata.append("ruedo_inferior", mediciones.ruedo);
            formdata.append("tiro_inferior", mediciones.tiro);
        }

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        //console.log(`Mediciones data ${formdata}`)

        
        fetch("https://api.textechsolutionscr.com/api/v1/mediciones/registrar", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                //console.log(result);
                const status = result.status;
                //console.log(status);

                if (parseInt(status) === 200) {
                    //console.log()

                    // Cliente creado con éxito
                    Swal.fire(
                      "Medición creada con éxito!",
                      `Se ha a registrado!`,
                      "success"
                    ).then((result) => {
                      if (result.isConfirmed) {
                        // El usuario hizo clic en el botón "OK"
                        navigate("/mediciones");
                      } else {
                        // El usuario cerró el cuadro de diálogo sin hacer clic en el botón "OK"
                        // Realiza alguna otra acción o maneja el caso en consecuencia
                      }
                    });
          
                  } else {
                    // Error al crear 
                    Swal.fire(
                      "Error al registrar la medición!",
                      "Existe un articulo ya asignado a ese usuario",
                      "error"
                    );

                    const form = document.getElementById("form-registro-medicion");
                    form.reset();
                  }

            })
            .catch((error) => console.log("error", error));
            
    };

    const obtenerInformacion = () => {
        let datos = localStorage.getItem("data");
        datos = JSON.parse(datos);

        setCliente(datos);
    };

    return (
        <React.Fragment>
            <div className="container registro-medicion">
                <h2 className="titulo-encabezado">Registro de mediciones</h2>
                <hr className="division"></hr>
                <div className="container form-contenedor">
                    <form className="form-registro-clientes" id="form-registro-medicion" onSubmit={handleSubmit}>
                        <div className="div-inp">
                            <label htmlFor="text">Cliente:</label>
                            <select
                                id="nombre"
                                name="id_cliente"
                                autoComplete="nombre"
                                onChange={handleNameChange}
                            >
                                <option value="" hidden>
                                    Selecione una opción
                                </option>
                                {cliente.map((cliente) => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {`${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="div-inp">
                            <label htmlFor="text">Prenda:</label>
                            <select
                                value={prenda}
                                id="prenda"
                                autoComplete="prenda"
                                onChange={handleOptionChange}
                            >
                                <option value="" disabled hidden>
                                    Selecione una opción
                                </option>
                                <option value="Camisa">Camisa</option>
                                <option value="Gabacha">Gabacha</option>
                                <option value="Camiseta">Camiseta</option>
                                <option value="Jacket">Jacket</option>
                                <option value="Chaleco">Chaleco</option>
                                <option value="Gabacha medica">Gabacha medica</option>

                                <option value="Pantalon">Pantalon</option>
                                <option value="Enagua">Enagua</option>
                                <option value="Short">Short</option>
                            </select>
                        </div>

                        <hr className="division"></hr>

                        {prendaSuperior && (
                            <div className="container opciones-medidas">
                                <div className="div-inp">
                                    <label htmlFor="text">Espalda:</label>
                                    <input
                                        type="number"
                                        id="espalda"
                                        name="espalda"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Talle de espalda:</label>
                                    <input
                                        type="number"
                                        id="cedula"
                                        name="talle_espalda"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Talle de frente:</label>
                                    <input
                                        type="number"
                                        id="cedula"
                                        name="talle_frente"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Busto:</label>
                                    <input
                                        type="number"
                                        id="cedula"
                                        name="busto"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Cintura:</label>
                                    <input
                                        type="number"
                                        id="cedula"
                                        name="cintura"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Cadera:</label>
                                    <input
                                        type="number"
                                        id="cadera"
                                        name="cadera"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Largo Manga Corta:</label>
                                    <input
                                        type="number"
                                        id="largo_manga_corta"
                                        name="largo_manga_corta"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Largo Manga Larga:</label>
                                    <input
                                        type="number"
                                        id="largo_manga_larga"
                                        name="largo_manga_larga"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Ancho Manga Corta:</label>
                                    <input
                                        type="number"
                                        id="ancho_manga_corta"
                                        name="ancho_manga_corta"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Ancho Manga Larga:</label>
                                    <input
                                        type="number"
                                        id="ancho_manga_larga"
                                        name="ancho_manga_larga"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Largo total:</label>
                                    <input
                                        type="number"
                                        id="largo_total"
                                        name="largo_total"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Alto de pinza:</label>
                                    <input
                                        type="number"
                                        id="alto_pinza"
                                        name="alto_pinza"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="div-inp">
                                    <label htmlFor="text">Talla:</label>
                                    <input
                                        type="text"
                                        id="talla"
                                        name="talla"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="div-inp">
                                    <label htmlFor="text">Observaciones:</label>
                                    <textarea
                                        id="txtArea"
                                        name="observaciones"
                                        rows="5"
                                        cols="60"
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {prendaInferior && (
                            <div className="container opciones-medidas">
                                <div className="div-inp">
                                    <label htmlFor="text">Largo:</label>
                                    <input
                                        type="number"
                                        id="largo"
                                        name="largo"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Cintura:</label>
                                    <input
                                        type="number"
                                        id="cintura"
                                        name="cintura"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Cadera:</label>
                                    <input
                                        type="number"
                                        id="cadera"
                                        name="cadera"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Pierna:</label>
                                    <input
                                        type="number"
                                        id="pierna"
                                        name="pierna"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Rodilla:</label>
                                    <input
                                        type="number"
                                        id="rodilla"
                                        name="rodilla"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Ruedo:</label>
                                    <input
                                        type="number"
                                        id="ruedo"
                                        name="ruedo"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Tiro:</label>
                                    <input
                                        type="number"
                                        id="tiro"
                                        name="tiro"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Talla:</label>
                                    <input
                                        type="text"
                                        id="talla"
                                        name="talla"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="div-inp">
                                    <label htmlFor="text">Observaciones:</label>
                                    <textarea
                                        name="observaciones"
                                        id="txtArea"
                                        rows="5"
                                        cols="60"
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        <button className="btn-registrar" type="submit">
                            Guardar
                        </button>
                    </form>

                    <div className="container img-contenedor">
                        <img className="isologo" src={Logo} alt="imagen" />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default RegistroMedicion;
