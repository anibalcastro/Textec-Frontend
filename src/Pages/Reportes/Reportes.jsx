import React, { useEffect } from "react";
import Logo from "../../Images/Logos/Logo Textech.webp";
import Card from "../../components/Card/Card-Reportes";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Reportes() {
    const role = Cookies.get("role");
    const navigate = useNavigate();

    useEffect(() => {
        alertInvalidatePermission();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Validate role
    const validateUserPermission = () => {
        if (role === "Admin") {
            return true;
        }

        return false;
    };

    //Show alert if validateUserPermission is false
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

    return (
        <React.Fragment>
            <h2 className="titulo-encabezado">Reportes</h2>

            <div className="information">
                <Card
                    titulo="Mediciones de clientes por empresa"
                    descripcion=""
                    link="/reporte/mediciones/clientes/empresa"
                    color="#6d949c"
                />

                <Card
                    titulo="Reporte de ventas"
                    descripcion=""
                    link="/reporte/ventas"
                    color="#94744C"
                />

                <Card
                    titulo="Reporte de saldos pendientes"
                    descripcion=""
                    link="/reporte/saldos_pendientes"
                    color="#6d949c"
                />

                <Card
                    titulo="Reporte de inventario"
                    descripcion=""
                    link="/reporte/inventario"
                    color="#94744C"
                />

                <Card
                    titulo="Productos más vendidos"
                    descripcion=""
                    link="/reporte/producto_vendido"
                    color="#6d949c"
                />

                <Card
                    titulo="Clientes"
                    descripcion=""
                    link="/reporte/clientes"
                    color="#94744C"
                />
            </div>
            <div className="container-logo">
                <img src={Logo} className="logo-textec" alt="Logo" />
            </div>
        </React.Fragment>
    );
}
