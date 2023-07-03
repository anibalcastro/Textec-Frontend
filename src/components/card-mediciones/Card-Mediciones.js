import React from "react";
import { Link } from "react-router-dom";

const Card_information = (props) => {
  const { articulo, fecha, id, color } = props;

  return (
    <React.Fragment>
    <div className="container contenedor-card-mediciones">
    <Link to={`/mediciones/${id}`} style={{ textDecoration: 'none' }} >
      <div className="card-body" style={{ background: color }}>
        <h5 className="card-title">{articulo}</h5>
        <p className="card-number">{fecha}</p>
      </div>
    </Link>
    </div>
    
    </React.Fragment>
  );
};

export default Card_information;