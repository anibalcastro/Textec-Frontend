import React, { useState } from "react";

const TableCustomers = ({ datos }) => {
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
                        <th>Nombre</th>
                        <th>Cédula</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Empresa</th>
                        <th>Departamento</th>
                    </tr>
                </thead>
                <tbody>
                    {datos &&
                        datos.slice(indexOfFirstItem, indexOfLastItem).map((dato, index) => (
                            <tr key={index}>
                                <td>{iterador + index + 1}</td>
                                <td>{`${dato.nombre} ${dato.apellido1} ${dato.apellido2}`}</td>
                                <td>{dato.cedula}</td>
                                <td>{dato.email}</td>
                                <td>{dato.telefono}</td>
                                <td>{dato.empresa}</td>
                                <td>{dato.departamento}</td>
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

export default TableCustomers;
