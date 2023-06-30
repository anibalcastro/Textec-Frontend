import React, { useEffect, useState } from "react";
import Logo from "../../Images/Logos/Icono.jpg";
import { useParams } from "react-router-dom";

const ModificarMedicion = () => {
    const [prenda, setPrenda] = useState("");
    const [idCliente, setIdCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [mediciones, setMediciones] = useState([]);

    const idDetalle = useParams();

    useEffect(() => {
       obtenetInformacionMedidas(idDetalle)
    }, [idDetalle]);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes realizar la lógica de autenticación con los datos del formulario
        // por ejemplo, enviar una solicitud al servidor para verificar las credenciales

        // Restablecer los campos del formulario después de enviar
    };

    

    const obtenetInformacionMedidas = (parametro) => {
        let mediciones = localStorage.getItem('medidas');
        mediciones = JSON.parse(mediciones);
    
        mediciones.forEach((item, i) => {
          if (parseInt(item.id) === parseInt(parametro.idDetalle)) {
            console.log(item);
            setIdCliente(item.id_cliente);
            setPrenda(item.articulo);
            setNombreCliente(`${item.nombre} ${item.apellido1} ${item.apellido2}`)
            setMediciones(item);
          }
        });
    
      }

    return (
        <React.Fragment>
            <div className="container registro-medicion">
                <h2 className="titulo-encabezado">Registro de mediciones</h2>
                <hr className="division"></hr>
                <div className="container form-contenedor">
                    <form className="form-registro-clientes" onSubmit={handleSubmit}>
                        <div className="div-inp">
                            <label htmlFor="text">Cliente:</label>
                            <input name="nombre" type="text" defaultValue={nombreCliente} disabled></input>
                        </div>

                        <div className="div-inp">
                            <label htmlFor="text">Prenda:</label>
                            <input name="nombre" type="text" defaultValue={prenda} disabled></input>
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
                                        defaultValue={mediciones.espalda_superior}
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
                                        defaultValue={mediciones.talle_espalda_superior}
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
                                        defaultValue={mediciones.talle_frente_superior}
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
                                        defaultValue={mediciones.busto_superior}
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
                                        defaultValue={mediciones.cintura_superior}
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
                                        defaultValue={mediciones.cadera_superior}
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
                                        defaultValue={mediciones.largo_manga_corta_superior}
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
                                        defaultValue={mediciones.largo_manga_larga_superior}
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
                                        defaultValue={mediciones.ancho_manga_corta_superior}
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
                                        defaultValue={mediciones.ancho_manga_larga_superior}
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
                                        defaultValue={mediciones.largo_total_superior}
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
                                        name="largo"
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
                                        name="cintura"
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
                                        name="cadera"
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
                                        name="pierna"
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
                                        name="rodilla"
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
                                        name="ruedo"
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
                                        name="tiro"
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
            </div>
        </React.Fragment>
    );
};

export default ModificarMedicion;
