import React, { useEffect, useState } from "react";
import Logo from "../../Images/Logos/Icono (1).webp";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const ModificarMedicion = () => {
    const [prenda, setPrenda] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [mediciones, setMediciones] = useState([]);

    const idDetalle = useParams();
    const navigate = useNavigate();
    const token = Cookies.get("jwtToken");

    useEffect(() => {
        obtenetInformacionMedidas(idDetalle);

        return () => {
            // Restablecer los estados a sus valores iniciales
            setPrenda("");
            setNombreCliente("");
            setMediciones([]);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**Lista de mediciones superiores */
    const medicionesSuperior = [
        "Camisa",
        "Gabacha",
        "Camiseta",
        "Jacket",
        "Chaleco",
        "Gabacha medica",
        "Vestido"
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

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes realizar la lógica de autenticación con los datos del formulario
        // por ejemplo, enviar una solicitud al servidor para verificar las credenciales
        console.log(mediciones);

        // Restablecer los campos del formulario después de enviar
        modificarMedicion();
    };


    const modificarMedicion = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        var formdata = new FormData();

        formdata.append("id_cliente", mediciones.id_cliente);
        formdata.append("articulo", mediciones.articulo);
        formdata.append("fecha", mediciones.fecha);
        formdata.append("observaciones", mediciones.observaciones);
        formdata.append("espalda_superior", mediciones.espalda_superior);
        formdata.append("talle_espalda_superior", mediciones.talle_espalda_superior);
        formdata.append("talle_frente_superior", mediciones.talle_frente_superior);
        formdata.append("busto_superior", mediciones.busto_superior);
        formdata.append("cintura_superior", mediciones.cintura_superior);
        formdata.append("cadera_superior", mediciones.cadera_superior);
        formdata.append("alto_pinza_superior", mediciones.alto_pinza_superior);
        formdata.append("largo_manga_corta_superior", mediciones.largo_manga_corta_superior);
        formdata.append("largo_manga_larga_superior", mediciones.largo_manga_larga_superior);
        formdata.append("ancho_manga_corta_superior", mediciones.ancho_manga_corta_superior);
        formdata.append("ancho_manga_larga_superior", mediciones.ancho_manga_larga_superior);
        formdata.append("largo_total_superior", mediciones.largo_total_superior);
        formdata.append("talla", mediciones.talla);
        formdata.append("largo_inferior", mediciones.largo_inferior);
        formdata.append("cintura_inferior", mediciones.cintura_inferior);
        formdata.append("cadera_inferior", mediciones.cadera_inferior);
        formdata.append("pierna_inferior", mediciones.pierna_inferior);
        formdata.append("rodilla_inferior", mediciones.rodilla_inferior);
        formdata.append("ruedo_inferior", mediciones.ruedo_inferior);
        formdata.append("tiro_inferior", mediciones.tiro_inferior);
        


        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(
            `https://api.textechsolutionscr.com/api/v1/mediciones/editar/${idDetalle.medicionId}`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                const status = result.status;
                console.log(status);

                if (status === 200) {
                    //console.log()

                    // Cliente creado con éxito
                    Swal.fire(
                        "Medición modificada con éxito!",
                        `Se ha a registrado!`,
                        "success"
                    ).then((result) => {
                        if (result.isConfirmed) {
                            // El usuario hizo clic en el botón "OK"
                            navigate("/mediciones");
                        } else {
                            // El usuario cerró el cuadro de diálogo sin hacer clic en el botón "OK"
                            // Realiza alguna otra acción o maneja el caso en consecuencia
                            navigate("/mediciones");
                        }
                    });
                } else {
                    // Error al crear
                    Swal.fire(
                        "Error al modificar la medición!",
                        "Vuelva a intentarlo luego!",
                        "error"
                    );
                }
            })
            .catch((error) => console.log("error", error));

    };

    const obtenetInformacionMedidas = (parametro) => {
        let mediciones = localStorage.getItem("medidas");
        mediciones = JSON.parse(mediciones);

        mediciones.forEach((item, i) => {
            //console.log(parametro.medicionId);

            if (parseInt(item.id) === parseInt(parametro.medicionId)) {
                setMediciones(item);

                setPrenda(item.articulo);
                let nombreCompleto = `${item.nombre} ${item.apellido1} ${item.apellido2}`;
                setNombreCliente(nombreCompleto);

                //console.log(mediciones);
            }
        });
    };

    return (
        <React.Fragment>
            
                <h2 className="titulo-encabezado">Registro de mediciones</h2>
                <hr className="division"></hr>
                <div className="container form-contenedor">
                    <form className="form-registro-clientes" onSubmit={handleSubmit}>
                        <div className="div-inp">
                            <label htmlFor="text">Cliente:</label>
                            <input
                                name="nombre"
                                type="text"
                                defaultValue={nombreCliente}
                                disabled
                            ></input>
                        </div>

                        <div className="div-inp">
                            <label htmlFor="text">Prenda:</label>
                            <input
                                name="nombre"
                                type="text"
                                defaultValue={prenda}
                                disabled
                            ></input>
                        </div>

                        <hr className="division"></hr>

                        {prendaSuperior && (
                            <div className="container opciones-medidas">
                                <div className="div-inp">
                                    <label htmlFor="text">Espalda:</label>
                                    <input
                                        type="number"
                                        id="espalda"
                                        name="espalda_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.espalda_superior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Talle de espalda:</label>
                                    <input
                                        type="number"
                                        id="cedula"
                                        name="talle_espalda_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.talle_espalda_superior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Talle de frente:</label>
                                    <input
                                        type="number"
                                        id="cedula"
                                        name="talle_frente_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.talle_frente_superior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Busto:</label>
                                    <input
                                        type="number"
                                        id="cedula"
                                        name="busto_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.busto_superior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Cintura:</label>
                                    <input
                                        type="number"
                                        id="cedula"
                                        name="cintura_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.cintura_superior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Cadera:</label>
                                    <input
                                        type="number"
                                        id="cadera"
                                        name="cadera_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.cadera_superior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Largo Manga Corta:</label>
                                    <input
                                        type="number"
                                        id="largo_manga_corta"
                                        name="largo_manga_corta_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.largo_manga_corta_superior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Largo Manga Larga:</label>
                                    <input
                                        type="number"
                                        id="largo_manga_larga"
                                        name="largo_manga_larga_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.largo_manga_larga_superior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Ancho Manga Corta:</label>
                                    <input
                                        type="number"
                                        id="ancho_manga_corta"
                                        name="ancho_manga_corta_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.ancho_manga_corta_superior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Ancho Manga Larga:</label>
                                    <input
                                        type="number"
                                        id="ancho_manga_larga"
                                        name="ancho_manga_larga_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.ancho_manga_larga_superior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Largo total:</label>
                                    <input
                                        type="number"
                                        id="largo_total"
                                        name="largo_total_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.largo_total_superior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Alto de pinza:</label>
                                    <input
                                        type="number"
                                        id="alto_pinza"
                                        name="alto_pinza_superior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.alto_pinza_superior}
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
                                        defaultValue={mediciones.talla}
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
                                        defaultValue={mediciones.observaciones}
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
                                        name="largo_inferior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.largo_inferior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Cintura:</label>
                                    <input
                                        type="number"
                                        id="cintura"
                                        name="cintura_inferior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.cintura_inferior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Cadera:</label>
                                    <input
                                        type="number"
                                        id="cadera"
                                        name="cadera_inferior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.cadera_inferior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Pierna:</label>
                                    <input
                                        type="number"
                                        id="pierna"
                                        name="pierna_inferior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.pierna_inferior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Rodilla:</label>
                                    <input
                                        type="number"
                                        id="rodilla"
                                        name="rodilla_inferior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.rodilla_inferior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Ruedo:</label>
                                    <input
                                        type="number"
                                        id="ruedo"
                                        name="ruedo_inferior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.ruedo_inferior}
                                    />
                                </div>
                                <div className="div-inp">
                                    <label htmlFor="text">Tiro:</label>
                                    <input
                                        type="number"
                                        id="tiro"
                                        name="tiro_inferior"
                                        autoComplete="current-text"
                                        onChange={handleInputChange}
                                        defaultValue={mediciones.tiro_inferior}
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
                                        defaultValue={mediciones.talla}
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
                                        defaultValue={mediciones.observaciones}
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
            
        </React.Fragment>
    );
};

export default ModificarMedicion;
