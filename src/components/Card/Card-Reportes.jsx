import React from "react";
import { Link } from "react-router-dom";

const CardReports = (props) => {
    const { titulo, descripcion, color, link } = props;

    return (
        <React.Fragment>
            <Link to={link}>
                <button style={{ background: "none", border: "none" }}>
                    <div className="card-body-reportes" style={{ background: color }}>
                        <h5 className="card-title">{titulo}</h5>
                        <p className="card-number">{descripcion}</p>
                    </div>
                </button>
            </Link>

        </React.Fragment>
    );
};

export default CardReports;