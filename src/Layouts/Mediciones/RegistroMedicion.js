import React, { useEffect, useState } from "react";
import Logo from "../../Images/Logos/Icono.jpg";

const RegistroMedicion = () => {
    const [prenda, setPrenda] = useState("");
    const [idCliente, setIdCliente] = useState("");
    const [mediciones, setMediciones] = useState([]);

    useEffect(() => {
        console.log(mediciones);
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
        // Aquí puedes realizar la lógica de autenticación con los datos del formulario
        // por ejemplo, enviar una solicitud al servidor para verificar las credenciales

        // Restablecer los campos del formulario después de enviar
    };

    return (
        <React.Fragment>
            <div className="container registro-medicion">
                <h2 className="titulo-encabezado">Registro de mediciones</h2>
                <hr className="division"></hr>
                <div className="container form-contenedor">
                    <form className="form-registro-clientes" onSubmit={handleSubmit}>
                        <div className="div-inp">
                            <label htmlFor="text">Cliente:</label>
                            <select
                                id="nombre"
                                name="id_cliente"
                                autoComplete="nombre"
                                onChange={handleNameChange}
                            >
                                <option value="" disabled hidden>Selecione una opción</option>
                                <option value="1"> Anibal Castro Ponce</option>
                                <option value="2"> Fabricio Castro Ponce</option>
                                <option value="3"> Allison Brenes Ledezma</option>
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
