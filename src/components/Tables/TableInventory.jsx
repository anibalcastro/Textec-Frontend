import React, { useState } from "react";

const TableInventory = ({ datos }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 60; // Número de mediciones por página

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(datos.length / itemsPerPage);

    let iterador = indexOfFirstItem;

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <React.Fragment>
            <table id="tabla-reparacion" className="tabla-medidas">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>color</th>
                        <th>Categoria</th>
                        <th>Proveedor</th>
                        <th>Comentario</th>
                    </tr>
                </thead>
                <tbody>
                    {datos &&
                        datos.slice(indexOfFirstItem, indexOfLastItem).map((dato, index) => (
                            <tr key={index}>
                                <td>{iterador + index + 1}</td>
                                <td>{`${dato.nombre_producto}`}</td>
                                <td>{dato.cantidad}</td>
                                <td style={{ backgroundColor: dato.color }}></td>
                                <td>{dato.nombre_categoria}</td>
                                <td>{dato.nombre_proveedor}</td>
                                <td>{dato.comentario}</td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={currentPage === index + 1 ? "active" : ""}
                        onClick={() => handleClick(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </React.Fragment>
    );
};

export default TableInventory;
